import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient().$extends(withAccelerate());
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JWTPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
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
      case 'assignment':
        return await handleAssignmentUpload(req, res, decoded);
      case 'submission':
        return await handleSubmissionUpload(req, res, decoded);
      case 'video':
        return await handleVideoUpload(req, res, decoded);
      case 'avatar':
        return await handleAvatarUpload(req, res, decoded);
      default:
        return res.status(400).json({ error: 'Invalid upload type' });
    }
  } catch (error) {
    console.error('Upload API Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleAssignmentUpload(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only teachers can upload assignment files' });
  }

  const { assignmentId } = req.query;

  if (!assignmentId) {
    return res.status(400).json({ error: 'Assignment ID required' });
  }

  // Verify assignment exists and belongs to teacher
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId as string },
  });

  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  if (assignment.teacherId !== user.userId && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Parse form data
  const form = formidable({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: 'File upload failed' });
        return resolve(null);
      }

      const uploadedFiles = Array.isArray(files.file)
        ? files.file
        : [files.file];
      const attachments: any[] = [];

      for (const file of uploadedFiles) {
        if (!file) continue;

        // In production, upload to cloud storage (S3, Cloudinary, etc.)
        // For now, we'll simulate the upload
        const fileUrl = `/uploads/${file.newFilename}`;

        const attachment = await prisma.attachment.create({
          data: {
            fileName: file.originalFilename || file.newFilename,
            fileUrl,
            fileSize: file.size,
            fileType: file.mimetype || 'application/octet-stream',
            assignmentId: assignmentId as string,
          },
        });

        attachments.push(attachment);
      }

      res.status(201).json({ attachments });
      resolve(null);
    });
  });
}

async function handleSubmissionUpload(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'STUDENT') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only students can upload submission files' });
  }

  const { submissionId } = req.query;

  if (!submissionId) {
    return res.status(400).json({ error: 'Submission ID required' });
  }

  // Verify submission exists and belongs to student
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId as string },
  });

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  if (submission.studentId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Parse form data
  const form = formidable({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: 'File upload failed' });
        return resolve(null);
      }

      const uploadedFiles = Array.isArray(files.file)
        ? files.file
        : [files.file];
      const attachments: any[] = [];

      for (const file of uploadedFiles) {
        if (!file) continue;

        // In production, upload to cloud storage
        const fileUrl = `/uploads/${file.newFilename}`;

        const attachment = await prisma.attachment.create({
          data: {
            fileName: file.originalFilename || file.newFilename,
            fileUrl,
            fileSize: file.size,
            fileType: file.mimetype || 'application/octet-stream',
            submissionId: submissionId as string,
          },
        });

        attachments.push(attachment);
      }

      res.status(201).json({ attachments });
      resolve(null);
    });
  });
}

async function handleVideoUpload(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Forbidden: Only teachers can upload videos' });
  }

  // Parse form data
  const form = formidable({
    maxFileSize: 500 * 1024 * 1024, // 500MB for videos
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: 'Video upload failed' });
        return resolve(null);
      }

      const videoFile = Array.isArray(files.video)
        ? files.video[0]
        : files.video;

      if (!videoFile) {
        res.status(400).json({ error: 'No video file provided' });
        return resolve(null);
      }

      // In production, upload to cloud storage (S3, Cloudinary, etc.)
      // For now, we'll simulate the upload
      const videoUrl = `/uploads/videos/${videoFile.newFilename}`;
      const thumbnailUrl = `/uploads/thumbnails/${videoFile.newFilename}.jpg`;

      const title = Array.isArray(fields.title)
        ? fields.title[0]
        : fields.title;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description;
      const assignmentId = Array.isArray(fields.assignmentId)
        ? fields.assignmentId[0]
        : fields.assignmentId;

      const video = await prisma.video.create({
        data: {
          title: title || videoFile.originalFilename || 'Untitled Video',
          description: description || null,
          videoUrl,
          thumbnailUrl,
          duration: null, // Would be extracted from video metadata
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
        },
      });

      res.status(201).json({ video });
      resolve(null);
    });
  });
}

async function handleAvatarUpload(
  req: VercelRequest,
  res: VercelResponse,
  user: JWTPayload
) {
  // Parse form data
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB for avatars
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: 'Avatar upload failed' });
        return resolve(null);
      }

      const avatarFile = Array.isArray(files.avatar)
        ? files.avatar[0]
        : files.avatar;

      if (!avatarFile) {
        res.status(400).json({ error: 'No avatar file provided' });
        return resolve(null);
      }

      // Validate file type
      if (!avatarFile.mimetype?.startsWith('image/')) {
        res.status(400).json({ error: 'File must be an image' });
        return resolve(null);
      }

      // In production, upload to cloud storage
      const avatarUrl = `/uploads/avatars/${avatarFile.newFilename}`;

      // Update user avatar
      const updatedUser = await prisma.user.update({
        where: { id: user.userId },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
        },
      });

      res.status(200).json({ user: updatedUser, avatarUrl });
      resolve(null);
    });
  });
}
