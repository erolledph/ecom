'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  updateUserRoleAndPremiumStatus,
  getUserByEmail,
  UserProfile,
  getAllUserProfiles,
  isOnTrial,
  hasTrialExpired,
  getTrialDaysRemaining,
  fixUserPremiumStatus,
  updateUserTrialStatus,
  isOriginalTrialWindowValid,
  getUserStatistics,
  UserStatistics,
  getPremiumSubscriptionInfo
} from '@/lib/auth';
import { getAllStoreSlugs } from '@/lib/store';
import { Users, Search, Shield, Crown, RefreshCw, ExternalLink, ArrowLeft, Clock, CircleStop as StopCircle, RotateCcw, Settings } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function UserManagementPage() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // User Management State
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [userFilter, setUserFilter] = useState<'all' | 'trial' | 'premium' | 'admin' | 'basic'>('all');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<'permanent' | '1month' | '3months' | '1year'>('permanent');

  // Handle URL search parameters
  useEffect(() => {
    const emailParam = searchParams.get('search');
    if (emailParam && emailParam !== searchEmail) {
      setSearchEmail(emailParam);
      // Automatically search when URL has search parameter
      handleSearchUser(emailParam);
    }
  }, [searchParams]);

  // Load all users for admin
  useEffect(() => {
    const loadAllUsers = async () => {
      if (userProfile?.role !== 'admin') {
        setAllUsers([]);
        return;
      }

      setAllUsersLoading(true);
      try {
        // Fetch users and store slugs in parallel
        const [users, storeSlugsMap] = await Promise.all([
          getAllUserProfiles(),
          getAllStoreSlugs()
        ]);

        // Enrich user profiles with store slugs
        const enrichedUsers = users.map(user => ({
          ...user,
          storeSlug: storeSlugsMap.get(user.uid) || undefined
        }));

        setAllUsers(enrichedUsers);
      } catch (error) {
        console.error('Error loading all users:', error);
        setAllUsers([]);
      } finally {
        setAllUsersLoading(false);
      }
    };

    // Only load users if userProfile is loaded and user is admin
    if (userProfile !== null) {
      loadAllUsers();
    }
  }, [userProfile]);

  // User Management Functions
  const handleSearchUser = async (email?: string) => {
    const emailToSearch = email || searchEmail;
    if (!emailToSearch.trim()) {
      showWarning('Please enter an email address to search');
      return;
    }

    // Update URL with search parameter
    router.push(`/dashboard/system-management/users?search=${encodeURIComponent(emailToSearch.trim())}`);

    setSearchLoading(true);
    setStatsLoading(true);
    try {
      const user = await getUserByEmail(emailToSearch.trim());
      setFoundUser(user);

      if (!user) {
        showInfo('No user found with that email address');
        setUserStatistics(null);
      } else {
        showSuccess('User found successfully');
        // Load user statistics
        const stats = await getUserStatistics(user.uid);
        setUserStatistics(stats);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      showError('Failed to search for user');
      setUserStatistics(null);
    } finally {
      setSearchLoading(false);
      setStatsLoading(false);
    }
  };

  const handleUserClick = (userEmail: string) => {
    setSearchEmail(userEmail);
    handleSearchUser(userEmail);
    // Scroll to search section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    setUpdatingUserId(userId);
    try {
      await updateUserRoleAndPremiumStatus(userId, { role: newRole });

      // Refresh user data from server after successful update
      const [users, storeSlugsMap] = await Promise.all([
        getAllUserProfiles(),
        getAllStoreSlugs()
      ]);

      const enrichedUsers = users.map(user => ({
        ...user,
        storeSlug: storeSlugsMap.get(user.uid) || undefined
      }));

      setAllUsers(enrichedUsers);

      // Update found user if it's the same user
      if (foundUser && foundUser.uid === userId) {
        const updatedUser = enrichedUsers.find(u => u.uid === userId);
        if (updatedUser) {
          setFoundUser(updatedUser);
        }
      }

      showSuccess(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user role: An unexpected error occurred. Please try again.';
      showError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleOpenPremiumModal = (user: UserProfile) => {
    setSelectedUser(user);
    const subscriptionInfo = getPremiumSubscriptionInfo(user);

    if (subscriptionInfo.type !== 'none' && subscriptionInfo.type !== 'trial') {
      setSubscriptionType(subscriptionInfo.type as any);
    } else {
      setSubscriptionType('permanent');
    }

    setShowPremiumModal(true);
  };

  const handleUpdateUserPremium = async (grantPremium: boolean) => {
    if (!selectedUser) return;

    setUpdatingUserId(selectedUser.uid);
    try {
      if (grantPremium) {
        await updateUserRoleAndPremiumStatus(selectedUser.uid, {
          isPremium: true,
          subscriptionType
        });
      } else {
        await updateUserRoleAndPremiumStatus(selectedUser.uid, { isPremium: false });
      }

      // Refresh user data from server after successful update
      const [users, storeSlugsMap] = await Promise.all([
        getAllUserProfiles(),
        getAllStoreSlugs()
      ]);

      const enrichedUsers = users.map(user => ({
        ...user,
        storeSlug: storeSlugsMap.get(user.uid) || undefined
      }));

      setAllUsers(enrichedUsers);

      // Update found user if it's the same user
      if (foundUser && foundUser.uid === selectedUser.uid) {
        const updatedUser = enrichedUsers.find(u => u.uid === selectedUser.uid);
        if (updatedUser) {
          setFoundUser(updatedUser);
        }
      }

      const message = grantPremium
        ? subscriptionType === 'permanent'
          ? 'User granted permanent premium access'
          : `User granted ${subscriptionType} premium subscription`
        : 'User premium status revoked';

      showSuccess(message);
      setShowPremiumModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user premium status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user premium status: An unexpected error occurred. Please try again.';
      showError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleFixUserPremiumStatus = async (userId: string) => {
    setUpdatingUserId(userId);
    try {
      await fixUserPremiumStatus(userId);
      showSuccess('User premium status fixed!');
      
      // Refresh the users list
      const [users, storeSlugsMap] = await Promise.all([
        getAllUserProfiles(),
        getAllStoreSlugs()
      ]);
      
      const enrichedUsers = users.map(user => ({
        ...user,
        storeSlug: storeSlugsMap.get(user.uid) || undefined
      }));
      
      setAllUsers(enrichedUsers);
      
      // Update found user if it's the same user
      if (foundUser && foundUser.uid === userId) {
        const updatedUser = enrichedUsers.find(u => u.uid === userId);
        if (updatedUser) {
          setFoundUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error fixing user premium status:', error);
      // Display the specific error message from the backend
      const errorMessage = error instanceof Error ? error.message : 'Failed to fix user premium status: An unexpected error occurred. Please try again.';
      showError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUpdateTrialStatus = async (userId: string, action: 'end' | 'reset') => {
    setUpdatingUserId(userId);
    try {
      await updateUserTrialStatus(userId, action);
      
      const actionText = action === 'end' ? 'ended' : 'reset';
      showSuccess(`User trial ${actionText} successfully!`);
      
      // Refresh the users list
      const [users, storeSlugsMap] = await Promise.all([
        getAllUserProfiles(),
        getAllStoreSlugs()
      ]);
      
      const enrichedUsers = users.map(user => ({
        ...user,
        storeSlug: storeSlugsMap.get(user.uid) || undefined
      }));
      
      setAllUsers(enrichedUsers);
      
      // Update found user if it's the same user
      if (foundUser && foundUser.uid === userId) {
        const updatedUser = enrichedUsers.find(u => u.uid === userId);
        if (updatedUser) {
          setFoundUser(updatedUser);
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing user trial:`, error);
      // Display the specific error message from the backend
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} user trial: An unexpected error occurred. Please try again.`;
      showError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };


  return (
    <AdminRoute>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-3 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          </div>
        </div>

        {/* Search User Section */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Search User</h2>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter user email address..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                />
              </div>
              <button
                onClick={() => handleSearchUser()}
                disabled={searchLoading}
                className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm min-h-[44px]"
              >
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>

            {/* Found User Display */}
            {foundUser && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                {/* Fix Needed Warning - Only show for users who need migration (not on trial) */}
                {foundUser.isPremium && foundUser.isPremiumAdminSet === undefined && !isOnTrial(foundUser) && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">🔧</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Premium Status Needs Migration</p>
                        <p className="text-xs text-yellow-700">
                          This user has premium access but is missing the isPremiumAdminSet field. Click "Fix Premium Status" to resolve.
                        </p>
                      </div>
                      <button
                        onClick={() => handleFixUserPremiumStatus(foundUser.uid)}
                        disabled={updatingUserId === foundUser.uid}
                        className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 min-h-[32px]"
                      >
                        {updatingUserId === foundUser.uid ? 'Fixing...' : 'Fix Now'}
                      </button>
                    </div>
                  </div>
                )}
                
                <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">User Found</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Name</p>
                    <p className="font-medium text-sm sm:text-base">{foundUser.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Email</p>
                    <p className="font-medium text-sm sm:text-base break-all">{foundUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Account Created</p>
                    <p className="font-medium text-sm sm:text-base">
                      {foundUser.createdAt ? (
                        foundUser.createdAt instanceof Date
                          ? foundUser.createdAt.toLocaleDateString()
                          : new Date(foundUser.createdAt).toLocaleDateString()
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Role</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        foundUser.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {foundUser.role === 'admin' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateUserRole(foundUser.uid, foundUser.role === 'admin' ? 'user' : 'admin')}
                        disabled={updatingUserId === foundUser.uid}
                        className={`px-2 sm:px-3 py-1 text-xs font-medium rounded transition-colors min-h-[32px] ${
                          foundUser.role === 'admin'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingUserId === foundUser.uid ? 'Updating...' : (foundUser.role === 'admin' ? 'Remove Admin' : 'Make Admin')}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Premium Status</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      {(() => {
                        const subscriptionInfo = getPremiumSubscriptionInfo(foundUser);
                        return (
                          <>
                            <div className="flex flex-col">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                subscriptionInfo.hasPremium
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {subscriptionInfo.hasPremium ? (
                                  <>
                                    <Crown className="w-3 h-3 mr-1" />
                                    {subscriptionInfo.type === 'permanent' ? 'Premium (Permanent)' :
                                     subscriptionInfo.type === 'trial' ? 'Trial' :
                                     subscriptionInfo.type === '1month' ? 'Premium (1 Month)' :
                                     subscriptionInfo.type === '3months' ? 'Premium (3 Months)' :
                                     subscriptionInfo.type === '1year' ? 'Premium (1 Year)' : 'Premium'}
                                  </>
                                ) : (
                                  'Basic'
                                )}
                              </span>
                              {subscriptionInfo.expiryDate && subscriptionInfo.type !== 'trial' && subscriptionInfo.type !== 'permanent' && (
                                <span className="text-xs text-gray-500 mt-1">
                                  Expires: {subscriptionInfo.expiryDate.toLocaleDateString()} ({subscriptionInfo.daysRemaining} days)
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleOpenPremiumModal(foundUser)}
                              disabled={updatingUserId === foundUser.uid}
                              className="px-2 sm:px-3 py-1 text-xs font-medium rounded transition-colors min-h-[32px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingUserId === foundUser.uid ? 'Updating...' : 'Manage Premium'}
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* User Statistics Section */}
                {statsLoading ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                      <p className="text-xs text-gray-500 ml-2">Loading statistics...</p>
                    </div>
                  </div>
                ) : userStatistics && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">User Statistics</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Products</p>
                        <p className="text-lg font-semibold text-gray-900">{userStatistics.totalProducts}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Slides</p>
                        <p className="text-lg font-semibold text-gray-900">{userStatistics.totalSlides}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Subscribers</p>
                        <p className="text-lg font-semibold text-gray-900">{userStatistics.totalSubscribers}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Store Visits</p>
                        <p className="text-lg font-semibold text-gray-900">{userStatistics.totalStoreVisits}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trial Management Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">Trial Management</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        if (!isOnTrial(foundUser)) {
                          showWarning('User is not currently on trial');
                        } else {
                          handleUpdateTrialStatus(foundUser.uid, 'end');
                        }
                      }}
                      disabled={!isOnTrial(foundUser) || updatingUserId === foundUser.uid}
                      className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[36px]"
                      title={!isOnTrial(foundUser) ? 'User is not on trial' : 'End user trial immediately'}
                    >
                      {updatingUserId === foundUser.uid ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Ending...
                        </>
                      ) : (
                        <>
                          <StopCircle className="w-4 h-4 mr-2" />
                          End Trial
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (!isOriginalTrialWindowValid(foundUser)) {
                          showWarning('Cannot re-enable trial: Original 7-day trial window has expired');
                        } else if (foundUser.isPremiumAdminSet === true) {
                          showWarning('Cannot re-enable trial: User has permanent premium access');
                        } else {
                          handleUpdateTrialStatus(foundUser.uid, 'reset');
                        }
                      }}
                      disabled={!isOriginalTrialWindowValid(foundUser) || foundUser.isPremiumAdminSet === true || updatingUserId === foundUser.uid}
                      className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[36px]"
                      title={
                        foundUser.isPremiumAdminSet === true
                          ? 'Cannot reset trial for users with permanent premium'
                          : !isOriginalTrialWindowValid(foundUser)
                          ? '7-day window has expired'
                          : 'Reset trial for another 7 days'
                      }
                    >
                      {updatingUserId === foundUser.uid ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Re-enable Trial
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {foundUser.isPremiumAdminSet === true
                      ? 'User has permanent premium access - trial management disabled'
                      : isOriginalTrialWindowValid(foundUser)
                      ? 'Trial can be re-enabled (account is within 7 days of creation)'
                      : 'Trial cannot be re-enabled (7-day window has expired)'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Users Section */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Users ({
                  allUsers.filter(u => {
                    if (userFilter === 'all') return true;
                    if (userFilter === 'trial') return isOnTrial(u) && u.isPremiumAdminSet !== true;
                    if (userFilter === 'premium') return u.isPremiumAdminSet === true || (u.isPremium && u.isPremiumAdminSet === undefined && !isOnTrial(u));
                    if (userFilter === 'admin') return u.role === 'admin';
                    if (userFilter === 'basic') return !u.isPremium && !isOnTrial(u);
                    return true;
                  }).length
                })</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as any)}
                  className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[44px]"
                >
                  <option value="all">All Users</option>
                  <option value="trial">Trial Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="admin">Admins</option>
                  <option value="basic">Basic Users</option>
                </select>
                <button
                  onClick={() => {
                    setAllUsersLoading(true);
                    const loadUsers = async () => {
                      try {
                        // Fetch users and store slugs in parallel
                        const [users, storeSlugsMap] = await Promise.all([
                          getAllUserProfiles(),
                          getAllStoreSlugs()
                        ]);
                        
                        // Enrich user profiles with store slugs
                        const enrichedUsers = users.map(user => ({
                          ...user,
                          storeSlug: storeSlugsMap.get(user.uid) || undefined
                        }));
                        
                        setAllUsers(enrichedUsers);
                        if (enrichedUsers.length === 0) {
                          showWarning('No users found in the database');
                        } else {
                          showSuccess(`Found ${enrichedUsers.length} users`);
                        }
                      } catch (error) {
                        console.error('Error loading users:', error);
                        showError('Failed to load users');
                      } finally {
                        setAllUsersLoading(false);
                      }
                    };
                    loadUsers();
                  }}
                  disabled={allUsersLoading}
                  className="flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors min-h-[44px]"
                >
                  <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${allUsersLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {allUsersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading users...</p>
              </div>
            ) : allUsers.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Showing {allUsers.length} users. Click on role/premium badges to toggle status.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Store
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allUsers.filter(u => {
                        if (userFilter === 'all') return true;
                        if (userFilter === 'trial') return isOnTrial(u) && u.isPremiumAdminSet !== true;
                        if (userFilter === 'premium') return u.isPremiumAdminSet === true || (u.isPremium && u.isPremiumAdminSet === undefined && !isOnTrial(u));
                        if (userFilter === 'admin') return u.role === 'admin';
                        if (userFilter === 'basic') return !u.isPremium && !isOnTrial(u);
                        return true;
                      }).map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                              {user.displayName || 'Not set'}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="text-xs sm:text-sm text-gray-900 break-all">{user.email}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                            {user.storeSlug ? (
                              <a
                                href={`/${user.storeSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary-600 hover:text-primary-900 transition-colors"
                                title={`Visit ${user.displayName || user.email}'s store`}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? (
                                <>
                                  <Shield className="w-3 h-3 mr-1" />
                                  Admin
                                </>
                              ) : (
                                'User'
                              )}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col items-start space-y-1">
                              {(() => {
                                const subscriptionInfo = getPremiumSubscriptionInfo(user);
                                return (
                                  <>
                                    {/* Premium Status Badge */}
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                                      subscriptionInfo.hasPremium
                                        ? subscriptionInfo.type === 'trial'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {subscriptionInfo.hasPremium ? (
                                        <>
                                          {subscriptionInfo.type === 'trial' ? (
                                            <>
                                              <Clock className="w-3 h-3 mr-1" />
                                              Trial
                                            </>
                                          ) : (
                                            <>
                                              <Crown className="w-3 h-3 mr-1" />
                                              {subscriptionInfo.type === 'permanent' ? 'Premium' :
                                               subscriptionInfo.type === '1month' ? '1M Premium' :
                                               subscriptionInfo.type === '3months' ? '3M Premium' :
                                               subscriptionInfo.type === '1year' ? '1Y Premium' : 'Premium'}
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        'Basic'
                                      )}
                                    </span>

                                    {/* Role Badge for Admin */}
                                    {user.role === 'admin' && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit bg-red-100 text-red-800">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Admin
                                      </span>
                                    )}

                                    {/* Subscription expiry info */}
                                    {subscriptionInfo.expiryDate && subscriptionInfo.daysRemaining !== undefined && (
                                      <span className={`text-xs font-medium ${
                                        subscriptionInfo.type === 'trial' ? 'text-blue-600' : 'text-yellow-600'
                                      }`}>
                                        {subscriptionInfo.daysRemaining} days left
                                      </span>
                                    )}

                                    {/* Trial Expired Notice */}
                                    {hasTrialExpired(user) && user.isPremiumAdminSet !== true && !user.premiumExpiryDate && (
                                      <span className="text-xs text-red-600 font-medium">
                                        Trial expired
                                      </span>
                                    )}

                                    {/* Fix Needed Notice - Only show for users who need migration (not on trial) */}
                                    {user.isPremium && user.isPremiumAdminSet === undefined && !isOnTrial(user) && (
                                      <span className="text-xs text-yellow-600 font-medium">
                                        🔧 Needs migration
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleUserClick(user.email)}
                              className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Search and Manage User"
                            >
                              <Settings className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="space-y-2">
                  <p>No users found</p>
                  <button
                    onClick={() => {
                      setAllUsersLoading(true);
                      const loadUsers = async () => {
                        try {
                          // Fetch users and store slugs in parallel
                          const [users, storeSlugsMap] = await Promise.all([
                            getAllUserProfiles(),
                            getAllStoreSlugs()
                          ]);
                          
                          // Enrich user profiles with store slugs
                          const enrichedUsers = users.map(user => ({
                            ...user,
                            storeSlug: storeSlugsMap.get(user.uid) || undefined
                          }));
                          
                          setAllUsers(enrichedUsers);
                          if (enrichedUsers.length === 0) {
                            showWarning('No users found in the database');
                          } else {
                            showSuccess(`Found ${enrichedUsers.length} users`);
                          }
                        } catch (error) {
                          console.error('Error loading users:', error);
                          showError('Failed to load users');
                        } finally {
                          setAllUsersLoading(false);
                        }
                      };
                      loadUsers();
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
                  >
                    Try Loading Users Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Subscription Modal */}
        {showPremiumModal && selectedUser && (
          <div
            className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPremiumModal(false);
                setSelectedUser(null);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manage Premium Access
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  User: <span className="font-medium">{selectedUser.email}</span>
                </p>
                {(() => {
                  const subscriptionInfo = getPremiumSubscriptionInfo(selectedUser);
                  return subscriptionInfo.hasPremium && subscriptionInfo.type !== 'trial' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        Current: <span className="font-semibold">
                          {subscriptionInfo.type === 'permanent' ? 'Permanent Premium' :
                           subscriptionInfo.type === '1month' ? '1 Month Subscription' :
                           subscriptionInfo.type === '3months' ? '3 Months Subscription' :
                           subscriptionInfo.type === '1year' ? '1 Year Subscription' : 'Premium'}
                        </span>
                      </p>
                      {subscriptionInfo.expiryDate && subscriptionInfo.type !== 'permanent' && (
                        <p className="text-xs text-blue-600 mt-1">
                          Expires: {subscriptionInfo.expiryDate.toLocaleDateString()} ({subscriptionInfo.daysRemaining} days remaining)
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Subscription Type:
                </label>

                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="permanent"
                      checked={subscriptionType === 'permanent'}
                      onChange={(e) => setSubscriptionType(e.target.value as any)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Permanent Premium</span>
                      <p className="text-xs text-gray-500">Never expires</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="1month"
                      checked={subscriptionType === '1month'}
                      onChange={(e) => setSubscriptionType(e.target.value as any)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">1 Month</span>
                      <p className="text-xs text-gray-500">Expires in 30 days</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="3months"
                      checked={subscriptionType === '3months'}
                      onChange={(e) => setSubscriptionType(e.target.value as any)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">3 Months</span>
                      <p className="text-xs text-gray-500">Expires in 90 days</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="1year"
                      checked={subscriptionType === '1year'}
                      onChange={(e) => setSubscriptionType(e.target.value as any)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">1 Year</span>
                      <p className="text-xs text-gray-500">Expires in 365 days</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPremiumModal(false);
                    setSelectedUser(null);
                  }}
                  disabled={updatingUserId === selectedUser.uid}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>

                {(() => {
                  const subscriptionInfo = getPremiumSubscriptionInfo(selectedUser);
                  return subscriptionInfo.hasPremium && subscriptionInfo.type !== 'trial' ? (
                    <button
                      onClick={() => handleUpdateUserPremium(false)}
                      disabled={updatingUserId === selectedUser.uid}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {updatingUserId === selectedUser.uid ? 'Revoking...' : 'Revoke Premium'}
                    </button>
                  ) : null;
                })()}

                <button
                  onClick={() => handleUpdateUserPremium(true)}
                  disabled={updatingUserId === selectedUser.uid}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {updatingUserId === selectedUser.uid ? 'Granting...' : 'Grant Premium'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}