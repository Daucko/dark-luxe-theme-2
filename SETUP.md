# eduAssign Setup Guide

## Overview

This is a complete setup for your eduAssign educational assignment management system with:
- ✅ Prisma ORM with PostgreSQL
- ✅ Full REST API with Vercel Serverless Functions
- ✅ JWT Authentication
- ✅ Role-based access control (Student, Teacher, Admin)
- ✅ File upload support
- ✅ Analytics endpoints

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Vercel account (for deployment)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `@prisma/client` - Database ORM
- `@vercel/node` - Vercel serverless function types
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `formidable` - File upload handling

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/eduassign?schema=public"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: For Vercel Postgres
# POSTGRES_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
# POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
# POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
```

### 3. Set Up Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

(Optional) Seed database or open Prisma Studio:
```bash
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
eduAssign/
├── api/                          # Backend API Routes
│   ├── auth/                     # Authentication endpoints
│   │   └── route.ts
│   ├── assignments/              # Assignment management
│   │   └── route.ts
│   ├── submissions/              # Submission handling
│   │   └── route.ts
│   ├── grades/                   # Grading system
│   │   └── route.ts
│   ├── videos/                   # Video management
│   │   └── route.ts
│   ├── analytics/                # Analytics dashboard
│   │   └── route.ts
│   ├── upload/                   # File upload endpoints
│   │   └── route.ts
│   ├── _middleware/              # Shared utilities
│   │   └── auth.ts
│   └── README.md                 # API documentation
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── src/
│   ├── lib/
│   │   └── prisma.ts             # Prisma client instance
│   ├── pages/                    # React pages
│   └── components/               # React components
│
├── .env.example                  # Environment variables template
├── package.json
└── SETUP.md                      # This file
```

## Database Schema

The Prisma schema includes the following models:

- **User** - Students, Teachers, and Admins
- **Assignment** - Course assignments
- **Submission** - Student submissions
- **Grade** - Grading records
- **Attachment** - File attachments
- **Video** - Instructional videos
- **Enrollment** - Student course enrollments
- **Course** - Course information
- **Notification** - User notifications

## API Endpoints

See `api/README.md` for complete API documentation.

### Quick Reference

- **Auth**: `/api/auth?action=register|login|me|google`
- **Assignments**: `/api/assignments`
- **Submissions**: `/api/submissions`
- **Grades**: `/api/grades`
- **Videos**: `/api/videos`
- **Analytics**: `/api/analytics?type=overview|student|teacher|assignment`
- **Upload**: `/api/upload?type=assignment|submission|video|avatar`

## Deployment to Vercel

### 1. Connect to Vercel

```bash
npm i -g vercel
vercel login
vercel
```

### 2. Set Up Database

Option A: Use Vercel Postgres
```bash
vercel postgres create
```

Option B: Use external PostgreSQL (Supabase, Neon, Railway, etc.)

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` and `JWT_SECRET`

### 4. Deploy

```bash
vercel --prod
```

The `postinstall` script will automatically run `prisma generate` during deployment.

## Development Tips

### Running Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Push schema changes without migration
npm run prisma:push

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Testing API Endpoints

Use tools like:
- **Postman** or **Insomnia** for API testing
- **Thunder Client** (VS Code extension)
- **curl** commands

Example:
```bash
# Register a new user
curl -X POST http://localhost:5173/api/auth?action=register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123","role":"STUDENT"}'
```

### File Upload Configuration

The current implementation uses local file storage. For production:

1. **AWS S3**: Use `@aws-sdk/client-s3`
2. **Cloudinary**: Use `cloudinary` package
3. **Vercel Blob**: Use `@vercel/blob`

Update the upload handlers in `api/upload/route.ts` accordingly.

## Troubleshooting

### Module not found errors

Run:
```bash
npm install
```

### Prisma Client errors

Regenerate the client:
```bash
npm run prisma:generate
```

### Database connection errors

1. Check your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Verify database credentials

### JWT token errors

Ensure `JWT_SECRET` is set in your environment variables.

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up environment variables
3. ✅ Run database migrations
4. ✅ Test API endpoints
5. 🔄 Integrate frontend with API
6. 🔄 Add authentication context to React
7. 🔄 Implement file upload UI
8. 🔄 Deploy to Vercel

## Security Considerations

- ⚠️ Change `JWT_SECRET` to a strong random string in production
- ⚠️ Never commit `.env` files to version control
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for API endpoints
- ⚠️ Validate and sanitize all user inputs
- ⚠️ Use secure file upload practices

## Support

For issues or questions:
1. Check `api/README.md` for API documentation
2. Review Prisma schema in `prisma/schema.prisma`
3. Check Vercel deployment logs

## License

Private project - All rights reserved
