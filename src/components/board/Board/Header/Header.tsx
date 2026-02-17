import { useState } from 'react';
import { Users } from 'lucide-react';
import Button from '../../../common/Button/Button';
import InviteMembersPopup from './InviteMembersPopup';
import { HeaderProps } from './Header.types';

const Header = ({
  onCreateIssue,
  onHover,
  onCreateInvite,
  members = [],
  inviteLink = '',
  isGeneratingLink = false,
  title,
}: HeaderProps) => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  const handleInviteClick = () => {
    setShowInvitePopup(true);
    // Generate invite link if callback provided
    onCreateInvite?.();
  };

  return (
    <div className="mb-6 flex justify-between items-center">
      <p className="text-xl font-bold text-gray-900 dark:text-white">
        {title || 'Work Items Board'}
      </p>

      <div className="flex items-center gap-3">
        {/* Invite Members Button with Popup */}
        <div className="relative">
          <button
            onClick={handleInviteClick}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            aria-label="Invite members"
          >
            <Users size={20} />
          </button>

          <InviteMembersPopup
            isOpen={showInvitePopup}
            onClose={() => setShowInvitePopup(false)}
            members={members}
            inviteLink={inviteLink}
            isGeneratingLink={isGeneratingLink}
          />
        </div>

        <Button
          onClick={onCreateIssue}
          onMouseEnter={onHover}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Issue
        </Button>
      </div>
    </div>
  );
};

export default Header;
