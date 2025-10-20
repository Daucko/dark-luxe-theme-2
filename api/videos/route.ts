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
        return await handleGetVideos(req, res, decoded);
      case 'POST':
        return await handleCreateVideo(req, res, decoded);
      case 'PUT':
        return await handleUpdateVideo(req, res, decoded);
      case 'DELETE':
        return await handleDeleteVideo(req, res, decoded);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Videos API Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGetVideos(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id, assignmentId, uploaderId } = req.query;

  // Get single video
  if (id) {
    const video = await prisma.video.findUnique({
      where: { id: id as string },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
      },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    return res.status(200).json({ video });
  }

  // Build query filters
  const where: any = {};

  if (assignmentId) {
    where.assignmentId = assignmentId;
  }

  if (uploaderId) {
    where.uploaderId = uploaderId;
  }

  const videos = await prisma.video.findMany({
    where,
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
          subject: true,
        },
      },
    },
    orderBy: {
      uploadedAt: 'desc',
    },
  });

  return res.status(200).json({ videos });
}

async function handleCreateVideo(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only teachers can upload videos' });
  }

  const { title, description, videoUrl, thumbnailUrl, duration, assignmentId } =
    req.body;

  if (!title || !videoUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // If assignmentId is provided, verify it exists
  if (assignmentId) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
  }

  const video = await prisma.video.create({
    data: {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration: duration ? parseInt(duration) : null,
      uploaderId: user.userId,
      assignmentId: assignmentId || null,
    },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return res.status(201).json({ video });
}

async function handleUpdateVideo(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Video ID required' });
  }

  // Check if video exists
  const existingVideo = await prisma.video.findUnique({
    where: { id: id as string },
  });

  if (!existingVideo) {
    return res.status(404).json({ error: 'Video not found' });
  }

  // Check permissions
  if (existingVideo.uploaderId !== user.userId && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: You can only update your own videos' });
  }

  const { title, description, videoUrl, thumbnailUrl, duration, assignmentId } =
    req.body;

  const video = await prisma.video.update({
    where: { id: id as string },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(videoUrl && { videoUrl }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      ...(duration !== undefined && {
        duration: duration ? parseInt(duration) : null,
      }),
      ...(assignmentId !== undefined && { assignmentId: assignmentId || null }),
    },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return res.status(200).json({ video });
}

async function handleDeleteVideo(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Video ID required' });
  }

  // Check if video exists
  const existingVideo = await prisma.video.findUnique({
    where: { id: id as string },
  });

  if (!existingVideo) {
    return res.status(404).json({ error: 'Video not found' });
  }

  // Check permissions
  if (existingVideo.uploaderId !== user.userId && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: You can only delete your own videos' });
  }

  await prisma.video.delete({
    where: { id: id as string },
  });

  return res.status(200).json({ message: 'Video deleted successfully' });
}
