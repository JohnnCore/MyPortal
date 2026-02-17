import { Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitialized } from '../../../redux/auth/authSelectors';
import type { PrivateRouteProps } from './PrivateRoute.types';

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectAuthInitialized);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
