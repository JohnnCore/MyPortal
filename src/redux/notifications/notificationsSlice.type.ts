import type { NotificationProps } from "../../types/notifications";

export type ReduxNotification = {
  id?: string;
  message: string;
  /** richMessages support any message contain rich text as an optional type */
  messages?: string[];
  props: Pick<NotificationProps, "type"> & Partial<NotificationProps>;
};

export type NotificationsInitialState = {
  notifications: Required<ReduxNotification>[];
};
