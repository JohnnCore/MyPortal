// src/components/common/Notification/Notification.tsx
import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { removeNotification } from '../../../redux/notifications/notificationsSlice';
import { NOTIFICATIONS_COLOR } from '../../../utils/constants';
import cn from '../../../utils/cn';
import type { NotificationComponentProps } from './Notification.types';

const Notification = ({ notification }: NotificationComponentProps) => {
  const dispatch = useAppDispatch();
  const {
    id,
    message,
    messages,
    props: { hasTimeout, timeoutDuration, dismissible, type },
  } = notification;

  // Auto-dismiss logic
  useEffect(() => {
    if (hasTimeout && timeoutDuration) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(id));
      }, timeoutDuration);
      return () => clearTimeout(timer);
    }
  }, [dispatch, id, hasTimeout, timeoutDuration]);

  return (
    <div
      className={cn(
        'border rounded-2xl shadow-sm px-4 py-3 mb-3 flex items-start justify-between transition-all duration-300',
        NOTIFICATIONS_COLOR[type] ?? NOTIFICATIONS_COLOR.info
      )}
    >
      <div className="flex flex-col">
        <p className="font-semibold">{message}</p>
        {messages && messages.length > 0 && (
          <ul className="mt-1 list-disc list-inside text-sm space-y-0.5">
            {messages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}
      </div>

      {dismissible && (
        <button
          onClick={() => dispatch(removeNotification(id))}
          className="ml-4 p-1 hover:opacity-70 transition"
          aria-label="Dismiss notification"
        >
          X
        </button>
      )}
    </div>
  );
};

export default Notification;
