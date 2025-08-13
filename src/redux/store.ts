import { initMessageListener, withReduxStateSync } from "redux-state-sync";

import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";

import notificationsSlice from "./notifications/notificationsSlice";
import modalSlice from "./modal/modalSlice";

const rootReducer = combineReducers({
  // Add your reducers here
  notificationsSlice: notificationsSlice,
  modalSlice: modalSlice,
});

export const setupStore = (preloadedState?: RootState) => {
  const store = configureStore({
    preloadedState,
    reducer: withReduxStateSync(rootReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(),
    /** We should only have access to redux dev tools on local & development env */
    devTools:
      import.meta.env.VITE_APP_DEPLOY_ENV === "local" ||
      import.meta.env.VITE_APP_DEPLOY_ENV === "development",
  });
  initMessageListener(store);
  return store;
};

const store = setupStore();
export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
