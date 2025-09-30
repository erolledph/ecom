'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  updateUserRoleAndPremiumStatus, 
  getUserByEmail, 
  UserProfile,
  getAllUserProfiles
} from '@/lib/auth';
import { getAllStoreSlugs } from '@/lib/store';
import { 
  Users, 
  Search, 
  Shield, 
  Crown, 
  RefreshCw,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const router = useRouter();
  
  // User Management State
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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
  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      showWarning('Please enter an email address to search');
      return;
    }

    setSearchLoading(true);
    try {
      const user = await getUserByEmail(searchEmail.trim());
      setFoundUser(user);
      
      if (!user) {
        showInfo('No user found with that email address');
      } else {
        showSuccess('User found successfully');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      showError('Failed to search for user');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    setUpdatingUserId(userId);
    try {
      await updateUserRoleAndPremiumStatus(userId, { role: newRole });
      setFoundUser(prev => prev ? { ...prev, role: newRole } : null);
      // Update the user in allUsers array
      setAllUsers(prev => prev.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
      showSuccess(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUpdateUserPremium = async (userId: string, isPremium: boolean) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRoleAndPremiumStatus(userId, { isPremium });
      setFoundUser(prev => prev ? { ...prev, isPremium } : null);
      // Update the user in allUsers array
      setAllUsers(prev => prev.map(user => 
        user.uid === userId ? { ...user, isPremium } : user
      ));
      showSuccess(`User premium status ${isPremium ? 'granted' : 'revoked'}`);
    } catch (error) {
      console.error('Error updating user premium status:', error);
      showError('Failed to update user premium status');
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
                onClick={handleSearchUser}
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
                <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">User Found</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Name</p>
                    <p className="font-medium text-sm sm:text-base">{foundUser.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Email</p>
                    <p className="font-medium text-sm sm:text-base break-all">{foundUser.email}</p>
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        foundUser.isPremium 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {foundUser.isPremium ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </>
                        ) : (
                          'Basic'
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateUserPremium(foundUser.uid, !foundUser.isPremium)}
                        disabled={updatingUserId === foundUser.uid}
                        className={`px-2 sm:px-3 py-1 text-xs font-medium rounded transition-colors min-h-[32px] ${
                          foundUser.isPremium
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingUserId === foundUser.uid ? 'Updating...' : (foundUser.isPremium ? 'Revoke Premium' : 'Grant Premium')}
                      </button>
                    </div>
                  </div>
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Users ({allUsers.length})</h2>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
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
                          Premium
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allUsers.map((user) => (
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isPremium 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isPremium ? (
                                <>
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </>
                              ) : (
                                'Basic'
                              )}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                              <button
                                onClick={() => handleUpdateUserRole(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                                disabled={updatingUserId === user.uid}
                                className={`inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border shadow-sm text-xs font-medium rounded transition-colors min-h-[36px] min-w-[36px] ${
                                  user.role === 'admin'
                                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              >
                                {updatingUserId === user.uid ? (
                                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current"></div>
                                ) : (
                                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleUpdateUserPremium(user.uid, !user.isPremium)}
                                disabled={updatingUserId === user.uid}
                                className={`inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border shadow-sm text-xs font-medium rounded transition-colors min-h-[36px] min-w-[36px] ${
                                  user.isPremium
                                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    : 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={user.isPremium ? 'Revoke Premium' : 'Grant Premium'}
                              >
                                {updatingUserId === user.uid ? (
                                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current"></div>
                                ) : (
                                  <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
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
      </div>
    </AdminRoute>
  );
}