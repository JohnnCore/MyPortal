import { Navigate, Outlet, useRoutes } from "react-router";

import BoardPage from "../pages/Board/BoardPage";

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
