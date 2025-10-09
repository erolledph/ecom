'use client';

import React, { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, Info, TriangleAlert as AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [id, duration, isPaused]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-green-500 text-gray-800';
      case 'error':
        return 'bg-white border-l-4 border-red-500 text-gray-800';
      case 'info':
        return 'bg-white border-l-4 border-blue-500 text-gray-800';
      case 'warning':
        return 'bg-white border-l-4 border-yellow-500 text-gray-800';
      default:
        return 'bg-white border-l-4 border-gray-500 text-gray-800';
    }
  };

  const getIconColors = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    const iconClass = `w-5 h-5 ${getIconColors()}`;
    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <XCircle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        flex items-start justify-between p-4 rounded-lg shadow-2xl min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2rem)] sm:max-w-md
        transition-all duration-300 ease-out transform relative overflow-hidden
        ${getColors()}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-start flex-1 min-w-0">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <span className="ml-3 text-sm font-medium leading-5 break-words">{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className={`h-full transition-all ease-linear ${getProgressBarColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;