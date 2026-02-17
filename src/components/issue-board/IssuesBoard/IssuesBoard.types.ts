import type {
  CreateIssueCardDTO,
  IssueWithRelations,
  MetaBase,
  ReorderIssuesDTO,
  UserSafe,
} from '../../../types';
import type { BoardFilters } from '../../../hooks/board/useIssueBoardFilters';

export interface IssueBoardProps {
  issues: IssueWithRelations[];
  statuses: MetaBase[];
  types: MetaBase[];
  priorities: MetaBase[];
  projectMembers: UserSafe[];
  projectId?: string | number;
  currentTab?: string;
  isLoading?: boolean;
  onReorder: (item: ReorderIssuesDTO, newIndex: number) => void | Promise<void>;
  onRenameStatus?: (statusId: number, newName: string) => void | Promise<void>;
  onReorderStatus?: (statusId: number, newIndex: number) => void | Promise<void>;
  onCreateCard?: (values: CreateIssueCardDTO) => void | Promise<boolean>;

  // Consolidated filter state — scalable for future filter additions
  filters: BoardFilters;
  onFilterChange: <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => void;
  onClearFilters: () => void;
}
