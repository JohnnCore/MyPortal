import { lazy, Suspense } from 'react';

import { Route, Routes } from 'react-router';

import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import { BOARD, LOGIN, REGISTER, ROOT, INVITE_ACCEPT } from './paths';
import { PrivateRoute } from '../components/common/PrivateRoute/PrivateRoute';
import Projects from '../components/project/Projects/Projects';
import ErrorBoundary from '../components/common/error-boundary/ErrorBoundary/ErrorBoundary';
import Spinner from '../components/common/Spinner/Spinner';

const BoardPage = lazy(() => import('../pages/Board/BoardPage'));
const AcceptInvitePage = lazy(() => import('../pages/Invites/AcceptInvitePage'));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={BOARD}
        element={
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <ErrorBoundary>
                <BoardPage />
              </ErrorBoundary>
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path={`${BOARD}/:tab`}
        element={
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <ErrorBoundary>
                <BoardPage />
              </ErrorBoundary>
            </Suspense>
          </PrivateRoute>
        }
      />

      <Route
        path={INVITE_ACCEPT}
        element={
          <Suspense fallback={<Spinner />}>
            <ErrorBoundary>
              <AcceptInvitePage />
            </ErrorBoundary>
          </Suspense>
        }
      />

      <Route path={ROOT} element={<Projects />} />
      {/* Public Routes */}
      <Route path={LOGIN} element={<LoginPage />} />

      <Route path={REGISTER} element={<RegisterPage />} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
