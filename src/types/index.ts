export type UserRole = 'STUDENT' | 'ADMIN' | 'TEACHER';

export type VideoType = 'INSTRUCTIONAL' | 'ANIMATED_HINT';

export type Term = 'FIRST' | 'SECOND' | 'THIRD';

export interface User {
  id: string;
  email: string;
  name: string;
  class: string;
  school: string;
  gender: string;
  profileImage?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  deadline?: Date;
  dueDate?: string;
  maxMarks?: number;
  totalPoints?: number;
  subject?: string;
  targetClass?: string;
  attachments?: string[];
  createdBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  submissionsCount?: number;
  gradedCount?: number;
}

export interface Submission {
  id: string;
  filePath?: string;
  files?: string[];
  submittedAt?: Date | string;
  late?: boolean;
  userId?: string;
  assignmentId: string;
  studentId?: string;
  studentName?: string;
  assignmentTitle?: string;
  status?: string;
}

export interface Grade {
  id: string;
  marks?: number;
  feedback?: string;
  gradedAt: Date;
  userId: string;
  assignmentId: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  filePath: string;
  videoType: VideoType;
  thumbnailUrl?: string;
  duration?: number;
  assignmentId: string;
  createdAt: Date;
}

export interface Session {
  year: string;
  term: Term;
}
