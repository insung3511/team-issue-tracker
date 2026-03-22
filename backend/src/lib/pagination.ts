import { PaginationMeta } from '../types/common';

export function calculatePagination(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
} as const;
