import { useState, useCallback, useEffect, useRef } from 'react';
import { ButtonVariant } from '../../components/common/Button/Button.types';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonVariant;
}

interface ConfirmDialogState extends ConfirmDialogConfig {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const useConfirmDialog = () => {
  const [state, setState] = useState<ConfirmDialogState>({
    isOpen: false,
    isLoading: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    variant: 'primary',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Basic confirm — returns a Promise<boolean> and prevents concurrent dialogs
   */
  const confirm = useCallback(
    (config: ConfirmDialogConfig): Promise<boolean> => {
      // Prevent concurrent dialogs
      if (state.isOpen) {
        return Promise.reject(new Error('A confirmation dialog is already open'));
      }

      return new Promise((resolve) => {
        setState({
          isOpen: true,
          isLoading: false,
          title: config.title,
          message: config.message,
          confirmText: config.confirmText || 'Confirm',
          cancelText: config.cancelText || 'Cancel',
          variant: config.variant || 'primary',
          onConfirm: () => {
            resolve(true);
            setState((s) => ({ ...s, isOpen: false, isLoading: false }));
          },
          onCancel: () => {
            resolve(false);
            setState((s) => ({ ...s, isOpen: false, isLoading: false }));
          },
        });
      });
    },
    [state.isOpen]
  );

  /**
   * Async confirm with proper cleanup and error handling
   */
  const confirmAsync = useCallback(
    (config: ConfirmDialogConfig, onConfirmAction: () => Promise<void>): Promise<boolean> => {
      // Prevent overlapping dialogs
      if (state.isOpen) {
        return Promise.reject(new Error('A confirmation dialog is already open'));
      }

      // Abort any pending async confirm
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      return new Promise((resolve, reject) => {
        setState({
          isOpen: true,
          isLoading: false,
          title: config.title,
          message: config.message,
          confirmText: config.confirmText || 'Confirm',
          cancelText: config.cancelText || 'Cancel',
          variant: config.variant || 'primary',
          onConfirm: async () => {
            if (signal.aborted) return;

            setState((s) => ({ ...s, isLoading: true }));
            try {
              await onConfirmAction();
              if (signal.aborted) return;

              setState((s) => ({ ...s, isOpen: false, isLoading: false }));
              resolve(true);
            } catch (error) {
              if (signal.aborted) return;
              setState((s) => ({ ...s, isLoading: false }));
              reject(error);
            }
          },
          onCancel: () => {
            if (signal.aborted) return;
            setState((s) => ({ ...s, isOpen: false, isLoading: false }));
            resolve(false);
          },
        });
      });
    },
    [state.isOpen]
  );

  /**
   * Manual close handler
   */
  const close = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false, isLoading: false }));
  }, []);

  /**
   * Cleanup: abort pending operations on unmount
   */
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleConfirm = useCallback(() => {
    state.onConfirm();
  }, [state]);

  const handleCancel = useCallback(() => {
    state.onCancel();
  }, [state]);

  return {
    // State
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    config: {
      title: state.title,
      message: state.message,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      variant: state.variant,
    },

    // Actions
    confirm,
    confirmAsync,
    close,

    // Handlers for the dialog component
    handleConfirm,
    handleCancel,
  };
};
