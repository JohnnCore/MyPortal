/**
 * API Types - Re-exports
 */

export * from './auth';
export * from './dto';
export * from './params';
export * from './issue';
export * from './meta';
export * from './invites';

// Generic API Response Types
export type Status = 'success' | 'error';

export interface ErrorPayload {
  code: number;
  message: string;
  details?: string | Record<string, unknown>;
  field?: string;
}

export interface PaginationMeta {
  current_page?: number;
  total_pages?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
  total_count: number;
  has_next_page?: boolean;
  has_prev_page?: boolean;
}

// Cursor-based pagination meta for infinite scroll
export interface CursorPaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  status: Status;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
  error?: ErrorPayload;
}

export interface PaginatedResponse<T> {
  status: Status;
  data: T[];
  pagination?: PaginationMeta;
  total?: number;
  page?: number;
  pageSize?: number;
}

// Cursor-based paginated response for infinite scroll
export interface CursorPaginatedResponse<T> {
  status: Status;
  data: T[];
  pagination: CursorPaginationMeta;
}

export interface SingleResponse<T> {
  status: Status;
  data: T;
  message?: string;
}
