import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Filter state stored in URL for shareability and browser navigation support.
 * Users can bookmark filtered views and share them with team members.
 */
export interface BoardFilters {
  search: string;
  assigneeIds: number[];
  statusIds: number[];
  typeIds: number[];
  priorityIds: number[];
}

const FILTER_KEYS = {
  search: 'search',
  assignees: 'assignees',
  statuses: 'statuses',
  types: 'types',
  priorities: 'priorities',
} as const;

/**
 * Parse a comma-separated string of numbers from URL
 */
const parseNumberArray = (value: string | null): number[] => {
  if (!value) return [];
  return value
    .split(',')
    .map(Number)
    .filter((n) => !isNaN(n) && n > 0);
};

/**
 * Convert number array to comma-separated string for URL
 */
const toUrlString = (values: number[]): string => {
  return values.filter((v) => v > 0).join(',');
};

/**
 * Custom hook for managing issue board filters via URL search params.
 *
 * Benefits:
 * - Shareable URLs (copy link shares exact filter state)
 * - Browser back/forward navigation works
 * - No Redux state needed for filters
 * - Bookmarkable filtered views
 *
 * @example
 * ```tsx
 * const { filters, setFilter, clearFilters, hasActiveFilters } = useIssueBoardFilters();
 *
 * // Set individual filter
 * setFilter('search', 'bug fix');
 * setFilter('assigneeIds', [1, 2, 3]);
 *
 * // Clear all filters
 * clearFilters();
 *
 * // Use in API call
 * const { issues } = useIssues({ projectId, ...filters });
 * ```
 */
export const useIssueBoardFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL
  const filters = useMemo<BoardFilters>(
    () => ({
      search: searchParams.get(FILTER_KEYS.search) ?? '',
      assigneeIds: parseNumberArray(searchParams.get(FILTER_KEYS.assignees)),
      statusIds: parseNumberArray(searchParams.get(FILTER_KEYS.statuses)),
      typeIds: parseNumberArray(searchParams.get(FILTER_KEYS.types)),
      priorityIds: parseNumberArray(searchParams.get(FILTER_KEYS.priorities)),
    }),
    [searchParams]
  );

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.length > 0 ||
      filters.assigneeIds.length > 0 ||
      filters.statusIds.length > 0 ||
      filters.typeIds.length > 0 ||
      filters.priorityIds.length > 0
    );
  }, [filters]);

  // Update a single filter
  const setFilter = useCallback(
    <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => {
      setSearchParams((prev: URLSearchParams) => {
        const next = new URLSearchParams(prev);

        // Map filter key to URL param key
        const urlKey =
          key === 'search'
            ? FILTER_KEYS.search
            : key === 'assigneeIds'
              ? FILTER_KEYS.assignees
              : key === 'statusIds'
                ? FILTER_KEYS.statuses
                : key === 'typeIds'
                  ? FILTER_KEYS.types
                  : FILTER_KEYS.priorities;

        if (key === 'search') {
          // Handle string value
          const strValue = value as string;
          if (strValue) {
            next.set(urlKey, strValue);
          } else {
            next.delete(urlKey);
          }
        } else {
          // Handle number array value
          const arrValue = value as number[];
          if (arrValue.length > 0) {
            next.set(urlKey, toUrlString(arrValue));
          } else {
            next.delete(urlKey);
          }
        }

        return next;
      });
    },
    [setSearchParams]
  );

  // Update multiple filters at once
  const setFilters = useCallback(
    (updates: Partial<BoardFilters>) => {
      setSearchParams((prev: URLSearchParams) => {
        const next = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          const urlKey =
            key === 'search'
              ? FILTER_KEYS.search
              : key === 'assigneeIds'
                ? FILTER_KEYS.assignees
                : key === 'statusIds'
                  ? FILTER_KEYS.statuses
                  : key === 'typeIds'
                    ? FILTER_KEYS.types
                    : FILTER_KEYS.priorities;

          if (key === 'search') {
            const strValue = value as string;
            if (strValue) {
              next.set(urlKey, strValue);
            } else {
              next.delete(urlKey);
            }
          } else {
            const arrValue = value as number[];
            if (arrValue && arrValue.length > 0) {
              next.set(urlKey, toUrlString(arrValue));
            } else {
              next.delete(urlKey);
            }
          }
        });

        return next;
      });
    },
    [setSearchParams]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams((prev: URLSearchParams) => {
      const next = new URLSearchParams(prev);
      next.delete(FILTER_KEYS.search);
      next.delete(FILTER_KEYS.assignees);
      next.delete(FILTER_KEYS.statuses);
      next.delete(FILTER_KEYS.types);
      next.delete(FILTER_KEYS.priorities);
      return next;
    });
  }, [setSearchParams]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.assigneeIds.length > 0) count++;
    if (filters.statusIds.length > 0) count++;
    if (filters.typeIds.length > 0) count++;
    if (filters.priorityIds.length > 0) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
};
