# Authentication Issue Fix

## Problem
The registration was failing with "Authentication failed" because the Vercel serverless API functions were not being served during local development.

## Root Cause
- The project uses Vercel serverless functions in the `/api` directory
- Running only `npm run dev` (which runs `vite`) doesn't serve the API endpoints
- The frontend was making requests to `/api/auth?action=register` but nothing was handling them

## Solution Applied

### 1. Updated package.json
Changed the `dev` script to use `vercel dev` instead of just `vite`:
```json
"scripts": {
  "dev": "vercel dev",
  "dev:vite": "vite",
  ...
}
```

### 2. Created vercel.json
Added configuration to properly route API requests:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

## How to Fix and Run

### Step 1: Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### Step 2: Stop any running dev server
Press `Ctrl+C` in your terminal if the dev server is running.

### Step 3: Ensure environment variables are set
Make sure your `.env` file exists with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/eduassign?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"
FRONTEND_URL="http://localhost:3000"
```

### Step 4: Run Prisma migrations (if not done already)
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 5: Start the development server
```bash
npm run dev
```

This will now:
- Start the Vite frontend server
- Start the Vercel serverless functions locally
- Properly route `/api/*` requests to your API handlers

### Step 6: Test registration
1. Go to `http://localhost:3000` (or whatever port Vercel dev assigns)
2. Click "Sign up"
3. Fill in the registration form
4. Submit

The registration should now work correctly!

## Alternative: Run Vite and API separately

If you prefer to run them separately:

**Terminal 1 - Frontend:**
```bash
npm run dev:vite
```

**Terminal 2 - API (using Vercel Dev):**
```bash
vercel dev --listen 3001
```

Then update `vite.config.ts` to add a proxy (already configured in the file).

## Troubleshooting

### Error: "Vercel CLI not found"
Install it globally:
```bash
npm install -g vercel
```

### Error: "Database connection failed"
1. Check your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Verify the database exists: `createdb eduassign`

### Error: "JWT_SECRET not defined"
Add `JWT_SECRET` to your `.env` file.

### Error: "Port already in use"
Kill the process using the port or change the port in `vite.config.ts`.

## What Changed
- ✅ `package.json` - Updated dev script to use `vercel dev`
- ✅ `vercel.json` - Created configuration for API routing
- ✅ `vite.config.ts` - Kept clean (no proxy needed with vercel dev)

## Next Steps
Once the server is running with `npm run dev`, try registering again. The API endpoints should now be accessible and the authentication should work properly.
