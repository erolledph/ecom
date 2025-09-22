'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  getUserStore, 
  updateStore, 
  uploadStoreImage, 
  uploadWidgetImage,
  uploadSubscriptionImage,
  deleteImageFromStorage,
  Store 
} from '@/lib/store';
import { Settings, Save, Palette, Globe, Badge as Widget, Megaphone, Mail, Code } from 'lucide-react';
import CustomToggle from '@/components/CustomToggle';
import ImageUploadWithDelete from '@/components/ImageUploadWithDelete';
import CustomHtmlEditor from '@/components/CustomHtmlEditor';

const SOCIAL_PLATFORMS = [
  'instagram',
  'twitter', 
  'facebook',
  'youtube',
  'linkedin',
  'tiktok',
  'snapchat',
  'pinterest',
  'github',
  'website'
];

const FONT_FAMILIES = [
  { value: 'Inter, system-ui, -apple-system, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
  { value: 'Impact, sans-serif', label: 'Impact' }
];

const HEADER_LAYOUTS = [
  { value: 'left-right', label: 'Avatar Left, Social Right' },
  { value: 'right-left', label: 'Avatar Right, Social Left' },
  { value: 'center', label: 'Centered Layout' }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: '',
    socialLinks: [] as Array<{ platform: string; url: string; }>,
    headerLayout: 'left-right' as 'left-right' | 'right-left' | 'center',
    widgetImage: '',
    widgetLink: '',
    widgetEnabled: true,
    bannerEnabled: true,
    bannerImage: '',
    bannerDescription: '',
    bannerLink: '',
    subscriptionEnabled: true,
    requireNameForSubscription: true,
    subscriptionBackgroundImage: '',
    slidesEnabled: true,
    displayPriceOnProducts: true,
    customization: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e5e7eb',
      avatarBorderColor: '#ffffff',
      activeCategoryBorderColor: '#6366f1',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headingFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      bodyFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headingTextColor: '#1f2937',
      bodyTextColor: '#374151',
      mainBackgroundGradientStartColor: '#f3f4f6',
      mainBackgroundGradientEndColor: '#f3f4f6',
      storeBackgroundColor: '#f3f4f6',
      currencySymbol: '$',
      priceFontColor: '#059669',
      slideOverlayColor: '#000000',
      slideOverlayOpacity: 0.4,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#e5e7eb',
      storeHeaderBgColor: '#ffffff',
      categoryTextColor: '#059669',
      categoryImageBorderColor: '#d1d5db',
      productCardBgColor: '#ffffff',
      productCardBorderColor: 'transparent',
      productTitleColor: '#1f2937',
      loadMoreButtonBgColor: '#84cc16',
      loadMoreButtonTextColor: '#ffffff',
      clearSearchButtonBgColor: '#4f46e5',
      clearSearchButtonTextColor: '#ffffff',
      slidePaginationDotColor: '#ffffff',
      slidePaginationActiveDotColor: '#ffffff',
      subscribeModalBgColor: '#ffffff',
      subscribeModalTextColor: '#374151',
      subscribeButtonBgColor: '#4f46e5',
      subscribeButtonTextColor: '#ffffff',
      subscribeModalBorderColor: '#e5e7eb',
      subscribeInputBgColor: '#ffffff',
      subscribeInputBorderColor: '#d1d5db',
      subscribeInputTextColor: '#374151',
      subscribeInputPlaceholderColor: '#9ca3af',
      dashboardViewStoreButtonBgColor: '#4f46e5',
      dashboardViewStoreButtonTextColor: '#ffffff',
      searchInputBgColor: '#ffffff',
      searchInputBorderColor: '#d1d5db',
      searchInputTextColor: '#111827',
      searchInputPlaceholderColor: '#9ca3af'
    }
  });

  useEffect(() => {
    const fetchStore = async () => {
      if (!user) return;
      
      try {
        const storeData = await getUserStore(user.uid);
        if (storeData) {
          setStore(storeData);
          setFormData({
            name: storeData.name,
            description: storeData.description,
            avatar: storeData.avatar || '',
            socialLinks: storeData.socialLinks || [],
            headerLayout: storeData.headerLayout || 'left-right',
            widgetImage: storeData.widgetImage || '',
            widgetLink: storeData.widgetLink || '',
            widgetEnabled: storeData.widgetEnabled !== false,
            bannerEnabled: storeData.bannerEnabled !== false,
            bannerImage: storeData.bannerImage || '',
            bannerDescription: storeData.bannerDescription || '',
            bannerLink: storeData.bannerLink || '',
            subscriptionEnabled: storeData.subscriptionEnabled !== false,
            requireNameForSubscription: storeData.requireNameForSubscription !== false,
            subscriptionBackgroundImage: storeData.subscriptionBackgroundImage || '',
            slidesEnabled: storeData.slidesEnabled !== false,
            displayPriceOnProducts: storeData.displayPriceOnProducts !== false,
            customization: {
              ...formData.customization,
              ...storeData.customization
            }
          });
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        showError('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomizationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [field]: value
      }
    }));
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'instagram', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file: File, type: 'avatar' | 'banner' | 'widget' | 'subscription') => {
    if (!user) throw new Error('User not authenticated');

    let imageUrl: string;
    
    if (type === 'widget') {
      imageUrl = await uploadWidgetImage(user.uid, file);
    } else if (type === 'subscription') {
      imageUrl = await uploadSubscriptionImage(user.uid, file);
    } else {
      imageUrl = await uploadStoreImage(user.uid, file, type);
    }

    // Update form data
    if (type === 'widget') {
      handleInputChange('widgetImage', imageUrl);
    } else if (type === 'subscription') {
      handleInputChange('subscriptionBackgroundImage', imageUrl);
    } else {
      handleInputChange(type, imageUrl);
    }

    return imageUrl;
  };

  const handleImageDelete = async (type: 'avatar' | 'banner' | 'widget' | 'subscription') => {
    let currentImageUrl: string;
    
    if (type === 'widget') {
      currentImageUrl = formData.widgetImage;
    } else if (type === 'subscription') {
      currentImageUrl = formData.subscriptionBackgroundImage;
    } else {
      currentImageUrl = formData[type];
    }

    if (currentImageUrl) {
      try {
        await deleteImageFromStorage(currentImageUrl);
      } catch (error) {
        console.warn('Failed to delete image from storage:', error);
      }
    }

    // Update form data
    if (type === 'widget') {
      handleInputChange('widgetImage', '');
    } else if (type === 'subscription') {
      handleInputChange('subscriptionBackgroundImage', '');
    } else {
      handleInputChange(type, '');
    }
  };

  const handleSave = async () => {
    if (!user || !store) return;

    setSaving(true);
    try {
      await updateStore(user.uid, {
        name: formData.name,
        description: formData.description,
        avatar: formData.avatar,
        socialLinks: formData.socialLinks,
        headerLayout: formData.headerLayout,
        widgetImage: formData.widgetImage,
        widgetLink: formData.widgetLink,
        widgetEnabled: formData.widgetEnabled,
        bannerEnabled: formData.bannerEnabled,
        bannerImage: formData.bannerImage,
        bannerDescription: formData.bannerDescription,
        bannerLink: formData.bannerLink,
        subscriptionEnabled: formData.subscriptionEnabled,
        requireNameForSubscription: formData.requireNameForSubscription,
        subscriptionBackgroundImage: formData.subscriptionBackgroundImage,
        slidesEnabled: formData.slidesEnabled,
        displayPriceOnProducts: formData.displayPriceOnProducts,
        customization: formData.customization
      });

      showSuccess('Store settings updated successfully!');
    } catch (error) {
      console.error('Error updating store:', error);
      showError('Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Settings className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600 mt-1">Customize your store appearance and functionality</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* General Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">General Information</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="My Awesome Store"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Store Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Welcome to my store! Discover amazing products..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Header Layout
            </label>
            <select
              value={formData.headerLayout}
              onChange={(e) => handleInputChange('headerLayout', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {HEADER_LAYOUTS.map((layout) => (
                <option key={layout.value} value={layout.value}>
                  {layout.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Store Avatar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Store Avatar</h2>
        </div>
        
        <ImageUploadWithDelete
          label="Store Avatar"
          description="Upload your store's profile picture. This will be displayed in the header of your store."
          currentImageUrl={formData.avatar}
          onImageUpload={(file) => handleImageUpload(file, 'avatar')}
          onImageDelete={() => handleImageDelete('avatar')}
          maxSizeText="Recommended: 200x200px, Max: 5MB"
        />
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
          </div>
          <button
            type="button"
            onClick={addSocialLink}
            className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm font-medium"
          >
            Add Social Link
          </button>
        </div>

        <div className="space-y-4">
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex space-x-3">
              <select
                value={link.platform}
                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {SOCIAL_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          
          {formData.socialLinks.length === 0 && (
            <p className="text-gray-500 text-sm">No social links added yet. Click "Add Social Link" to get started.</p>
          )}
        </div>
      </div>

      {/* Widget Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Widget className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Floating Widget</h2>
        </div>

        <div className="space-y-6">
          <CustomToggle
            id="widgetEnabled"
            label="Enable Floating Widget"
            description="Display a floating widget on your store page to engage visitors."
            checked={formData.widgetEnabled}
            onChange={(checked) => handleInputChange('widgetEnabled', checked)}
          />

          {formData.widgetEnabled && (
            <>
              <ImageUploadWithDelete
                label="Widget Image"
                description="Upload an image for your floating widget. If not provided, your store avatar will be used."
                currentImageUrl={formData.widgetImage}
                onImageUpload={(file) => handleImageUpload(file, 'widget')}
                onImageDelete={() => handleImageDelete('widget')}
                maxSizeText="Recommended: 64x64px, Max: 5MB"
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Widget Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.widgetLink}
                  onChange={(e) => handleInputChange('widgetLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  When clicked, the widget will redirect to this URL. Leave empty for a simple popup message.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Banner Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Megaphone className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Pop-up Banner</h2>
        </div>

        <div className="space-y-6">
          <CustomToggle
            id="bannerEnabled"
            label="Enable Pop-up Banner"
            description="Show a promotional banner popup to visitors when they first visit your store."
            checked={formData.bannerEnabled}
            onChange={(checked) => handleInputChange('bannerEnabled', checked)}
          />

          {formData.bannerEnabled && (
            <>
              <ImageUploadWithDelete
                label="Banner Image"
                description="Upload an image for your promotional banner popup."
                currentImageUrl={formData.bannerImage}
                onImageUpload={(file) => handleImageUpload(file, 'banner')}
                onImageDelete={() => handleImageDelete('banner')}
                maxSizeText="Recommended: 400x300px, Max: 5MB"
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Banner Description
                </label>
                <textarea
                  value={formData.bannerDescription}
                  onChange={(e) => handleInputChange('bannerDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Special offer! Get 20% off your first purchase..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Banner Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.bannerLink}
                  onChange={(e) => handleInputChange('bannerLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/special-offer"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Subscription Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Email Subscriptions</h2>
        </div>

        <div className="space-y-6">
          <CustomToggle
            id="subscriptionEnabled"
            label="Enable Email Subscriptions"
            description="Allow visitors to subscribe to your mailing list with a popup form."
            checked={formData.subscriptionEnabled}
            onChange={(checked) => handleInputChange('subscriptionEnabled', checked)}
          />

          {formData.subscriptionEnabled && (
            <>
              <CustomToggle
                id="requireNameForSubscription"
                label="Require Name for Subscription"
                description="Ask subscribers to provide their name along with their email address."
                checked={formData.requireNameForSubscription}
                onChange={(checked) => handleInputChange('requireNameForSubscription', checked)}
              />

              <ImageUploadWithDelete
                label="Subscription Background Image"
                description="Upload a background image for the subscription modal (optional)."
                currentImageUrl={formData.subscriptionBackgroundImage}
                onImageUpload={(file) => handleImageUpload(file, 'subscription')}
                onImageDelete={() => handleImageDelete('subscription')}
                maxSizeText="Recommended: 400x300px, Max: 5MB"
              />
            </>
          )}
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Display Settings</h2>
        </div>

        <div className="space-y-6">
          <CustomToggle
            id="slidesEnabled"
            label="Enable Promotional Slides"
            description="Show promotional slides carousel on your store homepage."
            checked={formData.slidesEnabled}
            onChange={(checked) => handleInputChange('slidesEnabled', checked)}
          />

          <CustomToggle
            id="displayPriceOnProducts"
            label="Display Product Prices"
            description="Show product prices on product cards throughout your store."
            checked={formData.displayPriceOnProducts}
            onChange={(checked) => handleInputChange('displayPriceOnProducts', checked)}
          />
        </div>
      </div>

      {/* Typography & Colors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Typography & Colors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Font Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Font Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Heading Font Family
              </label>
              <select
                value={formData.customization.headingFontFamily}
                onChange={(e) => handleCustomizationChange('headingFontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Body Font Family
              </label>
              <select
                value={formData.customization.bodyFontFamily}
                onChange={(e) => handleCustomizationChange('bodyFontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.customization.currencySymbol}
                onChange={(e) => handleCustomizationChange('currencySymbol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="$"
                maxLength={3}
              />
            </div>
          </div>

          {/* Color Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Color Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Store Name Color
                </label>
                <input
                  type="color"
                  value={formData.customization.storeNameFontColor}
                  onChange={(e) => handleCustomizationChange('storeNameFontColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Store Bio Color
                </label>
                <input
                  type="color"
                  value={formData.customization.storeBioFontColor}
                  onChange={(e) => handleCustomizationChange('storeBioFontColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Price Color
                </label>
                <input
                  type="color"
                  value={formData.customization.priceFontColor}
                  onChange={(e) => handleCustomizationChange('priceFontColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={formData.customization.storeBackgroundColor}
                  onChange={(e) => handleCustomizationChange('storeBackgroundColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom HTML */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Code className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Custom HTML</h2>
        </div>

        <CustomHtmlEditor
          storeId={user?.uid || ''}
          initialHtml={store?.customHtml || ''}
          onSave={(sanitizedHtml) => {
            // Update local state when HTML is saved
            setFormData(prev => ({ ...prev, customHtml: sanitizedHtml }));
          }}
        />
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}