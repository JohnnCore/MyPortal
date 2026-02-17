import { useNavigate } from 'react-router';
import { menu } from './menu';
import type { SidebarProps } from './Sidebar.types';

const MenuItems = ({
  onClick,
  onMobileClose,
}: {
  onClick: (link: string) => void;
  onMobileClose?: () => void;
}) => (
  <>
    {menu.map((item, idx) => (
      <button
        onClick={() => {
          onClick(item.url);
          onMobileClose?.(); // Close sidebar on mobile after navigation
        }}
        key={idx}
        disabled={item.disabled}
        className="flex items-center w-full gap-3 px-3 py-2 text-left rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap text-gray-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
            {item.badge}
          </span>
        )}
      </button>
    ))}
  </>
);

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navigate = useNavigate();

  const onClick = (link: string) => {
    // Placeholder for future functionality
    navigate(link);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Mobile sidebar - fixed and overlays */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col          ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="p-4 font-bold text-xl border-b border-zinc-800 flex items-center justify-between h-14">
          Jira Clone
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          <MenuItems onClick={onClick} onMobileClose={() => setSidebarOpen(false)} />
        </nav>
      </aside>

      {/* Desktop sidebar - collapsible */}
      <aside
        aria-hidden={!sidebarOpen}
        className={`hidden md:block bg-zinc-900 text-gray-200 border-r border-zinc-800 h-screen shrink-0 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 border-r-0'}`}
      >
        <div
          className={`${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 ${!sidebarOpen ? 'pointer-events-none' : ''}`}
        >
          <div className="p-4 font-bold text-xl border-b border-zinc-800 h-14 whitespace-nowrap">
            Jira Clone
          </div>
          <nav className="flex-1 space-y-1 p-2">
            <MenuItems onClick={onClick} />
          </nav>
        </div>
      </aside>
    </>
  );
}
