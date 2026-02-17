import type { UserSafe } from '../../../../types';

export interface HeaderProps {
  onCreateIssue: () => void;
  onHover?: () => void;
  onCreateInvite?: () => void;

  title?: string;
  members?: UserSafe[];
  inviteLink?: string;
  isGeneratingLink?: boolean;
}
