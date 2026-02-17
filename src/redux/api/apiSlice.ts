import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { RTKQ_TAGS } from '../../utils/constants';
import { logout } from '../auth/authSlice';
import { getCsrfToken } from '../../utils/csrf';
import { addNotification } from '../notifications/notificationsSlice'; // Import notification action

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api';
const MAX_RETRIES = 0;
const RETRY_STATUS_CODES = [500, 502, 503, 504, 429];

// ============================================================================
// TYPES
// ============================================================================

export type CustomError = FetchBaseQueryError & {
  message: string;
  originalStatus?: number;
};

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// ============================================================================
// BASE QUERY
// ============================================================================

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  // No need to manually set the Authorization header anymore
  prepareHeaders: (headers) => {
    // Add CSRF token from cookie
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }

    // Ensure content-type is set if it's not already
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    // Credentials are sent automatically with each request via cookies
    return headers;
  },
  credentials: 'include', // This ensures cookies are included in requests
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

const getStatusNumber = (error: FetchBaseQueryError): number => {
  if (!error) return 500;

  // Preserve originalStatus if exists
  if ('originalStatus' in error && typeof error.originalStatus === 'number') {
    return error.originalStatus;
  }

  if (typeof error.status === 'number') return error.status;

  switch (error.status) {
    case 'FETCH_ERROR':
      return 503;
    case 'PARSING_ERROR':
      return 500;
    case 'TIMEOUT_ERROR':
      return 504;
    case 'CUSTOM_ERROR':
      return 500;
    default:
      return 500;
  }
};

const parseApiError = (error: FetchBaseQueryError): { error: CustomError } => {
  const status = getStatusNumber(error);
  let message = 'An unexpected error occurred';

  const errorData = error.data as ApiErrorResponse | undefined;

  if (errorData?.message) message = errorData.message;
  else if (errorData?.error) message = errorData.error;
  else if (errorData?.errors)
    message = Object.entries(errorData.errors)
      .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
      .join('; ');

  const statusMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'You are not authenticated. Please log in.',
    403: "You don't have permission to perform this action.",
    404: 'The requested resource was not found.',
    409: 'This resource already exists or conflicts with another.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timeout. Please try again.',
  };

  if (!errorData?.message && status in statusMessages) message = statusMessages[status];

  return {
    error: {
      ...error,
      message,
      originalStatus:
        'originalStatus' in error
          ? error.originalStatus
          : typeof error.status === 'number'
            ? error.status
            : undefined,
      status,
    },
  };
};

// ============================================================================
// BASE QUERY WITH AUTH AND LOGOUT/REDIRECT
// ============================================================================
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, CustomError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle Unauthorized
  if (result.error && getStatusNumber(result.error) === 401) {
    const state = api.getState() as RootState;
    const isAuthenticated = state.auth?.isAuthenticated;

    // Only dispatch logout if the user was previously authenticated
    // This prevents logout from being called during the initial auth check
    if (isAuthenticated) {
      api.dispatch(logout());
    }

    const parsedError = parseApiError(result.error);
    // Dispatch notification for unauthorized error
    // api.dispatch(
    //     addNotification({
    //         message: parsedError.error.message,
    //         props: {
    //             type: "error",
    //             hasTimeout: true,
    //             timeoutDuration: 5000,
    //             dismissible: true,
    //         },
    //     })
    // );
    return parsedError;
  }

  if (result.error) {
    const parsedError = parseApiError(result.error);
    // Dispatch notification for any other error
    api.dispatch(
      addNotification({
        message: parsedError.error.message,
        props: {
          type: 'error',
          hasTimeout: true,
          timeoutDuration: 5000,
          dismissible: true,
        },
      })
    );
    return parsedError;
  }

  return result;
};

// ============================================================================
// BASE QUERY WITH RETRY AND BACKOFF
// ============================================================================
const baseQueryWithRetry: BaseQueryFn<string | FetchArgs, unknown, CustomError> = async (
  args,
  api,
  extraOptions
) => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await baseQueryWithAuth(args, api, extraOptions);

    if ('data' in result) return result;

    const status = getStatusNumber(result.error);
    if (RETRY_STATUS_CODES.includes(status) && attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((res) => setTimeout(res, delay));
      continue;
    }

    return result;
  }

  return parseApiError({
    status: 500,
    data: { message: 'Max retries reached' },
  } as FetchBaseQueryError);
};

// ============================================================================
// API SLICE
// ============================================================================

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: Object.values(RTKQ_TAGS),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  refetchOnMountOrArgChange: false, // Don't refetch on remount unless data is stale
  keepUnusedDataFor: 60, // Keep cache for 60 seconds
  endpoints: () => ({}),
});
