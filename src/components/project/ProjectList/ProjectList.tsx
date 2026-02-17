import { useMemo, useState, useEffect, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

import Table from '../../common/Table/Table';
import type { ProjectWithRelations } from '../../../types';
import { useProjects } from '../../../hooks/Projects/useProject';
import Input from '../../common/Input/Input';
import type { ProjectListProps } from './ProjectList.types';

import { BOARD } from '../../../routes/paths';

const ProjectList = ({ initialPageSize = 10 }: ProjectListProps) => {
  const [page, setPage] = useState(0); // zero-based for UI
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

  // debounce search (1s). Track last-applied search to avoid resetting
  // page on the initial mount timer firing.
  const lastAppliedSearchRef = useRef<string>(search.trim());

  useEffect(() => {
    const t = setTimeout(() => {
      const q = search.trim();
      setDebouncedSearch(q);
      if (lastAppliedSearchRef.current !== q) {
        // only reset page when the actual search value changed
        setPage(0);
        lastAppliedSearchRef.current = q;
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [search]);

  const {
    projects = [],
    total = 0,
    isFetching,
    isError,
  } = useProjects({
    page: page + 1, // API is 1-based
    limit: pageSize,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const columns = useMemo<ColumnDef<ProjectWithRelations>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => <span className="flex items-center gap-2">Name</span>,
        cell: (info) => (
          <div className="flex items-center gap-3">
            <button aria-label="favorite" className="text-yellow-400">
              ★
            </button>
            <Link
              to={BOARD.replace(':projectId', String(info.row.original.id))}
              className="text-blue-400 hover:underline"
            >
              {String(info.getValue() ?? '')}
            </Link>
          </div>
        ),
      },
      {
        accessorKey: 'key',
        header: () => <span>Key</span>,
        cell: (info) => <div>{String(info.getValue() ?? '')}</div>,
      },
      {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: (info) => <div>{String(info.getValue() ?? 'Team-managed software')}</div>,
      },
      {
        accessorKey: 'lead',
        header: () => <span>Lead</span>,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
              CF
            </div>
            <div className="text-sm">{String(info.getValue() ?? '—')}</div>
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <span>Space URL</span>,
        cell: () => <div className="text-sm text-neutral-300">···</div>,
      },
    ],
    []
  );

  const header = (
    <div className="mb-2 flex items-center justify-between gap-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects"
        aria-label="Search projects"
        className="flex-1 bg-neutral-900 text-neutral-100 border border-neutral-700 rounded px-3 py-2"
      />

      <select
        value={'all'}
        onChange={() => {}}
        aria-label="Filter by type"
        className="bg-neutral-900 text-neutral-100 border border-neutral-700 rounded px-3 py-2"
      >
        <option value="all">All types</option>
        <option value="Team-managed software">Team-managed software</option>
      </select>
    </div>
  );

  if (isError) return <div>Unable to load projects.</div>;

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center z-10 rounded-md">
          <span className="text-neutral-200">Loading...</span>
        </div>
      )}
      <Table
        data={projects}
        columns={columns}
        className="rounded-md"
        header={header}
        pageSize={pageSize}
        page={page}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(0); // Reset to first page when changing page size
        }}
        onSortChange={(colId, order) => {
          setSortBy(colId);
          setSortOrder(order);
          setPage(0);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
};

export default ProjectList;
