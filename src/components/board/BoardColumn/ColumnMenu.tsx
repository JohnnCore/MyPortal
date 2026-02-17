import { useState, useRef, useEffect } from 'react';

interface ColumnMenuProps {
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

export default function ColumnMenu({
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}: ColumnMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMoveLeft = () => {
    onMoveLeft?.();
    setIsOpen(false);
  };

  const handleMoveRight = () => {
    onMoveRight?.();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        aria-label="Column menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-600 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="py-1">
            <button
              onClick={handleMoveLeft}
              disabled={!canMoveLeft}
              className={`w-full text-left px-4 py-2 text-sm ${
                canMoveLeft
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              ← Move Column Left
            </button>
            <button
              onClick={handleMoveRight}
              disabled={!canMoveRight}
              className={`w-full text-left px-4 py-2 text-sm ${
                canMoveRight
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Move Column Right →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
