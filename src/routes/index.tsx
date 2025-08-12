import { Navigate, Outlet, useRoutes } from "react-router";

import BoardPage from "../pages/board/BoardPage";

export const Routes = () => {
  return useRoutes([
    {
      element: <Outlet />,
      children: [
        {
          path: "/",
          element: <BoardPage />,
        },
      ],
    },
  ]);
};
