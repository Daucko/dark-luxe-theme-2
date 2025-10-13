# Development Setup Guide

## Quick Start

Run both the API server and frontend app with a single command:

```bash
npm run dev:full
```

This will start:
- **API Server** (Vercel dev) on `http://localhost:3001` - Blue prefix
- **Frontend App** (Vite) on `http://localhost:3000` - Green prefix

## Individual Commands

If you prefer to run them separately:

### Start API Server Only
```bash
npm run dev:api
```
Runs on `http://localhost:3001`

### Start Frontend Only
```bash
npm run dev
```
Runs on `http://localhost:3000`

## Testing Registration

Once both servers are running, you can test registration:

1. Open `http://localhost:3000` in your browser
2. Click "Sign up"
3. Fill in the form:
   - **Name**: Collins
   - **Email**: collinsono@example.com
   - **Password**: collins
   - **Role**: Student
4. Click "Sign up"

## Viewing Logs

When using `npm run dev:full`:
- **[API]** prefix = Backend logs (database queries, auth operations)
- **[APP]** prefix = Frontend logs (Vite dev server)

The detailed console logs will show:
- Database connection status
- User creation/lookup
- Password hashing
- JWT token generation
- Cookie setting

## Database Commands

```bash
# View database in browser
npm run prisma:studio

# Push schema changes to database
npm run prisma:push

# Generate Prisma client
npm run prisma:generate
```

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
- Kill processes on port 3000: `npx kill-port 3000`
- Kill processes on port 3001: `npx kill-port 3001`

### Database Connection Issues
Check your `.env` file has:
```
DATABASE_URL="your-postgres-connection-string"
JWT_SECRET="your-secret-key"
```

### API Not Responding
Make sure Vercel dev is running on port 3001. Check the logs for any errors.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Gmail address for sending emails (optional)
- `EMAIL_PASS` - Gmail app password (optional)
