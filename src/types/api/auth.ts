/**
 * Authentication API Types
 */

import type { UserSafe } from '../domain/user';

// Request DTOs
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

// Response Types
export interface LoginResponse {
  user: UserSafe;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GetCurrentUserResponse {
  authenticated: boolean;
  user: UserSafe;
}
