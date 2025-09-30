export type Role =
  | "Project Manager"
  | "Backend Developer"
  | "Frontend Developer"
  | "QA Engineer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  id: number;
  name: string;
  key: string;
  lead: number; // userId
}

export type ProjectStatus = "Active" | "On Hold" | "Completed" | "Cancelled";
export type IssueStatus =
  | "To Do"
  | "Blocked"
  | "In Progress"
  | "In Review"
  | "Done";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type IssueType = "Task" | "Bug" | "Story" | "Epic";

export interface MetaResponse {
  id: number;
  name: string;
}

export interface Issue {
  projectId: number;
  title: string;
  typeId: number;
  description: string;
  statusId: number;
  priorityId: number;
  tags: string[];
  assignee: number; // userId
  reporter: number; // userId
}

export interface IssueResponse extends Issue {
  id: number;
  key: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Comment {
  id: number;
  issueId: number;
  author: number; // userId
  text: string;
  created: string; // ISO date
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SingleResponse<T> {
  data: T;
}
