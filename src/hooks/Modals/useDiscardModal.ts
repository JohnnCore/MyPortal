import { useState, useCallback, useRef } from 'react';

export const useDiscardDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const resolvePromiseRef = useRef<((value: boolean) => void) | null>(null);

  /**
   * Show a discard confirmation dialog
   * Returns a promise that resolves to true if discarded, false if cancelled
   */
  const confirmDiscard = useCallback((): Promise<boolean> => {
    // Prevent multiple dialogs at once
    if (resolvePromiseRef.current) {
      return Promise.reject(new Error('Discard dialog is already open'));
    }

    return new Promise((resolve) => {
      resolvePromiseRef.current = resolve;
      setIsOpen(true);
    });
  }, []);

  const handleDiscard = useCallback(() => {
    setIsOpen(false);
    resolvePromiseRef.current?.(true);
    resolvePromiseRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolvePromiseRef.current?.(false);
    resolvePromiseRef.current = null;
  }, []);

  return {
    isOpen,
    confirmDiscard,
    handleDiscard,
    handleCancel,
  };
};
