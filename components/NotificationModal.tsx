'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/useToast';
import { markNotificationAsRead, Notification } from '@/lib/store';
import { X, Calendar } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  userId: string;
  isRead: boolean;
  onMarkAsRead: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  notification,
  userId,
  isRead,
  onMarkAsRead
}: NotificationModalProps) {
  const { showSuccess, showError } = useToast();

  // Auto-mark as read when modal opens (but don't auto-close)
  React.useEffect(() => {
    const autoMarkAsRead = async () => {
      if (!notification || isRead) return;

      try {
        await markNotificationAsRead(userId, notification.id!);
        onMarkAsRead();
      } catch (error) {
        console.error('Error auto-marking notification as read:', error);
      }
    };

    if (isOpen && notification && !isRead) {
      autoMarkAsRead();
    }
  }, [isOpen, notification, isRead, userId, onMarkAsRead]);

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !notification) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 pr-16">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {notification.title}
          </h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {notification.createdAt.toLocaleDateString()} at {notification.createdAt.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{notification.description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
