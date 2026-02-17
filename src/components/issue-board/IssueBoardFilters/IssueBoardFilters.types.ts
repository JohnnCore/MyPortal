import type { UserSafe } from '../../../types';

export interface IssueBoardFiltersProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  projectMembers?: UserSafe[];
  onMemberFilter?: (memberIds: number[]) => void;
  onFilterClick?: () => void;
  selectedMembers?: number[];
}
