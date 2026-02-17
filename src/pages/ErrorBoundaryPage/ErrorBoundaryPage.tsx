import React from 'react';
import { useErrorBoundary } from 'react-error-boundary'; // Import useErrorBoundary
import Button from '../../components/common/Button/Button';
import PageContainer from '../../components/common/PageContainer/PageContainer';

export interface ErrorBoundaryPageProps {
  error: Error; // Ensure the error prop is of type Error
}

// Make sure the return type is explicitly set to JSX.Element
const ErrorBoundaryPage: React.FC<ErrorBoundaryPageProps> = ({ error }) => {
  const { resetBoundary } = useErrorBoundary(); // Access resetBoundary here

  let message: string | undefined = 'An unexpected error occurred.';
  let body: React.ReactNode = (
    <div className="mt-12 self-stretch md:self-center">
      <h2 className="text-xl">Technical details</h2>
      <div className="border border-[#DC2626] rounded overflow-hidden">
        <pre className="p-4 bg-[#FEF2F2] overflow-x-auto">{message}</pre>
      </div>
    </div>
  );

  if (import.meta.env.VITE_APP_DEBUG_MODE === 'true' && error instanceof Error) {
    message = error.stack; // Show the stack trace in debug mode
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4 items-center justify-center h-full mt-12">
        <h1 className="mx-auto max-w-2xl text-2xl md:text-3xl font-bold tracking-tight">
          Uh oh, something went wrong
        </h1>
        <p className="text-base md:text-xl">Please return to your previous screen and try again.</p>
        <Button onClick={resetBoundary}>Go Back</Button>
        {body}
      </div>
    </PageContainer>
  );
};

export default ErrorBoundaryPage;
