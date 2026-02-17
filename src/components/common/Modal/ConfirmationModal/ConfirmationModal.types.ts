import type { ButtonVariant } from '../../Button/Button.types';

export interface ConfirmDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonVariant;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}
