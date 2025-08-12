import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { addNotification } from "../redux/notifications/notificationsSlice";

import { Routes } from "../routes";

const App = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notificationsSlice);

  const addaNotification = () => {
    dispatch(
      addNotification({
        id: "no change in availability error",
        message: "No changes made. Adjust entries and try again.",
        props: {
          type: "error",
          hasTimeout: false,
          ariaLabel: "There was an error trying to submit the request.",
        },
      })
    );
  };

  return (
    <>
      <Routes />
      <MainNavigation />
      <GlobalNotifications />
      <WrapperModal />
    </>
  );
};

export default App;
