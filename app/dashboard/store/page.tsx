'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getUserStore, updateStore, uploadStoreImage, uploadWidgetImage, Store } from '@/lib/store';
import Image from 'next/image';
import { 
  Save, 
  Upload, 
  Palette, 
  Globe, 
  Image as ImageIcon,
  Settings,
  Eye,
  EyeOff,
  Link as LinkIcon,
  MessageSquare,
  Megaphone
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

const CURRENCY_SYMBOLS = [
  { value: '$', label: 'USD - $ (US Dollar)' },
  { value: '€', label: 'EUR - € (Euro)' },
  { value: '£', label: 'GBP - £ (British Pound)' },
  { value: '¥', label: 'JPY - ¥ (Japanese Yen)' },
  { value: 'A$', label: 'AUD - A$ (Australian Dollar)' },
  { value: 'C$', label: 'CAD - C$ (Canadian Dollar)' },
  { value: 'Fr', label: 'CHF - Fr (Swiss Franc)' },
  { value: '¥', label: 'CNY - ¥ (Chinese Yuan)' },
  { value: 'kr', label: 'SEK - kr (Swedish Krona)' },
  { value: 'NZ$', label: 'NZD - NZ$ (New Zealand Dollar)' },
  { value: 'MX$', label: 'MXN - MX$ (Mexican Peso)' },
  { value: 'S$', label: 'SGD - S$ (Singapore Dollar)' },
  { value: 'HK$', label: 'HKD - HK$ (Hong Kong Dollar)' },
  { value: 'kr', label: 'NOK - kr (Norwegian Krone)' },
  { value: '₩', label: 'KRW - ₩ (South Korean Won)' },
  { value: '₹', label: 'INR - ₹ (Indian Rupee)' },
  { value: 'R$', label: 'BRL - R$ (Brazilian Real)' },
  { value: 'R', label: 'ZAR - R (South African Rand)' },
  { value: '₽', label: 'RUB - ₽ (Russian Rubles)' },
  { value: '₺', label: 'TRY - ₺ (Turkish Lira)' },
  { value: 'kr', label: 'DKK - kr (Danish Krone)' },
  { value: 'zł', label: 'PLN - zł (Polish Zloty)' },
  { value: 'NT$', label: 'TWD - NT$ (Taiwan Dollar)' },
  { value: '฿', label: 'THB - ฿ (Thai Baht)' },
  { value: 'RM', label: 'MYR - RM (Malaysian Ringgit)' },
  { value: 'Ft', label: 'HUF - Ft (Hungarian Forint)' },
  { value: 'Kč', label: 'CZK - Kč (Czech Koruna)' },
  { value: '₪', label: 'ILS - ₪ (Israeli Shekel)' },
  { value: 'CL$', label: 'CLP - CL$ (Chilean Peso)' },
  { value: '₱', label: 'PHP - ₱ (Philippine Peso)' }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Form states
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
    socialLinks: [] as Array<{ platform: string; url: string; }>,
    customization: {
      backgroundType: 'solid' as 'solid' | 'gradient',
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e5e7eb',
      avatarBorderColor: '#ffffff',
      activeCategoryBorderColor: '#6366f1',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headingFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      bodyFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headingTextColor: '#111827',
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

  // Image states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [widgetFile, setWidgetFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [widgetPreview, setWidgetPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

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
            socialLinks: storeData.socialLinks || [],
            customization: {
              ...formData.customization,
              ...storeData.customization
            }
          });
          setAvatarPreview(storeData.avatar || '');
          setBackgroundPreview(storeData.backgroundImage || '');
          setWidgetPreview(storeData.widgetImage || '');
          setBannerPreview(storeData.bannerImage || '');
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

  const handleImageChange = (type: 'avatar' | 'background' | 'widget' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
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
      }
    }
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !store) return;

    setSaving(true);

    try {
      let updates: Partial<Store> = {
        name: formData.name,
        description: formData.description,
        headerLayout: formData.headerLayout,
        slidesEnabled: formData.slidesEnabled,
        displayPriceOnProducts: formData.displayPriceOnProducts,
        displayHeaderBackgroundImage: formData.displayHeaderBackgroundImage,
        widgetEnabled: formData.widgetEnabled,
        widgetLink: formData.widgetLink,
        bannerEnabled: formData.bannerEnabled,
        bannerDescription: formData.bannerDescription,
        bannerLink: formData.bannerLink,
        socialLinks: formData.socialLinks,
        customization: formData.customization
      };

      // Upload images if new files are selected
      if (avatarFile) {
        const avatarUrl = await uploadStoreImage(user.uid, avatarFile, 'avatar');
        updates.avatar = avatarUrl;
      }

      if (backgroundFile) {
        const backgroundUrl = await uploadStoreImage(user.uid, backgroundFile, 'background');
        updates.backgroundImage = backgroundUrl;
      }

      if (widgetFile) {
        const widgetUrl = await uploadWidgetImage(user.uid, widgetFile);
        updates.widgetImage = widgetUrl;
      }

      if (bannerFile) {
        const bannerUrl = await uploadStoreImage(user.uid, bannerFile, 'banner');
        updates.bannerImage = bannerUrl;
      }

      await updateStore(user.uid, updates);
      showSuccess('Store settings updated successfully!');
    } catch (error) {
      console.error('Error updating store:', error);
      showError('Failed to update store settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'customization', label: 'Customization', icon: Palette },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'features', label: 'Features', icon: Eye }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900"
                  placeholder="Welcome to my store! Discover amazing products..."
                />
              </div>

              <div>
                <label htmlFor="headerLayout" className="block text-sm font-medium text-gray-700 mb-2">
                  Header Layout
                </label>
                <select
                  id="headerLayout"
                  name="headerLayout"
                  value={formData.headerLayout}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                >
                  {HEADER_LAYOUTS.map((layout) => (
                    <option key={layout.value} value={layout.value}>
                      {layout.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* Store Avatar */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Store Avatar</h3>
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
                    {avatarFile ? 'Change Avatar' : 'Upload Store Avatar'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange('avatar', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Background Image */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Header Background Image</h3>
                {backgroundPreview && (
                  <div className="mb-4">
                    <Image
                      src={backgroundPreview}
                      alt="Background preview"
                      width={400}
                      height={200}
                      className="w-full max-w-md h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {backgroundFile ? 'Change Background' : 'Upload Background Image'}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Floating Widget Image</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This image will appear as a floating widget on your store. If not set, your store avatar will be used.
                </p>
                {widgetPreview && (
                  <div className="mb-4">
                    <Image
                      src={widgetPreview}
                      alt="Widget preview"
                      width={64}
                      height={64}
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
                
                <div className="mt-4">
                  <label htmlFor="widgetLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="widgetLink"
                    name="widgetLink"
                    value={formData.widgetLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                    placeholder="https://example.com/special-offer"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    When clicked, the widget will redirect to this URL
                  </p>
                </div>
              </div>

              {/* Popup Banner */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Megaphone className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-medium text-gray-900">Popup Banner</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Create an eye-catching popup banner that appears when visitors first arrive at your store (Please check to open)
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bannerEnabled"
                      name="bannerEnabled"
                      checked={formData.bannerEnabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="bannerEnabled" className="ml-2 block text-sm text-gray-900">
                      Enable popup banner
                    </label>
                  </div>

                  {formData.bannerEnabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Image *
                        </label>
                        {bannerPreview && (
                          <div className="mb-4">
                            <Image
                              src={bannerPreview}
                              alt="Banner preview"
                              width={400}
                              height={300}
                              className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
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

                      <div>
                        <label htmlFor="bannerDescription" className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Description (Optional)
                        </label>
                        <textarea
                          id="bannerDescription"
                          name="bannerDescription"
                          rows={3}
                          value={formData.bannerDescription}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900"
                          placeholder="Add a compelling description for your banner..."
                        />
                      </div>

                      <div>
                        <label htmlFor="bannerLink" className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Link (Optional)
                        </label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="url"
                            id="bannerLink"
                            name="bannerLink"
                            value={formData.bannerLink}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                            placeholder="https://example.com/special-offer"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          When clicked, the banner will redirect to this URL
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customization Tab */}
          {activeTab === 'customization' && (
            <div className="space-y-8">
              {/* Typography */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="customization.headingFontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                      Heading Font
                    </label>
                    <select
                      id="customization.headingFontFamily"
                      name="customization.headingFontFamily"
                      value={formData.customization.headingFontFamily}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="customization.bodyFontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                      Body Font
                    </label>
                    <select
                      id="customization.bodyFontFamily"
                      name="customization.bodyFontFamily"
                      value={formData.customization.bodyFontFamily}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
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
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

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
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="customization.avatarBorderColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar Border Color
                    </label>
                    <input
                      type="color"
                      id="customization.avatarBorderColor"
                      name="customization.avatarBorderColor"
                      value={formData.customization.avatarBorderColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="customization.activeCategoryBorderColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Active Category Border
                    </label>
                    <input
                      type="color"
                      id="customization.activeCategoryBorderColor"
                      name="customization.activeCategoryBorderColor"
                      value={formData.customization.activeCategoryBorderColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Store Background */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Store Background</h3>
                
                {/* Background Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Background Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="customization.backgroundType"
                        value="solid"
                        checked={formData.customization.backgroundType === 'solid'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Solid Color</span>
                    </label>
                    <label className="flex items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="customization.backgroundType"
                        value="gradient"
                        checked={formData.customization.backgroundType === 'gradient'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Gradient Color</span>
                    </label>
                  </div>
                </div>

                {/* Background Color Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.customization.backgroundType === 'solid' ? (
                    <div>
                      <label htmlFor="customization.storeBackgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        id="customization.storeBackgroundColor"
                        name="customization.storeBackgroundColor"
                        value={formData.customization.storeBackgroundColor}
                        onChange={handleInputChange}
                        className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="customization.mainBackgroundGradientStartColor" className="block text-sm font-medium text-gray-700 mb-2">
                          Gradient Start Color
                        </label>
                        <input
                          type="color"
                          id="customization.mainBackgroundGradientStartColor"
                          name="customization.mainBackgroundGradientStartColor"
                          value={formData.customization.mainBackgroundGradientStartColor}
                          onChange={handleInputChange}
                          className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label htmlFor="customization.mainBackgroundGradientEndColor" className="block text-sm font-medium text-gray-700 mb-2">
                          Gradient End Color
                        </label>
                        <input
                          type="color"
                          id="customization.mainBackgroundGradientEndColor"
                          name="customization.mainBackgroundGradientEndColor"
                          value={formData.customization.mainBackgroundGradientEndColor}
                          onChange={handleInputChange}
                          className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                {/* Background Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Preview
                  </label>
                  <div 
                    className="w-full h-20 rounded-lg border border-gray-300"
                    style={{
                      background: formData.customization.backgroundType === 'gradient'
                        ? `linear-gradient(135deg, ${formData.customization.mainBackgroundGradientStartColor}, ${formData.customization.mainBackgroundGradientEndColor})`
                        : formData.customization.storeBackgroundColor
                    }}
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Currency</h3>
                <div className="max-w-xs">
                  <label htmlFor="customization.currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol
                  </label>
                  <select
                    id="customization.currencySymbol"
                    name="customization.currencySymbol"
                    value={formData.customization.currencySymbol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                  >
                    {CURRENCY_SYMBOLS.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Add Social Link
                </button>
              </div>

              {formData.socialLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No social links added yet. Click "Add Social Link" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <select
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="px-3 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Store Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Promotional Slides</h4>
                    <p className="text-sm text-gray-600">Show promotional slides on your store homepage</p>
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

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Header Background Image</h4>
                    <p className="text-sm text-gray-600">Display background image in the header section</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="displayHeaderBackgroundImage"
                      checked={formData.displayHeaderBackgroundImage}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Floating Widget</h4>
                    <p className="text-sm text-gray-600">Show floating widget button on your store</p>
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
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
