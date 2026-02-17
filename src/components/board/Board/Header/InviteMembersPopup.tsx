import { useState, useRef, useEffect } from 'react';
import { Copy, X, Check } from 'lucide-react';
import type { UserSafe } from '../../../../types';

interface InviteMembersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  members: UserSafe[];
  inviteLink: string;
  isGeneratingLink?: boolean;
}

const InviteMembersPopup = ({
  isOpen,
  onClose,
  members,
  inviteLink,
  isGeneratingLink = false,
}: InviteMembersPopupProps) => {
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for clipboard failure
      const el = document.createElement('textarea');
      el.value = inviteLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Project Members</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Close"
        >
          <X size={16} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Members List */}
      <div className="max-h-60 overflow-y-auto px-4 py-3">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No members yet
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                  {member.username?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {member.username || member.email}
                  </p>
                  {member.email && member.username && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Link Section */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Invite Link
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inviteLink}
            readOnly
            disabled={isGeneratingLink}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            onClick={handleCopy}
            disabled={isGeneratingLink || !inviteLink}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            aria-label="Copy invite link"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span className="text-sm">Copied</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
        {isGeneratingLink && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Generating invite link...</p>
        )}
      </div>
    </div>
  );
};

export default InviteMembersPopup;
