/**
 * Comment Domain Types
 */

import type { UserSafe } from './user';

export interface Comment {
  id: number;
  content: string;
  issueId: number;
  userId: number;
  user?: UserSafe; // Populated relation
  createdBy?: number;
  updatedBy?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentWithUser extends Comment {
  user?: UserSafe;
  creatorUser?: UserSafe;
  updaterUser?: UserSafe;
}
