'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getUserStore, updateStore, uploadStoreImage, Store } from '@/lib/store';
import CustomHtmlEditor from '@/components/CustomHtmlEditor';
import Image from 'next/image';
import { 
  Save, 
  Upload, 
  Eye, 
  Palette, 
  Type, 
  Layout, 
  Settings,
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  Monitor,
  Smartphone,
  Users,
  Mail,
  Image as ImageIcon,
  MousePointer
} from 'lucide-react';

const SOCIAL_PLATFORMS = [
  'instagram', 'twitter', 'facebook', 'youtube', 'linkedin', 
  'tiktok', 'snapchat', 'pinterest', 'github', 'website'
];

const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, system-ui, -apple-system, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { name: 'Ubuntu', value: 'Ubuntu, sans-serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif' }
];

const HEADER_LAYOUTS = [
  { value: 'left-right', label: 'Avatar Left, Social Right' },
  { value: 'right-left', label: 'Avatar Right, Social Left' },
  { value: 'center', label: 'Centered Layout' }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // General Settings
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [headerLayout, setHeaderLayout] = useState<'left-right' | 'right-left' | 'center'>('left-right');
  const [isActive, setIsActive] = useState(true);

  // Images
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [widgetFile, setWidgetFile] = useState<File | null>(null);
  const [subscriptionFile, setSubscriptionFile] = useState<File | null>(null);

  // Social Links
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([]);

  // Typography & Colors
  const [fontFamily, setFontFamily] = useState('');
  const [headingFontFamily, setHeadingFontFamily] = useState('');
  const [bodyFontFamily, setBodyFontFamily] = useState('');
  const [headingTextColor, setHeadingTextColor] = useState('#1f2937');
  const [bodyTextColor, setBodyTextColor] = useState('#374151');
  const [storeNameFontColor, setStoreNameFontColor] = useState('#ffffff');
  const [storeBioFontColor, setStoreBioFontColor] = useState('#e5e7eb');

  // Layout & Background
  const [storeBackgroundColor, setStoreBackgroundColor] = useState('#f3f4f6');
  const [mainBackgroundGradientStartColor, setMainBackgroundGradientStartColor] = useState('');
  const [mainBackgroundGradientEndColor, setMainBackgroundGradientEndColor] = useState('');
  const [storeHeaderBgColor, setStoreHeaderBgColor] = useState('');

  // Avatar & Category Borders
  const [avatarBorderColor, setAvatarBorderColor] = useState('#ffffff');
  const [activeCategoryBorderColor, setActiveCategoryBorderColor] = useState('#6366f1');
  const [categoryTextColor, setCategoryTextColor] = useState('#059669');
  const [categoryImageBorderColor, setCategoryImageBorderColor] = useState('');

  // Product Cards
  const [productCardBgColor, setProductCardBgColor] = useState('#ffffff');
  const [productCardBorderColor, setProductCardBorderColor] = useState('');
  const [productTitleColor, setProductTitleColor] = useState('#1f2937');
  const [priceFontColor, setPriceFontColor] = useState('#059669');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // Buttons & CTAs
  const [loadMoreButtonBgColor, setLoadMoreButtonBgColor] = useState('#4f46e5');
  const [loadMoreButtonTextColor, setLoadMoreButtonTextColor] = useState('#ffffff');
  const [clearSearchButtonBgColor, setClearSearchButtonBgColor] = useState('#4f46e5');
  const [clearSearchButtonTextColor, setClearSearchButtonTextColor] = useState('#ffffff');
  const [dashboardViewStoreButtonBgColor, setDashboardViewStoreButtonBgColor] = useState('#4f46e5');
  const [dashboardViewStoreButtonTextColor, setDashboardViewStoreButtonTextColor] = useState('#ffffff');

  // Search Input
  const [searchInputBgColor, setSearchInputBgColor] = useState('#ffffff');
  const [searchInputBorderColor, setSearchInputBorderColor] = useState('#d1d5db');
  const [searchInputTextColor, setSearchInputTextColor] = useState('#111827');
  const [searchInputPlaceholderColor, setSearchInputPlaceholderColor] = useState('#9ca3af');

  // Slides
  const [slideOverlayColor, setSlideOverlayColor] = useState('#000000');
  const [slideOverlayOpacity, setSlideOverlayOpacity] = useState(0.4);
  const [slideTitleColor, setSlideTitleColor] = useState('#ffffff');
  const [slideDescriptionColor, setSlideDescriptionColor] = useState('#e5e7eb');
  const [slidePaginationDotColor, setSlidePaginationDotColor] = useState('#ffffff');
  const [slidePaginationActiveDotColor, setSlidePaginationActiveDotColor] = useState('#ffffff');

  // Subscription Modal
  const [subscribeModalBgColor, setSubscribeModalBgColor] = useState('#ffffff');
  const [subscribeModalTextColor, setSubscribeModalTextColor] = useState('#374151');
  const [subscribeButtonBgColor, setSubscribeButtonBgColor] = useState('#4f46e5');
  const [subscribeButtonTextColor, setSubscribeButtonTextColor] = useState('#ffffff');
  const [subscribeModalBorderColor, setSubscribeModalBorderColor] = useState('#e5e7eb');
  const [subscribeInputBgColor, setSubscribeInputBgColor] = useState('#ffffff');
  const [subscribeInputBorderColor, setSubscribeInputBorderColor] = useState('#d1d5db');
  const [subscribeInputTextColor, setSubscribeInputTextColor] = useState('#374151');
  const [subscribeInputPlaceholderColor, setSubscribeInputPlaceholderColor] = useState('#9ca3af');

  // Feature Toggles
  const [displayPriceOnProducts, setDisplayPriceOnProducts] = useState(true);
  const [displayHeaderBackgroundImage, setDisplayHeaderBackgroundImage] = useState(true);
  const [slidesEnabled, setSlidesEnabled] = useState(true);
  const [widgetEnabled, setWidgetEnabled] = useState(true);
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(true);
  const [requireNameForSubscription, setRequireNameForSubscription] = useState(true);

  // Widget & Banner
  const [widgetLink, setWidgetLink] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [bannerLink, setBannerLink] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      if (!user) return;
      
      try {
        const storeData = await getUserStore(user.uid);
        if (storeData) {
          setStore(storeData);
          
          // General Settings
          setStoreName(storeData.name || '');
          setStoreDescription(storeData.description || '');
          setHeaderLayout(storeData.headerLayout || 'left-right');
          setIsActive(storeData.isActive !== false);
          
          // Social Links
          setSocialLinks(storeData.socialLinks || []);
          
          // Feature Toggles
          setDisplayPriceOnProducts(storeData.displayPriceOnProducts !== false);
          setDisplayHeaderBackgroundImage(storeData.displayHeaderBackgroundImage !== false);
          setSlidesEnabled(storeData.slidesEnabled !== false);
          setWidgetEnabled(storeData.widgetEnabled !== false);
          setBannerEnabled(storeData.bannerEnabled !== false);
          setSubscriptionEnabled(storeData.subscriptionEnabled !== false);
          setRequireNameForSubscription(storeData.requireNameForSubscription !== false);
          
          // Widget & Banner
          setWidgetLink(storeData.widgetLink || '');
          setBannerDescription(storeData.bannerDescription || '');
          setBannerLink(storeData.bannerLink || '');
          
          // Customization
          const customization = storeData.customization || {};
          
          // Typography & Colors
          setFontFamily(customization.fontFamily || '');
          setHeadingFontFamily(customization.headingFontFamily || '');
          setBodyFontFamily(customization.bodyFontFamily || '');
          setHeadingTextColor(customization.headingTextColor || '#1f2937');
          setBodyTextColor(customization.bodyTextColor || '#374151');
          setStoreNameFontColor(customization.storeNameFontColor || '#ffffff');
          setStoreBioFontColor(customization.storeBioFontColor || '#e5e7eb');
          
          // Layout & Background
          setStoreBackgroundColor(customization.storeBackgroundColor || '#f3f4f6');
          setMainBackgroundGradientStartColor(customization.mainBackgroundGradientStartColor || '');
          setMainBackgroundGradientEndColor(customization.mainBackgroundGradientEndColor || '');
          setStoreHeaderBgColor(customization.storeHeaderBgColor || '');
          
          // Avatar & Category Borders
          setAvatarBorderColor(customization.avatarBorderColor || '#ffffff');
          setActiveCategoryBorderColor(customization.activeCategoryBorderColor || '#6366f1');
          setCategoryTextColor(customization.categoryTextColor || '#059669');
          setCategoryImageBorderColor(customization.categoryImageBorderColor || '');
          
          // Product Cards
          setProductCardBgColor(customization.productCardBgColor || '#ffffff');
          setProductCardBorderColor(customization.productCardBorderColor || '');
          setProductTitleColor(customization.productTitleColor || '#1f2937');
          setPriceFontColor(customization.priceFontColor || '#059669');
          setCurrencySymbol(customization.currencySymbol || '$');
          
          // Buttons & CTAs
          setLoadMoreButtonBgColor(customization.loadMoreButtonBgColor || '#4f46e5');
          setLoadMoreButtonTextColor(customization.loadMoreButtonTextColor || '#ffffff');
          setClearSearchButtonBgColor(customization.clearSearchButtonBgColor || '#4f46e5');
          setClearSearchButtonTextColor(customization.clearSearchButtonTextColor || '#ffffff');
          setDashboardViewStoreButtonBgColor(customization.dashboardViewStoreButtonBgColor || '#4f46e5');
          setDashboardViewStoreButtonTextColor(customization.dashboardViewStoreButtonTextColor || '#ffffff');
          
          // Search Input
          setSearchInputBgColor(customization.searchInputBgColor || '#ffffff');
          setSearchInputBorderColor(customization.searchInputBorderColor || '#d1d5db');
          setSearchInputTextColor(customization.searchInputTextColor || '#111827');
          setSearchInputPlaceholderColor(customization.searchInputPlaceholderColor || '#9ca3af');
          
          // Slides
          setSlideOverlayColor(customization.slideOverlayColor || '#000000');
          setSlideOverlayOpacity(customization.slideOverlayOpacity || 0.4);
          setSlideTitleColor(customization.slideTitleColor || '#ffffff');
          setSlideDescriptionColor(customization.slideDescriptionColor || '#e5e7eb');
          setSlidePaginationDotColor(customization.slidePaginationDotColor || '#ffffff');
          setSlidePaginationActiveDotColor(customization.slidePaginationActiveDotColor || '#ffffff');
          
          // Subscription Modal
          setSubscribeModalBgColor(customization.subscribeModalBgColor || '#ffffff');
          setSubscribeModalTextColor(customization.subscribeModalTextColor || '#374151');
          setSubscribeButtonBgColor(customization.subscribeButtonBgColor || '#4f46e5');
          setSubscribeButtonTextColor(customization.subscribeButtonTextColor || '#ffffff');
          setSubscribeModalBorderColor(customization.subscribeModalBorderColor || '#e5e7eb');
          setSubscribeInputBgColor(customization.subscribeInputBgColor || '#ffffff');
          setSubscribeInputBorderColor(customization.subscribeInputBorderColor || '#d1d5db');
          setSubscribeInputTextColor(customization.subscribeInputTextColor || '#374151');
          setSubscribeInputPlaceholderColor(customization.subscribeInputPlaceholderColor || '#9ca3af');
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        showError('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [user, showError]);

  const handleSaveStore = async () => {
    if (!user || !store) return;
    
    setSaving(true);
    
    try {
      let avatarUrl = store.avatar;
      let backgroundUrl = store.backgroundImage;
      let bannerUrl = store.bannerImage;
      let widgetUrl = store.widgetImage;
      let subscriptionUrl = store.subscriptionBackgroundImage;
      
      // Upload new images if selected
      if (avatarFile) {
        avatarUrl = await uploadStoreImage(user.uid, avatarFile, 'avatar');
      }
      if (backgroundFile) {
        backgroundUrl = await uploadStoreImage(user.uid, backgroundFile, 'background');
      }
      if (bannerFile) {
        bannerUrl = await uploadStoreImage(user.uid, bannerFile, 'banner');
      }
      if (widgetFile) {
        widgetUrl = await uploadStoreImage(user.uid, widgetFile, 'avatar'); // Using avatar type for widget
      }
      if (subscriptionFile) {
        subscriptionUrl = await uploadStoreImage(user.uid, subscriptionFile, 'background');
      }
      
      const updates = {
        name: storeName,
        description: storeDescription,
        headerLayout,
        isActive,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        bannerImage: bannerUrl,
        widgetImage: widgetUrl,
        subscriptionBackgroundImage: subscriptionUrl,
        socialLinks,
        displayPriceOnProducts,
        displayHeaderBackgroundImage,
        slidesEnabled,
        widgetEnabled,
        bannerEnabled,
        subscriptionEnabled,
        requireNameForSubscription,
        widgetLink,
        bannerDescription,
        bannerLink,
        customization: {
          fontFamily,
          headingFontFamily,
          bodyFontFamily,
          headingTextColor,
          bodyTextColor,
          storeNameFontColor,
          storeBioFontColor,
          storeBackgroundColor,
          mainBackgroundGradientStartColor,
          mainBackgroundGradientEndColor,
          storeHeaderBgColor,
          avatarBorderColor,
          activeCategoryBorderColor,
          categoryTextColor,
          categoryImageBorderColor,
          productCardBgColor,
          productCardBorderColor,
          productTitleColor,
          priceFontColor,
          currencySymbol,
          loadMoreButtonBgColor,
          loadMoreButtonTextColor,
          clearSearchButtonBgColor,
          clearSearchButtonTextColor,
          dashboardViewStoreButtonBgColor,
          dashboardViewStoreButtonTextColor,
          searchInputBgColor,
          searchInputBorderColor,
          searchInputTextColor,
          searchInputPlaceholderColor,
          slideOverlayColor,
          slideOverlayOpacity,
          slideTitleColor,
          slideDescriptionColor,
          slidePaginationDotColor,
          slidePaginationActiveDotColor,
          subscribeModalBgColor,
          subscribeModalTextColor,
          subscribeButtonBgColor,
          subscribeButtonTextColor,
          subscribeModalBorderColor,
          subscribeInputBgColor,
          subscribeInputBorderColor,
          subscribeInputTextColor,
          subscribeInputPlaceholderColor
        }
      };
      
      await updateStore(user.uid, updates);
      showSuccess('Store settings saved successfully!');
      
      // Reset file inputs
      setAvatarFile(null);
      setBackgroundFile(null);
      setBannerFile(null);
      setWidgetFile(null);
      setSubscriptionFile(null);
      
      // Refresh store data
      const updatedStore = await getUserStore(user.uid);
      if (updatedStore) {
        setStore(updatedStore);
      }
      
    } catch (error) {
      console.error('Error saving store:', error);
      showError('Failed to save store settings');
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'instagram', url: '' }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const ColorInput = ({ label, value, onChange, description }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  const ImageUpload = ({ label, currentImage, onFileChange, description }: {
    label: string;
    currentImage?: string;
    onFileChange: (file: File | null) => void;
    description?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {currentImage && (
        <div className="mb-2">
          <Image
            src={currentImage}
            alt={label}
            width={100}
            height={100}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'features', label: 'Features', icon: Monitor },
    { id: 'subscription', label: 'Subscription', icon: Users },
    { id: 'custom-html', label: 'Custom HTML', icon: Globe }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Settings className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
              <p className="text-gray-600 mt-1">Customize your store appearance and functionality</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {store && (
              <a
                href={`/${store.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Store
              </a>
            )}
            <button
              onClick={handleSaveStore}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Layout</label>
                  <select
                    value={headerLayout}
                    onChange={(e) => setHeaderLayout(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {HEADER_LAYOUTS.map((layout) => (
                      <option key={layout.value} value={layout.value}>
                        {layout.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                <textarea
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Store is active and visible to visitors</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Store Avatar"
                  currentImage={store?.avatar}
                  onFileChange={setAvatarFile}
                  description="Square image recommended (200x200px)"
                />
                <ImageUpload
                  label="Header Background"
                  currentImage={store?.backgroundImage}
                  onFileChange={setBackgroundFile}
                  description="Wide image recommended (1200x400px)"
                />
                <ImageUpload
                  label="Widget Image"
                  currentImage={store?.widgetImage}
                  onFileChange={setWidgetFile}
                  description="Small square image for floating widget"
                />
                <ImageUpload
                  label="Banner Image"
                  currentImage={store?.bannerImage}
                  onFileChange={setBannerFile}
                  description="Image for promotional banner popup"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                <button
                  onClick={addSocialLink}
                  className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </button>
              </div>
              
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex space-x-3">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {socialLinks.length === 0 && (
                  <p className="text-gray-500 text-sm">No social links added yet. Click "Add Link" to get started.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Background & Layout Colors */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Background & Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Store Background Color"
                  value={storeBackgroundColor}
                  onChange={setStoreBackgroundColor}
                  description="Main background color of your store"
                />
                <ColorInput
                  label="Header Background Color"
                  value={storeHeaderBgColor}
                  onChange={setStoreHeaderBgColor}
                  description="Background color for the header section"
                />
                <ColorInput
                  label="Gradient Start Color"
                  value={mainBackgroundGradientStartColor}
                  onChange={setMainBackgroundGradientStartColor}
                  description="Starting color for background gradient"
                />
                <ColorInput
                  label="Gradient End Color"
                  value={mainBackgroundGradientEndColor}
                  onChange={setMainBackgroundGradientEndColor}
                  description="Ending color for background gradient"
                />
              </div>
            </div>

            {/* Avatar & Category Borders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar & Category Styling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Avatar Border Color"
                  value={avatarBorderColor}
                  onChange={setAvatarBorderColor}
                  description="Border color around your store avatar"
                />
                <ColorInput
                  label="Active Category Border"
                  value={activeCategoryBorderColor}
                  onChange={setActiveCategoryBorderColor}
                  description="Border color for selected category"
                />
                <ColorInput
                  label="Category Text Color"
                  value={categoryTextColor}
                  onChange={setCategoryTextColor}
                  description="Text color for category names"
                />
                <ColorInput
                  label="Category Image Border"
                  value={categoryImageBorderColor}
                  onChange={setCategoryImageBorderColor}
                  description="Border color for category images"
                />
              </div>
            </div>

            {/* Product Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Product Card Background"
                  value={productCardBgColor}
                  onChange={setProductCardBgColor}
                  description="Background color for product cards"
                />
                <ColorInput
                  label="Product Card Border"
                  value={productCardBorderColor}
                  onChange={setProductCardBorderColor}
                  description="Border color for product cards"
                />
                <ColorInput
                  label="Product Title Color"
                  value={productTitleColor}
                  onChange={setProductTitleColor}
                  description="Color for product titles"
                />
                <ColorInput
                  label="Price Color"
                  value={priceFontColor}
                  onChange={setPriceFontColor}
                  description="Color for product prices"
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="$"
                />
              </div>
            </div>

            {/* Buttons & CTAs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buttons & Call-to-Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Load More Button Background"
                  value={loadMoreButtonBgColor}
                  onChange={setLoadMoreButtonBgColor}
                  description="Background color for load more button"
                />
                <ColorInput
                  label="Load More Button Text"
                  value={loadMoreButtonTextColor}
                  onChange={setLoadMoreButtonTextColor}
                  description="Text color for load more button"
                />
                <ColorInput
                  label="Clear Search Button Background"
                  value={clearSearchButtonBgColor}
                  onChange={setClearSearchButtonBgColor}
                  description="Background color for clear search button"
                />
                <ColorInput
                  label="Clear Search Button Text"
                  value={clearSearchButtonTextColor}
                  onChange={setClearSearchButtonTextColor}
                  description="Text color for clear search button"
                />
                <ColorInput
                  label="Dashboard View Store Button Background"
                  value={dashboardViewStoreButtonBgColor}
                  onChange={setDashboardViewStoreButtonBgColor}
                  description="Background color for view store button in dashboard"
                />
                <ColorInput
                  label="Dashboard View Store Button Text"
                  value={dashboardViewStoreButtonTextColor}
                  onChange={setDashboardViewStoreButtonTextColor}
                  description="Text color for view store button in dashboard"
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Input Styling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Search Input Background"
                  value={searchInputBgColor}
                  onChange={setSearchInputBgColor}
                  description="Background color for search input"
                />
                <ColorInput
                  label="Search Input Border"
                  value={searchInputBorderColor}
                  onChange={setSearchInputBorderColor}
                  description="Border color for search input"
                />
                <ColorInput
                  label="Search Input Text"
                  value={searchInputTextColor}
                  onChange={setSearchInputTextColor}
                  description="Text color for search input"
                />
                <ColorInput
                  label="Search Input Placeholder"
                  value={searchInputPlaceholderColor}
                  onChange={setSearchInputPlaceholderColor}
                  description="Placeholder text color for search input"
                />
              </div>
            </div>

            {/* Slides */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotional Slides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Slide Overlay Color"
                  value={slideOverlayColor}
                  onChange={setSlideOverlayColor}
                  description="Overlay color on slide images"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Slide Overlay Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={slideOverlayOpacity}
                    onChange={(e) => setSlideOverlayOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Current: {Math.round(slideOverlayOpacity * 100)}%</p>
                </div>
                <ColorInput
                  label="Slide Title Color"
                  value={slideTitleColor}
                  onChange={setSlideTitleColor}
                  description="Color for slide titles"
                />
                <ColorInput
                  label="Slide Description Color"
                  value={slideDescriptionColor}
                  onChange={setSlideDescriptionColor}
                  description="Color for slide descriptions"
                />
                <ColorInput
                  label="Pagination Dot Color"
                  value={slidePaginationDotColor}
                  onChange={setSlidePaginationDotColor}
                  description="Color for inactive pagination dots"
                />
                <ColorInput
                  label="Active Pagination Dot Color"
                  value={slidePaginationActiveDotColor}
                  onChange={setSlidePaginationActiveDotColor}
                  description="Color for active pagination dot"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Families</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">General Font</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Default</option>
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading Font</label>
                  <select
                    value={headingFontFamily}
                    onChange={(e) => setHeadingFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Use General Font</option>
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Font</label>
                  <select
                    value={bodyFontFamily}
                    onChange={(e) => setBodyFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Use General Font</option>
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Heading Text Color"
                  value={headingTextColor}
                  onChange={setHeadingTextColor}
                  description="Color for all headings (h1, h2, etc.)"
                />
                <ColorInput
                  label="Body Text Color"
                  value={bodyTextColor}
                  onChange={setBodyTextColor}
                  description="Color for regular text content"
                />
                <ColorInput
                  label="Store Name Color"
                  value={storeNameFontColor}
                  onChange={setStoreNameFontColor}
                  description="Color for your store name in header"
                />
                <ColorInput
                  label="Store Bio Color"
                  value={storeBioFontColor}
                  onChange={setStoreBioFontColor}
                  description="Color for store description in header"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Modal Styling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Modal Background Color"
                  value={subscribeModalBgColor}
                  onChange={setSubscribeModalBgColor}
                  description="Background color for subscription modal"
                />
                <ColorInput
                  label="Modal Text Color"
                  value={subscribeModalTextColor}
                  onChange={setSubscribeModalTextColor}
                  description="Text color for modal content"
                />
                <ColorInput
                  label="Modal Border Color"
                  value={subscribeModalBorderColor}
                  onChange={setSubscribeModalBorderColor}
                  description="Border color for modal"
                />
                <ColorInput
                  label="Subscribe Button Background"
                  value={subscribeButtonBgColor}
                  onChange={setSubscribeButtonBgColor}
                  description="Background color for subscribe button"
                />
                <ColorInput
                  label="Subscribe Button Text"
                  value={subscribeButtonTextColor}
                  onChange={setSubscribeButtonTextColor}
                  description="Text color for subscribe button"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Field Styling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Input Background Color"
                  value={subscribeInputBgColor}
                  onChange={setSubscribeInputBgColor}
                  description="Background color for input fields"
                />
                <ColorInput
                  label="Input Border Color"
                  value={subscribeInputBorderColor}
                  onChange={setSubscribeInputBorderColor}
                  description="Border color for input fields"
                />
                <ColorInput
                  label="Input Text Color"
                  value={subscribeInputTextColor}
                  onChange={setSubscribeInputTextColor}
                  description="Text color for input fields"
                />
                <ColorInput
                  label="Input Placeholder Color"
                  value={subscribeInputPlaceholderColor}
                  onChange={setSubscribeInputPlaceholderColor}
                  description="Placeholder text color for input fields"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subscriptionEnabled}
                    onChange={(e) => setSubscriptionEnabled(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Enable subscription modal</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={requireNameForSubscription}
                    onChange={(e) => setRequireNameForSubscription(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Require name for subscription</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={displayPriceOnProducts}
                    onChange={(e) => setDisplayPriceOnProducts(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Display prices on products</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={displayHeaderBackgroundImage}
                    onChange={(e) => setDisplayHeaderBackgroundImage(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Display header background image</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={slidesEnabled}
                    onChange={(e) => setSlidesEnabled(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Enable promotional slides</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Widget Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={widgetEnabled}
                    onChange={(e) => setWidgetEnabled(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Enable floating widget</span>
                </label>
                
                {widgetEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Widget Link (Optional)</label>
                    <input
                      type="url"
                      value={widgetLink}
                      onChange={(e) => setWidgetLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500 mt-1">If provided, clicking the widget will open this link</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Banner Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bannerEnabled}
                    onChange={(e) => setBannerEnabled(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Enable promotional banner popup</span>
                </label>
                
                {bannerEnabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Description</label>
                      <textarea
                        value={bannerDescription}
                        onChange={(e) => setBannerDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Describe your promotional offer..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Link (Optional)</label>
                      <input
                        type="url"
                        value={bannerLink}
                        onChange={(e) => setBannerLink(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-gray-500 mt-1">If provided, clicking the banner will open this link</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'custom-html' && (
          <div className="bg-white rounded-lg shadow p-6">
            <CustomHtmlEditor
              storeId={user?.uid || ''}
              initialHtml={store?.customHtml || ''}
            />
          </div>
        )}
      </div>
    </div>
  );
}