'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { 
  addGlobalBanner, 
  getActiveGlobalBanner, 
  getAllGlobalBanners,
  updateGlobalBanner, 
  deleteGlobalBanner, 
  uploadGlobalBannerImage,
  GlobalBanner
} from '@/lib/store';
import { getGlobalBannerClickEvents } from '@/lib/analytics';
import ImageUploadWithDelete from '@/components/ImageUploadWithDelete';
import CustomToggle from '@/components/CustomToggle';
import { 
  Radio, 
  Save, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Settings,
  Megaphone
} from 'lucide-react';

export default function GlobalBroadcastPage() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const router = useRouter();
  
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
        isActive: bannerForm.isActive
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

  return (
    <AdminRoute>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard/system-management')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
              <Radio className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Global Broadcast</h1>
              <p className="text-gray-600 mt-1">Manage system-wide announcement banners</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {bannerLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading global banners...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* All Banners Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">All Global Banners</h3>
                    <button
                      onClick={handleCreateNewBanner}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Megaphone className="w-4 h-4 mr-2" />
                      Create New Banner
                    </button>
                  </div>

                  {allGlobalBanners.length > 0 ? (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Link
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Clicks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allGlobalBanners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-12 w-16">
                                  <Image
                                    src={banner.imageUrl}
                                    alt="Banner"
                                    width={64}
                                    height={48}
                                    className="h-12 w-16 rounded-lg object-cover"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {banner.description || (
                                    <span className="text-gray-400 italic">No description</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {banner.link ? (
                                  <a
                                    href={banner.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-primary-600 hover:text-primary-900 transition-colors"
                                    title={banner.link}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm italic">No link</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  banner.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {banner.isActive ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Inactive
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                  {bannerClickCounts[banner.id] || 0} clicks
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditBanner(banner)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    title="Edit banner"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedBanner(banner);
                                      handleDeleteBanner();
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                                    title="Delete banner"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No global banners created yet</p>
                      <p className="text-sm">Click "Create New Banner" to get started</p>
                    </div>
                  )}
                </div>

                {/* Banner Form - Only show when creating/editing */}
                {(selectedBanner !== null || (!selectedBanner && (bannerForm.imageUrl || bannerForm.description || bannerForm.link))) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {selectedBanner ? 'Edit Banner' : 'Create New Banner'}
                    </h3>

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
                          Banner Description (Optional)
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
                          If only image and link are provided (no description), the image will be clickable
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
                                {selectedBanner ? 'Update Banner' : 'Create Banner'}
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedBanner(null);
                              setBannerForm({
                                imageUrl: '',
                                description: '',
                                link: '',
                                isActive: false
                              });
                            }}
                            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>

                        {selectedBanner && (
                          <button
                            onClick={handleDeleteBanner}
                            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <Trash2 className="w-5 h-5 mr-2" />
                            Delete Banner
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Troubleshooting Note */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">Banner Usage</h4>
                      <p className="text-sm text-blue-800">
                        Global banners will appear as popups to all users when they visit the application after a 3-second delay. 
                        Use this feature to announce important updates, promotions, or system maintenance. If only an image and link are provided (no description), the image will be clickable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}