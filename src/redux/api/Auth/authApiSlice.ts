import { apiSlice } from '../apiSlice';
import { RootState } from '../../store';
import { finishInitialization, logout, setCredentials } from '../../auth/authSlice';
import type { GetCurrentUserResponse, LoginDTO, LoginResponse, RegisterDTO } from '../../../types';
import { addNotification, createErrorNotification } from '../../notifications/notificationsSlice';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginDTO>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Automatically update Redux state on success
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user }));
        } catch (err) {
          dispatch(addNotification(createErrorNotification('Login failed')));
          console.error('Login failed:', err);
        }
      },
    }),

    // Register
    register: builder.mutation<LoginResponse, RegisterDTO>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user }));
        } catch (err) {
          dispatch(addNotification(createErrorNotification('Registration failed')));
          console.error('Registration failed:', err);
        }
      },
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear state even if API call fails
          dispatch(logout());
        }
      },
    }),

    // Get current user (verify token)
    getCurrentUser: builder.query<GetCurrentUserResponse, void>({
      query: () => ({ url: '/auth/check', method: 'GET' }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = (getState() as RootState).auth.user;
          if (!currentUser || currentUser.id !== data.user.id) {
            dispatch(setCredentials({ user: data.user }));
          }
        } catch {
          dispatch(logout());
          dispatch(addNotification(createErrorNotification('Failed to verify authentication')));
        } finally {
          dispatch(finishInitialization());
        }
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetCurrentUserQuery } =
  authApiSlice;
