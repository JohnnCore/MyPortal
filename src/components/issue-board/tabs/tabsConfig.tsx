import React from 'react';
import type { BoardFilters } from '../../../hooks/board/useIssueBoardFilters';
import type {
  CreateIssueCardDTO,
  IssueWithRelations,
  MetaBase,
  ReorderIssuesDTO,
  UserSafe,
} from '../../../types';

/**
 * Props contract that every tab content component receives.
 * Adding a new tab only requires implementing this interface.
 */
export interface TabContentProps {
  issues: IssueWithRelations[];
  statuses: MetaBase[];
  types: MetaBase[];
  priorities: MetaBase[];
  projectMembers: UserSafe[];
  filters: BoardFilters;
  isLoading?: boolean;
  projectId?: string | number;
  onReorder?: (item: ReorderIssuesDTO, newIndex: number) => void | Promise<void>;
  onRenameStatus?: (statusId: number, newName: string) => void | Promise<void>;
  onReorderStatus?: (statusId: number, newIndex: number) => void | Promise<void>;
  onCreateCard?: (values: CreateIssueCardDTO) => void | Promise<boolean>;
}

export interface TabEntry {
  /** Unique tab identifier, used in the URL path */
  id: string;
  /** Display label in the tab header */
  label: string;
  /** Lazy-loaded content component */
  Component: React.LazyExoticComponent<React.ComponentType<TabContentProps>>;
  /** Whether this tab should show the search + filter bar above it */
  showFilters: boolean;
}

export const TABS: TabEntry[] = [
  {
    id: 'board',
    label: 'Board',
    Component: React.lazy(() => import('./BoardTab')),
    showFilters: true,
  },
  {
    id: 'list',
    label: 'List',
    Component: React.lazy(() => import('./ListTab')),
    showFilters: true,
  },
];

export function getTab(id?: string): TabEntry {
  return TABS.find((t) => t.id === id) || TABS[0];
}
