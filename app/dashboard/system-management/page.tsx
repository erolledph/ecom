'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import AdminRoute from '@/components/AdminRoute';
import { 
  updateUserRoleAndPremiumStatus, 
  getUserByEmail, 
  UserProfile,
  getAllUserProfiles
} from '@/lib/auth';
import { 
  addGlobalBanner, 
  getActiveGlobalBanner, 
  updateGlobalBanner, 
  deleteGlobalBanner, 
  uploadGlobalBannerImage,
  GlobalBanner 
} from '@/lib/store';
import ImageUploadWithDelete from '@/components/ImageUploadWithDelete';
import CustomToggle from '@/components/CustomToggle';
import { 
  Settings, 
  Users, 
  Search, 
  Shield, 
  Crown, 
  Megaphone, 
  Save, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Radio,
  RefreshCw
} from 'lucide-react';

type TabType = 'user-management' | 'global-broadcast';

export default function SystemManagementPage() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('user-management');
  
  // User Management State
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  
  // Global Banner State
  const [currentBanner, setCurrentBanner] = useState<GlobalBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    imageUrl: '',
    description: '',
    link: '',
    isActive: false
  });
  const [bannerLoading, setBannerLoading] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);

  // Load current global banner
  useEffect(() => {
    const loadCurrentBanner = async () => {
      setBannerLoading(true);
      try {
        const banner = await getActiveGlobalBanner();
        if (banner) {
          setCurrentBanner(banner);
          setBannerForm({
            imageUrl: banner.imageUrl,
            description: banner.description,
            link: banner.link,
            isActive: banner.isActive
          });
        }
      } catch (error) {
        console.error('Error loading current banner:', error);
      } finally {
        setBannerLoading(false);
      }
    };

    if (userProfile?.role === 'admin') {
      loadCurrentBanner();
    }
  }, [userProfile]);

  // Load all users for admin
  useEffect(() => {
    const loadAllUsers = async () => {
      if (userProfile?.role !== 'admin') {
        setAllUsers([]);
        return;
      }
      
      setAllUsersLoading(true);
      try {
        const users = await getAllUserProfiles();
        setAllUsers(users);
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

  // Global Banner Functions
  const handleBannerImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadGlobalBannerImage(file);
      
      setBannerForm(prev => ({ ...prev, imageUrl }));
      showSuccess('Banner image uploaded successfully!');
      return imageUrl;
    } catch (error: any) {
      console.error('Error uploading banner image:', error, {
        code: error.code,
        message: error.message,
        userRole: userProfile?.role
      });
      
      if (error.message && error.message.includes('image-resize-compress')) {
        showError('Image processing failed. Please try a different image or format.');
      } else {
        showError(`Failed to upload banner image: ${error.message || 'Unknown error'}`);
      }
      throw error;
    }
  };

  const handleBannerImageDelete = async (): Promise<void> => {
    setBannerForm(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSaveBanner = async () => {
    if (!bannerForm.imageUrl.trim()) {
      showWarning('Please upload a banner image');
      return;
    }

    if (!bannerForm.description.trim()) {
      showWarning('Please enter a banner description');
      return;
    }

    setSavingBanner(true);
    try {
      const bannerData = {
        imageUrl: bannerForm.imageUrl,
        description: bannerForm.description,
        link: bannerForm.link,
        isActive: bannerForm.isActive
      };

      if (currentBanner) {
        // Update existing banner
        await updateGlobalBanner(currentBanner.id, bannerData);
        setCurrentBanner(prev => prev ? { ...prev, ...bannerData } : null);
        showSuccess('Global banner updated successfully');
      } else {
        // Create new banner
        const bannerId = await addGlobalBanner(bannerData);
        const newBanner = { id: bannerId, ...bannerData, createdAt: new Date(), updatedAt: new Date() };
        setCurrentBanner(newBanner);
        showSuccess('Global banner created successfully');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      showError('Failed to save global banner');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!currentBanner) return;

    const confirmed = window.confirm('Are you sure you want to delete the global banner? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteGlobalBanner(currentBanner.id);
      setCurrentBanner(null);
      setBannerForm({
        imageUrl: '',
        description: '',
        link: '',
        isActive: false
      });
      showSuccess('Global banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      showError('Failed to delete global banner');
    }
  };

  const tabs = [
    {
      id: 'user-management' as TabType,
      name: 'Manage Users',
      icon: Users,
      description: 'User roles and permissions'
    },
    {
      id: 'global-broadcast' as TabType,
      name: 'Global Broadcast',
      icon: Radio,
      description: 'System-wide announcements'
    }
  ];

  return (
    <AdminRoute>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg">
              <Settings className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">System Management</h1>
              <p className="text-gray-600 mt-1">Administrator tools and system configuration</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* User Management Tab */}
          {activeTab === 'user-management' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              </div>

              {/* Search User */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search User by Email
                    </label>
                    <input
                      type="email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSearchUser}
                      disabled={searchLoading}
                      className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {searchLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Found User Display */}
              {foundUser && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{foundUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Display Name</label>
                      <p className="text-gray-900">{foundUser.displayName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Role</label>
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Premium Status</label>
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
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateUserRole(foundUser.uid, foundUser.role === 'admin' ? 'user' : 'admin')}
                      disabled={updatingUserId === foundUser.uid}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
                        foundUser.role === 'admin'
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {foundUser.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>

                    <button
                      onClick={() => handleUpdateUserPremium(foundUser.uid, !foundUser.isPremium)}
                      disabled={updatingUserId === foundUser.uid}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
                        foundUser.isPremium
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {foundUser.isPremium ? 'Revoke Premium' : 'Grant Premium'}
                    </button>
                  </div>
                </div>
              )}

              {/* All Users Table */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">All Users</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {allUsers.length} total users
                    </span>
                    <button
                      onClick={() => {
                        setAllUsersLoading(true);
                        const loadUsers = async () => {
                          try {
                            const users = await getAllUserProfiles();
                            setAllUsers(users);
                            showSuccess('Users refreshed successfully');
                          } catch (error) {
                            console.error('Error refreshing users:', error);
                            showError('Failed to refresh users');
                          } finally {
                            setAllUsersLoading(false);
                          }
                        };
                        loadUsers();
                      }}
                      disabled={allUsersLoading}
                      className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${allUsersLoading ? 'animate-spin' : ''}`} />
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
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <p className="text-sm text-gray-600">
                        Showing {allUsers.length} users. Click on role/premium badges to toggle status.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Premium
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allUsers.map((user) => (
                            <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.displayName || 'Not set'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
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
                              <td className="px-6 py-4 whitespace-nowrap">
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdateUserRole(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                                    disabled={updatingUserId === user.uid}
                                    className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded transition-colors ${
                                      user.role === 'admin'
                                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                  >
                                    {updatingUserId === user.uid ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                    ) : (
                                      <Shield className="w-3 h-3" />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleUpdateUserPremium(user.uid, !user.isPremium)}
                                    disabled={updatingUserId === user.uid}
                                    className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded transition-colors ${
                                      user.isPremium
                                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        : 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title={user.isPremium ? 'Revoke Premium' : 'Grant Premium'}
                                  >
                                    {updatingUserId === user.uid ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                    ) : (
                                      <Crown className="w-3 h-3" />
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
                              const users = await getAllUserProfiles();
                              setAllUsers(users);
                              if (users.length === 0) {
                                showWarning('No users found in the database');
                              } else {
                                showSuccess(`Found ${users.length} users`);
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
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Try Loading Users Again
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin SDK Note */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">Server-Side Operations Required</h4>
                    <p className="text-sm text-blue-800">
                      Advanced user management operations like deleting user accounts or programmatically creating users 
                      require Firebase Admin SDK implementation via Cloud Functions or a dedicated backend server.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Broadcast Tab */}
          {activeTab === 'global-broadcast' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Radio className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Global Announcement Banner</h2>
              </div>

              {bannerLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading current banner...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Banner Image Upload */}
                  <ImageUploadWithDelete
                    label="Banner Image"
                    description="Upload an image for the global announcement banner that will be displayed to all users."
                    currentImageUrl={bannerForm.imageUrl}
                    onImageUpload={handleBannerImageUpload}
                    onImageDelete={handleBannerImageDelete}
                    maxSizeText="Recommended: 400x300px, Max: 5MB"
                  />

                  {/* Banner Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Banner Description *
                    </label>
                    <textarea
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Enter the announcement message..."
                    />
                  </div>

                  {/* Banner Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Banner Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={bannerForm.link}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, link: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://example.com/announcement"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Optional link for users to click when they interact with the banner
                    </p>
                  </div>

                  {/* Banner Active Toggle */}
                  <CustomToggle
                    id="bannerActive"
                    label="Banner Active"
                    description="When enabled, the banner will be displayed to all users when they access the application."
                    checked={bannerForm.isActive}
                    onChange={(checked) => setBannerForm(prev => ({ ...prev, isActive: checked }))}
                  />

                  {/* Banner Actions */}
                  <div className="flex justify-between">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveBanner}
                        disabled={savingBanner}
                        className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {savingBanner ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            {currentBanner ? 'Update Banner' : 'Create Banner'}
                          </>
                        )}
                      </button>
                    </div>

                    {currentBanner && (
                      <button
                        onClick={handleDeleteBanner}
                        className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Banner
                      </button>
                    )}
                  </div>

                  {/* Current Banner Status */}
                  {currentBanner && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-green-900">Current Banner Status</h4>
                      </div>
                      <p className="text-sm text-green-800 mt-1">
                        Banner is {currentBanner.isActive ? 'active and visible to all users' : 'inactive and hidden from users'}
                      </p>
                    </div>
                  )}

                  {/* Troubleshooting Note */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">Banner Usage</h4>
                        <p className="text-sm text-blue-800">
                          The global banner will appear as a popup to all users when they visit the application. 
                          Use this feature to announce important updates, promotions, or system maintenance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}