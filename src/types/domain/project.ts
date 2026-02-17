/**
 * Project Domain Types
 */

import type { UserSafe } from './user';
import type { IssueType, IssueStatus, IssuesPriority, Tag } from './meta';

export type ProjectStatus = 'Active' | 'On Hold' | 'Completed' | 'Cancelled';

export interface Project {
  id: number;
  name: string;
  key: string;
  leadId: number;
  createdBy: number;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectWithRelations extends Project {
  leadUser?: UserSafe;
  issueTypes?: IssueType[];
  issueStatuses?: IssueStatus[];
  priorities?: IssuesPriority[];
  tags?: Tag[];
  members?: UserSafe[];
}
