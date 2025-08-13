import cn from "classnames";

import { PageContainerProps } from "./PageContainer.types";

/**
 * PageContainer
 * @description The root element of any page component, which contains
 * the content in the appropriate layout for the screen size.
 *
 * 💡 If any element on the page needs to "escape" this container and run to the
 * screen edges, try applying the class `aims-full-bleed` on that element.
 */
function PageContainer({ bgGrey, bgGreyLg, children }: PageContainerProps) {
  return (
    <main
      id="main"
      className={cn("min-h-[100vh]", {
        "bg-secondary-grey": bgGrey,
        "lg:bg-secondary-grey": bgGreyLg,
      })}
    >
      <div className="py-4 mx-4 lg:mx-16">{children}</div>
    </main>
  );
}

export default PageContainer;
