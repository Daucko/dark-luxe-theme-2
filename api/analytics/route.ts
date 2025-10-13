import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient().$extends(withAccelerate());
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JWTPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    const { type } = req.query;

    switch (type) {
      case 'overview':
        return await handleOverviewAnalytics(req, res, decoded);
      case 'student':
        return await handleStudentAnalytics(req, res, decoded);
      case 'teacher':
        return await handleTeacherAnalytics(req, res, decoded);
      case 'assignment':
        return await handleAssignmentAnalytics(req, res, decoded);
      default:
        return res.status(400).json({ error: 'Invalid analytics type' });
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleOverviewAnalytics(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAssignments,
    totalSubmissions,
    totalGrades,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.assignment.count(),
    prisma.submission.count({ where: { status: { not: 'NOT_SUBMITTED' } } }),
    prisma.grade.count(),
    prisma.submission.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        assignment: {
          select: { id: true, title: true, subject: true },
        },
      },
    }),
  ]);

  // Calculate average grade
  const grades = await prisma.grade.findMany({
    select: { points: true },
  });
  const averageGrade =
    grades.length > 0
      ? grades.reduce((sum, g) => sum + g.points, 0) / grades.length
      : 0;

  return res.status(200).json({
    overview: {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAssignments,
      totalSubmissions,
      totalGrades,
      averageGrade: Math.round(averageGrade * 100) / 100,
    },
    recentActivity,
  });
}

async function handleStudentAnalytics(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { studentId } = req.query;
  const targetStudentId = (studentId as string) || user.userId;

  // Students can only view their own analytics
  if (user.role === 'STUDENT' && targetStudentId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const [
    student,
    totalSubmissions,
    gradedSubmissions,
    pendingSubmissions,
    lateSubmissions,
    grades,
    recentSubmissions,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetStudentId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    }),
    prisma.submission.count({
      where: {
        studentId: targetStudentId,
        status: { not: 'NOT_SUBMITTED' },
      },
    }),
    prisma.submission.count({
      where: {
        studentId: targetStudentId,
        status: 'GRADED',
      },
    }),
    prisma.submission.count({
      where: {
        studentId: targetStudentId,
        status: 'SUBMITTED',
      },
    }),
    prisma.submission.count({
      where: {
        studentId: targetStudentId,
        status: 'LATE',
      },
    }),
    prisma.grade.findMany({
      where: { studentId: targetStudentId },
      include: {
        submission: {
          include: {
            assignment: {
              select: {
                id: true,
                title: true,
                subject: true,
                totalPoints: true,
              },
            },
          },
        },
      },
      orderBy: { gradedAt: 'desc' },
    }),
    prisma.submission.findMany({
      where: { studentId: targetStudentId },
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            subject: true,
            totalPoints: true,
          },
        },
        grade: true,
      },
    }),
  ]);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Calculate statistics
  const averageGrade =
    grades.length > 0
      ? grades.reduce((sum, g) => sum + g.points, 0) / grades.length
      : 0;

  const averagePercentage =
    grades.length > 0
      ? grades.reduce((sum, g) => {
          const percentage =
            (g.points / g.submission.assignment.totalPoints) * 100;
          return sum + percentage;
        }, 0) / grades.length
      : 0;

  // Grade distribution by subject
  const gradesBySubject = grades.reduce((acc: any, grade) => {
    const subject = grade.submission.assignment.subject;
    if (!acc[subject]) {
      acc[subject] = { total: 0, count: 0, grades: [] };
    }
    acc[subject].total += grade.points;
    acc[subject].count += 1;
    acc[subject].grades.push(grade.points);
    return acc;
  }, {});

  const subjectPerformance = Object.entries(gradesBySubject).map(
    ([subject, data]: [string, any]) => ({
      subject,
      average: data.total / data.count,
      count: data.count,
    })
  );

  return res.status(200).json({
    student,
    statistics: {
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions,
      lateSubmissions,
      averageGrade: Math.round(averageGrade * 100) / 100,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
    },
    subjectPerformance,
    recentGrades: grades.slice(0, 5),
    recentSubmissions,
  });
}

async function handleTeacherAnalytics(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { teacherId } = req.query;
  const targetTeacherId = (teacherId as string) || user.userId;

  // Teachers can only view their own analytics (unless admin)
  if (user.role === 'TEACHER' && targetTeacherId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (user.role === 'STUDENT') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Teacher or Admin access required' });
  }

  const [
    teacher,
    totalAssignments,
    publishedAssignments,
    draftAssignments,
    totalSubmissions,
    gradedSubmissions,
    pendingGrading,
    assignments,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetTeacherId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    }),
    prisma.assignment.count({
      where: { teacherId: targetTeacherId },
    }),
    prisma.assignment.count({
      where: {
        teacherId: targetTeacherId,
        status: 'PUBLISHED',
      },
    }),
    prisma.assignment.count({
      where: {
        teacherId: targetTeacherId,
        status: 'DRAFT',
      },
    }),
    prisma.submission.count({
      where: {
        assignment: { teacherId: targetTeacherId },
        status: { not: 'NOT_SUBMITTED' },
      },
    }),
    prisma.submission.count({
      where: {
        assignment: { teacherId: targetTeacherId },
        status: 'GRADED',
      },
    }),
    prisma.submission.count({
      where: {
        assignment: { teacherId: targetTeacherId },
        status: { in: ['SUBMITTED', 'LATE'] },
      },
    }),
    prisma.assignment.findMany({
      where: { teacherId: targetTeacherId },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  return res.status(200).json({
    teacher,
    statistics: {
      totalAssignments,
      publishedAssignments,
      draftAssignments,
      totalSubmissions,
      gradedSubmissions,
      pendingGrading,
    },
    recentAssignments: assignments,
  });
}

async function handleAssignmentAnalytics(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { assignmentId } = req.query;

  if (!assignmentId) {
    return res.status(400).json({ error: 'Assignment ID required' });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId as string },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      submissions: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          grade: true,
        },
      },
    },
  });

  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  // Check permissions
  if (user.role === 'TEACHER' && assignment.teacherId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const totalSubmissions = assignment.submissions.filter(
    (s) => s.status !== 'NOT_SUBMITTED'
  ).length;
  const gradedSubmissions = assignment.submissions.filter(
    (s) => s.status === 'GRADED'
  ).length;
  const lateSubmissions = assignment.submissions.filter(
    (s) => s.status === 'LATE'
  ).length;

  const grades = assignment.submissions
    .filter((s) => s.grade)
    .map((s) => s.grade!);

  const averageGrade =
    grades.length > 0
      ? grades.reduce((sum, g) => sum + g.points, 0) / grades.length
      : 0;

  const averagePercentage =
    grades.length > 0 ? (averageGrade / assignment.totalPoints) * 100 : 0;

  return res.status(200).json({
    assignment: {
      id: assignment.id,
      title: assignment.title,
      subject: assignment.subject,
      totalPoints: assignment.totalPoints,
      dueDate: assignment.dueDate,
      teacher: assignment.teacher,
    },
    statistics: {
      totalSubmissions,
      gradedSubmissions,
      lateSubmissions,
      pendingGrading: totalSubmissions - gradedSubmissions,
      averageGrade: Math.round(averageGrade * 100) / 100,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
    },
    submissions: assignment.submissions,
  });
}
