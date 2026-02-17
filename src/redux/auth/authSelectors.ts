import type { RootState } from '../store';

// ============================================================================
// AUTH SELECTORS
// ============================================================================

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthInitialized = (state: RootState) => state.auth.isInitialized;

// Additional helpful selectors
export const selectUserEmail = (state: RootState) => state.auth.user?.email;
export const selectUserUsername = (state: RootState) => state.auth.user?.username;
export const selectUserId = (state: RootState) => state.auth.user?.id;
