/**
 * Issue Domain Types
 */

import type { UserSafe } from './user';
import type { IssueStatus, IssueType, MetaResponse, IssuesPriority, Tag } from './meta';
import { CommentWithUser } from './comment';

export interface Issue {
  id: number;
  key: string;
  title: string;
  description?: string | null;
  assigneeId?: number | null;
  projectId: number;
  typeId: number;
  statusId: number;
  priorityId: number;
  order: number;
  createdBy: number;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IssueWithRelations extends Issue {
  assigneeUser?: UserSafe | null;
  creatorUser?: UserSafe | null;
  type?: IssueType;
  status?: IssueStatus;
  priority?: IssuesPriority;
  tags?: Tag[];
  comments?: CommentWithUser[];
}

// Legacy alias for backwards compatibility
export type IssueResponse = IssueWithRelations;

// Tag input can be existing (with id) or new (with name only)
export type TagInput =
  | { id: number; name?: string } // Existing tag
  | { id: 0 | -1; name: string } // New tag (frontend sends negative/zero ID)
  | MetaResponse;
