export type NotificationTypeName =
  | "system"
  | "success"
  | "error"
  | "criticalError"
  | "info"
  | "warning";

export interface NotificationProps {
  // Accessible name for the alert:
  ariaLabel: string;

  // Dismissing closes the notification by default. If any other effects need to be combined, pass a callback:
  handleDismiss?: () => void;

  // Use if the Notification should not be dismissible (do not use if presented as a toast)
  noDismiss?: boolean;

  // Use this prop to show any call-to-action button
  callToActionButton?: {
    btnText: string;
    btnOnClick: () => void;
  };
  // Type of notification (controls styling)
  type: NotificationTypeName;

  // Full width of container
  fullWidth?: boolean;
  hasTimeout?: boolean;
  noIcon?: boolean;
}
