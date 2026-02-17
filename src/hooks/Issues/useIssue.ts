import { useCallback, useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { skipToken } from '@reduxjs/toolkit/query';

import type {
  ApiResponse,
  GetIssuesQueryParams,
  ReorderIssuesDTO,
  UpdateIssueDTO,
  UpdateIssueInput,
} from '../../types';
import { useUpdateIssueMutation } from '../../redux/api/Issues/issuesApiSlice';
import { addNotification } from '../../redux/notifications/notificationsSlice';
import { createErrorNotification } from '../../redux/notifications/notificationsSlice';
import {
  useCreateCommentMutation,
  useGetIssueByIdQuery,
  useGetIssueCommentsQuery,
  useGetIssuesQuery,
  useReorderIssueMutation,
} from '../../redux/api/Issues/issuesApiSlice';

interface HookParams {
  projectId: number | null;
  id: number | null;
}

/**
 * Hook for fetching issues with filtering and pagination
 *
 * @param params - Query parameters including projectId and optional filters
 * @returns Object containing issues array and RTK Query loading states
 *
 * @example
 * ```tsx
 * const { issues, isLoading, isError } = useIssues({ projectId: 1 });
 * ```
 */
export const useIssues = (params: GetIssuesQueryParams) => {
  const valid = typeof params.projectId === 'number' && params.projectId > 0;

  const queryArg = valid ? params : skipToken;

  return useGetIssuesQuery(queryArg, {
    selectFromResult: (result) => ({
      ...result,
      issues: result.data?.data ?? [],
    }),
  });
};

/**
 * Hook for fetching a single issue by ID
 *
 * @param params - Hook parameters
 * @param params.id - The issue ID
 * @param params.projectId - The project ID the issue belongs to
 * @returns Object containing issue data and loading states
 *
 * @example
 * ```tsx
 * const { issue, isLoading, isError } = useIssue({ id: 1, projectId: 1 });
 * ```
 */
export const useIssue = ({ id, projectId }: HookParams) => {
  const valid = typeof id === 'number' && typeof projectId === 'number' && id > 0 && projectId > 0;

  const queryArg = valid ? { id, projectId } : skipToken;

  return useGetIssueByIdQuery(queryArg, {
    selectFromResult: (result) => ({
      ...result,
      issue: result.data ?? null,
    }),
  });
};

interface ReorderParams {
  projectId: number | null;
}

/**
 * Hook for reordering issues within or across status columns
 *
 * @param params - Hook parameters
 * @param params.projectId - The project ID
 * @returns Object containing the reorder handler function
 *
 * @example
 * ```tsx
 * const { handleReorderIssue } = useReorderIssue({ projectId: 1 });
 * await handleReorderIssue(issue, newIndex);
 * ```
 */
export const useReorderIssue = ({ projectId }: ReorderParams) => {
  const dispatch = useDispatch();
  const [reorderIssue] = useReorderIssueMutation();

  // Track pending request to prevent race conditions
  const pendingRequestRef = useRef<Promise<ApiResponse<null>> | null>(null);

  const handleReorderIssue = useCallback(
    async (issue: ReorderIssuesDTO, newIndex: number): Promise<void> => {
      if (!projectId) {
        console.warn('Cannot reorder: projectId is missing or invalid');
        return;
      }

      // Wait for previous request to finish
      if (pendingRequestRef.current) {
        await pendingRequestRef.current.catch(() => { });
      }

      try {
        const request = reorderIssue({
          id: issue.id,
          statusId: issue.statusId,
          newIndex,
          projectId,
        }).unwrap();

        pendingRequestRef.current = request;
        await request;
        pendingRequestRef.current = null;
      } catch (err) {
        pendingRequestRef.current = null;
        const notification = createErrorNotification('Error reordering issue.');
        dispatch(addNotification(notification));
        console.error('Error reordering issue:', err);
      }
    },
    [reorderIssue, projectId, dispatch]
  );

  return { handleReorderIssue };
};

/**
 * Hook for updating an issue with debounced mutations
 *
 * @param params - Hook parameters
 * @param params.id - The issue ID
 * @param params.projectId - The project ID
 * @returns Object containing the update handler and loading state
 *
 * @example
 * ```tsx
 * const { handleUpdate, isLoading } = useUpdateIssue({ id: 1, projectId: 1 });
 * handleUpdate({ title: 'New Title' });
 * ```
 */
export function useUpdateIssue({ id, projectId }: HookParams) {
  const dispatch = useDispatch();
  const [updateIssue, { isLoading, isError, error }] = useUpdateIssueMutation();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdateRef = useRef<UpdateIssueDTO | null>(null);

  const handleUpdate = useCallback(
    (values: UpdateIssueInput) => {
      if (!values) return;

      if (typeof id !== 'number' || typeof projectId !== 'number' || id <= 0 || projectId <= 0) {
        console.warn('Cannot update issue: invalid id or projectId');
        return;
      }

      const issueId = id;
      const projectIdValue = projectId;

      pendingUpdateRef.current = {
        ...values,
        id: issueId,
        projectId: projectIdValue,
      };

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        const updateData = pendingUpdateRef.current;
        if (!updateData) return;

        try {
          await updateIssue(updateData).unwrap();
        } catch (err) {
          const notification = createErrorNotification('Failed to update issue.');
          dispatch(addNotification(notification));
          console.error('Failed to update issue:', err);
        } finally {
          pendingUpdateRef.current = null;
        }
      }, 500);
    },
    [updateIssue, id, projectId, dispatch]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { handleUpdate, isLoading, isError, error };
}

/**
 * Hook for fetching issue comments
 *
 * @param params - Hook parameters
 * @param params.id - The issue ID
 * @param params.projectId - The project ID
 * @returns Object containing comments array and loading states
 *
 * @example
 * ```tsx
 * const { comments, isLoading } = useIssueComments({ id: 1, projectId: 1 });
 * ```
 */
export const useIssueComments = ({ id, projectId }: HookParams) => {
  const valid = typeof id === 'number' && typeof projectId === 'number' && id > 0 && projectId > 0;

  const queryArg = valid ? { issueId: id, projectId } : skipToken;

  return useGetIssueCommentsQuery(queryArg, {
    selectFromResult: (result) => ({
      ...result,
      comments: result.data ?? null,
    }),
  });
};

/**
 * Hook for creating a comment on an issue
 *
 * @param params - Hook parameters
 * @param params.id - The issue ID
 * @param params.projectId - The project ID
 * @returns Object containing the create handler and loading state
 *
 * @example
 * ```tsx
 * const { handleCreate, isLoading } = useCreateComment({ id: 1, projectId: 1 });
 * await handleCreate('Comment content');
 * ```
 */
export function useCreateComment({ id, projectId }: HookParams) {
  const dispatch = useDispatch();
  const [createComment, { isLoading, isError, error }] = useCreateCommentMutation();

  const handleCreate = async (value: string) => {
    if (typeof id !== 'number' || typeof projectId !== 'number' || id <= 0 || projectId <= 0) {
      console.warn('Cannot create comment: invalid id or projectId');
      return;
    }

    try {
      await createComment({
        content: value,
        issueId: id,
        projectId,
      }).unwrap();
    } catch (err) {
      const notification = createErrorNotification('Failed to add comment.');
      dispatch(addNotification(notification));
      console.error('Failed to add comment:', err);
    }
  };

  return { handleCreate, isLoading, isError, error };
}
