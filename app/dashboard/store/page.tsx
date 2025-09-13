'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getUserStore, updateStore, uploadStoreImage, Store } from '@/lib/store';
import Image from 'next/image';
import { 
  Save, 
  Upload, 
  Palette, 
  Settings, 
  Type,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Plus,
  Trash2
} from 'lucide-react';

const FONT_OPTIONS = [
  { value: 'Inter, system-ui, -apple-system, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Lucida Console, monospace', label: 'Lucida Console' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'Century Gothic, sans-serif', label: 'Century Gothic' }
];

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

const CURRENCY_OPTIONS = [
  { symbol: '$', name: 'USD - US Dollar' },
  { symbol: '₱', name: 'PHP - PHILIPPINE PESO' },
  { symbol: '€', name: 'EUR - Euro' },
  { symbol: '£', name: 'GBP - British Pound' },
  { symbol: '¥', name: 'JPY - Japanese Yen' },
  { symbol: '₹', name: 'INR - Indian Rupee' },
  { symbol: 'C$', name: 'CAD - Canadian Dollar' },
  { symbol: 'A$', name: 'AUD - Australian Dollar' },
  { symbol: '₩', name: 'KRW - South Korean Won' },
  { symbol: '¥', name: 'CNY - Chinese Yuan' },
  { symbol: 'CHF', name: 'CHF - Swiss Franc' },
  { symbol: 'kr', name: 'SEK - Swedish Krona' },
  { symbol: 'kr', name: 'NOK - Norwegian Krone' },
  { symbol: 'kr', name: 'DKK - Danish Krone' },
  { symbol: '₽', name: 'RUB - Russian Ruble' },
  { symbol: 'R$', name: 'BRL - Brazilian Real' },
  { symbol: '$', name: 'MXN - Mexican Peso' },
  { symbol: '₦', name: 'NGN - Nigerian Naira' },
  { symbol: 'R', name: 'ZAR - South African Rand' },
  { symbol: '₪', name: 'ILS - Israeli Shekel' },
  { symbol: '₺', name: 'TRY - Turkish Lira' }
];

