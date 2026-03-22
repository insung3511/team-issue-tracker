import { IssueStatus } from '../generated/prisma';

export const STATUS_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  BACKLOG: ['TODO'],
  TODO: ['IN_PROGRESS', 'BACKLOG'],
  IN_PROGRESS: ['IN_REVIEW', 'TODO'],
  IN_REVIEW: ['DONE', 'IN_PROGRESS'],
  DONE: ['IN_PROGRESS'],
};

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
