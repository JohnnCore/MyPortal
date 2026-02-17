import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  header?: ReactNode;
  pageSize?: number;
  // controlled pagination / server-driven
  page?: number;
  total?: number; // total rows available on server
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // simple server sorting callback: column id and order
  onSortChange?: (columnId: string | undefined, order: 'asc' | 'desc' | undefined) => void;
  // external sort state for synchronization
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VirtualizedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  header?: ReactNode;
  // Loading states
  isLoading?: boolean;
  isFetching?: boolean;
  // Infinite scroll
  hasMore?: boolean;
  onLoadMore?: () => void;
  // Sorting
  onSortChange?: (columnId: string | undefined, order: 'asc' | 'desc' | undefined) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Customization
  emptyMessage?: string;
  estimatedRowHeight?: number;
}
