import { useRef, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { VirtualizedTableProps } from './Table.types';
import Spinner from '../Spinner/Spinner';

const ESTIMATED_ROW_HEIGHT = 56;

/**
 * VirtualizedTable component for infinite scroll scenarios.
 * Uses @tanstack/react-virtual for efficient rendering of large datasets.
 * Supports infinite loading with cursor-based pagination.
 */
export default function VirtualizedTable<T>({
  data,
  columns,
  className = '',
  header,
  isLoading,
  isFetching,
  hasMore,
  onLoadMore,
  onSortChange,
  sortBy,
  sortOrder,
  emptyMessage = 'No items to display',
  estimatedRowHeight = ESTIMATED_ROW_HEIGHT,
}: VirtualizedTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const lastFetchedIndex = useRef<number>(-1);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /**
   * Handle column header click for sorting.
   * Simple cycle: none → desc → asc → none
   */
  const handleSort = (columnId: string) => {
    if (!onSortChange) return;

    // If clicking a different column, start with desc
    if (sortBy !== columnId) {
      onSortChange(columnId, 'desc');
      return;
    }

    // Same column - cycle through states
    if (sortOrder === 'desc') {
      onSortChange(columnId, 'asc');
    } else if (sortOrder === 'asc') {
      onSortChange(undefined, undefined); // clear sort
    } else {
      onSortChange(columnId, 'desc');
    }
  };

  const rows = table.getRowModel().rows;

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: hasMore ? rows.length + 1 : rows.length, // +1 for loading row
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Infinite scroll: fetch more when approaching end
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem || !hasMore || isFetching || !onLoadMore) return;

    // Only fetch if we're actually near the end AND the user has scrolled
    // This prevents immediate fetching on initial load
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Trigger fetch when scrolled past 70% and within 3 items of the end
    const shouldFetch = scrollPercentage > 0.7 && lastItem.index >= rows.length - 3;

    // Prevent duplicate fetches for the same index
    if (shouldFetch && lastItem.index !== lastFetchedIndex.current) {
      lastFetchedIndex.current = lastItem.index;
      onLoadMore();
    }
  }, [virtualItems, rows.length, hasMore, isFetching, onLoadMore]);

  // Reset lastFetchedIndex when data length changes (new data loaded or filters changed)
  useEffect(() => {
    if (rows.length > 0 && lastFetchedIndex.current >= rows.length) {
      lastFetchedIndex.current = -1;
    }
  }, [rows.length]);

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        {header && <div className="mb-3">{header}</div>}
        <div className="flex items-center justify-center p-12 border border-neutral-700 rounded-md bg-neutral-900">
          <Spinner />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        {header && <div className="mb-3">{header}</div>}
        <div className="p-6 text-neutral-400 border border-neutral-700 rounded-md bg-neutral-900 text-center">
          {emptyMessage}
        </div>
      </div>
    );
  }

  const headerGroups = table.getHeaderGroups();

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {header && <div className="mb-3">{header}</div>}

      <div className="border border-neutral-700 rounded-md overflow-hidden">
        {/* Scrollable container with single table */}
        <div ref={parentRef} className="overflow-auto" style={{ height: '600px' }}>
          <table className="min-w-full">
            {/* Fixed header */}
            <thead className="sticky top-0 z-10 bg-neutral-900">
              {headerGroups.map((hg) => (
                <tr
                  key={hg.id}
                  className="bg-neutral-900 text-neutral-100 border-b border-neutral-700"
                >
                  {hg.headers.map((hdr) => {
                    const colId = hdr.column.id;
                    const isSorted = sortBy === colId;
                    const currentSortOrder = isSorted ? sortOrder : undefined;

                    return (
                      <th
                        key={hdr.id}
                        className={`px-4 py-3 text-left text-sm font-medium select-none ${
                          onSortChange ? 'cursor-pointer hover:bg-neutral-800' : ''
                        }`}
                        onClick={() => onSortChange && handleSort(colId)}
                      >
                        {hdr.isPlaceholder ? null : (
                          <div className="flex items-center gap-2">
                            {flexRender(hdr.column.columnDef.header, hdr.getContext())}
                            {onSortChange && (
                              <>
                                {currentSortOrder === 'asc' && (
                                  <span aria-label="sorted ascending">▲</span>
                                )}
                                {currentSortOrder === 'desc' && (
                                  <span aria-label="sorted descending">▼</span>
                                )}
                                {!currentSortOrder && <span className="text-neutral-500">↕</span>}
                              </>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* Virtualized body */}
            <tbody>
              {/* Spacer before virtual items */}
              {virtualItems.length > 0 && virtualItems[0].start > 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{ height: `${virtualItems[0].start}px`, padding: 0 }}
                  />
                </tr>
              )}

              {/* Render only visible virtual items */}
              {virtualItems.map((virtualRow) => {
                const isLoaderRow = virtualRow.index >= rows.length;
                const row = rows[virtualRow.index];

                return (
                  <tr
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="border-b border-neutral-700 hover:bg-neutral-800"
                  >
                    {isLoaderRow ? (
                      <td colSpan={columns.length} className="px-4 py-4 text-center">
                        {hasMore ? (
                          <Spinner />
                        ) : (
                          <span className="text-neutral-500 text-sm">No more items</span>
                        )}
                      </td>
                    ) : row ? (
                      row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-neutral-200">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))
                    ) : null}
                  </tr>
                );
              })}

              {/* Spacer after virtual items */}
              {virtualItems.length > 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      height: `${rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)}px`,
                      padding: 0,
                    }}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
