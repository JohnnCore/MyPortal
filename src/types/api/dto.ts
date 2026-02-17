/**
 * Data Transfer Objects (Request Bodies)
 */

import { UserSafe } from '../domain';
import type { TagInput } from '../domain/issue';

// Project DTOs
export interface CreateProjectDTO {
  name: string;
  key: string; // 2-10 uppercase letters/numbers
  issueTypes?: Array<string | { name: string }>;
  issueStatuses?: Array<string | { name: string }>;
  priorities?: Array<string | { name: string }>;
  projectMembers?: number[]; // User IDs
}

export interface UpdateProjectDTO {
  id: number;
  name?: string;
  key?: string;
}

// Issue DTOs
export interface CreateIssueDTO {
  projectId: number;
  title: string;
  description?: string | null;
  assigneeId?: number | null;
  typeId: number;
  statusId: number;
  priorityId: number;
  order?: number;
  tags?: TagInput[];
}

export interface CreateIssueCardDTO {
  projectId?: number;
  title?: string;
  description?: string | null;
  assigneeId?: number | null;
  typeId?: number;
  statusId?: number;
  priorityId?: number;
  order?: number;
  tags?: TagInput[];
}

export interface UpdateIssueDTO {
  id: number;
  projectId?: number;
  title?: string;
  description?: string | null;
  assigneeId?: number | null;
  typeId?: number;
  statusId?: number;
  priorityId?: number;
  order?: number;
  tags?: TagInput[];
  assigneeUser?: UserSafe | null;
  updatedAt?: string;
}

export type UpdateIssueInput = Omit<UpdateIssueDTO, 'id' | 'projectId'>;

export interface DeleteIssueDTO {
  id: number;
  projectId: number;
}

// Comment DTOs
export interface CreateCommentDTO {
  content: string;
  issueId: number;
  projectId: number;
}

export interface UpdateCommentDTO {
  content: string;
}

// Tag DTOs
export interface CreateTagDTO {
  name: string;
  projectId: number;
}

// Meta DTOs
export interface CreateIssueStatusDTO {
  name: string;
  projectId: number;
}

export interface RenameIssueStatusDTO {
  id: number;
  status: string;
  projectId: number;
}

export interface ReorderIssueStatusDTO {
  statusId: number;
  newIndex: number;
  projectId: number;
}

export interface CreateIssueTypeDTO {
  name: string;
  projectId: number;
}

export interface CreatePriorityDTO {
  name: string;
  projectId: number;
}

// Invite DTOs
export interface CreateInviteDTO {
  projectId: number;
  email?: string;
  expiresDays?: number;
  maxUses?: number;
}

export interface AcceptInviteDTO {
  token: string;
}

export type ReorderIssuesDTO = {
  id: number;
  statusId: number;
  newIndex: number;
  projectId: number;
};
