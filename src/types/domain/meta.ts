/**
 * Meta/Lookup Domain Types
 * These are project-scoped lookup values
 */

export interface MetaBase {
  id: number;
  name: string;
  projectId?: number;
  createdBy?: number;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
}

// Generic meta response for dropdowns
export interface MetaResponse {
  id: number;
  name: string;
}

export type IssueType = MetaBase;

export type IssueStatus = MetaBase;

export type IssuesPriority = MetaBase;

export type Tag = MetaBase;
