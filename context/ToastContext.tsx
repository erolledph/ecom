'use client';

import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ToastContainer, toast, ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: Id) => void;
  clearAllToasts: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const options: ToastOptions = {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
      default:
        toast.info(message, options);
        break;
    }
  }, []);

  const removeToast = useCallback((id: Id) => {
    toast.dismiss(id);
  }, []);

  const clearAllToasts = useCallback(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    if (pathname === '/auth' || pathname === '/') {
      clearAllToasts();
    }
  }, [pathname, clearAllToasts]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={5}
      />
    </ToastContext.Provider>
  );
};
