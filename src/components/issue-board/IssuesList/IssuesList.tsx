import { useCallback, useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ColumnDef } from '@tanstack/react-table';
import { useGetIssuesInfiniteQuery } from '../../../redux/api/Issues/issuesApiSlice';
import { issuesApiSlice } from '../../../redux/api/Issues/issuesApiSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import type { IssueWithRelations } from '../../../types';
import type { BoardFilters } from '../../../hooks/board/useIssueBoardFilters';
import VirtualizedTable from '../../common/Table/VirtualizedTable';

type Props = {
  projectId?: string | number;
  filters: BoardFilters;
};

const LIMIT = 20;

export default function IssuesList({ projectId, filters }: Props) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const projectIdNumber = useMemo(() => {
    if (!projectId) return undefined;
    return typeof projectId === 'string' ? parseInt(projectId, 10) : projectId;
  }, [projectId]);

  // Query params without cursor (initial load)
  const queryParams = useMemo(
    () => ({
      projectId: projectIdNumber!,
      limit: LIMIT,
      search: filters.search || undefined,
      assigneeIds: filters.assigneeIds.length ? filters.assigneeIds : undefined,
      statusIds: filters.statusIds.length ? filters.statusIds : undefined,
      typeIds: filters.typeIds.length ? filters.typeIds : undefined,
      priorityIds: filters.priorityIds.length ? filters.priorityIds : undefined,
    }),
    [projectIdNumber, filters]
  );

  const { data, isLoading, isFetching, isError, error } = useGetIssuesInfiniteQuery(queryParams, {
    skip: !projectIdNumber,
  });

  const issues = data?.data ?? [];
  const hasMore = data?.pagination?.hasMore ?? false;
  const nextCursor = data?.pagination?.nextCursor ?? null;

  // Combined fetching state includes both RTK Query fetching and manual next page fetching
  const isCurrentlyFetching = isFetching || isFetchingNextPage;

  // Reset fetching state when query params change (e.g., filter change)
  useEffect(() => {
    setIsFetchingNextPage(false);
  }, [queryParams]);

  // Fetch next page
  const fetchNextPage = useCallback(() => {
    // Prevent duplicate requests
    if (!hasMore || isCurrentlyFetching || !nextCursor || !projectIdNumber) {
      return;
    }

    setIsFetchingNextPage(true);

    dispatch(
      issuesApiSlice.endpoints.getIssuesInfinite.initiate(
        { ...queryParams, cursor: nextCursor },
        { subscribe: false, forceRefetch: true }
      )
    )
      .unwrap()
      .then(() => {
        setIsFetchingNextPage(false);
      })
      .catch(() => {
        setIsFetchingNextPage(false);
      });
  }, [dispatch, hasMore, isCurrentlyFetching, nextCursor, queryParams, projectIdNumber]);

  // Define table columns
  const columns = useMemo<ColumnDef<IssueWithRelations>[]>(
    () => [
      {
        accessorKey: 'title',
        header: () => <span>Name</span>,
        cell: (info) => {
          const issue = info.row.original;
          return (
            <Link
              to={`?selectedIssue=${issue.id}`}
              state={{ background: location }}
              className="text-blue-400 hover:underline font-medium"
            >
              {issue.title || `Issue ${issue.id}`}
            </Link>
          );
        },
      },
      {
        accessorKey: 'assigneeUser',
        header: () => <span>Assigned</span>,
        cell: (info) => {
          const user = info.getValue() as IssueWithRelations['assigneeUser'];

          return user ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                {user.username?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-sm">{user.username}</span>
            </div>
          ) : (
            <span className="text-neutral-500 text-sm">Unassigned</span>
          );
        },
      },
      {
        accessorKey: 'creatorUser',
        header: () => <span>Creator</span>,
        cell: (info) => {
          const user = info.getValue() as IssueWithRelations['creatorUser'];
          return user ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                {user.username?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-sm">{user.username}</span>
            </div>
          ) : (
            <span className="text-neutral-500 text-sm">—</span>
          );
        },
      },
      {
        accessorKey: 'priority',
        header: () => <span>Priority</span>,
        cell: (info) => {
          const priority = info.getValue() as IssueWithRelations['priority'];
          return priority ? (
            <span className="px-2 py-1 text-xs rounded-full bg-neutral-700 text-neutral-200">
              {priority.name}
            </span>
          ) : (
            <span className="text-neutral-500 text-sm">—</span>
          );
        },
      },
      {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: (info) => {
          const type = info.getValue() as IssueWithRelations['type'];
          return type ? (
            <span className="px-2 py-1 text-xs rounded-full bg-neutral-700 text-neutral-200">
              {type.name}
            </span>
          ) : (
            <span className="text-neutral-500 text-sm">—</span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: () => <span>Status</span>,
        cell: (info) => {
          const status = info.getValue() as IssueWithRelations['status'];
          return status ? (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-600 text-white">
              {status.name}
            </span>
          ) : (
            <span className="text-neutral-500 text-sm">—</span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: () => <span>Created Time</span>,
        cell: (info) => {
          const date = info.getValue() as string | undefined;
          return date ? (
            <span className="text-sm text-neutral-300">
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          ) : (
            <span className="text-neutral-500 text-sm">—</span>
          );
        },
      },
      {
        accessorKey: 'updatedAt',
        header: () => <span>Updated Time</span>,
        cell: (info) => {
          const date = info.getValue() as string | undefined;
          return date ? (
            <span className="text-sm text-neutral-300">
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          ) : (
            <span className="text-neutral-500 text-sm">—</span>
          );
        },
      },
    ],
    [location]
  );

  if (!projectIdNumber) {
    return <div className="p-6 text-neutral-400">No project selected.</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-400">
        Error loading issues:{' '}
        {error && 'message' in error ? (error as { message: string }).message : 'Unknown error'}
      </div>
    );
  }

  return (
    <VirtualizedTable
      data={issues}
      columns={columns}
      isLoading={isLoading}
      isFetching={isCurrentlyFetching}
      hasMore={hasMore}
      onLoadMore={fetchNextPage}
      emptyMessage="No issues to show."
      className="h-full"
    />
  );
}
