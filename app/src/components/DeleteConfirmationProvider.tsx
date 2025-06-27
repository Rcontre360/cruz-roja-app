import React, { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface DeleteConfirmationContextType {
  confirmDelete: (title: string, message: string) => Promise<boolean>;
}

const DeleteConfirmationContext = createContext<DeleteConfirmationContextType | undefined>(undefined);

export function useDeleteConfirmation() {
  const context = useContext(DeleteConfirmationContext);
  if (!context) {
    throw new Error('useDeleteConfirmation must be used within a DeleteConfirmationProvider');
  }
  return context;
}

interface DeleteConfirmationProviderProps {
  children: ReactNode;
}

export function DeleteConfirmationProvider({ children }: DeleteConfirmationProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirmDelete = (title: string, message: string): Promise<boolean> => {
    setTitle(title);
    setMessage(message);
    setIsOpen(true);
    
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveRef) resolveRef(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveRef) resolveRef(false);
  };

  return (
    <DeleteConfirmationContext.Provider value={{ confirmDelete }}>
      {children}
      <ConfirmationModal
        isOpen={isOpen}
        title={title}
        message={message}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DeleteConfirmationContext.Provider>
  );
}