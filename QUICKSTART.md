# 🚀 Quick Start Guide

Get your eduAssign application up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Copy the template and configure your environment:

```bash
cp .env.template .env
```

Edit `.env` and update:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string (run: `openssl rand -base64 32`)

## Step 3: Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

## Step 4: Start Development Server

```bash
npm run dev
```

Your app is now running at `http://localhost:5173` 🎉

## Step 5: Test the API

### Register a new user:

```bash
curl -X POST http://localhost:5173/api/auth?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@test.com",
    "password": "password123",
    "name": "John Teacher",
    "role": "TEACHER"
  }'
```

### Login:

```bash
curl -X POST http://localhost:5173/api/auth?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@test.com",
    "password": "password123"
  }'
```

Save the returned `token` for authenticated requests!

### Create an assignment (use your token):

```bash
curl -X POST http://localhost:5173/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Introduction to Algebra",
    "description": "Complete exercises 1-10",
    "subject": "Mathematics",
    "totalPoints": 100,
    "dueDate": "2025-12-31T23:59:59Z"
  }'
```

## What's Next?

1. **Explore the API** - Check `api/README.md` for all endpoints
2. **Open Prisma Studio** - Run `npm run prisma:studio` to view your database
3. **Connect Frontend** - Integrate the API with your React components
4. **Deploy to Vercel** - See `SETUP.md` for deployment instructions

## Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build

# Database
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run migrations
npm run prisma:studio          # Open database GUI
npm run prisma:push            # Push schema changes

# Linting
npm run lint                   # Run ESLint
```

## Need Help?

- 📖 Full setup guide: `SETUP.md`
- 🔌 API documentation: `api/README.md`
- 🗄️ Database schema: `prisma/schema.prisma`

## Troubleshooting

**"Cannot find module" errors?**
```bash
npm install
```

**Database connection failed?**
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running

**Prisma errors?**
```bash
npm run prisma:generate
```

Happy coding! 🎓
