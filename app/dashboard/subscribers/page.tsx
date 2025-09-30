'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import PremiumFeatureGate from '@/components/PremiumFeatureGate';
import { canAccessFeature } from '@/lib/auth';
import { getStoreSubscribers, deleteSubscriber, Subscriber } from '@/lib/store';
import { Users, Download, Trash2, RefreshCcw, Mail, User, TrendingUp } from 'lucide-react';
import Papa from 'papaparse';

export default function SubscribersPage() {
  const { user } = useAuth();
  const { userProfile } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    if (!user) return;
    
    try {
      const subscribersData = await getStoreSubscribers(user.uid);
      setSubscribers(subscribersData);
      setHasShownError(false); // Reset error flag on successful fetch
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      // Only show error toast if we haven't shown it before
      if (!hasShownError) {
        showError('Failed to load subscribers');
        setHasShownError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [user, showError, hasShownError]);

  useEffect(() => {
    if (user) {
      fetchSubscribers();
    }
  }, [user, fetchSubscribers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasShownError(false); // Reset error flag when manually refreshing
    try {
      await fetchSubscribers();
      showSuccess('Subscribers refreshed successfully');
    } catch (error) {
      showError('Failed to refresh subscribers');
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportCSV = async () => {
    if (subscribers.length === 0) {
      showWarning('No subscribers to export');
      return;
    }

    if (!canAccessFeature(userProfile, 'export')) {
      return; // Silently return without showing any message
    }

    setExporting(true);
    try {
      // Prepare data for CSV export
      const csvData = subscribers.map(subscriber => ({
        Name: subscriber.name || 'N/A',
        Email: subscriber.email,
        'Subscription Date': subscriber.createdAt?.toDate ? 
          subscriber.createdAt.toDate().toLocaleDateString() : 
          new Date(subscriber.createdAt).toLocaleDateString()
      }));

      // Convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`Exported ${subscribers.length} subscribers to CSV`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showError('Failed to export subscribers');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!user) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this subscriber? This action cannot be undone.');
    
    if (!confirmed) return;

    try {
      await deleteSubscriber(user.uid, subscriberId);
      // Remove the deleted subscriber from the local state
      setSubscribers(prev => prev.filter(sub => sub.id !== subscriberId));
      showSuccess('Subscriber deleted successfully');
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      showError('Failed to delete subscriber');
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Subscribers</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2  sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm min-h-[44px]"
            >
              <RefreshCcw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              onClick={handleExportCSV}
              disabled={exporting || subscribers.length === 0}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm min-h-[44px]"
              title="Export subscribers to CSV"
            >
              <Download className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${exporting ? 'animate-bounce' : ''}`} />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      {subscribers.length > 0 ? (
        <div className="overflow-hidden mx-2 sm:mx-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Name
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Subscription Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {subscriber.name || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[150px] sm:max-w-none">{subscriber.email}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-xs sm:text-sm text-gray-500">
                        {subscriber.createdAt?.toDate ? 
                          subscriber.createdAt.toDate().toLocaleDateString() : 
                          new Date(subscriber.createdAt).toLocaleDateString()
                        }
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id!)}
                        className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-danger-300 shadow-sm text-xs font-medium rounded text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors min-h-[36px] min-w-[36px]"
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No subscribers yet
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
              When visitors subscribe to your store's mailing list, they will appear here. 
              Enable the subscription form in your store settings to start collecting subscribers.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 max-w-lg mx-auto">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">To enable subscriptions:</p>
              <ol className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2 text-left">
                <li className="flex items-start">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">1</span>
                  Go to Store Settings
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">2</span>
                  Navigate to the Subscriptions tab
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">3</span>
                  Enable the subscription form
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}