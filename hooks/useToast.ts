import { useContext } from 'react';
import { ToastContext, ToastContextType } from '@/context/ToastContext';
import { ToastType } from '@/components/Toast';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    showToast: context.addToast,
    hideToast: context.removeToast,
    showSuccess: (message: string) => context.addToast(message, 'success'),
    showError: (message: string) => context.addToast(message, 'error'),
    showInfo: (message: string) => context.addToast(message, 'info'),
    showWarning: (message: string) => context.addToast(message, 'warning'),
  };
};