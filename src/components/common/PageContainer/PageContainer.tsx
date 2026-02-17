import cn from '../../../utils/cn';

import { PageContainerProps } from './PageContainer.types';
import Sidebar from '../../navigation/Sidebar/Sidebar';
import Navbar from '../../navigation/Navbar/Navbar';
import { useEffect, useState } from 'react';
/**
 * PageContainer
 * @description The root element of any page component, which contains
 * the content in the appropriate layout for the screen size.
 *
 */
function PageContainer({ bgGrey, bgGreyLg, children, showNavbar = true }: PageContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {showNavbar && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Main content area - takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar spans full width of content area */}
        {showNavbar && (
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        )}

        {/* Scrollable content */}
        <main
          id="main"
          className={cn('flex-1 overflow-y-auto p-5', {
            'bg-secondary-grey': bgGrey,
            'lg:bg-secondary-grey': bgGreyLg,
          })}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default PageContainer;
