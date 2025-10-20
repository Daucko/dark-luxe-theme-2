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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    switch (req.method) {
      case 'GET':
        return await handleGetGrades(req, res, decoded);
      case 'POST':
        return await handleCreateGrade(req, res, decoded);
      case 'PUT':
        return await handleUpdateGrade(req, res, decoded);
      case 'DELETE':
        return await handleDeleteGrade(req, res, decoded);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Grades API Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGetGrades(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id, studentId, submissionId } = req.query;

  // Get single grade
  if (id) {
    const grade = await prisma.grade.findUnique({
      where: { id: id as string },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        gradedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    });

    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    // Check permissions
    if (user.role === 'STUDENT' && grade.studentId !== user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json({ grade });
  }

  // Build query filters
  const where: any = {};

  if (user.role === 'STUDENT') {
    where.studentId = user.userId;
  }

  if (studentId && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
    where.studentId = studentId;
  }

  if (submissionId) {
    where.submissionId = submissionId;
  }

  const grades = await prisma.grade.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      gradedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      submission: {
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              subject: true,
              totalPoints: true,
              dueDate: true,
            },
          },
        },
      },
    },
    orderBy: {
      gradedAt: 'desc',
    },
  });

  return res.status(200).json({ grades });
}

async function handleCreateGrade(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only teachers can create grades' });
  }

  const { submissionId, points, feedback } = req.body;

  if (!submissionId || points === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if submission exists
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: true,
      grade: true,
    },
  });

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  if (submission.grade) {
    return res
      .status(400)
      .json({ error: 'Grade already exists. Use PUT to update.' });
  }

  // Validate points
  const pointsNum = parseFloat(points);
  if (pointsNum < 0 || pointsNum > submission.assignment.totalPoints) {
    return res.status(400).json({
      error: `Points must be between 0 and ${submission.assignment.totalPoints}`,
    });
  }

  // Create grade and update submission status
  const grade = await prisma.grade.create({
    data: {
      submissionId,
      studentId: submission.studentId,
      gradedById: user.userId,
      points: pointsNum,
      feedback,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gradedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      submission: {
        include: {
          assignment: true,
        },
      },
    },
  });

  // Update submission status to GRADED
  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: 'GRADED' },
  });

  return res.status(201).json({ grade });
}

async function handleUpdateGrade(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only teachers can update grades' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Grade ID required' });
  }

  // Check if grade exists
  const existingGrade = await prisma.grade.findUnique({
    where: { id: id as string },
    include: {
      submission: {
        include: {
          assignment: true,
        },
      },
    },
  });

  if (!existingGrade) {
    return res.status(404).json({ error: 'Grade not found' });
  }

  const { points, feedback } = req.body;

  // Validate points if provided
  if (points !== undefined) {
    const pointsNum = parseFloat(points);
    if (
      pointsNum < 0 ||
      pointsNum > existingGrade.submission.assignment.totalPoints
    ) {
      return res.status(400).json({
        error: `Points must be between 0 and ${existingGrade.submission.assignment.totalPoints}`,
      });
    }
  }

  const grade = await prisma.grade.update({
    where: { id: id as string },
    data: {
      ...(points !== undefined && { points: parseFloat(points) }),
      ...(feedback !== undefined && { feedback }),
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gradedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      submission: {
        include: {
          assignment: true,
        },
      },
    },
  });

  return res.status(200).json({ grade });
}

async function handleDeleteGrade(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only teachers can delete grades' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Grade ID required' });
  }

  // Check if grade exists
  const existingGrade = await prisma.grade.findUnique({
    where: { id: id as string },
  });

  if (!existingGrade) {
    return res.status(404).json({ error: 'Grade not found' });
  }

  // Delete grade and update submission status
  await prisma.grade.delete({
    where: { id: id as string },
  });

  await prisma.submission.update({
    where: { id: existingGrade.submissionId },
    data: { status: 'SUBMITTED' },
  });

  return res.status(200).json({ message: 'Grade deleted successfully' });
}
