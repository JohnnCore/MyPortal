import { AppRoutes } from '../routes';
import { Suspense } from 'react';
import Spinner from '../components/common/Spinner/Spinner';
import { GlobalNotifications } from '../components/common/Notification/GlobalNotifications/GlobalNotifications';
import ErrorBoundary from '../components/common/error-boundary/ErrorBoundary/ErrorBoundary';
import { AppInitializer } from '../components/common/AppInit/AppInit';

const App = () => {
  return (
    <ErrorBoundary>
      <AppInitializer>
        {/* Keep notifications always available, outside Suspense */}
        <GlobalNotifications />

        {/* Route-level error isolation */}
        <Suspense fallback={<Spinner />}>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Suspense>
      </AppInitializer>
    </ErrorBoundary>
  );
};

export default App;
