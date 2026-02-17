import { useCallback } from 'react';
import { useAppDispatch } from '../reduxHooks';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useCreateProjectInviteMutation,
  useAcceptInviteMutation,
  useListProjectInvitesQuery,
} from '../../redux/api/ProjectInvites/projectInvitesApiSlice';
import {
  addNotification,
  createErrorNotification,
} from '../../redux/notifications/notificationsSlice';
import { CreateInviteDTO, ProjectInvite } from '../../types';

export const useProjectInvites = ({ projectId }: { projectId?: number | string }) => {
  const valid =
    projectId !== undefined &&
    projectId !== null &&
    projectId !== '' &&
    Number.isFinite(Number(projectId));

  return useListProjectInvitesQuery(valid ? { projectId: String(projectId) } : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      invites: result.data ?? ([] as ProjectInvite[]),
    }),
  });
};

export const useCreateProjectInvite = ({ projectId }: { projectId?: number | string | null }) => {
  const dispatch = useAppDispatch();
  const [createInvite, result] = useCreateProjectInviteMutation();

  const handleCreateInvite = useCallback(
    async (body: CreateInviteDTO) => {
      if (!projectId) {
        console.warn('Cannot create invite: projectId is missing');
        return;
      }

      try {
        const res = await createInvite({
          projectId: Number(projectId),
          email: body.email,
        }).unwrap();
        return res;
      } catch (err) {
        const notification = createErrorNotification('Failed to create invite.');
        dispatch(addNotification(notification));
        console.error('Failed to create invite:', err);
        throw err;
      }
    },
    [createInvite, dispatch, projectId]
  );

  return { handleCreateInvite, result };
};

export const useAcceptInvite = () => {
  const dispatch = useAppDispatch();
  const [acceptInvite, result] = useAcceptInviteMutation();

  const handleAcceptInvite = useCallback(
    async (token: string) => {
      try {
        const res = await acceptInvite({ token }).unwrap();
        return res;
      } catch (err) {
        const notification = createErrorNotification('Failed to accept invite.');
        dispatch(addNotification(notification));
        console.error('Failed to accept invite:', err);
        throw err;
      }
    },
    [acceptInvite, dispatch]
  );

  return { handleAcceptInvite, result };
};

export default useProjectInvites;
