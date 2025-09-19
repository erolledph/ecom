'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getUserStore, updateStore, uploadStoreImage, uploadWidgetImage, uploadSubscriptionImage, Store } from '@/lib/store';
import CustomHtmlEditor from '@/components/CustomHtmlEditor';
import Image from 'next/image';
import { 
  Save, 
  Upload, 
  Eye, 
  ArrowLeft,
  Store as StoreIcon,
  Palette,
  Image as ImageIcon,
  Globe,
  Settings,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Users
} from 'lucide-react';

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
  { name: 'Inter', value: 'Inter, system-ui, -apple-system, sans-serif' },
  { name: 'Roboto', value: 'Roboto, system-ui, -apple-system, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", system-ui, -apple-system, sans-serif' },
  { name: 'Lato', value: 'Lato, system-ui, -apple-system, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, system-ui, -apple-system, sans-serif' },
  { name: 'Poppins', value: 'Poppins, system-ui, -apple-system, sans-serif' },
  { name: 'Nunito', value: 'Nunito, system-ui, -apple-system, sans-serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", system-ui, -apple-system, sans-serif' },
  { name: 'Ubuntu', value: 'Ubuntu, system-ui, -apple-system, sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
  { name: 'Merriweather', value: 'Merriweather, Georgia, serif' },
  { name: 'Lora', value: 'Lora, Georgia, serif' }
];

