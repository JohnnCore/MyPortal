/**
 * Navigation UI Types
 */

export interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
