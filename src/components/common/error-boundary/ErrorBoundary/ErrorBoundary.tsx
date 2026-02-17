import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryPage from '../../../../pages/ErrorBoundaryPage/ErrorBoundaryPage';

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  const handleError = (error: Error, info: ErrorInfo) => {
    // Log to your error reporting service (e.g., Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught an error:', error, info);
  };

  const handleReset = () => {
    // Optional: Add any cleanup or reset logic
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorBoundaryPage}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
