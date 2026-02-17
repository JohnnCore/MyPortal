import { UserSafe } from '../domain';

export interface AuthState {
  user: UserSafe | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
