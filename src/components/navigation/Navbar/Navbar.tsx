import { useState, useRef } from 'react';
import { useAuth } from '../../../hooks/Auth/useAuth';
import type { NavbarProps } from './Navbar.types';

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  // (simple implementation, can be improved with useEffect)
  const handleDropdownToggle = () => setDropdownOpen((open) => !open);
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors hover:cursor-pointer z-10"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          <svg className="w-6 h-6 block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-3 relative">
        <button
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="Create new item"
        >
          Create
        </button>
        {/* User avatar with dropdown */}
        <div className="relative" ref={avatarRef}>
          <button
            className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-600 hover:border-blue-500 transition-colors focus:outline-none"
            onClick={handleDropdownToggle}
            aria-label="User menu"
          >
            {/* Show initials or fallback icon */}
            <span className="text-white font-bold text-base">
              {user?.username
                ? user.username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : 'U'}
            </span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50">
              <ul className="py-1">
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors">
                    Profile
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors">
                    Settings
                  </button>
                </li>
                <li>
                  <hr className="my-1 border-zinc-700" />
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
