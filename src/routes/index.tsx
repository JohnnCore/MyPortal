import { lazy } from "react";
import { Routes, Route, useLocation, matchPath } from "react-router";

import { BOARD, ISSUE_DETAILS, modalPaths, ROOT } from "./paths";

const MyFeed = lazy(() => import("../components/my-feed/MyFeed/MyFeed"));
const BoardPage = lazy(() => import("../pages/Board/BoardPage"));
const IssueDetail = lazy(
  () => import("../components/board/IssueDetail/IssueDetail")
);

export const AppRoutes = () => {
  const location = useLocation();

  // Check if current location matches any modal path
  const modalPath = Object.keys(modalPaths).find((path) =>
    matchPath(path, location.pathname)
  );

  // Build background location for modal overlay
  const backgroundLocation = modalPath
    ? { ...location, pathname: modalPaths[modalPath] }
    : null;

  return (
    <>
      {/* Main routes */}
      <Routes location={backgroundLocation || location}>
        <Route path={ROOT} element={<MyFeed />} />
        <Route path={BOARD} element={<BoardPage />} />
      </Routes>

      {/* Modal overlay route */}
      {modalPath && (
        <Routes>
          <Route path={ISSUE_DETAILS} element={<IssueDetail />} />
        </Routes>
      )}
    </>
  );
};
