import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

interface LoginBody {
  email: string;
  password: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action } = req.query;

    switch (action) {
      case 'register':
        return await handleRegister(req, res);
      case 'login':
        return await handleLogin(req, res);
      case 'me':
        return await handleGetCurrentUser(req, res);
      case 'google':
        return await handleGoogleAuth(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
  // Setup nodemailer transporter (use environment variables for real credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-email-password',
    },
  });
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name, role }: RegisterBody = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set JWT as HTTP-only cookie
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
  );

  // Determine dashboard URL based on role
  let dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}`;
  if (user.role === 'ADMIN') {
    dashboardUrl += '/admin/dashboard';
  } else if (user.role === 'TEACHER') {
    dashboardUrl += '/teacher/dashboard';
  } else {
    dashboardUrl += '/student/dashboard';
  }

  // Send welcome email
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: user.email,
    subject: 'Welcome to EduAssign!',
    html: `
      <h2>Welcome, ${user.name || user.email}!</h2>
      <p>Your account has been created successfully. Click the button below to go to your dashboard:</p>
      <a href="${dashboardUrl}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Go to Dashboard</a>
      <p>If you did not sign up, please ignore this email.</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending welcome email:', err);
    // Optionally, you can return a warning in the response
  }

  return res.status(201).json({
    user,
  });
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password }: LoginBody = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set JWT as HTTP-only cookie
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
  );

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  });
}

async function handleGetCurrentUser(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleGoogleAuth(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { googleId, email, name, avatar, role } = req.body;

  if (!googleId || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { googleId },
  });

  if (!user) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    user = await prisma.user.create({
      data: {
        googleId,
        email,
        name,
        avatar,
        role,
      },
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
    token,
  });
}
