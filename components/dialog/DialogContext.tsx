import React, { createContext, useCallback, useContext, useState } from 'react';

interface DialogConfig {
  title: string;
  message: string;
  showActions?: boolean;
  confirmText?: string;
  isLoading?: boolean;
  actions?: React.ReactNode;
  onConfirm?: () => void | Promise<any>;
  onClose?: () => void;
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => void;
  hideDialog: () => void;
  dialogConfig: DialogConfig | null;
  isOpen: boolean;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showDialog = useCallback((config: DialogConfig) => {
    setDialogConfig(config);
    setIsOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsOpen(false);
    setDialogConfig(null);
  }, []);

  return (
    <DialogContext.Provider
      value={{ showDialog, hideDialog, dialogConfig, isOpen }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
