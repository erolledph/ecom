'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  getAllNotifications,
  deleteNotification,
  Notification
} from '@/lib/store';
import NotificationForm from '@/components/NotificationForm';
import { Bell, Plus, PenSquare as Edit, Trash2, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';

export default function BroadcastNotificationsPage() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadNotifications();
    }
  }, [userProfile]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const notificationsData = await getAllNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      showError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadNotifications();
      showSuccess('Notifications refreshed successfully');
    } catch (error) {
      showError('Failed to refresh notifications');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedNotification(null);
    setFormMode('add');
    setShowForm(true);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDelete = async (notificationId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this notification? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      showSuccess('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedNotification(null);
    loadNotifications();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="bg-white rounded-lg shadow">
              <div className="h-16 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Broadcast Notifications</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage system-wide notifications for all users
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm min-h-[44px]"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleCreateNew}
                className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Notification
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-3 sm:p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1 text-sm sm:text-base">Broadcast Notification Features</h4>
                <div className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <p>• Create system-wide notifications that appear in all user dashboards</p>
                  <p>• Support for Markdown formatting in notification descriptions</p>
                  <p>• Real-time badge count updates when users read notifications</p>
                  <p>• Track notification read status per user</p>
                  <p>• Control notification visibility with active/inactive status</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Form */}
        {showForm && (
          <div className="p-3 sm:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {formMode === 'edit' ? 'Edit Notification' : 'Create New Notification'}
                </h2>
              </div>
              
              <NotificationForm
                notification={selectedNotification}
                mode={formMode}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Notifications Table */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                All Notifications ({notifications.length})
              </h2>
            </div>

            {notifications.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Description
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Created
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 max-w-[150px] sm:max-w-none">
                              {notification.title}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 max-w-xs">
                              {notification.description.substring(0, 100)}
                              {notification.description.length > 100 && '...'}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notification.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.isActive ? (
                                <>
                                  <ToggleRight className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-500">
                              {notification.createdAt.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                              <button
                                onClick={() => handleEdit(notification)}
                                className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[36px] min-w-[36px]"
                                title="Edit notification"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => notification.id && handleDelete(notification.id)}
                                className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors min-h-[36px] min-w-[36px]"
                                title="Delete notification"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No notifications yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto px-4">
                  Create your first broadcast notification to communicate with all users across the platform.
                </p>
                <button 
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Notification
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}