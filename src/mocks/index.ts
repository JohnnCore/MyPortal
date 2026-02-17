// types.ts
import type { Comment, IssueResponse, IssueStatus, Project, User } from '../types';

// mockData.ts

export const users: User[] = [
  {
    id: 1,
    username: 'alice.chen',
    name: 'Alice Chen',
    email: 'alice.chen@example.com',
    role: 'Project Manager',
  },
  {
    id: 2,
    username: 'ben.rivera',
    name: 'Ben Rivera',
    email: 'ben.rivera@example.com',
    role: 'Backend Developer',
  },
  {
    id: 3,
    username: 'clara.smith',
    name: 'Clara Smith',
    email: 'clara.smith@example.com',
    role: 'Frontend Developer',
  },
  {
    id: 4,
    username: 'david.kim',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'QA Engineer',
  },
];

export const issuesStatues: IssueStatus[] = [
  { id: 1, name: 'To Do' },
  { id: 2, name: 'Blocked' },
  { id: 3, name: 'In Progress' },
  { id: 4, name: 'In Review' },
  { id: 5, name: 'Done' },
];

export const projects: Project[] = [
  { id: 101, name: 'Website Redesign', key: 'WR', leadId: 1, createdBy: 1 },
  { id: 102, name: 'Mobile App', key: 'MA', leadId: 3, createdBy: 1 },
];

export const issues: IssueResponse[] = [
  {
    id: 1001,
    title: 'Update homepage hero section',
    projectId: 101,
    key: 'WR-1',
    typeId: 1,
    description: 'Replace old hero image with new branding image, update CTA text.',
    statusId: 3,
    priorityId: 2,
    assigneeId: 3,
    order: 0,
    createdBy: 1,
    createdAt: '2025-08-01T10:15:00Z',
    updatedAt: '2025-08-03T14:20:00Z',
  },
  {
    id: 1002,
    title: 'Implement dark mode',
    projectId: 101,
    key: 'WR-2',
    typeId: 1,
    description: 'Allow users to toggle between light and dark themes.',
    statusId: 1,
    priorityId: 1,
    assigneeId: 2,
    order: 1,
    createdBy: 3,
    createdAt: '2025-08-02T09:00:00Z',
    updatedAt: '2025-08-02T09:00:00Z',
  },
  {
    id: 1003,
    title: 'Fix login crash on iOS',
    projectId: 102,
    key: 'MA-1',
    typeId: 3,
    description: 'App crashes when user logs in with Google account.',
    statusId: 3,
    priorityId: 1,
    assigneeId: 2,
    order: 0,
    createdBy: 4,
    createdAt: '2025-08-05T11:00:00Z',
    updatedAt: '2025-08-06T08:30:00Z',
  },
];

export const comments: Comment[] = [
  {
    id: 5001,
    issueId: 1001,
    userId: 3,
    content: 'Mockup ready, reviewing with design team.',
    createdAt: '2025-08-02T12:45:00Z',
    updatedAt: '2025-08-02T12:45:00Z',
  },
  {
    id: 5002,
    issueId: 1003,
    userId: 4,
    content: 'Crash logs uploaded for review.',
    createdAt: '2025-08-05T15:20:00Z',
    updatedAt: '2025-08-05T15:20:00Z',
  },
];
