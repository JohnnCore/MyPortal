import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModalActionHandler = (buttonId: string) => void | Promise<void>;

interface ModalActionContextValue {
  actionHandler: ModalActionHandler | null;
  setActionHandler: (handler: ModalActionHandler | null) => void;
}

const ModalActionContext = createContext<ModalActionContextValue | null>(null);

export const ModalActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actionHandler, setActionHandler] = useState<ModalActionHandler | null>(null);

  return (
    <ModalActionContext.Provider value={{ actionHandler, setActionHandler }}>
      {children}
    </ModalActionContext.Provider>
  );
};

/**
 * Hook to access the modal action context
 */
export const useModalActionContext = () => {
  const context = useContext(ModalActionContext);
  if (!context) {
    throw new Error('useModalActionContext must be used within ModalActionProvider');
  }
  return context;
};

/**
 * Hook to register a modal action handler for the current component
 *
 * Usage:
 * ```tsx
 * const handleModalAction = async (buttonId: string) => {
 *   if (buttonId === 'confirm-action') {
 *     await handleConfirm();
 *   }
 * };
 *
 * useModalActionHandler(handleModalAction);
 * ```
 */
export const useModalActionHandler = (handler: ModalActionHandler) => {
  const { setActionHandler } = useModalActionContext();

  useEffect(() => {
    setActionHandler(handler);
    return () => setActionHandler(null);
  }, [handler, setActionHandler]);
};
