import { initMessageListener, withReduxStateSync } from 'redux-state-sync';
import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import notificationsSlice from './notifications/notificationsSlice';
import authSlice from './auth/authSlice';

import { apiSlice } from './api/apiSlice';

const rootReducer = combineReducers({
  notificationsSlice: notificationsSlice,
  // modalSlice: modalSlice,
  auth: authSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    preloadedState,
    reducer: withReduxStateSync(rootReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware as Middleware),
    devTools: import.meta.env.VITE_APP_DEPLOY_ENV === 'development',
  });

  // Enable refetchOnFocus and refetchOnReconnect
  setupListeners(store.dispatch);

  initMessageListener(store);
  return store;
};

const store = setupStore();
export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
