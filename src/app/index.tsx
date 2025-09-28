import { AppRoutes } from "../routes";
import WrapperModal from "../components/common/Modal/WrapperModal/WrapperModal";
import { Suspense } from "react";
import Spinner from "../components/common/Spinner/Spinner";

const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <AppRoutes />
      {/* <MainNavigation />
      <GlobalNotifications />
      */}
      <WrapperModal />
    </Suspense>
  );
};

export default App;
