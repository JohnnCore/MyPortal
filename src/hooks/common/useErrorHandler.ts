import { useCallback } from 'react';
import { useAppDispatch } from '../reduxHooks';
import {
  addNotification,
  createErrorNotification,
} from '../../redux/notifications/notificationsSlice';

/**
 * Error response from API (RTK Query format)
 */
interface ApiErrorData {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

interface ApiError {
  status?: number | string;
  data?: ApiErrorData;
}

/**
 * Extract a user-friendly error message from various error types
 */
const extractErrorMessage = (error: unknown, defaultMessage: string): string => {
  // Handle RTK Query error format
  if (error && typeof error === 'object' && 'data' in error) {
    const apiError = error as ApiError;
    const errorData = apiError.data;

    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
    if (errorData?.errors) {
      return Object.entries(errorData.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('; ');
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
};

/**
 * Options for error handling
 */
interface ErrorHandlerOptions {
  /** Show notification to user (default: true) */
  showNotification?: boolean;
  /** Log error to console (default: true in development) */
  logToConsole?: boolean;
  /** Custom error message override */
  customMessage?: string;
  /** Context for debugging (e.g., function name, operation) */
  context?: string;
}

/**
 * Custom hook for standardized error handling across the application.
 *
 * Features:
 * - Consistent error message extraction from various error types
 * - Automatic notification dispatch
 * - Optional console logging
 * - Context tracking for debugging
 *
 * @example
 * ```tsx
 * const handleError = useErrorHandler();
 *
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   handleError(error, { context: 'someAsyncOperation' });
 * }
 *
 * // With custom message
 * handleError(error, {
 *   customMessage: 'Failed to save changes',
 *   context: 'updateIssue'
 * });
 *
 * // Silent error (no notification)
 * handleError(error, {
 *   showNotification: false,
 *   context: 'backgroundSync'
 * });
 * ```
 */
export const useErrorHandler = () => {
  const dispatch = useAppDispatch();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}): string => {
      const {
        showNotification = true,
        logToConsole = import.meta.env.DEV,
        customMessage,
        context,
      } = options;

      const defaultMessage = 'An unexpected error occurred';
      const message = customMessage ?? extractErrorMessage(error, defaultMessage);

      // Log to console in development
      if (logToConsole) {
        const logContext = context ? `[${context}]` : '';
        console.error(`Error${logContext}:`, error);
      }

      // Show notification
      if (showNotification) {
        dispatch(addNotification(createErrorNotification(message)));
      }

      // Return message for additional handling if needed
      return message;
    },
    [dispatch]
  );

  return handleError;
};

/**
 * HOF to wrap async functions with error handling
 *
 * @example
 * ```tsx
 * const handleError = useErrorHandler();
 *
 * const safeFetch = withErrorHandling(
 *   async () => await fetchData(),
 *   handleError,
 *   { context: 'fetchData' }
 * );
 *
 * await safeFetch();
 * ```
 */
export const withErrorHandling = <T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  handleError: ReturnType<typeof useErrorHandler>,
  options: ErrorHandlerOptions = {}
): ((...args: Parameters<T>) => Promise<ReturnType<T> | undefined>) => {
  return async (...args: Parameters<T>) => {
    try {
      return (await fn(...args)) as ReturnType<T>;
    } catch (error) {
      handleError(error, options);
      return undefined;
    }
  };
};
