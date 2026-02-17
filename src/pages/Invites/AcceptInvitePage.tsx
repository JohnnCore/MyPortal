import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAcceptInvite } from '../../hooks/ProjectInvites/useProjectInvite';
import { useAppDispatch } from '../../hooks/reduxHooks';
import {
  addNotification,
  createErrorNotification,
} from '../../redux/notifications/notificationsSlice';

const AcceptInvitePage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleAcceptInvite } = useAcceptInvite();

  useEffect(() => {
    const doAccept = async () => {
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const res = await handleAcceptInvite(String(token));
        const projectId = res?.data?.projectId;
        if (projectId) {
          navigate(`/board/${projectId}`, { replace: true });
        } else {
          // If backend didn't return projectId, redirect to root
          navigate('/', { replace: true });
        }
      } catch (err) {
        dispatch(addNotification(createErrorNotification('Failed to accept invite.')));
        console.error('Accept invite error:', err);
        navigate('/', { replace: true });
      }
    };

    doAccept();
  }, [token, handleAcceptInvite, navigate, dispatch]);

  return <div>Processing invite...</div>;
};

export default AcceptInvitePage;
