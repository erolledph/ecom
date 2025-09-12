'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  getUserStore, 
  updateStore, 
  uploadStoreImage, 
  uploadWidgetImage,
  checkSlugAvailability,
  Store 
} from '@/lib/store';
import Image from 'next/image';
import { 
  Save, 
  Upload, 
  Eye, 
  Palette, 
  Settings, 
  Globe,
  DollarSign,
  Package,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  ArrowLeft
} from 'lucide-react';

const CURRENCY_OPTIONS = [
  { value: '$', label: '$ (USD, CAD, AUD)' },
  { value: '€', label: '€ (Euro)' },
  { value: '£', label: '£ (British Pound)' },
  { value: '¥', label: '¥ (Japanese Yen)' },
  { value: '₹', label: '₹ (Indian Rupee)' },
  { value: '₽', label: '₽ (Russian Ruble)' },
  { value: '₩', label: '₩ (Korean Won)' },
  { value: '₺', label: '₺ (Turkish Lira)' },
  { value: '₱', label: '₱ (Philippine Peso)' },
  { value: 'Mex$', label: 'Mex$ (Mexican Peso)' },
  { value: 'R$', label: 'R$ (Brazilian Real)' },
  { value: 'SFr', label: 'SFr (Swiss Franc)' },
  { value: 'kr', label: 'kr (Scandinavian)' },
  { value: 'zł', label: 'zł (Polish Złoty)' },
  { value: '฿', label: '฿ (Thai Baht)' },
  { value: '₫', label: '₫ (Vietnamese Đồng)' },
  { value: '₦', label: '₦ (Nigerian Naira)' },
  { value: 'R', label: 'R (South African Rand)' },
  { value: 'د.إ', label: 'د.إ (UAE Dirham)' },
  { value: '﷼', label: '﷼ (Saudi Riyal)' }
];

const FONT_FAMILIES = [
  { value: 'Inter, system-ui, -apple-system, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' }
];

