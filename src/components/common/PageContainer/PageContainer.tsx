import cn from "classnames";

import { PageContainerProps } from "./PageContainer.types";
import Sidebar from "../../navigation/Sidebar/Sidebar";
/**
 * PageContainer
 * @description The root element of any page component, which contains
 * the content in the appropriate layout for the screen size.
 *
 */
function PageContainer({ bgGrey, bgGreyLg, children }: PageContainerProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar with fixed width */}
      <Sidebar />

      {/* Main content expands fully */}
      <main
        id="main"
        className={cn("flex-1 h-screen overflow-y-auto", {
          "bg-secondary-grey": bgGrey,
          "lg:bg-secondary-grey": bgGreyLg,
        })}
      >
        <div className="py-4 px-4">{children}</div>
      </main>
    </div>
  );
}

export default PageContainer;
