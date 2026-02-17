import {
  addNotification,
  createErrorNotification,
  createSuccessNotification,
} from './../../redux/notifications/notificationsSlice';
import { useAppDispatch } from './../reduxHooks';
import {
  useGetTypesQuery,
  useGetStatusesQuery,
  useGetPrioritiesQuery,
  useGetProjectTagsQuery,
  useRenameStatusesMutation,
  useReorderStatusMutation,
  useCreateStatusMutation,
} from '../../redux/api/Meta/metaApiSlice';

import { useCallback } from 'react';
import type { GetMetaQueryParams } from '../../types';

import { skipToken } from '@reduxjs/toolkit/query';

export const useMetaTypes = ({ projectId }: GetMetaQueryParams) => {
  const valid = typeof projectId === 'number' && projectId > 0;

  return useGetTypesQuery(valid ? { projectId } : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      types: [...(result.data?.data ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }),
  });
};

export const useMetaStatuses = ({ projectId, page, pageSize }: GetMetaQueryParams) => {
  const valid = typeof projectId === 'number' && projectId > 0;

  return useGetStatusesQuery(valid ? { projectId, page, pageSize } : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      statuses: [...(result.data?.data ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }),
  });
};

export const useMetaPriorities = ({ projectId }: GetMetaQueryParams) => {
  const valid = typeof projectId === 'number' && projectId > 0;

  return useGetPrioritiesQuery(valid ? { projectId } : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      priorities: [...(result.data?.data ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }),
  });
};

export const useGetProjectTags = ({ projectId }: GetMetaQueryParams) => {
  const valid = typeof projectId === 'number' && projectId > 0;

  return useGetProjectTagsQuery(valid ? { projectId } : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      tags: result.data?.data ?? [],
    }),
  });
};

export interface UseRenameStatusProps {
  projectId: number | null;
}

export const useRenameStatus = ({ projectId }: UseRenameStatusProps) => {
  const dispatch = useAppDispatch();
  const [renameStatuses] = useRenameStatusesMutation();

  const handleRenameStatus = useCallback(
    async (statusId: number, newName: string) => {
      if (typeof projectId !== 'number' || projectId <= 0) {
        console.warn('Cannot rename status: projectId is missing');
        return;
      }

      try {
        await renameStatuses({
          id: statusId,
          status: newName,
          projectId,
        }).unwrap();
      } catch (error) {
        dispatch(addNotification(createErrorNotification('Error renaming status.')));
        console.error('Error renaming status:', error);
      }
    },
    [renameStatuses, dispatch, projectId]
  );

  return { handleRenameStatus };
};

export const useCreateStatus = ({ projectId }: UseRenameStatusProps) => {
  const dispatch = useAppDispatch();
  const [createStatus] = useCreateStatusMutation();

  const handleCreateStatus = useCallback(
    async (name: string) => {
      if (typeof projectId !== 'number' || projectId <= 0) {
        console.warn('Cannot create status: projectId is missing');
        return;
      }

      try {
        await createStatus({ name, projectId }).unwrap();
      } catch (error) {
        dispatch(addNotification(createErrorNotification('Error creating status.')));
        console.error('Error creating status:', error);
      }
    },
    [createStatus, dispatch, projectId]
  );

  return { handleCreateStatus };
};

export const useReorderStatus = ({ projectId }: UseRenameStatusProps) => {
  const dispatch = useAppDispatch();
  const [reorderStatus] = useReorderStatusMutation();

  const handleReorderStatus = useCallback(
    async (statusId: number, newIndex: number) => {
      if (typeof projectId !== 'number' || projectId <= 0) {
        console.warn('Cannot reorder status: projectId is missing');
        return;
      }

      try {
        await reorderStatus({ statusId, newIndex, projectId }).unwrap();
        dispatch(addNotification(createSuccessNotification('Column reordered successfully!')));
      } catch (error) {
        dispatch(addNotification(createErrorNotification('Error reordering status.')));
        console.error('Error reordering status:', error);
      }
    },
    [reorderStatus, dispatch, projectId]
  );

  return { handleReorderStatus };
};
