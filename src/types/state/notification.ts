import { Notification } from '../ui';

export interface NotificationsState {
  notifications: Notification[];
  maxNotifications: number;
}
