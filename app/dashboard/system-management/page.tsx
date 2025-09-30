'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  updateUserRoleAndPremiumStatus, 
  getUserByEmail, 
  UserProfile,
  getAllUserProfiles
} from '@/lib/auth';
import { 
  addGlobalBanner, 
  getActiveGlobalBanner, 
  getAllGlobalBanners,
  updateGlobalBanner, 
  deleteGlobalBanner, 
  uploadGlobalBannerImage,
  GlobalBanner,
  getAllStoreSlugs
} from '@/lib/store';
import { getGlobalBannerClickEvents } from '@/lib/analytics';
import ImageUploadWithDelete from '@/components/ImageUploadWithDelete';
import CustomToggle from '@/components/CustomToggle';
import { Settings, Users, Search, Shield, Crown, Megaphone, Save, Trash2, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Radio, RefreshCw, ExternalLink, DollarSign } from 'lucide-react';
import { Bell } from 'lucide-react';

type TabType = 'user-management' | 'global-broadcast' | 'broadcast-notifications' | 'sponsor-products';

export default function SystemManagementPage() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const router = useRouter();
  
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
  const [allGlobalBanners, setAllGlobalBanners] = useState<GlobalBanner[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<GlobalBanner | null>(null);
  const [bannerClickCounts, setBannerClickCounts] = useState<Record<string, number>>({});
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
    const loadGlobalBanners = async () => {
      setBannerLoading(true);
      try {
        // Load all global banners
        const banners = await getAllGlobalBanners();
        setAllGlobalBanners(banners);
        
        // Load current active banner
        const activeBanner = await getActiveGlobalBanner();
        setCurrentBanner(activeBanner);
        
        // Load click counts for all banners
        if (user?.uid) {
          const clickEvents = await getGlobalBannerClickEvents(user.uid);
          const clickCounts: Record<string, number> = {};
          
          clickEvents.forEach(event => {
            const bannerId = event.properties?.banner_id;
            if (bannerId) {
              clickCounts[bannerId] = (clickCounts[bannerId] || 0) + 1;
            }
          });
          
          setBannerClickCounts(clickCounts);
        }
      } catch (error) {
        console.error('Error loading global banners:', error);
      } finally {
        setBannerLoading(false);
      }
    };

    if (userProfile?.role === 'admin' && user?.uid) {
      loadGlobalBanners();
    }
  }, [userProfile, user?.uid]);

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

    setSavingBanner(true);
    try {
      const bannerData = {
        imageUrl: bannerForm.imageUrl,
        description: bannerForm.description.trim() || undefined,
        link: bannerForm.link.trim() || undefined,
        isActive: bannerForm.isActive,
        ownerId: user.uid
      };

      if (selectedBanner) {
        // Update existing banner
        await updateGlobalBanner(selectedBanner.id, bannerData);
        
        // Update the banner in allGlobalBanners
        setAllGlobalBanners(prev => prev.map(banner => 
          banner.id === selectedBanner.id ? { ...banner, ...bannerData } : banner
        ));
        
        // Update currentBanner if it's the same as selectedBanner
        if (currentBanner?.id === selectedBanner.id) {
          setCurrentBanner(prev => prev ? { ...prev, ...bannerData } : null);
        }
        
        showSuccess('Global banner updated successfully');
      } else {
        // Create new banner
        if (!user?.uid) {
          showError('User not authenticated');
          return;
        }
        
        const bannerId = await addGlobalBanner(bannerData, user.uid);
        const newBanner = { 
          id: bannerId, 
          ...bannerData, 
          ownerId: user.uid,
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
        
        setAllGlobalBanners(prev => [newBanner, ...prev]);
        showSuccess('Global banner created successfully');
      }
      
      // Reset form and selection
      setSelectedBanner(null);
      setBannerForm({
        imageUrl: '',
        description: '',
        link: '',
        isActive: false
      });
    } catch (error) {
      console.error('Error saving banner:', error);
      showError('Failed to save global banner');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!selectedBanner) return;

    const confirmed = window.confirm('Are you sure you want to delete this global banner? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteGlobalBanner(selectedBanner.id);
      
      // Remove from allGlobalBanners
      setAllGlobalBanners(prev => prev.filter(banner => banner.id !== selectedBanner.id));
      
      // Clear currentBanner if it's the same as selectedBanner
      if (currentBanner?.id === selectedBanner.id) {
        setCurrentBanner(null);
      }
      
      // Reset form and selection
      setSelectedBanner(null);
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

  const handleEditBanner = (banner: GlobalBanner) => {
    setSelectedBanner(banner);
    setBannerForm({
      imageUrl: banner.imageUrl,
      description: banner.description || '',
      link: banner.link || '',
      isActive: banner.isActive
    });
  };

  const handleCreateNewBanner = () => {
    setSelectedBanner(null);
    setBannerForm({
      imageUrl: '',
      description: '',
      link: '',
      isActive: false
    });
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
    },
    {
      id: 'broadcast-notifications' as TabType,
      name: 'Broadcast Notifications',
      icon: Bell,
      description: 'User dashboard notifications'
    },
    {
      id: 'sponsor-products' as TabType,
      name: 'Sponsor Products',
      icon: DollarSign,
      description: 'Passive income products'
    }
  ];

  return (
    <AdminRoute>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">System Management</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-3 sm:p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div className="text-left hidden sm:block">
                      <div className="text-xs sm:text-sm">{tab.name}</div>
                      <div className="text-xs text-gray-400 font-normal hidden lg:block">{tab.description}</div>
                    </div>
                    <span className="sm:hidden text-xs">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-6">
          {/* User Management Tab */}
          {activeTab === 'user-management' && (
            <div className="space-y-6">
              {/* User Management Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <Users className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Management</h2>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Manage user roles and permissions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => router.push('/dashboard/system-management/users')}
                      className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1 text-sm sm:text-base">User Management Features</h4>
                      <div className="text-xs sm:text-sm text-blue-800 space-y-1">
                        <p>• Search for users by email address</p>
                        <p>• View all registered users with their store information</p>
                        <p>• Toggle user roles between User and Admin</p>
                        <p>• Grant or revoke Premium access for users</p>
                        <p>• Visit user stores directly from the management interface</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sponsor Products Tab */}
          {activeTab === 'sponsor-products' && (
            <div className="space-y-6">
              {/* Sponsor Products Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                      <DollarSign className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Sponsor Products</h2>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Manage sponsored products that appear in user stores
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => router.push('/dashboard/system-management/sponsor-products')}
                      className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Manage Sponsor Products
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-200">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1 text-sm sm:text-base">How Sponsored Products Work</h4>
                      <div className="text-xs sm:text-sm text-green-800 space-y-1">
                        <p>• Sponsored products appear randomly in user stores with 15+ products</p>
                        <p>• Stores with 15-24 products show 1 sponsored product (1st position)</p>
                        <p>• Stores with 25+ products show 2 sponsored products (1st and 6th positions)</p>
                        <p>• Only displayed in "All Products" section, not in filters or search</p>
                        <p>• Click tracking helps measure performance and revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Broadcast Notifications Tab */}
          {activeTab === 'broadcast-notifications' && (
            <div className="space-y-6">
              {/* Broadcast Notifications Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <Bell className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Broadcast Notifications</h2>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Manage system-wide notifications for all users
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => router.push('/dashboard/system-management/broadcast-notifications')}
                      className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Manage Notifications
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
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
            </div>
          )}
          {/* Global Broadcast Tab */}
          {activeTab === 'global-broadcast' && (
            <div className="space-y-6">
              {/* Global Broadcast Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                      <Radio className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Global Broadcast</h2>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Manage system-wide announcement banners
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => router.push('/dashboard/system-management/global-broadcast')}
                      className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Manage Broadcasts
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-900 mb-1 text-sm sm:text-base">Global Broadcast Features</h4>
                      <div className="text-xs sm:text-sm text-purple-800 space-y-1">
                        <p>• Create system-wide announcement banners for all users</p>
                        <p>• Upload custom images and add descriptions or links</p>
                        <p>• Control banner visibility with active/inactive status</p>
                        <p>• Track banner click performance and engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}