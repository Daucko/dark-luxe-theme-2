import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
        return await handleGetSubmissions(req, res, decoded);
      case 'POST':
        return await handleCreateSubmission(req, res, decoded);
      case 'PUT':
        return await handleUpdateSubmission(req, res, decoded);
      case 'DELETE':
        return await handleDeleteSubmission(req, res, decoded);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Submissions API Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGetSubmissions(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id, assignmentId, studentId, status } = req.query;

  // Get single submission
  if (id) {
    const submission = await prisma.submission.findUnique({
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
        assignment: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        attachments: true,
        grade: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check permissions
    if (
      user.role === 'STUDENT' &&
      submission.studentId !== user.userId
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json({ submission });
  }

  // Build query filters
  const where: any = {};

  if (user.role === 'STUDENT') {
    where.studentId = user.userId;
  }

  if (assignmentId) {
    where.assignmentId = assignmentId;
  }

  if (studentId && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
    where.studentId = studentId;
  }

  if (status) {
    where.status = status;
  }

  const submissions = await prisma.submission.findMany({
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
      assignment: {
        select: {
          id: true,
          title: true,
          subject: true,
          totalPoints: true,
          dueDate: true,
        },
      },
      attachments: true,
      grade: true,
    },
    orderBy: {
      submittedAt: 'desc',
    },
  });

  return res.status(200).json({ submissions });
}

async function handleCreateSubmission(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Forbidden: Only students can create submissions' });
  }

  const { assignmentId, content, notes, attachments = [] } = req.body;

  if (!assignmentId) {
    return res.status(400).json({ error: 'Assignment ID required' });
  }

  // Check if assignment exists
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  // Check if submission already exists
  const existingSubmission = await prisma.submission.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: user.userId,
        assignmentId,
      },
    },
  });

  if (existingSubmission) {
    return res.status(400).json({ error: 'Submission already exists. Use PUT to update.' });
  }

  // Determine if submission is late
  const isLate = new Date() > new Date(assignment.dueDate);
  const status = isLate ? 'LATE' : 'SUBMITTED';

  const submission = await prisma.submission.create({
    data: {
      studentId: user.userId,
      assignmentId,
      content,
      notes,
      status,
      submittedAt: new Date(),
      attachments: {
        create: attachments,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignment: true,
      attachments: true,
    },
  });

  return res.status(201).json({ submission });
}

async function handleUpdateSubmission(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Submission ID required' });
  }

  // Check if submission exists
  const existingSubmission = await prisma.submission.findUnique({
    where: { id: id as string },
    include: {
      assignment: true,
    },
  });

  if (!existingSubmission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  // Check permissions
  if (user.role === 'STUDENT' && existingSubmission.studentId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden: You can only update your own submissions' });
  }

  const { content, notes, status } = req.body;

  // Determine if submission is late (only for students updating)
  let updateData: any = {
    ...(content !== undefined && { content }),
    ...(notes !== undefined && { notes }),
  };

  if (user.role === 'STUDENT') {
    const isLate = new Date() > new Date(existingSubmission.assignment.dueDate);
    updateData.status = isLate ? 'LATE' : 'SUBMITTED';
    updateData.submittedAt = new Date();
  } else if (status) {
    updateData.status = status;
  }

  const submission = await prisma.submission.update({
    where: { id: id as string },
    data: updateData,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignment: true,
      attachments: true,
      grade: true,
    },
  });

  return res.status(200).json({ submission });
}

async function handleDeleteSubmission(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Submission ID required' });
  }

  // Check if submission exists
  const existingSubmission = await prisma.submission.findUnique({
    where: { id: id as string },
  });

  if (!existingSubmission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  // Check permissions
  if (
    user.role === 'STUDENT' &&
    existingSubmission.studentId !== user.userId
  ) {
    return res.status(403).json({ error: 'Forbidden: You can only delete your own submissions' });
  }

  await prisma.submission.delete({
    where: { id: id as string },
  });

  return res.status(200).json({ message: 'Submission deleted successfully' });
}
