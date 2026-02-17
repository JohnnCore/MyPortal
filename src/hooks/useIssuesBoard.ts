import { useCallback, useState } from 'react';
import { useAppDispatch } from './reduxHooks';
import { useIssues, useReorderIssue } from './Issues/useIssue';
import {
  useMetaStatuses,
  useMetaTypes,
  useMetaPriorities,
  useRenameStatus,
  useReorderStatus,
} from './Meta/useMeta';
import {
  useCreateIssueMutation,
  useCreateIssueCardMutation,
} from '../redux/api/Issues/issuesApiSlice';
import {
  addNotification,
  createErrorNotification,
  createSuccessNotification,
} from '../redux/notifications/notificationsSlice';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useDebounce from './useDebounce';
import {
  CreateIssueCardDTO,
  CreateIssueDTO,
  IssueResponse,
  MetaResponse,
  ReorderIssuesDTO,
  UserSafe,
} from '../types';
import { useIssueBoardFilters, BoardFilters } from './board/useIssueBoardFilters';
import { useProjectMembers } from './Projects/useProject';

interface UseIssueBoardProps {
  projectId: number | null | undefined;
  skipIssuesFetch?: boolean; // Add option to skip fetching issues
}

interface UseIssueBoardReturn {
  // Data
  issues: IssueResponse[] | undefined;
  statuses: MetaResponse[] | undefined;
  priorities: MetaResponse[] | undefined;
  types: MetaResponse[] | undefined;
  projectMembers: UserSafe[];
  isLoading: boolean;
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;

  // Modal state
  showFormModal: boolean;
  existingIssue: IssueResponse | null;

  // Filter state (from URL)
  filters: BoardFilters;
  hasActiveFilters: boolean;
  activeFilterCount: number;

  // Handlers
  handleCreateClick: () => void;
  handleFormSubmit: (values: CreateIssueDTO) => Promise<boolean>;
  handleCreateCard: (values: CreateIssueCardDTO) => Promise<boolean>;
  handleFormCancel: () => void;
  handleCloseModal: () => void;
  handleReorderIssue: (issue: ReorderIssuesDTO, newIndex: number) => Promise<void>;
  handleIssueClick: (issue: IssueResponse) => void;
  handleRenameStatus: (statusId: number, newName: string) => Promise<void>;
  handleReorderStatus: (statusId: number, newIndex: number) => Promise<void>;

  // Filter handlers (URL-based)
  setFilter: <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => void;
  clearFilters: () => void;

  // Utils
  preloadForm: () => void;
}

