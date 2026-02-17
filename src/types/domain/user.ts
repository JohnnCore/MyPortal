/**
 * User Domain Types
 */

export type Role = 'Project Manager' | 'Backend Developer' | 'Frontend Developer' | 'QA Engineer';

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string; // Display name (can be derived from username)
  avatar?: string;
  role?: string; // Role as string for flexibility
  createdAt?: string;
  updatedAt?: string;
}

// User without sensitive fields (for API responses)
export type UserSafe = Omit<User, 'password'>;

// Minimal user info for dropdowns/assignments
export interface UserMeta {
  id: number;
  name: string;
}
