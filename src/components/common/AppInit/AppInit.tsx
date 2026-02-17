import React, { useEffect } from 'react';
import { useGetCurrentUserQuery } from '../../../redux/api/Auth/authApiSlice';
import { useSelector } from 'react-redux';
import { selectAuthInitialized } from '../../../redux/auth/authSelectors';
import { initializeCsrfToken } from '../../../utils/csrf';
import type { CustomError } from '../../../redux/api/apiSlice';

// Type guard for CustomError
const isCustomError = (error: unknown): error is CustomError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const isInitialized = useSelector(selectAuthInitialized);

  // Run auth check once on mount - skip if already initialized
  const { isLoading, isError, error, refetch } = useGetCurrentUserQuery(undefined, {
    skip: isInitialized,
  });

  useEffect(() => {
    initializeCsrfToken();
  }, []);

  // The finishInitialization dispatch is now handled in authApiSlice.ts
  // onQueryStarted callback, so we don't need to do it here

  // Show loading spinner only during initial auth verification
  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed catastrophically
  // (network error, server down, etc. - not just "not authenticated")
  if (!isInitialized && isError && error) {
    // Only show error for non-401 errors (401 is expected for logged-out users)
    if (isCustomError(error) && error.status !== 401) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md p-6">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">
              Unable to verify authentication. Please check your connection and try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