const PREDEFINED_PALETTES = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e5e7eb',
      avatarBorderColor: '#ffffff',
      activeCategoryBorderColor: '#6366f1',
      headingTextColor: '#111827',
      bodyTextColor: '#374151',
      mainBackgroundGradientStartColor: '#f3f4f6',
      mainBackgroundGradientEndColor: '#f3f4f6',
      storeBackgroundColor: '#f3f4f6',
      priceFontColor: '#059669',
      slideOverlayColor: '#000000',
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#e5e7eb'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#bfdbfe',
      avatarBorderColor: '#3b82f6',
      activeCategoryBorderColor: '#1d4ed8',
      headingTextColor: '#1e3a8a',
      bodyTextColor: '#1e40af',
      mainBackgroundGradientStartColor: '#dbeafe',
      mainBackgroundGradientEndColor: '#bfdbfe',
      storeBackgroundColor: '#eff6ff',
      priceFontColor: '#1d4ed8',
      slideOverlayColor: '#1e40af',
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#bfdbfe'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#fed7aa',
      avatarBorderColor: '#f97316',
      activeCategoryBorderColor: '#ea580c',
      headingTextColor: '#9a3412',
      bodyTextColor: '#c2410c',
      mainBackgroundGradientStartColor: '#fff7ed',
      mainBackgroundGradientEndColor: '#fed7aa',
      storeBackgroundColor: '#fff7ed',
      priceFontColor: '#ea580c',
      slideOverlayColor: '#9a3412',
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#fed7aa'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#bbf7d0',
      avatarBorderColor: '#10b981',
      activeCategoryBorderColor: '#059669',
      headingTextColor: '#064e3b',
      bodyTextColor: '#065f46',
      mainBackgroundGradientStartColor: '#ecfdf5',
      mainBackgroundGradientEndColor: '#bbf7d0',
      storeBackgroundColor: '#f0fdf4',
      priceFontColor: '#059669',
      slideOverlayColor: '#064e3b',
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#bbf7d0'
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#ddd6fe',
      avatarBorderColor: '#8b5cf6',
      activeCategoryBorderColor: '#7c3aed',
      headingTextColor: '#581c87',
      bodyTextColor: '#6b21a8',
      mainBackgroundGradientStartColor: '#faf5ff',
      mainBackgroundGradientEndColor: '#ddd6fe',
      storeBackgroundColor: '#faf5ff',
      priceFontColor: '#7c3aed',
      slideOverlayColor: '#581c87',
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#ddd6fe'
    }
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#fecdd3',
      avatarBorderColor: '#f43f5e',
      activeCategoryBorderColor: '#e11d48',
      headingTextColor: '#881337',
      bodyTextColor: '#9f1239',
      mainBackgroundGradientStartColor: '#fff1f2',
      mainBackgroundGradientEndColor: '#fecdd3',
      storeBackgroundColor: '#fff1f2',
      priceFontColor: '#e11d48',
      slideOverlayColor: '#881337',
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#fecdd3'
    }
  }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedPaletteId, setSelectedPaletteId] = useState('default');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headerLayout: 'left-right' as 'left-right' | 'right-left' | 'center',
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
  
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([]);
  const [imageFiles, setImageFiles] = useState<{
    avatar?: File;
    background?: File;
    widget?: File;
    banner?: File;
  }>({});
  const [imagePreviews, setImagePreviews] = useState<{
    avatar?: string;
    background?: string;
    widget?: string;
    banner?: string;
  }>({});

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
              headingFontFamily: storeData.customization?.headingFontFamily || storeData.customization?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
              bodyFontFamily: storeData.customization?.bodyFontFamily || storeData.customization?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
              headingTextColor: storeData.customization?.headingTextColor || '#111827',
              bodyTextColor: storeData.customization?.bodyTextColor || '#374151',
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
          setSocialLinks(storeData.socialLinks || []);
          
          // Set initial palette selection
          setSelectedPaletteId('default');
          
          // Set image previews
          setImagePreviews({
            avatar: storeData.avatar || undefined,
            background: storeData.backgroundImage || undefined,
            widget: storeData.widgetImage || undefined,
            banner: storeData.bannerImage || undefined
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('customization.')) {
      const customizationKey = name.replace('customization.', '');
      setFormData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          [customizationKey]: type === 'number' ? (customizationKey === 'slideOverlayOpacity' ? parseFloat(value) : parseFloat(value)) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleImageChange = (type: 'avatar' | 'background' | 'widget' | 'banner') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFiles(prev => ({ ...prev, [type]: file }));
      setImagePreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
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

  const applyPalette = (palette: typeof PREDEFINED_PALETTES[0]) => {
    setFormData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...palette.colors
      }
    }));
    setSelectedPaletteId(palette.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !store) return;

    setSaving(true);

    try {
      // Upload images if any
      const imageUrls: Partial<{
        avatar: string;
        backgroundImage: string;
        widgetImage: string;
        bannerImage: string;
      }> = {};

      if (imageFiles.avatar) {
        imageUrls.avatar = await uploadStoreImage(user.uid, imageFiles.avatar, 'avatar');
      }
      if (imageFiles.background) {
        imageUrls.backgroundImage = await uploadStoreImage(user.uid, imageFiles.background, 'background');
      }
      if (imageFiles.widget) {
        imageUrls.widgetImage = await uploadStoreImage(user.uid, imageFiles.widget, 'avatar');
      }
      if (imageFiles.banner) {
        imageUrls.bannerImage = await uploadStoreImage(user.uid, imageFiles.banner, 'banner');
      }

      // Update store
      await updateStore(user.uid, {
        name: formData.name,
        description: formData.description,
        headerLayout: formData.headerLayout,
        displayPriceOnProducts: formData.displayPriceOnProducts,
        displayHeaderBackgroundImage: formData.displayHeaderBackgroundImage,
        slidesEnabled: formData.slidesEnabled,
        widgetEnabled: formData.widgetEnabled,
        bannerEnabled: formData.bannerEnabled,
        bannerDescription: formData.bannerDescription,
        bannerLink: formData.bannerLink,
        socialLinks: socialLinks.filter(link => link.url.trim() !== ''),
        customization: formData.customization,
        ...imageUrls
      });

      showSuccess('Store settings updated successfully!');
      
      // Reset image files
      setImageFiles({});
      
      // Refresh store data
      const updatedStore = await getUserStore(user.uid);
      if (updatedStore) {
        setStore(updatedStore);
      }
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
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600 mt-1">Customize your store appearance and settings</p>
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
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
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
                <label htmlFor="headerLayout" className="block text-sm font-medium text-gray-700 mb-2">
                  Header Layout
                </label>
                <select
                  id="headerLayout"
                  name="headerLayout"
                  value={formData.headerLayout}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="left-right">Avatar Left, Social Right</option>
                  <option value="right-left">Avatar Right, Social Left</option>
                  <option value="center">Centered Layout</option>
                </select>
              </div>

              {/* Store Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Store Avatar
                  </label>
                  {imagePreviews.avatar && (
                    <div className="mb-3">
                      <Image
                        src={imagePreviews.avatar}
                        alt="Avatar preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange('avatar')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Background Image
                  </label>
                  {imagePreviews.background && (
                    <div className="mb-3">
                      <Image
                        src={imagePreviews.background}
                        alt="Background preview"
                        width={120}
                        height={80}
                        className="w-30 h-20 rounded-lg object-cover border-2 border-gray-200"
                      />
                    </div>
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload Background</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange('background')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Links
                  </label>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Link
                  </button>
                </div>
                
                <div className="space-y-3">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex space-x-3">
                      <select
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {SOCIAL_PLATFORMS.map(platform => (
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
                        className="px-3 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="customization.currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="customization.currencySymbol"
                  name="customization.currencySymbol"
                  value={formData.customization.currencySymbol}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  {CURRENCY_OPTIONS.map(currency => (
                    <option key={`${currency.symbol}-${currency.name}`} value={currency.symbol}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Symbol displayed before product prices
                </p>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Feature Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="displayPriceOnProducts"
                      checked={formData.displayPriceOnProducts}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Display prices on products</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="displayHeaderBackgroundImage"
                      checked={formData.displayHeaderBackgroundImage}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Show header background image</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="slidesEnabled"
                      checked={formData.slidesEnabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Enable promotional slides</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="widgetEnabled"
                      checked={formData.widgetEnabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Enable floating widget</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Color Palettes Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Color Palettes</h3>
                <p className="text-sm text-gray-600 mb-4">Choose a predefined color palette or customize individual colors below</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {PREDEFINED_PALETTES.map((palette) => (
                    <div
                      key={palette.id}
                      onClick={() => applyPalette(palette)}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedPaletteId === palette.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{palette.name}</h4>
                        {selectedPaletteId === palette.id && (
                          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Color Swatches */}
                      <div className="grid grid-cols-4 gap-1">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: palette.colors.activeCategoryBorderColor }}
                          title="Active Category"
                        ></div>
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: palette.colors.priceFontColor }}
                          title="Price Color"
                        ></div>
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: palette.colors.headingTextColor }}
                          title="Heading Color"
                        ></div>
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: palette.colors.mainBackgroundGradientStartColor }}
                          title="Background"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Colors</h3>
                <p className="text-sm text-gray-600 mb-4">Fine-tune individual colors to match your brand</p>
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
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
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
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
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
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor="customization.activeCategoryBorderColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Active Category Border Color
                  </label>
                  <input
                    type="color"
                    id="customization.activeCategoryBorderColor"
                    name="customization.activeCategoryBorderColor"
                    value={formData.customization.activeCategoryBorderColor}
                    onChange={handleInputChange}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
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
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Background Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="customization.mainBackgroundGradientStartColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Background Start Color
                    </label>
                    <input
                      type="color"
                      id="customization.mainBackgroundGradientStartColor"
                      name="customization.mainBackgroundGradientStartColor"
                      value={formData.customization.mainBackgroundGradientStartColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="customization.mainBackgroundGradientEndColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Background End Color
                    </label>
                    <input
                      type="color"
                      id="customization.mainBackgroundGradientEndColor"
                      name="customization.mainBackgroundGradientEndColor"
                      value={formData.customization.mainBackgroundGradientEndColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Slide Overlay Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="customization.slideOverlayColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Color
                    </label>
                    <input
                      type="color"
                      id="customization.slideOverlayColor"
                      name="customization.slideOverlayColor"
                      value={formData.customization.slideOverlayColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="customization.slideOverlayOpacity" className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      id="customization.slideOverlayOpacity"
                      name="customization.slideOverlayOpacity"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.customization.slideOverlayOpacity}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{formData.customization.slideOverlayOpacity}</span>
                  </div>

                  <div>
                    <label htmlFor="customization.slideTitleColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Title Color
                    </label>
                    <input
                      type="color"
                      id="customization.slideTitleColor"
                      name="customization.slideTitleColor"
                      value={formData.customization.slideTitleColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Font Families</h3>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">Used for titles, headings, and category names</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">Used for descriptions, prices, and general text</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Text Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="customization.headingTextColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Heading Text Color
                    </label>
                    <input
                      type="color"
                      id="customization.headingTextColor"
                      name="customization.headingTextColor"
                      value={formData.customization.headingTextColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <p className="mt-1 text-sm text-gray-500">Color for headings and titles</p>
                  </div>

                  <div>
                    <label htmlFor="customization.bodyTextColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Body Text Color
                    </label>
                    <input
                      type="color"
                      id="customization.bodyTextColor"
                      name="customization.bodyTextColor"
                      value={formData.customization.bodyTextColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <p className="mt-1 text-sm text-gray-500">Color for descriptions and general text</p>
                  </div>
                </div>
              </div>

              {/* Typography Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Typography Preview</h3>
                <div 
                  className="p-6 border border-gray-200 rounded-lg bg-white"
                  style={{
                    fontFamily: formData.customization.bodyFontFamily,
                    color: formData.customization.bodyTextColor
                  }}
                >
                  <h1 
                    className="text-2xl font-bold mb-2"
                    style={{
                      fontFamily: formData.customization.headingFontFamily,
                      color: formData.customization.headingTextColor
                    }}
                  >
                    Sample Store Heading
                  </h1>
                  <h2 
                    className="text-lg font-semibold mb-3"
                    style={{
                      fontFamily: formData.customization.headingFontFamily,
                      color: formData.customization.headingTextColor
                    }}
                  >
                    Product Category
                  </h2>
                  <p className="text-sm mb-2">
                    This is how your store description and product descriptions will look with the selected typography settings.
                  </p>
                  <p 
                    className="text-sm font-semibold"
                    style={{ color: formData.customization.priceFontColor }}
                  >
                    {formData.customization.currencySymbol}29.99
                  </p>
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
