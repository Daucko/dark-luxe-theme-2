// server.js - Local development server for API routes
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
// Allow local dev frontend and deployed Vercel frontend to access the API with credentials
const allowedOrigins = [
  'http://localhost:3000',
  'https://dark-luxe-theme-2.vercel.app',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // If no origin (e.g., same-origin or curl), allow it
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Otherwise, block
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Import and use auth route handler
app.all('/api/auth', async (req, res) => {
  try {
    // Dynamically import the Vercel function
    const authModule = await import('./api/auth/route.ts');
    const handler = authModule.default;

    // Convert Express req/res to Vercel's format
    const vercelReq = {
      ...req,
      query: { ...req.query },
      body: req.body,
      headers: req.headers,
      method: req.method,
    };

    const vercelRes = {
      status: (code) => {
        res.status(code);
        return vercelRes;
      },
      json: (data) => {
        res.json(data);
        return vercelRes;
      },
      end: () => {
        res.end();
        return vercelRes;
      },
      setHeader: (key, value) => {
        res.setHeader(key, value);
        return vercelRes;
      },
    };

    await handler(vercelReq, vercelRes);
  } catch (error) {
    console.error('Error in auth route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for http://localhost:3000`);
  console.log(
    `🔗 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`
  );
});
