import { useContext } from 'react';
import { ToastContext, ToastType } from '@/context/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    showToast: context.addToast,
    hideToast: context.removeToast,
    clearAll: context.clearAllToasts,
    showSuccess: (message: string, duration?: number) => context.addToast(message, 'success', duration),
    showError: (message: string, duration?: number) => context.addToast(message, 'error', duration),
    showInfo: (message: string, duration?: number) => context.addToast(message, 'info', duration),
    showWarning: (message: string, duration?: number) => context.addToast(message, 'warning', duration),
  };
};