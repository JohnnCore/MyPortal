src/
components/ # Reusable UI components
Button/
Button.tsx
Button.types.ts # Only local types
Button.test.tsx
Modal/
Modal.tsx
Modal.types.ts
Modal.test.tsx

pages/ # Page-level components (e.g., Next.js pages)
HomePage.tsx
HomePage.types.ts # Only if page-specific types are needed
UserPage.tsx
UserPage.types.ts

types/ # Shared types across components/pages
api/
auth.ts
user.ts
index.ts
ui/
avatar.ts # Types reused across multiple components (UI concern)
modal.ts
index.ts
common.ts # Generic utility types like Nullable, ID, etc.
domain/ # Domain / business types
user.ts
order.ts

utils/ # Generic helper functions
formatDate.ts
formatDate.types.ts # Only if helper has types

/\*\*

- TypeScript Type Definitions for MyPortal Frontend
- Generated from Sequelize models and API specifications
  \*/

// =====================
// Generic API Response Types
// =====================

export type Status = 'success' | 'error';

export interface ErrorPayload {
code: number;
message: string;
details?: string | Record<string, any>;
field?: string;
}

export interface PaginationMeta {
current_page?: number;
total_pages?: number;
per_page?: number;
limit?: number;
offset?: number;
total_count: number;
has_next_page?: boolean;
has_prev_page?: boolean;
}

export interface ApiResponse<T = any> {
status: Status;
data?: T;
message?: string;
pagination?: PaginationMeta;
error?: ErrorPayload;
}

export interface PaginatedResponse<T> {
status: 'success';
data: T[];
pagination: PaginationMeta;
}

// =====================
// Query Parameters
// =====================

export interface PaginationParams {
limit?: number;
offset?: number;
page?: number;
}

export interface IssueFilterParams extends PaginationParams {
status?: number;
type?: number;
priority?: number;
assignee?: number;
search?: string;
tags?: string; // comma-separated tag IDs
}

export interface ProjectFilterParams extends PaginationParams {
search?: string;
}

// =====================
// Core Model Types
// =====================

export interface User {
id: number;
username: string;
email: string;
password?: string; // Only present in DB, never in API responses
createdAt?: string;
updatedAt?: string;
}

export type UserSafe = Omit<User, 'password'>;

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

export interface IssueType {
id: number;
name: string;
projectId: number;
createdBy: number;
updatedBy?: number | null;
createdAt?: string;
updatedAt?: string;
}

export interface IssueStatus {
id: number;
name: string;
projectId: number;
createdBy: number;
updatedBy?: number | null;
createdAt?: string;
updatedAt?: string;
}

export interface Priority {
id: number;
name: string;
projectId: number;
createdBy: number;
updatedBy?: number | null;
createdAt?: string;
updatedAt?: string;
}

export interface Tag {
id: number;
name: string;
projectId: number;
createdBy: number;
updatedBy?: number | null;
createdAt?: string;
updatedAt?: string;
}

export interface Issue {
id: number;
key: string; // e.g., "PROJ-123"
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

export interface IssueComment {
id: number;
content: string;
issueId: number;
userId: number;
createdBy: number;
updatedBy?: number | null;
createdAt?: string;
updatedAt?: string;
}

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

// =====================
// Relation-Aware Types (API Responses)
// =====================

export interface ProjectWithRelations extends Project {
leadUser?: UserSafe;
issueTypes?: IssueType[];
issueStatuses?: IssueStatus[];
priorities?: Priority[];
tags?: Tag[];
members?: UserSafe[];
}

export interface IssueWithRelations extends Issue {
assigneeUser?: UserSafe | null;
reporterUser?: UserSafe;
type?: IssueType;
status?: IssueStatus;
priority?: Priority;
tags?: Tag[];
comments?: IssueCommentWithUser[];
}

export interface IssueCommentWithUser extends IssueComment {
user?: UserSafe;
creatorUser?: UserSafe;
updaterUser?: UserSafe;
}

export interface ProjectInviteWithRelations extends ProjectInvite {
project?: Project;
creatorUser?: UserSafe;
usedUser?: UserSafe;
}

// =====================
// DTOs - Request Bodies
// =====================

// Auth DTOs
export interface RegisterDTO {
username: string;
email: string;
password: string;
}

export interface LoginDTO {
email: string;
password: string;
}

export interface RefreshTokenDTO {
refreshToken: string;
}

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
name?: string;
key?: string;
}

