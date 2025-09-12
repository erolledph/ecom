'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye,
  Palette,
  Type,
  DollarSign,
  Image as ImageIcon
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
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Georgia', value: 'Georgia, serif' }
];

const COLOR_PALETTES = [
  {
    name: 'Ocean Breeze',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e0f2fe',
      avatarBorderColor: '#0ea5e9',
      activeCategoryBorderColor: '#0284c7',
      mainBackgroundGradientStartColor: '#0ea5e9',
      mainBackgroundGradientEndColor: '#0284c7',
      storeBackgroundColor: '#f0f9ff',
      priceFontColor: '#0369a1',
      slideOverlayColor: '#0c4a6e',
      slideOverlayOpacity: 0.5,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#e0f2fe'
    }
  },
  {
    name: 'Sunset Glow',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#fed7aa',
      avatarBorderColor: '#f97316',
      activeCategoryBorderColor: '#ea580c',
      mainBackgroundGradientStartColor: '#f97316',
      mainBackgroundGradientEndColor: '#dc2626',
      storeBackgroundColor: '#fff7ed',
      priceFontColor: '#c2410c',
      slideOverlayColor: '#7c2d12',
      slideOverlayOpacity: 0.4,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#fed7aa'
    }
  },
  {
    name: 'Forest Green',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#dcfce7',
      avatarBorderColor: '#22c55e',
      activeCategoryBorderColor: '#16a34a',
      mainBackgroundGradientStartColor: '#22c55e',
      mainBackgroundGradientEndColor: '#15803d',
      storeBackgroundColor: '#f0fdf4',
      priceFontColor: '#166534',
      slideOverlayColor: '#14532d',
      slideOverlayOpacity: 0.5,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#dcfce7'
    }
  },
  {
    name: 'Royal Purple',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e9d5ff',
      avatarBorderColor: '#a855f7',
      activeCategoryBorderColor: '#9333ea',
      mainBackgroundGradientStartColor: '#a855f7',
      mainBackgroundGradientEndColor: '#7c3aed',
      storeBackgroundColor: '#faf5ff',
      priceFontColor: '#7c2d92',
      slideOverlayColor: '#581c87',
      slideOverlayOpacity: 0.5,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#e9d5ff'
    }
  },
  {
    name: 'Rose Gold',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#fce7f3',
      avatarBorderColor: '#ec4899',
      activeCategoryBorderColor: '#db2777',
      mainBackgroundGradientStartColor: '#ec4899',
      mainBackgroundGradientEndColor: '#be185d',
      storeBackgroundColor: '#fdf2f8',
      priceFontColor: '#be185d',
      slideOverlayColor: '#831843',
      slideOverlayOpacity: 0.4,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#fce7f3'
    }
  },
  {
    name: 'Midnight Dark',
    colors: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#d1d5db',
      avatarBorderColor: '#6b7280',
      activeCategoryBorderColor: '#4b5563',
      mainBackgroundGradientStartColor: '#374151',
      mainBackgroundGradientEndColor: '#1f2937',
      storeBackgroundColor: '#111827',
      priceFontColor: '#10b981',
      slideOverlayColor: '#000000',
      slideOverlayOpacity: 0.6,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#d1d5db'
    }
  }
];

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    isActive: true,
    headerLayout: 'left-right' as 'left-right' | 'right-left' | 'center',
    socialLinks: [] as Array<{ platform: string; url: string; }>,
    customization: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e5e7eb',
      avatarBorderColor: '#ffffff',
      activeCategoryBorderColor: '#6366f1',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      mainBackgroundGradientStartColor: '',
      mainBackgroundGradientEndColor: '',
      storeBackgroundColor: '#f3f4f6',
      currencySymbol: '$',
      priceFontColor: '#059669',
      slideOverlayColor: '#000000',
      slideOverlayOpacity: 0.4,
      slideTitleColor: '#ffffff',
      slideDescriptionColor: '#e5e7eb'
    }
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [widgetFile, setWidgetFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [widgetPreview, setWidgetPreview] = useState('');
  const [widgetLink, setWidgetLink] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

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
            isActive: storeData.isActive,
            headerLayout: storeData.headerLayout || 'left-right',
            socialLinks: Array.isArray(storeData.socialLinks) ? storeData.socialLinks : [],
            customization: {
              storeNameFontColor: storeData.customization?.storeNameFontColor || '#ffffff',
              storeBioFontColor: storeData.customization?.storeBioFontColor || '#e5e7eb',
              avatarBorderColor: storeData.customization?.avatarBorderColor || '#ffffff',
              activeCategoryBorderColor: storeData.customization?.activeCategoryBorderColor || '#6366f1',
              fontFamily: storeData.customization?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
              mainBackgroundGradientStartColor: storeData.customization?.mainBackgroundGradientStartColor || '',
              mainBackgroundGradientEndColor: storeData.customization?.mainBackgroundGradientEndColor || '',
              storeBackgroundColor: storeData.customization?.storeBackgroundColor || '#f3f4f6',
              currencySymbol: storeData.customization?.currencySymbol || '$',
              priceFontColor: storeData.customization?.priceFontColor || '#059669',
              slideOverlayColor: storeData.customization?.slideOverlayColor || '#000000',
              slideOverlayOpacity: storeData.customization?.slideOverlayOpacity || 0.4,
              slideTitleColor: storeData.customization?.slideTitleColor || '#ffffff',
              slideDescriptionColor: storeData.customization?.slideDescriptionColor || '#e5e7eb'
            }
          });
          setAvatarPreview(storeData.avatar);
          setBackgroundPreview(storeData.backgroundImage);
          setWidgetPreview(storeData.widgetImage || '');
          setWidgetLink(storeData.widgetLink || '');
        }
      } catch (error) {
        console.error('Error fetching store:', error);
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

  const checkSlug = async (slug: string) => {
    if (!slug || slug === store?.slug) {
      setSlugError('');
      return;
    }

    setIsCheckingSlug(true);
    try {
      const isAvailable = await checkSlugAvailability(slug, store?.id);
      if (!isAvailable) {
        setSlugError('This URL is already taken. Please choose a different one.');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugError('Error checking URL availability');
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    setFormData(prev => ({ ...prev, slug }));
    
    // Debounce slug checking
    const timeoutId = setTimeout(() => checkSlug(slug), 500);
    return () => clearTimeout(timeoutId);
  };

  const handleImageChange = (type: 'avatar' | 'background' | 'widget') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else if (type === 'background') {
        setBackgroundFile(file);
        setBackgroundPreview(URL.createObjectURL(file));
      } else if (type === 'widget') {
        setWidgetFile(file);
        setWidgetPreview(URL.createObjectURL(file));
      }
    }
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'instagram', url: '' }]
    }));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const applySuggestedPalette = (palette: typeof COLOR_PALETTES[0]) => {
    setFormData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...palette.colors
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !store) return;

    if (slugError) {
      alert('Please fix the URL error before saving.');
      return;
    }

    setSaving(true);

    try {
      let avatarUrl = store.avatar;
      let backgroundUrl = store.backgroundImage;
      let widgetImageUrl = store.widgetImage || '';

      // Upload new images if selected
      if (avatarFile) {
        avatarUrl = await uploadStoreImage(user.uid, avatarFile, 'avatar');
      }
      if (backgroundFile) {
        backgroundUrl = await uploadStoreImage(user.uid, backgroundFile, 'background');
      }
      if (widgetFile) {
        widgetImageUrl = await uploadWidgetImage(user.uid, widgetFile);
      }

      // Filter out empty social links
      const validSocialLinks = formData.socialLinks.filter(link => link.url.trim() !== '');

      const updateData = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        isActive: formData.isActive,
        headerLayout: formData.headerLayout,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        widgetImage: widgetImageUrl,
        widgetLink: widgetLink,
        socialLinks: validSocialLinks,
        customization: formData.customization
      };

      await updateStore(store.id, updateData);
      alert('Store settings updated successfully!');
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Failed to update store settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
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

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', name: 'Basic Info', icon: Save },
              { id: 'appearance', name: 'Appearance', icon: Palette },
              { id: 'typography', name: 'Typography', icon: Type },
              { id: 'pricing', name: 'Pricing', icon: DollarSign },
              { id: 'media', name: 'Media', icon: ImageIcon }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
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
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900 bg-white"
                  placeholder="Welcome to my store! Discover amazing products..."
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Store URL *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    yourdomain.com/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white ${
                      slugError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="my-store"
                  />
                </div>
                {isCheckingSlug && (
                  <p className="mt-1 text-sm text-gray-500">Checking availability...</p>
                )}
                {slugError && (
                  <p className="mt-1 text-sm text-red-600">{slugError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Only lowercase letters and numbers allowed. This will be your store's web address.
                </p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white"
                >
                  <option value="left-right">Avatar Left, Social Right</option>
                  <option value="right-left">Avatar Right, Social Left</option>
                  <option value="center">Centered Layout</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Links
                  </label>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="flex items-center px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Link
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-3">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
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
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Store is active (visible to visitors)
                </label>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Suggested Color Palettes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Suggested Color Palettes
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Click on any palette below to instantly apply a professionally designed color scheme to your store.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {COLOR_PALETTES.map((palette, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applySuggestedPalette(palette)}
                      className="group relative p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900 mb-3">{palette.name}</h4>
                        <div className="flex justify-center space-x-1 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: palette.colors.mainBackgroundGradientStartColor }}
                            title="Primary Color"
                          />
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: palette.colors.mainBackgroundGradientEndColor }}
                            title="Secondary Color"
                          />
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: palette.colors.activeCategoryBorderColor }}
                            title="Accent Color"
                          />
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: palette.colors.priceFontColor }}
                            title="Price Color"
                          />
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-primary-600 transition-colors">
                          Click to apply
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Colors</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Fine-tune individual colors or start from scratch with your own color scheme.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name Color
                  </label>
                  <input
                    type="color"
                    name="customization.storeNameFontColor"
                    value={formData.customization.storeNameFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
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
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Border Color
                  </label>
                  <input
                    type="color"
                    name="customization.avatarBorderColor"
                    value={formData.customization.avatarBorderColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Category Border
                  </label>
                  <input
                    type="color"
                    name="customization.activeCategoryBorderColor"
                    value={formData.customization.activeCategoryBorderColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Style
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Solid Background Color</label>
                    <input
                      type="color"
                      name="customization.storeBackgroundColor"
                      value={formData.customization.storeBackgroundColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="text-center text-gray-500 text-sm flex items-center justify-center">
                    OR
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-xs text-gray-600 mb-2">Gradient Background (overrides solid color)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Color</label>
                      <input
                        type="color"
                        name="customization.mainBackgroundGradientStartColor"
                        value={formData.customization.mainBackgroundGradientStartColor}
                        onChange={handleInputChange}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Color</label>
                      <input
                        type="color"
                        name="customization.mainBackgroundGradientEndColor"
                        value={formData.customization.mainBackgroundGradientEndColor}
                        onChange={handleInputChange}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Slide Overlay Settings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Overlay Color</label>
                    <input
                      type="color"
                      name="customization.slideOverlayColor"
                      value={formData.customization.slideOverlayColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Overlay Opacity</label>
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
                    <span className="text-xs text-gray-500">{Math.round(formData.customization.slideOverlayOpacity * 100)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Slide Title Color</label>
                    <input
                      type="color"
                      name="customization.slideTitleColor"
                      value={formData.customization.slideTitleColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Slide Description Color</label>
                    <input
                      type="color"
                      name="customization.slideDescriptionColor"
                      value={formData.customization.slideDescriptionColor}
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
                <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  id="fontFamily"
                  name="customization.fontFamily"
                  value={formData.customization.fontFamily}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white"
                >
                  {FONT_FAMILIES.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    id="currencySymbol"
                    name="customization.currencySymbol"
                    value={formData.customization.currencySymbol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white"
                    placeholder="$"
                    maxLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Color
                  </label>
                  <input
                    type="color"
                    name="customization.priceFontColor"
                    value={formData.customization.priceFontColor}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
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
                    onChange={handleImageChange('avatar')}
                    className="hidden"
                  />
                </label>
              </div>

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
                      className="w-full max-w-sm h-32 rounded-lg object-cover border-2 border-gray-200"
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
                    onChange={handleImageChange('background')}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Floating Widget
                </label>
                <div className="space-y-4">
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
                      onChange={handleImageChange('widget')}
                      className="hidden"
                    />
                  </label>
                  
                  <div>
                    <label htmlFor="widgetLink" className="block text-sm font-medium text-gray-700 mb-2">
                      Widget Link (Optional)
                    </label>
                    <input
                      type="url"
                      id="widgetLink"
                      value={widgetLink}
                      onChange={(e) => setWidgetLink(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white"
                      placeholder="https://example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      When clicked, the widget will open this link. Leave empty for a simple animation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
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
        </form>
      </div>
    </div>
  );
}