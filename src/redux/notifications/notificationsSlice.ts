import { initialState } from './initialState';
import type {
  Notification,
  NotificationProps,
  NotificationType,
} from '../../types/ui/notification';

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Generate unique ID with fallback
 */
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Default timeout durations by type (in milliseconds)
 */
const DEFAULT_TIMEOUTS: Record<NotificationType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

/**
 * Max age for notifications without timeout (5 minutes)
 * Prevents memory leaks from accumulated error notifications
 */
const MAX_NOTIFICATION_AGE = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// SLICE
// ============================================================================

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add a notification
    addNotification: (
      state,
      action: PayloadAction<{
        id?: string;
        message: string;
        messages?: string[];
        props: NotificationProps;
      }>
    ) => {
      const { id, message, messages, props } = action.payload;

      // Generate unique ID
      const notificationId = id || generateId();

      // Check if notification with this ID already exists
      if (state.notifications.some((n) => n.id === notificationId)) {
        return;
      }

      // Create notification with defaults
      const notification: Notification = {
        id: notificationId,
        message,
        messages: messages ?? [],
        props: {
          ...props,
          hasTimeout: props.hasTimeout !== undefined ? props.hasTimeout : props.type !== 'error',
          timeoutDuration: props.timeoutDuration ?? DEFAULT_TIMEOUTS[props.type],
          dismissible: props.dismissible !== undefined ? props.dismissible : true,
        },
        createdAt: Date.now(),
      };

      // Clean up old notifications without timeout to prevent memory leaks
      const now = Date.now();
      state.notifications = state.notifications.filter((n) => {
        // Keep notifications with timeout (they auto-dismiss)
        if (n.props.hasTimeout) return true;
        // Remove old notifications without timeout (older than MAX_NOTIFICATION_AGE)
        return now - n.createdAt < MAX_NOTIFICATION_AGE;
      });

      // Add to notifications
      state.notifications.push(notification);

      // Enforce max limit by removing oldest
      if (state.notifications.length > state.maxNotifications) {
        state.notifications.shift();
      }
    },

    // Remove a specific notification
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Remove all notifications
    removeAllNotifications: (state) => {
      state.notifications = [];
    },

    // Remove old notifications (older than X milliseconds)
    removeOldNotifications: (state, action: PayloadAction<number>) => {
      const maxAge = action.payload;
      const now = Date.now();
      state.notifications = state.notifications.filter((n) => now - n.createdAt < maxAge);
    },

    // Set max notifications limit
    setMaxNotifications: (state, action: PayloadAction<number>) => {
      state.maxNotifications = Math.max(1, action.payload);

      // Trim if needed
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(-state.maxNotifications);
      }
    },
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  addNotification,
  removeNotification,
  removeAllNotifications,
  removeOldNotifications,
  setMaxNotifications,
} = notificationsSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectNotifications = (state: RootState) => state.notificationsSlice.notifications;

export const selectNotificationCount = (state: RootState) =>
  state.notificationsSlice.notifications.length;

export const selectHasNotifications = (state: RootState) =>
  state.notificationsSlice.notifications.length > 0;

// Get notifications by type
export const selectNotificationsByType = (type: NotificationType) =>
  createSelector([(state: RootState) => state.notificationsSlice.notifications], (notifications) =>
    notifications.filter((n) => n.props.type === type)
  );
// ============================================================================
// REDUCER
// ============================================================================

export default notificationsSlice.reducer;

// ============================================================================
// HELPER FUNCTIONS FOR COMPONENTS
// ============================================================================

/**
 * Helper to create success notification
 */
export const createSuccessNotification = (message: string, messages?: string[]) => ({
  message,
  messages,
  props: {
    type: 'success' as const,
    hasTimeout: true,
    dismissible: true,
  },
});

/**
 * Helper to create error notification
 */
export const createErrorNotification = (message: string, messages?: string[]) => ({
  message,
  messages,
  props: {
    type: 'error' as const,
    hasTimeout: false, // Errors should stay until dismissed
    dismissible: true,
  },
});

/**
 * Helper to create warning notification
 */
export const createWarningNotification = (message: string, messages?: string[]) => ({
  message,
  messages,
  props: {
    type: 'warning' as const,
    hasTimeout: true,
    dismissible: true,
  },
});

/**
 * Helper to create info notification
 */
export const createInfoNotification = (message: string, messages?: string[]) => ({
  message,
  messages,
  props: {
    type: 'info' as const,
    hasTimeout: true,
    dismissible: true,
  },
});