// Issue DTOs
export interface CreateIssueDTO {
projectId: number;
title: string;
description?: string;
assigneeId?: number | null;
typeId: number;
statusId: number;
priorityId: number;
order?: number;
tags?: Array<{ id?: number; name?: string }>; // Can pass existing IDs or new names
}

export interface UpdateIssueDTO {
title?: string;
description?: string;
assigneeId?: number | null;
typeId?: number;
statusId?: number;
priorityId?: number;
order?: number;
tags?: Array<{ id?: number; name?: string }>;
}

// Comment DTOs
export interface CreateCommentDTO {
content: string;
issueId: number;
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
name: string;
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

// =====================
// Response Types (Typed Wrappers)
// =====================

// Auth Responses
export interface LoginResponse {
user: UserSafe;
accessToken: string;
refreshToken: string;
}

export interface RefreshTokenResponse {
accessToken: string;
refreshToken: string;
}

// Project Responses
export type ProjectsListResponse = PaginatedResponse<ProjectWithRelations>;
export type ProjectResponse = ApiResponse<ProjectWithRelations>;
export type ProjectMembersResponse = ApiResponse<{
project: ProjectWithRelations;
members: UserSafe[];
}>;

// Issue Responses
export type IssuesListResponse = PaginatedResponse<IssueWithRelations>;
export type IssueResponse = ApiResponse<IssueWithRelations>;

// Comment Responses
export type CommentsListResponse = PaginatedResponse<IssueCommentWithUser>;
export type CommentResponse = ApiResponse<IssueCommentWithUser>;

// Meta Responses
export type IssueTypesResponse = ApiResponse<IssueType[]>;
export type IssueStatusesResponse = ApiResponse<IssueStatus[]>;
export type PrioritiesResponse = ApiResponse<Priority[]>;
export type TagsResponse = ApiResponse<Tag[]>;

// Invite Responses
export type InvitesListResponse = PaginatedResponse<ProjectInviteWithRelations>;
export type InviteResponse = ApiResponse<ProjectInviteWithRelations>;

// =====================
// Validation Constants
// =====================

export const VALIDATION_CONSTANTS = {
PASSWORD_MIN_LENGTH: 8,
PASSWORD_MAX_LENGTH: 128,
USERNAME_MIN_LENGTH: 3,
USERNAME_MAX_LENGTH: 50,
EMAIL_MAX_LENGTH: 255,
ISSUE_TITLE_MAX_LENGTH: 255,
ISSUE_DESCRIPTION_MAX_LENGTH: 10000,
ISSUE_KEY_MAX_LENGTH: 20,
PROJECT_NAME_MAX_LENGTH: 100,
PROJECT_KEY_MIN_LENGTH: 2,
PROJECT_KEY_MAX_LENGTH: 10,
TAG_NAME_MAX_LENGTH: 50,
COMMENT_MAX_LENGTH: 5000,
} as const;

export const PAGINATION_CONSTANTS = {
DEFAULT_LIMIT: 50,
MAX_LIMIT: 100,
ABSOLUTE_MAX_LIMIT: 500,
} as const;

// =====================
// Error Codes
// =====================

export enum ErrorCode {
BAD_REQUEST = 400,
UNAUTHORIZED = 401,
FORBIDDEN = 403,
NOT_FOUND = 404,
CONFLICT = 409,
UNPROCESSABLE_ENTITY = 422,
INTERNAL_SERVER_ERROR = 500,
}

// =====================
// Tag Processing Types (for issue creation/update)
// =====================

/\*\*

- Tag can be:
- - Existing tag by ID: { id: number }
- - New tag to create: { id: 0 | -1, name: string }
- - Just a name string (legacy): string
    \*/
    export type TagInput =
    | { id: number; name?: string } // Existing tag
    | { id: 0 | -1; name: string } // New tag (frontend sends negative/zero ID)
    | string; // Legacy: just name

// =====================
// Health Check Types
// =====================

export interface HealthCheckResponse {
status: 'ok';
}

export interface ReadinessCheckResponse {
database: 'ready' | 'not_ready' | 'unknown';
redis: 'ready' | 'not_ready' | 'unknown';
databaseError?: string;
redisError?: string;
}

// =====================
// CSRF Types
// =====================

export interface CsrfTokenResponse {
csrfToken: string;
}
