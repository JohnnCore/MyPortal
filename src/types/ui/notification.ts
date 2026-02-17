/**
 * Notification UI Types
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  type: NotificationType;
  hasTimeout?: boolean;
  timeoutDuration?: number; // in milliseconds
  dismissible?: boolean;
  ariaLabel?: string;
  noIcon?: boolean;
  fullWidth?: boolean;
  callToActionButton?: {
    btnText: string;
    btnOnClick: () => void;
  };
}

export interface Notification {
  id: string;
  message: string;
  messages?: string[];
  props: NotificationProps;
  createdAt: number; // Unix timestamp
}
