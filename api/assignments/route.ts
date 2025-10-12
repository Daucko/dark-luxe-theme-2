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
        return await handleGetAssignments(req, res, decoded);
      case 'POST':
        return await handleCreateAssignment(req, res, decoded);
      case 'PUT':
        return await handleUpdateAssignment(req, res, decoded);
      case 'DELETE':
        return await handleDeleteAssignment(req, res, decoded);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Assignments API Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGetAssignments(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id, status, subject } = req.query;

  // Get single assignment
  if (id) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: id as string },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        attachments: true,
        videos: true,
        submissions: user.role === 'STUDENT' ? {
          where: { studentId: user.userId },
          include: {
            grade: true,
          },
        } : true,
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    return res.status(200).json({ assignment });
  }

  // Get all assignments
  const where: any = {};

  if (user.role === 'TEACHER') {
    where.teacherId = user.userId;
  }

  if (status) {
    where.status = status;
  }

  if (subject) {
    where.subject = subject;
  }

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      attachments: true,
      videos: true,
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({ assignments });
}

async function handleCreateAssignment(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only teachers can create assignments' });
  }

  const {
    title,
    description,
    subject,
    instructions,
    totalPoints,
    dueDate,
    status = 'PUBLISHED',
    attachments = [],
    videos = [],
  } = req.body;

  if (!title || !description || !subject || !totalPoints || !dueDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      subject,
      instructions,
      totalPoints: parseInt(totalPoints),
      dueDate: new Date(dueDate),
      status,
      teacherId: user.userId,
      attachments: {
        create: attachments,
      },
      videos: {
        create: videos.map((video: any) => ({
          ...video,
          uploaderId: user.userId,
        })),
      },
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      attachments: true,
      videos: true,
    },
  });

  return res.status(201).json({ assignment });
}

async function handleUpdateAssignment(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only teachers can update assignments' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Assignment ID required' });
  }

  // Check if assignment exists and belongs to teacher
  const existingAssignment = await prisma.assignment.findUnique({
    where: { id: id as string },
  });

  if (!existingAssignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  if (existingAssignment.teacherId !== user.userId && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: You can only update your own assignments' });
  }

  const {
    title,
    description,
    subject,
    instructions,
    totalPoints,
    dueDate,
    status,
  } = req.body;

  const assignment = await prisma.assignment.update({
    where: { id: id as string },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(subject && { subject }),
      ...(instructions !== undefined && { instructions }),
      ...(totalPoints && { totalPoints: parseInt(totalPoints) }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(status && { status }),
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      attachments: true,
      videos: true,
    },
  });

  return res.status(200).json({ assignment });
}

async function handleDeleteAssignment(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only teachers can delete assignments' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Assignment ID required' });
  }

  // Check if assignment exists and belongs to teacher
  const existingAssignment = await prisma.assignment.findUnique({
    where: { id: id as string },
  });

  if (!existingAssignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  if (existingAssignment.teacherId !== user.userId && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: You can only delete your own assignments' });
  }

  await prisma.assignment.delete({
    where: { id: id as string },
  });

  return res.status(200).json({ message: 'Assignment deleted successfully' });
}
