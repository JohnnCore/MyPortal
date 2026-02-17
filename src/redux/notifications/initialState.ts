import { NotificationsState } from '../../types/state/notification';

export const MAX_NOTIFICATIONS = 5;
export const initialState: NotificationsState = {
  notifications: [],
  maxNotifications: MAX_NOTIFICATIONS, // Max notifications shown at once
};
