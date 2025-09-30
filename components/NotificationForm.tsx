'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { addNotification, updateNotification, Notification } from '@/lib/store';
import { Save, ArrowLeft, Bell } from 'lucide-react';
import CustomToggle from '@/components/CustomToggle';

interface NotificationFormProps {
  notification?: Notification | null;
  mode: 'add' | 'edit';
  onSave?: () => void;
  onCancel?: () => void;
}

export default function NotificationForm({ notification, mode, onSave, onCancel }: NotificationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true
  });

  // Initialize form with notification data if editing
  useEffect(() => {
    if (notification && mode === 'edit') {
      setFormData({
        title: notification.title,
        description: notification.description,
        isActive: notification.isActive
      });
    }
  }, [notification, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      showError('Please enter a notification title.');
      return;
    }

    if (!formData.description.trim()) {
      showError('Please enter a notification description.');
      return;
    }

    setSaving(true);

    try {
      const notificationData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive
      };

      if (mode === 'edit' && notification) {
        await updateNotification(notification.id!, notificationData);
        showSuccess('Notification updated successfully!');
      } else {
        await addNotification({
          ...notificationData,
          ownerId: user.uid
        }, user.uid);
        showSuccess('Notification created successfully!');
      }

      if (onSave) {
        onSave();
      } else {
        router.push('/dashboard/system-management/broadcast-notifications');
      }
    } catch (error) {
      console.error('Error saving notification:', error);
      showError('Failed to save notification. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard/system-management/broadcast-notifications');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Notification Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
            placeholder="Important announcement for all users"
          />
          <p className="mt-1 text-xs text-gray-500">
            Create clear and concise titles for your notifications
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Description (Markdown Supported) *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900 text-sm"
            placeholder="Write your notification message here. You can use **bold**, *italic*, and other Markdown formatting."
          />
          <p className="mt-1 text-xs text-gray-500">
            Supports Markdown formatting: **bold**, *italic*, [links](url), lists, etc.
          </p>
        </div>

        <CustomToggle
          id="isActive"
          label="Active Notification"
          description="When enabled, this notification will be visible to all users."
          checked={formData.isActive}
          onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm min-h-[44px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {mode === 'edit' ? 'Update Notification' : 'Create Notification'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
