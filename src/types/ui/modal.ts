/**
 * Modal UI Types
 */

import type { ReactNode } from 'react';

export type ModalType = 'default' | 'confirm' | 'alert' | 'discard';

export type ModalDesktopSizeType = 'small' | 'medium' | 'large' | 'extra_large' | 'full';

export interface ModalButton {
  text: string;
  handler?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface ModalContent {
  title: string;
  children: ReactNode;
  buttons: {
    primary: ModalButton;
    secondary: ModalButton;
  };
  hasDelegateParams?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message?: string;
  content?: ModalContent;
  primaryButton?: ModalButton;
  secondaryButton?: ModalButton;
  isLoading?: boolean;
  modalId?: string;
  hideYOverflow?: boolean;
  closeableOnOverlay?: boolean;
  customZIndex?: number;
  size?: ModalDesktopSizeType;
}

export interface ConfirmationModalProps {
  title?: string;
  children?: ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

export interface DiscardModalProps {
  isOpen: boolean;
  onDiscard: () => void;
  onCancel: () => void;
}
