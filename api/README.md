# eduAssign API Documentation

This directory contains the backend API routes for the eduAssign application, built with Vercel Serverless Functions and Prisma ORM.

## API Structure

```
api/
├── auth/                 # Authentication endpoints
├── assignments/          # Assignment management
├── submissions/          # Submission handling
├── grades/              # Grading system
├── videos/              # Video management
├── analytics/           # Analytics dashboard
├── upload/              # File upload endpoints
└── _middleware/         # Shared middleware utilities
```

## Authentication

All API routes (except auth endpoints) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication (`/api/auth`)

#### Register
- **POST** `/api/auth?action=register`
- **Body**: `{ email, password, name?, role: 'STUDENT' | 'TEACHER' | 'ADMIN' }`
- **Response**: `{ user, token }`

#### Login
- **POST** `/api/auth?action=login`
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### Get Current User
- **GET** `/api/auth?action=me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user }`

#### Google OAuth
- **POST** `/api/auth?action=google`
- **Body**: `{ googleId, email, name, avatar, role }`
- **Response**: `{ user, token }`

---

### Assignments (`/api/assignments`)

#### Get All Assignments
- **GET** `/api/assignments`
- **Query Params**: `status?, subject?`
- **Response**: `{ assignments[] }`

#### Get Single Assignment
- **GET** `/api/assignments?id=<assignment-id>`
- **Response**: `{ assignment }`

#### Create Assignment (Teacher/Admin only)
- **POST** `/api/assignments`
- **Body**: `{ title, description, subject, instructions?, totalPoints, dueDate, status?, attachments?, videos? }`
- **Response**: `{ assignment }`

#### Update Assignment (Teacher/Admin only)
- **PUT** `/api/assignments?id=<assignment-id>`
- **Body**: `{ title?, description?, subject?, instructions?, totalPoints?, dueDate?, status? }`
- **Response**: `{ assignment }`

#### Delete Assignment (Teacher/Admin only)
- **DELETE** `/api/assignments?id=<assignment-id>`
- **Response**: `{ message }`

---

### Submissions (`/api/submissions`)

#### Get All Submissions
- **GET** `/api/submissions`
- **Query Params**: `assignmentId?, studentId?, status?`
- **Response**: `{ submissions[] }`

#### Get Single Submission
- **GET** `/api/submissions?id=<submission-id>`
- **Response**: `{ submission }`

#### Create Submission (Student only)
- **POST** `/api/submissions`
- **Body**: `{ assignmentId, content?, notes?, attachments? }`
- **Response**: `{ submission }`

#### Update Submission
- **PUT** `/api/submissions?id=<submission-id>`
- **Body**: `{ content?, notes?, status? }`
- **Response**: `{ submission }`

#### Delete Submission
- **DELETE** `/api/submissions?id=<submission-id>`
- **Response**: `{ message }`

---

### Grades (`/api/grades`)

#### Get All Grades
- **GET** `/api/grades`
- **Query Params**: `studentId?, submissionId?`
- **Response**: `{ grades[] }`

#### Get Single Grade
- **GET** `/api/grades?id=<grade-id>`
- **Response**: `{ grade }`

#### Create Grade (Teacher/Admin only)
- **POST** `/api/grades`
- **Body**: `{ submissionId, points, feedback? }`
- **Response**: `{ grade }`

#### Update Grade (Teacher/Admin only)
- **PUT** `/api/grades?id=<grade-id>`
- **Body**: `{ points?, feedback? }`
- **Response**: `{ grade }`

#### Delete Grade (Teacher/Admin only)
- **DELETE** `/api/grades?id=<grade-id>`
- **Response**: `{ message }`

---

### Videos (`/api/videos`)

#### Get All Videos
- **GET** `/api/videos`
- **Query Params**: `assignmentId?, uploaderId?`
- **Response**: `{ videos[] }`

#### Get Single Video
- **GET** `/api/videos?id=<video-id>`
- **Response**: `{ video }`

#### Create Video (Teacher/Admin only)
- **POST** `/api/videos`
- **Body**: `{ title, description?, videoUrl, thumbnailUrl?, duration?, assignmentId? }`
- **Response**: `{ video }`

#### Update Video (Teacher/Admin only)
- **PUT** `/api/videos?id=<video-id>`
- **Body**: `{ title?, description?, videoUrl?, thumbnailUrl?, duration?, assignmentId? }`
- **Response**: `{ video }`

#### Delete Video (Teacher/Admin only)
- **DELETE** `/api/videos?id=<video-id>`
- **Response**: `{ message }`

---

### Analytics (`/api/analytics`)

#### Overview Analytics (Admin only)
- **GET** `/api/analytics?type=overview`
- **Response**: `{ overview, recentActivity }`

#### Student Analytics
- **GET** `/api/analytics?type=student&studentId=<student-id>`
- **Response**: `{ student, statistics, subjectPerformance, recentGrades, recentSubmissions }`

#### Teacher Analytics
- **GET** `/api/analytics?type=teacher&teacherId=<teacher-id>`
- **Response**: `{ teacher, statistics, recentAssignments }`

#### Assignment Analytics
- **GET** `/api/analytics?type=assignment&assignmentId=<assignment-id>`
- **Response**: `{ assignment, statistics, submissions }`

---

### Upload (`/api/upload`)

#### Upload Assignment Files (Teacher/Admin only)
- **POST** `/api/upload?type=assignment&assignmentId=<assignment-id>`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `file` field
- **Response**: `{ attachments[] }`

#### Upload Submission Files (Student only)
- **POST** `/api/upload?type=submission&submissionId=<submission-id>`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `file` field
- **Response**: `{ attachments[] }`

#### Upload Video (Teacher/Admin only)
- **POST** `/api/upload?type=video`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `video`, `title`, `description`, `assignmentId` fields
- **Response**: `{ video }`

#### Upload Avatar
- **POST** `/api/upload?type=avatar`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `avatar` field
- **Response**: `{ user, avatarUrl }`

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/eduassign"
JWT_SECRET="your-secret-key-here"
```

For production (Vercel), set these in your Vercel project settings.

## Database Setup

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npm run prisma:generate
```

3. Run migrations:
```bash
npm run prisma:migrate
```

4. (Optional) Open Prisma Studio:
```bash
npm run prisma:studio
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Role-Based Access Control

- **STUDENT**: Can view assignments, create/update their own submissions, view their own grades
- **TEACHER**: Can create/manage assignments, grade submissions, view analytics for their classes
- **ADMIN**: Full access to all resources and analytics

## Notes

- File uploads are currently configured for local storage. In production, integrate with cloud storage (AWS S3, Cloudinary, etc.)
- JWT tokens expire after 7 days
- All dates are stored and returned in ISO 8601 format
- Pagination is not implemented yet - consider adding for large datasets
