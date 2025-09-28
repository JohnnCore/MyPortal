// types.ts
import type {
  Comment,
  IssueResponse,
  IssueStatus,
  Project,
  User,
} from "../types/board";

// mockData.ts

export const users: User[] = [
  {
    id: 1,
    name: "Alice Chen",
    email: "alice.chen@example.com",
    role: "Project Manager",
  },
  {
    id: 2,
    name: "Ben Rivera",
    email: "ben.rivera@example.com",
    role: "Backend Developer",
  },
  {
    id: 3,
    name: "Clara Smith",
    email: "clara.smith@example.com",
    role: "Frontend Developer",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@example.com",
    role: "QA Engineer",
  },
];

export const issuesStatues: IssueStatus[] = [
  "To Do",
  "Blocked",
  "In Progress",
  "In Review",
  "Done",
];

export const projects: Project[] = [
  { id: 101, name: "Website Redesign", key: "WR", lead: 1 },
  { id: 102, name: "Mobile App", key: "MA", lead: 3 },
];

export const issues: IssueResponse[] = [
  {
    id: 1001,
    title: "Update homepage hero section",
    projectId: 101,
    key: "WR-1",
    typeId: 1,
    description:
      "Replace old hero image with new branding image, update CTA text.",
    statusId: 3,
    priorityId: 2,
    assignee: 3,
    reporter: 1,
    createdAt: "2025-08-01T10:15:00Z",
    updatedAt: "2025-08-03T14:20:00Z",
    tags: ["frontend", "backend"]
  },
  {
    id: 1002,
    title: "Implement dark mode",
    projectId: 101,
    key: "WR-2",
    typeId: 1,
    description: "Allow users to toggle between light and dark themes.",
    statusId: 1,
    priorityId: 1,
    assignee: 2,
    reporter: 3,
    createdAt: "2025-08-02T09:00:00Z",
    updatedAt: "2025-08-02T09:00:00Z",
    tags: ["frontend", "backend"]

  },
  {
    id: 1003,
    title: "Fix login crash on iOS",
    projectId: 102,
    key: "MA-1",
    typeId: 3,
    description: "App crashes when user logs in with Google account.",
    statusId: 3,
    priorityId: 1,
    assignee: 2,
    reporter: 4,
    createdAt: "2025-08-05T11:00:00Z",
    updatedAt: "2025-08-06T08:30:00Z",
    tags: ["frontend", "backend"]

  },
];

export const comments: Comment[] = [
  {
    id: 5001,
    issueId: 1001,
    author: 3,
    text: "Mockup ready, reviewing with design team.",
    created: "2025-08-02T12:45:00Z",
  },
  {
    id: 5002,
    issueId: 1003,
    author: 4,
    text: "Crash logs uploaded for review.",
    created: "2025-08-05T15:20:00Z",
  },
];
