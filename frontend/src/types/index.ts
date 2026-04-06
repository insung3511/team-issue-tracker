// These types mirror the backend Prisma models + API responses

export type IssueStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
  createdAt: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: Priority;
  labels: string[];
  creatorId: number;
  assigneeId: number | null;
  creator?: User;
  assignee?: User | null;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  issueId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

// API Response wrappers (mirror backend)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Stats API response types (direct objects, no ApiResponse wrapper)
export interface StatsOverview {
  BACKLOG: number;
  TODO: number;
  IN_PROGRESS: number;
  IN_REVIEW: number;
  DONE: number;
}

export interface StatsByPriority {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  URGENT: number;
}

export interface StatsByAssignee {
  [name: string]: number;
}
