import { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { TableProps } from './Table.types';

/**
 * Lightweight reusable TanStack table with dark header/styles matching project list UI.
 */
export default function Table<T>({
  data,
  columns,
  className = '',
  header,
  pageSize = 10,
  page: controlledPage,
  total,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  sortBy,
  sortOrder,
}: TableProps<T>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const [internalPage, setInternalPage] = useState(0);
  const page = controlledPage ?? internalPage;

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

  // when data or pageSize change, reset internal page if uncontrolled
  useEffect(() => {
    if (controlledPage === undefined) setInternalPage(0);
  }, [data, pageSize, controlledPage]);

  const pagedData = useMemo(() => {
    // If table is in server-driven mode (controlled page or total provided),
    // `data` is expected to already contain only the current page items.
    if (controlledPage !== undefined || total !== undefined) {
      return data;
    }

    const start = page * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize, controlledPage, total]);

  const pageCount = Math.max(1, Math.ceil((total ?? data.length) / pageSize));

  // render a table that uses pagedData for rows
  const pagedTable = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Calculate showing text
  const totalItems = total ?? data.length;
  const startItem = Math.min(page * pageSize + 1, totalItems);
  const endItem = Math.min((page + 1) * pageSize, totalItems);

  // Smart pagination logic
  const getPageNumbers = () => {
    const delta = 2; // Pages to show around current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (
      let i = Math.max(2, page + 1 - delta);
      i <= Math.min(pageCount - 1, page + 1 + delta);
      i++
    ) {
      range.push(i);
    }

    // Always include last page if > 1
    if (pageCount > 1) {
      range.push(pageCount);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add ellipses
    let prev = 0;
    for (const pageNum of uniqueRange) {
      if (pageNum - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(pageNum);
      prev = pageNum;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {header && <div className="mb-3">{header}</div>}

      <table className="min-w-full border border-neutral-700 rounded-md">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="bg-neutral-900 text-neutral-100 border-b border-neutral-700">
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
                            {currentSortOrder === 'asc' && <span>▲</span>}
                            {currentSortOrder === 'desc' && <span>▼</span>}
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

        <tbody>
          {pagedTable.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-neutral-700 hover:bg-neutral-800">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-neutral-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        {/* Left: Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              onPageSizeChange?.(newPageSize);
              // Reset to first page when changing page size
              if (onPageChange) {
                onPageChange(0);
              } else {
                setInternalPage(0);
              }
            }}
            className="bg-neutral-800 text-neutral-200 border border-neutral-700 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Center: Showing X-Y of Z items */}
        <div className="text-sm text-neutral-400 text-center">
          {totalItems > 0 ? (
            <>
              Showing {startItem}–{endItem} of {totalItems}
            </>
          ) : (
            <>No items</>
          )}
        </div>

        {/* Right: Pagination controls */}
        <div className="flex items-center justify-center sm:justify-end gap-1">
          {/* Previous button */}
          <button
            disabled={page === 0}
            onClick={() =>
              onPageChange
                ? onPageChange(Math.max(0, page - 1))
                : setInternalPage((p) => Math.max(0, p - 1))
            }
            className="px-2 py-1 rounded bg-neutral-800 text-neutral-200 disabled:opacity-50 hover:bg-neutral-700 text-sm"
            aria-label="Previous page"
          >
            ‹
          </button>

          {/* Desktop pagination */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((pageNum, idx) =>
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-neutral-500 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() =>
                    onPageChange
                      ? onPageChange(Number(pageNum) - 1)
                      : setInternalPage(Number(pageNum) - 1)
                  }
                  className={`px-2 py-1 rounded text-sm transition-colors min-w-7 ${
                    Number(pageNum) - 1 === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          {/* Mobile pagination - just current page */}
          <div className="sm:hidden flex items-center">
            <span className="px-2 py-1 bg-blue-600 text-white rounded text-sm min-w-7 text-center">
              {page + 1}
            </span>
          </div>

          {/* Next button */}
          <button
            disabled={page >= pageCount - 1}
            onClick={() =>
              onPageChange
                ? onPageChange(Math.min(pageCount - 1, page + 1))
                : setInternalPage((p) => Math.min(pageCount - 1, p + 1))
            }
            className="px-2 py-1 rounded bg-neutral-800 text-neutral-200 disabled:opacity-50 hover:bg-neutral-700 text-sm"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