export const useIssueBoard = ({
  projectId,
  skipIssuesFetch = false,
}: UseIssueBoardProps): UseIssueBoardReturn => {
  const dispatch = useAppDispatch();

  // --- URL-based filter state ---
  const { filters, setFilter, clearFilters, hasActiveFilters, activeFilterCount } =
    useIssueBoardFilters();

  // Debounce search to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(filters.search, 600);

  // --- API hooks ---
  // Skip fetching issues when on the list tab (list has its own infinite query)
  const { issues, isError, isFetching, error } = useIssues(
    skipIssuesFetch
      ? { projectId: 0 } // Invalid projectId to skip the query
      : {
          projectId: projectId!,
          search: debouncedSearchQuery || undefined,
          assigneeIds: filters.assigneeIds.length > 0 ? filters.assigneeIds : undefined,
          statusIds: filters.statusIds.length > 0 ? filters.statusIds : undefined,
          typeIds: filters.typeIds.length > 0 ? filters.typeIds : undefined,
          priorityIds: filters.priorityIds.length > 0 ? filters.priorityIds : undefined,
        }
  );

  const { statuses } = useMetaStatuses({
    projectId: projectId || 0,
  });

  const { types } = useMetaTypes({
    projectId: projectId || 0,
  });

  const { priorities } = useMetaPriorities({
    projectId: projectId || 0,
  });

  const { projectMembers } = useProjectMembers(projectId ?? null);

  const [createIssue] = useCreateIssueMutation();

  const [createIssueCard] = useCreateIssueCardMutation();

  const { handleRenameStatus } = useRenameStatus({ projectId: projectId ?? null });
  const { handleReorderStatus } = useReorderStatus({ projectId: projectId ?? null });
  const { handleReorderIssue } = useReorderIssue({ projectId: projectId ?? null });

  // --- Local state ---
  const [existingIssue, setExistingIssue] = useState<IssueResponse | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // --- Computed state ---
  const hasData = Boolean(issues && statuses && priorities && types);
  const isLoading = isFetching && !hasData;

  // --- Handlers ---
  const handleFormSubmit = useCallback(
    async (values: CreateIssueDTO): Promise<boolean> => {
      if (!projectId) {
        console.warn('Cannot submit issue: projectId is missing');
        return false;
      }

      const payload: CreateIssueDTO = {
        ...values,
        projectId,
        tags: values.tags ?? [],
      };

      try {
        await createIssue(payload).unwrap();

        // SUCCESS
        setShowFormModal(false);
        setExistingIssue(null);
        dispatch(addNotification(createSuccessNotification('Issue created successfully!')));
        return true;
      } catch (err) {
        // ERROR
        dispatch(addNotification(createErrorNotification('Error creating issue')));
        console.error('Error creating issue:', err);
        return false;
      }
    },
    [createIssue, projectId, dispatch]
  );

  const handleCreateCard = useCallback(
    async (values: CreateIssueCardDTO): Promise<boolean> => {
      if (!projectId) {
        console.warn('Cannot submit issue: projectId is missing');
        return false;
      }

      // Ensure all required fields are present for CreateIssueDTO
      const payload: CreateIssueDTO = {
        projectId,
        title: values.title ?? '',
        typeId: values.typeId ?? 0,
        statusId: values.statusId ?? 0,
        priorityId: values.priorityId ?? 0,
        description: values.description,
        assigneeId: values.assigneeId,
        order: values.order,
        tags: values.tags ?? [],
      };

      try {
        await createIssueCard(payload).unwrap();

        // SUCCESS
        setShowFormModal(false);
        setExistingIssue(null);
        dispatch(addNotification(createSuccessNotification('Issue created successfully!')));
        return true;
      } catch (err) {
        // ERROR
        dispatch(addNotification(createErrorNotification('Error creating issue')));
        console.error('Error creating issue:', err);
        return false;
      }
    },
    [createIssueCard, projectId, dispatch]
  );

  const handleFormCancel = useCallback(() => {
    setShowFormModal(false);
    setExistingIssue(null);
  }, []);

  const handleCreateClick = useCallback(() => {
    setExistingIssue(null);
    setShowFormModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowFormModal(false);
    setExistingIssue(null);
  }, []);

  const handleIssueClick = useCallback((clickedIssue: IssueResponse) => {
    setExistingIssue(clickedIssue);
    setShowFormModal(true);
  }, []);

  // ...existing code...

  const preloadForm = useCallback(() => {
    import('../components/board/IssueForm/IssueForm');
  }, []);

  return {
    // Data
    issues,
    statuses,
    types,
    priorities,
    projectMembers: projectMembers ?? [],
    isLoading,
    isError,
    error,

    // Modal state
    showFormModal,
    existingIssue,

    // Filter state (URL-based)
    filters,
    hasActiveFilters,
    activeFilterCount,

    // Handlers
    handleCreateClick,
    handleFormSubmit,
    handleCreateCard,
    handleFormCancel,
    handleCloseModal,
    handleReorderIssue,
    handleIssueClick,
    handleRenameStatus,
    handleReorderStatus,

    // Filter handlers (URL-based)
    setFilter,
    clearFilters,

    // Utils
    preloadForm,
  };
};
