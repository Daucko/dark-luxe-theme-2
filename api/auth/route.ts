import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Initialize Prisma Client with Accelerate for Vercel deployment
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
}).$extends(withAccelerate());

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
  // Enable CORS with credentials support
  const allowedOrigins = [
    'https://dark-luxe-theme-2.vercel.app',
    'http://localhost:3000',
  ];
  const origin = req.headers.origin || 'http://localhost:3000';
  const corsOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Quick runtime guard: if no database URL is configured, return a clear 500
  const DATABASE_URL =
    process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error(
      'Auth API misconfiguration: DATABASE_URL / PRISMA_DATABASE_URL is not set'
    );
    return res.status(500).json({
      error:
        'Server misconfigured: DATABASE_URL (or PRISMA_DATABASE_URL) is not set',
      details:
        'Set your database connection string as the PRISMA_DATABASE_URL or DATABASE_URL environment variable in your deployment platform (for example, Vercel).',
    });
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
  console.log('=== REGISTER FUNCTION CALLED ===');

  if (req.method !== 'POST') {
    console.log('Method not POST:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name, role }: RegisterBody = req.body;
  console.log('Registration data received:', {
    email,
    name,
    role,
    hasPassword: !!password,
  });

  if (!email || !password || !role) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log(
      'Existing user check:',
      existingUser ? 'User exists' : 'User does not exist'
    );

    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating user in database...');
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

    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set JWT as HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`
    );

    console.log('Cookie set, preparing response');

    // Determine dashboard URL based on role
    let dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}`;
    if (user.role === 'ADMIN') {
      dashboardUrl += '/admin/dashboard';
    } else if (user.role === 'TEACHER') {
      dashboardUrl += '/teacher/dashboard';
    } else {
      dashboardUrl += '/student/dashboard';
    }

    // Send welcome email (async, don't wait)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-password',
      },
    });

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

    transporter.sendMail(mailOptions).catch((error: Error) => {
      console.error('Error sending welcome email:', error.message);
    });

    console.log('Registration complete, sending response');
    return res.status(201).json({
      user,
      token, // Include token in response for frontend access
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Internal server error during registration',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  console.log('=== LOGIN FUNCTION CALLED ===');

  if (req.method !== 'POST') {
    console.log('Method not POST:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password }: LoginBody = req.body;
  console.log('Login attempt for email:', email);

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find user
    console.log('Searching for user in database...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password,
      });
    }

    if (!user || !user.password) {
      console.log('User not found or no password set');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    console.log('Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password verification failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set JWT as HTTP-only cookie with proper settings for cross-origin
    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`
    );

    console.log('Login successful for user:', user.email);

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token, // Include token in response for frontend access
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error during login',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function handleGetCurrentUser(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Try to get token from HTTP-only cookie first, then fall back to Authorization header
  let token: string | undefined;

  // Parse cookies from the request
  const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  token = cookies?.token;

  // Fallback to Authorization header if cookie not present
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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

  // Set JWT as HTTP-only cookie for Google auth as well
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${
      7 * 24 * 60 * 60
    }; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`
  );

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
    token, // Include token in response for frontend access
  });
}
