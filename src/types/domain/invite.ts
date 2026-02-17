/**
 * Project Invite Domain Types
 */

import type { UserSafe } from './user';
import type { Project } from './project';

export interface ProjectInvite {
  id: number;
  token: string;
  email?: string | null;
  projectId: number;
  expiresAt: string;
  maxUses?: number | null;
  usesCount: number;
  used: boolean;
  createdBy?: number | null;
  usedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectInviteWithRelations extends ProjectInvite {
  project?: Project;
  creatorUser?: UserSafe;
  usedUser?: UserSafe;
}
