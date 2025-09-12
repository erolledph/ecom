'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number; // in milliseconds, default to 5000
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-primary-600 text-white';
      case 'error':
        return 'bg-danger-600 text-white';
      case 'info':
        return 'bg-info-600 text-white';
      case 'warning':
        return 'bg-warning-600 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-lg mb-3 transition-all duration-300 ease-in-out transform animate-slide-in ${getColors()}`}
      role="alert"
    >
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-3 text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;