const HEADER_LAYOUTS = [
  { id: 'left-right', name: 'Avatar Left, Social Right', icon: '👤 ➡️ 📱' },
  { id: 'right-left', name: 'Social Left, Avatar Right', icon: '📱 ➡️ 👤' },
  { id: 'center', name: 'Centered Layout', icon: '🎯' }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headerLayout: 'left-right' as 'left-right' | 'right-left' | 'center',
    slidesEnabled: true,
    displayPriceOnProducts: true,
    displayHeaderBackgroundImage: true,
    widgetEnabled: true,
    widgetLink: '',
    bannerEnabled: true,
    bannerDescription: '',
    bannerLink: '',
    subscriptionEnabled: true,
    requireNameForSubscription: true,
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
      slideDescriptionColor: '#e5e7eb'
    }
  });

  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [widgetFile, setWidgetFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [subscriptionFile, setSubscriptionFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [widgetPreview, setWidgetPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [subscriptionPreview, setSubscriptionPreview] = useState('');

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
            headerLayout: storeData.headerLayout || 'left-right',
            slidesEnabled: storeData.slidesEnabled !== false,
            displayPriceOnProducts: storeData.displayPriceOnProducts !== false,
            displayHeaderBackgroundImage: storeData.displayHeaderBackgroundImage !== false,
            widgetEnabled: storeData.widgetEnabled !== false,
            widgetLink: storeData.widgetLink || '',
            bannerEnabled: storeData.bannerEnabled !== false,
            bannerDescription: storeData.bannerDescription || '',
            bannerLink: storeData.bannerLink || '',
            subscriptionEnabled: storeData.subscriptionEnabled !== false,
            requireNameForSubscription: storeData.requireNameForSubscription !== false,
            customization: {
              ...formData.customization,
              ...storeData.customization
            }
          });
          setSocialLinks(storeData.socialLinks || []);
          setAvatarPreview(storeData.avatar || '');
          setBackgroundPreview(storeData.backgroundImage || '');
          setWidgetPreview(storeData.widgetImage || '');
          setBannerPreview(storeData.bannerImage || '');
          setSubscriptionPreview(storeData.subscriptionBackgroundImage || '');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('customization.')) {
      const customizationKey = name.replace('customization.', '');
      setFormData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          [customizationKey]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleImageChange = (type: 'avatar' | 'background' | 'widget' | 'banner' | 'subscription', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      
      switch (type) {
        case 'avatar':
          setAvatarFile(file);
          setAvatarPreview(preview);
          break;
        case 'background':
          setBackgroundFile(file);
          setBackgroundPreview(preview);
          break;
        case 'widget':
          setWidgetFile(file);
          setWidgetPreview(preview);
          break;
        case 'banner':
          setBannerFile(file);
          setBannerPreview(preview);
          break;
        case 'subscription':
          setSubscriptionFile(file);
          setSubscriptionPreview(preview);
          break;
      }
    }
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setSocialLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { platform: 'instagram', url: '' }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !store) return;

    setSaving(true);

    try {
      let avatarUrl = store.avatar;
      let backgroundUrl = store.backgroundImage;
      let widgetUrl = store.widgetImage;
      let bannerUrl = store.bannerImage;
      let subscriptionUrl = store.subscriptionBackgroundImage;

      // Upload images if new files are selected
      if (avatarFile) {
        avatarUrl = await uploadStoreImage(user.uid, avatarFile, 'avatar');
      }
      if (backgroundFile) {
        backgroundUrl = await uploadStoreImage(user.uid, backgroundFile, 'background');
      }
      if (widgetFile) {
        widgetUrl = await uploadWidgetImage(user.uid, widgetFile);
      }
      if (bannerFile) {
        bannerUrl = await uploadStoreImage(user.uid, bannerFile, 'banner');
      }
      if (subscriptionFile) {
        subscriptionUrl = await uploadSubscriptionImage(user.uid, subscriptionFile);
      }

      const updateData = {
        ...formData,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        widgetImage: widgetUrl,
        bannerImage: bannerUrl,
        subscriptionBackgroundImage: subscriptionUrl,
        socialLinks: socialLinks.filter(link => link.url.trim() !== '')
      };

      await updateStore(user.uid, updateData);
      showSuccess('Store settings updated successfully!');
      
      // Update local store state
      setStore(prev => prev ? { ...prev, ...updateData } : null);
    } catch (error) {
      console.error('Error updating store:', error);
      showError('Failed to update store settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCustomHtmlSave = (sanitizedHtml: string) => {
    // Update local store state with the new custom HTML
    setStore(prev => prev ? { ...prev, customHtml: sanitizedHtml } : null);
    showSuccess('Custom HTML updated successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: StoreIcon },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'images', name: 'Images', icon: ImageIcon },
    { id: 'features', name: 'Features', icon: Settings },
    { id: 'subscriptions', name: 'Subscriptions', icon: Users },
    { id: 'custom-html', name: 'Custom HTML', icon: Code },
    { id: 'social', name: 'Social Links', icon: Globe }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600 mt-1">Customize your store appearance and functionality</p>
          </div>
          {store && (
            <a
              href={`/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Store
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="My Awesome Store"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Welcome to my store! Discover amazing products..."
                />
              </div>

              <div>
                <label htmlFor="headerLayout" className="block text-sm font-medium text-gray-700 mb-3">
                  Header Layout
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HEADER_LAYOUTS.map((layout) => (
                    <label
                      key={layout.id}
                      className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.headerLayout === layout.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="headerLayout"
                        value={layout.id}
                        checked={formData.headerLayout === layout.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="text-2xl mb-2">{layout.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{layout.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customization.headingFontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font Family
                  </label>
                  <select
                    id="customization.headingFontFamily"
                    name="customization.headingFontFamily"
                    value={formData.customization.headingFontFamily}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="customization.bodyFontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                    Body Font Family
                  </label>
                  <select
                    id="customization.bodyFontFamily"
                    name="customization.bodyFontFamily"
                    value={formData.customization.bodyFontFamily}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customization.storeNameFontColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name Color
                  </label>
                  <input
                    type="color"
                    id="customization.storeNameFontColor"
                    name="customization.storeNameFontColor"
                    value={formData.customization.storeNameFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="customization.storeBioFontColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Store Bio Color
                  </label>
                  <input
                    type="color"
                    id="customization.storeBioFontColor"
                    name="customization.storeBioFontColor"
                    value={formData.customization.storeBioFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customization.priceFontColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Price Color
                  </label>
                  <input
                    type="color"
                    id="customization.priceFontColor"
                    name="customization.priceFontColor"
                    value={formData.customization.priceFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="customization.currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    id="customization.currencySymbol"
                    name="customization.currencySymbol"
                    value={formData.customization.currencySymbol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="$"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customization.mainBackgroundGradientStartColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Background Gradient Start
                  </label>
                  <input
                    type="color"
                    id="customization.mainBackgroundGradientStartColor"
                    name="customization.mainBackgroundGradientStartColor"
                    value={formData.customization.mainBackgroundGradientStartColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="customization.mainBackgroundGradientEndColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Background Gradient End
                  </label>
                  <input
                    type="color"
                    id="customization.mainBackgroundGradientEndColor"
                    name="customization.mainBackgroundGradientEndColor"
                    value={formData.customization.mainBackgroundGradientEndColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-8">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Store Avatar
                </label>
                {avatarPreview && (
                  <div className="mb-4">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={100}
                      height={100}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {avatarFile ? 'Change Avatar' : 'Upload Avatar'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange('avatar', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Header Background Image
                </label>
                {backgroundPreview && (
                  <div className="mb-4">
                    <Image
                      src={backgroundPreview}
                      alt="Background preview"
                      width={300}
                      height={150}
                      className="w-full max-w-md h-32 rounded-lg object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {backgroundFile ? 'Change Background' : 'Upload Background'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange('background', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Widget Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Widget Image
                </label>
                {widgetPreview && (
                  <div className="mb-4">
                    <Image
                      src={widgetPreview}
                      alt="Widget preview"
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {widgetFile ? 'Change Widget Image' : 'Upload Widget Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange('widget', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pop-up Banner Image
                </label>
                {bannerPreview && (
                  <div className="mb-4">
                    <Image
                      src={bannerPreview}
                      alt="Banner preview"
                      width={300}
                      height={200}
                      className="w-full max-w-md h-40 rounded-lg object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {bannerFile ? 'Change Banner Image' : 'Upload Banner Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange('banner', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Slides</h4>
                    <p className="text-sm text-gray-600">Show promotional slides on your store</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="slidesEnabled"
                      checked={formData.slidesEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Display Prices</h4>
                    <p className="text-sm text-gray-600">Show product prices on your store</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="displayPriceOnProducts"
                      checked={formData.displayPriceOnProducts}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Floating Widget</h4>
                    <p className="text-sm text-gray-600">Show floating widget on your store</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="widgetEnabled"
                      checked={formData.widgetEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Pop-up Banner</h4>
                    <p className="text-sm text-gray-600">Show promotional banner popup</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="bannerEnabled"
                      checked={formData.bannerEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              {formData.widgetEnabled && (
                <div>
                  <label htmlFor="widgetLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="widgetLink"
                    name="widgetLink"
                    value={formData.widgetLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="https://example.com/special-offer"
                  />
                </div>
              )}

              {formData.bannerEnabled && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bannerDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Description
                    </label>
                    <textarea
                      id="bannerDescription"
                      name="bannerDescription"
                      rows={3}
                      value={formData.bannerDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Special offer description..."
                    />
                  </div>

                  <div>
                    <label htmlFor="bannerLink" className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Link (Optional)
                    </label>
                    <input
                      type="url"
                      id="bannerLink"
                      name="bannerLink"
                      value={formData.bannerLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="https://example.com/special-offer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Subscriptions</h4>
                    <p className="text-sm text-gray-600">Allow visitors to subscribe to your mailing list</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="subscriptionEnabled"
                      checked={formData.subscriptionEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Name</h4>
                    <p className="text-sm text-gray-600">Require visitors to provide their name when subscribing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="requireNameForSubscription"
                      checked={formData.requireNameForSubscription}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              {/* Subscription Background Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subscription Form Background Image
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Optional background image for the subscription modal
                </p>
                {subscriptionPreview && (
                  <div className="mb-4">
                    <Image
                      src={subscriptionPreview}
                      alt="Subscription background preview"
                      width={300}
                      height={200}
                      className="w-full max-w-md h-40 rounded-lg object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {subscriptionFile ? 'Change Background' : 'Upload Background'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange('subscription', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
          {/* Custom HTML Tab */}
          {activeTab === 'custom-html' && store && (
            <div>
              <CustomHtmlEditor
                storeId={store.id}
                initialHtml={store.customHtml || ''}
                onSave={handleCustomHtmlSave}
              />
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                  <p className="text-sm text-gray-600">Add links to your social media profiles</p>
                </div>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Link
                </button>
              </div>

              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
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
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder={`https://${link.platform}.com/yourprofile`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {socialLinks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No social links added yet</p>
                    <p className="text-sm">Click "Add Link" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Button - Only show for non-custom-html tabs */}
          {activeTab !== 'custom-html' && (
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
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
          )}
        </form>
      </div>
    </div>
  );
}
