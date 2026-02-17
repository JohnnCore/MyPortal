import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserSafe } from '../../types';
import type { AuthState } from '../../types/state/auth';

// ============================================================================
// INITIAL STATE - Load from cookies if available
// ============================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

// ============================================================================
// SLICE
// ============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    // Set credentials (login)
    setCredentials: (state, action: PayloadAction<{ user: UserSafe }>) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;
      // state.isInitialized = true;
    },

    // Update user info (without changing token)
    updateUser: (state, action: PayloadAction<Partial<UserSafe>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Clear credentials (logout)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isInitialized = true;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    finishInitialization: (state) => {
      state.isInitialized = true;
    },
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const { setCredentials, updateUser, logout, setLoading, finishInitialization } =
  authSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

// Note: Selectors moved to a separate file to avoid circular imports
// These should be defined in a separate selectors file or used with typed hooks

// ============================================================================
// REDUCER
// ============================================================================

export default authSlice.reducer;
