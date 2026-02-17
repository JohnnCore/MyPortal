// src/components/common/Notification/GlobalNotifications.tsx
import React from 'react';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { selectNotifications } from '../../../../redux/notifications/notificationsSlice';
import Notification from '../Notification';

export const GlobalNotifications: React.FC = () => {
  const notifications = useAppSelector(selectNotifications);

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-50 max-w-sm space-y-3"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
