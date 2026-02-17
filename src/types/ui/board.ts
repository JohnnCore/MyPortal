/**
 * Board UI Types (Kanban/Issue Board)
 */

import { ReactNode } from 'react';
import { DndContextProps } from '@dnd-kit/core';
import type { IssueResponse } from '../domain/issue';
import type { MetaResponse } from '../domain/meta';
import { CreateIssueCardDTO, CreateIssueDTO } from '../api';

export interface StatusColumn {
  id: number;
  name: string;
}

export interface DraggableItem {
  id: number | string;
  statusId: number;
  order?: number;
}

export interface DropIndicator {
  statusId: number;
  index: number;
}

export interface UseBoardDnDProps<T extends DraggableItem> {
  items: T[];
  statuses: StatusColumn[];
  onReorder?: (item: T, newIndex: number) => void | Promise<void>;
}

export interface UseBoardDnDReturn<T extends DraggableItem> {
  dndContextProps: Pick<DndContextProps, 'sensors' | 'onDragStart' | 'onDragOver' | 'onDragEnd'>;
  itemsByStatus: Record<number, T[]>;
  activeItem: T | null;
  dropIndicator: DropIndicator | null;
  statuses: StatusColumn[];
}

export type DndContextPropsSubset = Pick<
  DndContextProps,
  'sensors' | 'onDragStart' | 'onDragOver' | 'onDragEnd'
>;

export interface BoardState<T extends DraggableItem = IssueResponse> {
  itemsByStatus: Record<number, T[]>;
  activeItem: T | null;
  dropIndicator: DropIndicator | null;
}

export interface BoardProps<T extends DraggableItem> {
  itemsByStatus: Record<number, T[]>;
  statuses: StatusColumn[];
  types: MetaResponse[];
  priorities: MetaResponse[];
  activeItem: T | null;
  activeStatus?: StatusColumn | null;
  dropIndicator: DropIndicator | null;
  statusDropIndicatorIndex?: number | null;
  dndContextProps: Pick<DndContextProps, 'sensors' | 'onDragStart' | 'onDragOver' | 'onDragEnd'>;
  statusDndContextProps?: Pick<
    DndContextProps,
    'sensors' | 'onDragStart' | 'onDragOver' | 'onDragEnd'
  >;
  renderCard: (item: T) => ReactNode;
  emptyStateMessage?: string;
  dropIndicatorClassName?: string;
  isLoading?: boolean;
  onRenameStatus?: (statusId: number, newName: string) => void | Promise<void>;
  onReorderStatus?: (statusId: number, newIndex: number) => void | Promise<void>;
  onCreateCard?: (values: CreateIssueCardDTO) => void | Promise<boolean>;
}

export interface BoardCardProps<T extends DraggableItem = IssueResponse> {
  item: T;
  onClick?: (item: T) => void;
}

export interface BoardColumnProps {
  status: StatusColumn;
  items: IssueResponse[];
  types: MetaResponse[];
  isLoading?: boolean;
  onRenameStatus?: (statusId: number, newName: string) => void | Promise<void>;
  onCreateCard?: (values: CreateIssueDTO) => void | Promise<boolean>;
}
