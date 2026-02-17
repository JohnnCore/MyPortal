/**
 * API Query Parameter Types
 */

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export interface IssueFilterParams extends PaginationParams {
  status?: number;
  type?: number;
  priority?: number;
  assignee?: number;
  search?: string;
  tags?: string; // comma-separated tag IDs
  assigneeIds?: number[];
  statusIds?: number[];
  typeIds?: number[];
  priorityIds?: number[];
}

export interface GetProjectFilterParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetIssuesQueryParams = {
  projectId: number;
  status?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  assigneeIds?: number[];
  statusIds?: number[];
  typeIds?: number[];
  priorityIds?: number[];
};

// Cursor-based pagination params for infinite scroll
export type GetIssuesCursorParams = {
  projectId: number;
  limit?: number;
  cursor?: string | null;
  search?: string;
  assigneeIds?: number[];
  statusIds?: number[];
  typeIds?: number[];
  priorityIds?: number[];
};

export type GetProjectMembersParams = {
  projectId: number;
};

export type GetIssueParams = {
  id: number;
  projectId: number;
};

export type GetCommentsParams = {
  issueId: number;
  projectId: number;
};
