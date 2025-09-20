'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getStoreSubscribers, clearStoreSubscribers, Subscriber } from '@/lib/store';
import { Users, Download, Trash2, RefreshCcw, Mail, User } from 'lucide-react';
import Papa from 'papaparse';

export default function SubscribersPage() {
  const { user } = useAuth();
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

  const handleClearAll = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete all ${subscribers.length} subscribers? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      await clearStoreSubscribers(user.uid);
      setSubscribers([]);
      showSuccess('All subscribers have been cleared');
    } catch (error) {
      console.error('Error clearing subscribers:', error);
      showError('Failed to clear subscribers');
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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Subscribers</h1>
              <p className="text-gray-600 mt-1">
                Manage your mailing list subscribers ({subscribers.length} total)
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button
              onClick={handleExportCSV}
              disabled={exporting || subscribers.length === 0}
              className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : ''}`} />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            
            {subscribers.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      {subscribers.length > 0 ? (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscriber.name || (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subscriber.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subscriber.createdAt?.toDate ? 
                          subscriber.createdAt.toDate().toLocaleDateString() : 
                          new Date(subscriber.createdAt).toLocaleDateString()
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No subscribers yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When visitors subscribe to your store's mailing list, they will appear here. 
              Enable the subscription form in your store settings to start collecting subscribers.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 max-w-lg mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-3">To enable subscriptions:</p>
              <ol className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  Go to Store Settings
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  Navigate to the Subscriptions tab
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
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
