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

export interface Issue {
  id: number;
  projectId: number;
  type: IssueType;
  key: string;
  summary: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  assignee: number; // userId
  reporter: number; // userId
  created: string; // ISO date
  updated: string; // ISO date
}

export interface Comment {
  id: number;
  issueId: number;
  author: number; // userId
  text: string;
  created: string; // ISO date
}