const HEADER_LAYOUTS = [
  { value: 'left-right', label: 'Avatar Left, Social Right' },
  { value: 'right-left', label: 'Avatar Right, Social Left' },
  { value: 'center', label: 'Centered Layout' }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    headerLayout: 'left-right' as 'left-right' | 'right-left' | 'center',
    socialLinks: [] as Array<{ platform: string; url: string; }>,
    displayPriceOnProducts: true,
    displayHeaderBackgroundImage: true,
    slidesEnabled: true,
    widgetEnabled: true,
    bannerEnabled: true,
    bannerDescription: '',
    bannerLink: '',
    customization: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e5e7eb',
      avatarBorderColor: '#ffffff',
      activeCategoryBorderColor: '#6366f1',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
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
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [widgetFile, setWidgetFile] = useState<File | null>(null);
  
  // Preview states
  const [avatarPreview, setAvatarPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [widgetPreview, setWidgetPreview] = useState('');
  
  // Social link state
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

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
            slug: storeData.slug,
            headerLayout: storeData.headerLayout || 'left-right',
            socialLinks: storeData.socialLinks || [],
            displayPriceOnProducts: storeData.displayPriceOnProducts !== false,
            displayHeaderBackgroundImage: storeData.displayHeaderBackgroundImage !== false,
            slidesEnabled: storeData.slidesEnabled !== false,
            widgetEnabled: storeData.widgetEnabled !== false,
            bannerEnabled: storeData.bannerEnabled !== false,
            bannerDescription: storeData.bannerDescription || '',
            bannerLink: storeData.bannerLink || '',
            customization: {
              storeNameFontColor: storeData.customization?.storeNameFontColor || '#ffffff',
              storeBioFontColor: storeData.customization?.storeBioFontColor || '#e5e7eb',
              avatarBorderColor: storeData.customization?.avatarBorderColor || '#ffffff',
              activeCategoryBorderColor: storeData.customization?.activeCategoryBorderColor || '#6366f1',
              fontFamily: storeData.customization?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
              mainBackgroundGradientStartColor: storeData.customization?.mainBackgroundGradientStartColor || '#f3f4f6',
              mainBackgroundGradientEndColor: storeData.customization?.mainBackgroundGradientEndColor || '#f3f4f6',
              storeBackgroundColor: storeData.customization?.storeBackgroundColor || '#f3f4f6',
              currencySymbol: storeData.customization?.currencySymbol || '$',
              priceFontColor: storeData.customization?.priceFontColor || '#059669',
              slideOverlayColor: storeData.customization?.slideOverlayColor || '#000000',
              slideOverlayOpacity: storeData.customization?.slideOverlayOpacity || 0.4,
              slideTitleColor: storeData.customization?.slideTitleColor || '#ffffff',
              slideDescriptionColor: storeData.customization?.slideDescriptionColor || '#e5e7eb'
            }
          });
          
          // Set image previews
          setAvatarPreview(storeData.avatar || '');
          setBackgroundPreview(storeData.backgroundImage || '');
          setBannerPreview(storeData.bannerImage || '');
          setWidgetPreview(storeData.widgetImage || '');
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

  const handleImageChange = (type: 'avatar' | 'background' | 'banner' | 'widget', file: File) => {
    const previewUrl = URL.createObjectURL(file);
    
    switch (type) {
      case 'avatar':
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
        break;
      case 'background':
        setBackgroundFile(file);
        setBackgroundPreview(previewUrl);
        break;
      case 'banner':
        setBannerFile(file);
        setBannerPreview(previewUrl);
        break;
      case 'widget':
        setWidgetFile(file);
        setWidgetPreview(previewUrl);
        break;
    }
  };

  const addSocialLink = () => {
    if (newSocialPlatform && newSocialUrl) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { platform: newSocialPlatform, url: newSocialUrl }]
      }));
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
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
    showWarning('Saving store settings...');

    try {
      let updates: Partial<Store> = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        headerLayout: formData.headerLayout,
        socialLinks: formData.socialLinks,
        displayPriceOnProducts: formData.displayPriceOnProducts,
        displayHeaderBackgroundImage: formData.displayHeaderBackgroundImage,
        slidesEnabled: formData.slidesEnabled,
        widgetEnabled: formData.widgetEnabled,
        bannerEnabled: formData.bannerEnabled,
        bannerDescription: formData.bannerDescription,
        bannerLink: formData.bannerLink,
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

      if (bannerFile) {
        const bannerUrl = await uploadStoreImage(user.uid, bannerFile, 'banner');
        updates.bannerImage = bannerUrl;
      }

      if (widgetFile) {
        const widgetUrl = await uploadWidgetImage(user.uid, widgetFile);
        updates.widgetImage = widgetUrl;
      }

      await updateStore(user.uid, updates);
      showSuccess('Store settings saved successfully!');
    } catch (error) {
      console.error('Error saving store:', error);
      showError('Failed to save store settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'features', label: 'Features', icon: Globe }
  ];

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

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600 mt-1">Customize your store appearance and settings</p>
          </div>
          
          {store && (
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`/${store.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Store
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Desktop Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile Tab Selector */}
        <div className="block md:hidden border-b border-gray-200">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-4 text-sm font-medium text-gray-700 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex border-b border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="My Awesome Store"
                  />
                </div>
                {/* store url are hidden so user cant update it */}
             <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store URL *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      yourdomain.com/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      disabled
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="my-store"
                   />
                  </div>
                </div>
               
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Welcome to my awesome store! Discover unique products curated just for you."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Layout
                </label>
                <select
                  name="headerLayout"
                  value={formData.headerLayout}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  {HEADER_LAYOUTS.map((layout) => (
                    <option key={layout.value} value={layout.value}>
                      {layout.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Social Media Links
                </label>
                
                {/* Existing Social Links */}
                <div className="space-y-3 mb-4">
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {link.platform}
                        </span>
                        <p className="text-sm text-gray-500 truncate">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Social Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    placeholder="Platform (e.g., instagram)"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                  />
                  <input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Add Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    name="customization.fontFamily"
                    value={formData.customization.fontFamily}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Background Color
                  </label>
                  <input
                    type="color"
                    name="customization.storeBackgroundColor"
                    value={formData.customization.storeBackgroundColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name Color
                  </label>
                  <input
                    type="color"
                    name="customization.storeNameFontColor"
                    value={formData.customization.storeNameFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Bio Color
                  </label>
                  <input
                    type="color"
                    name="customization.storeBioFontColor"
                    value={formData.customization.storeBioFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Border Color
                  </label>
                  <input
                    type="color"
                    name="customization.avatarBorderColor"
                    value={formData.customization.avatarBorderColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Category Border Color
                  </label>
                  <input
                    type="color"
                    name="customization.activeCategoryBorderColor"
                    value={formData.customization.activeCategoryBorderColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Gradient Background */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Background Gradient</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient Start Color
                    </label>
                    <input
                      type="color"
                      name="customization.mainBackgroundGradientStartColor"
                      value={formData.customization.mainBackgroundGradientStartColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient End Color
                    </label>
                    <input
                      type="color"
                      name="customization.mainBackgroundGradientEndColor"
                      value={formData.customization.mainBackgroundGradientEndColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Slide Customization */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Slide Customization</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Overlay Color
                    </label>
                    <input
                      type="color"
                      name="customization.slideOverlayColor"
                      value={formData.customization.slideOverlayColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Overlay Opacity
                    </label>
                    <input
                      type="range"
                      name="customization.slideOverlayOpacity"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.customization.slideOverlayOpacity}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">
                      {Math.round(formData.customization.slideOverlayOpacity * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Title Color
                    </label>
                    <input
                      type="color"
                      name="customization.slideTitleColor"
                      value={formData.customization.slideTitleColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Description Color
                    </label>
                    <input
                      type="color"
                      name="customization.slideDescriptionColor"
                      value={formData.customization.slideDescriptionColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Display Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="displayPriceOnProducts"
                        name="displayPriceOnProducts"
                        type="checkbox"
                        checked={formData.displayPriceOnProducts}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="displayPriceOnProducts" className="font-medium text-gray-700">
                        Show product prices on store
                      </label>
                      <p className="text-gray-500">
                        When disabled, product prices will be hidden from your store visitors.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Font Color
                    </label>
                    <input
                      type="color"
                      name="customization.priceFontColor"
                      value={formData.customization.priceFontColor}
                      onChange={handleInputChange}
                      className="w-full md:w-48 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Currency Tab */}
          {activeTab === 'currency' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Settings</h3>
                
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol
                  </label>
                  <select
                    name="customization.currencySymbol"
                    value={formData.customization.currencySymbol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    {CURRENCY_OPTIONS.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    This symbol will be displayed before product prices in your store.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-8">
              {/* Avatar */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Store Avatar</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {avatarPreview && (
                    <div className="flex-shrink-0">
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {avatarFile ? 'Change Avatar' : 'Upload Avatar'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageChange('avatar', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Background Image */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Header Background Image</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="displayHeaderBackgroundImage"
                        name="displayHeaderBackgroundImage"
                        type="checkbox"
                        checked={formData.displayHeaderBackgroundImage}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="displayHeaderBackgroundImage" className="font-medium text-gray-700">
                        Display header background image
                      </label>
                      <p className="text-gray-500">
                        When enabled, the background image will be shown in the store header.
                      </p>
                    </div>
                  </div>

                  {backgroundPreview && (
                    <div className="mt-4">
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
                      onChange={(e) => e.target.files?.[0] && handleImageChange('background', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pop-up Banner</h3>
                <div className="space-y-4">
                  {bannerPreview && (
                    <div>
                      <Image
                        src={bannerPreview}
                        alt="Banner preview"
                        width={400}
                        height={200}
                        className="w-full max-w-md h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                  
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {bannerFile ? 'Change Banner' : 'Upload Banner Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageChange('banner', e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Description
                    </label>
                    <textarea
                      name="bannerDescription"
                      rows={3}
                      value={formData.bannerDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Describe your banner or promotion..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="bannerLink"
                      value={formData.bannerLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="https://example.com/promotion"
                    />
                  </div>
                </div>
              </div>

              {/* Widget Image */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Floating Widget</h3>
                <div className="space-y-4">
                  {widgetPreview && (
                    <div>
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
                      onChange={(e) => e.target.files?.[0] && handleImageChange('widget', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Store Features</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="slidesEnabled"
                        name="slidesEnabled"
                        type="checkbox"
                        checked={formData.slidesEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="slidesEnabled" className="font-medium text-gray-700">
                        Enable promotional slides
                      </label>
                      <p className="text-gray-500">
                        Show promotional slides on your store homepage to highlight special offers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="widgetEnabled"
                        name="widgetEnabled"
                        type="checkbox"
                        checked={formData.widgetEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="widgetEnabled" className="font-medium text-gray-700">
                        Enable floating widget
                      </label>
                      <p className="text-gray-500">
                        Display a floating widget button on your store for quick access to promotions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="bannerEnabled"
                        name="bannerEnabled"
                        type="checkbox"
                        checked={formData.bannerEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="bannerEnabled" className="font-medium text-gray-700">
                        Enable pop-up banner
                      </label>
                      <p className="text-gray-500">
                        Show a pop-up banner to visitors with special announcements or promotions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
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