'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStore, updateStore, uploadStoreImage, uploadWidgetImage, checkSlugAvailability, Store } from '@/lib/store';
import { 
  Save, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Store as StoreIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Facebook,
  Copy,
  Zap
} from 'lucide-react';

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    widgetLink: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      facebook: ''
    },
    customization: {
      storeNameFontColor: '#ffffff',
      storeBioFontColor: '#e5e7eb',
      avatarBorderColor: '#ffffff',
      activeCategoryBorderColor: '#6366f1',
      fontFamily: 'Inter',
      headerBackgroundColor: '',
      currencySymbol: '$',
      slideOverlayColor: '#000000',
      slideOverlayOpacity: 0.5
    }
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [widgetFile, setWidgetFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [widgetPreview, setWidgetPreview] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-clear success messages after 3 seconds
  useEffect(() => {
    if (message && message.includes('success')) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchStore = async () => {
      if (!user) return;
      
      try {
        console.log('Fetching store for user:', user.uid);
        const storeData = await getUserStore(user.uid);
        console.log('Store data received:', storeData);
        if (storeData) {
          setStore(storeData);
          setFormData({
            name: storeData.name,
            description: storeData.description,
            slug: storeData.slug,
            widgetLink: storeData.widgetLink || '',
            socialLinks: storeData.socialLinks,
            customization: {
              storeNameFontColor: storeData.customization?.storeNameFontColor || '#ffffff',
              storeBioFontColor: storeData.customization?.storeBioFontColor || '#e5e7eb',
              avatarBorderColor: storeData.customization?.avatarBorderColor || '#ffffff',
              activeCategoryBorderColor: storeData.customization?.activeCategoryBorderColor || '#6366f1',
              fontFamily: storeData.customization?.fontFamily || 'Inter',
              headerBackgroundColor: storeData.customization?.headerBackgroundColor || '',
              currencySymbol: storeData.customization?.currencySymbol || '$',
              slideOverlayColor: storeData.customization?.slideOverlayColor || '#000000',
              slideOverlayOpacity: storeData.customization?.slideOverlayOpacity || 0.5
            }
          });
          setAvatarPreview(storeData.avatar);
          setBackgroundPreview(storeData.backgroundImage);
          setWidgetPreview(storeData.widgetImage || '');
        } else {
          console.log('No store found for user:', user.uid);
          setMessage('No store found. Please contact support if this issue persists.');
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        setMessage('Error loading store data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else if (name.startsWith('customization.')) {
      const customKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          [customKey]: customKey === 'slideOverlayOpacity' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'background' | 'widget') => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  };

  const copyStoreUrl = async () => {
    if (!store) return;
    
    const storeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${store.slug}`;
    
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = storeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const validateSlug = (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !store) return;

    // Validate slug
    if (!validateSlug(formData.slug)) {
      setMessage('Slug must be 3-20 characters long and contain only lowercase letters and numbers.');
      return;
    }

    // Check slug availability
    if (formData.slug !== store.slug) {
      const isAvailable = await checkSlugAvailability(formData.slug, store.id);
      if (!isAvailable) {
        setMessage('This slug is already taken. Please choose another one.');
        return;
      }
    }

    setSaving(true);
    setMessage('');

    try {
      let avatarUrl = store.avatar;
      let backgroundUrl = store.backgroundImage;
      let widgetUrl = store.widgetImage || '';

      // Upload new images if selected
      if (avatarFile) {
        avatarUrl = await uploadStoreImage(user.uid, avatarFile, 'avatar');
      }
      
      if (backgroundFile) {
        backgroundUrl = await uploadStoreImage(user.uid, backgroundFile, 'background');
      }
      
      if (widgetFile) {
        widgetUrl = await uploadWidgetImage(user.uid, widgetFile);
      }

      // Update store
      await updateStore(user.uid, {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        widgetImage: widgetUrl,
        widgetLink: formData.widgetLink,
        socialLinks: formData.socialLinks,
        customization: formData.customization
      });

      setMessage('Store settings updated successfully!');
      
      // Reset file states after successful save
      setAvatarFile(null);
      setBackgroundFile(null);
      setWidgetFile(null);
      
      // Update local store state
      setStore(prev => prev ? {
        ...prev,
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        widgetImage: widgetUrl,
        widgetLink: formData.widgetLink,
        socialLinks: formData.socialLinks,
        customization: formData.customization
      } : null);

    } catch (error) {
      console.error('Error updating store:', error);
      setMessage('Failed to update store settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
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
          <div className="p-2 bg-primary-100 rounded-lg mr-3">
            <StoreIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <StoreIcon className="w-5 h-5 mr-2 text-primary-600" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Store URL (Slug) *
                {store && (
                  <button
                    type="button"
                    onClick={copyStoreUrl}
                    className="ml-2 inline-flex items-center text-xs text-primary-600 hover:text-primary-700 transition-colors"
                    title="Copy store URL"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copySuccess ? 'Copied!' : 'Copy URL'}
                  </button>
                )}
              </label>
              <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                <span className="inline-flex items-center px-3 rounded-l-lg border-r border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  {typeof window !== "undefined" ? window.location.origin.replace(/^https?:\/\//, '') : ""}/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 rounded-r-lg focus:outline-none text-gray-900"
                  placeholder="mystore123"
                  pattern="[a-z0-9]{3,20}"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                3-20 characters, lowercase letters and numbers only
              </p>
            </div>
          </div>

          <div className="mt-6">
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
              placeholder="Welcome to my affiliate store! Discover amazing products and deals curated just for you."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
            Store Images
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Store Avatar
              </label>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <Image
                    src={avatarPreview || 'https://placehold.co/300x300/e5e7eb/9ca3af?text=No+Avatar'}
                    alt="Store Avatar"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'avatar')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Background */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Image
              </label>
              <div className="space-y-4">
                <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {backgroundPreview ? (
                    <Image
                      src={backgroundPreview}
                      alt="Background"
                      width={400}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Background Image</span>
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Upload Background</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'background')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-primary-600" />
            Social Media Links
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="w-4 h-4 text-pink-500 inline mr-2" />
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="https://instagram.com/yourstore"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                <Twitter className="w-4 h-4 text-blue-400 inline mr-2" />
                Twitter
              </label>
              <input
                type="url"
                id="twitter"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="https://twitter.com/yourstore"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="w-4 h-4 text-blue-600 inline mr-2" />
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                name="socialLinks.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="https://facebook.com/yourstore"
              />
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-5 h-5 mr-2 text-primary-600">🎨</span>
            Customization
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Font Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Font Colors</h3>
              
              <div>
                <label htmlFor="storeNameFontColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="storeNameFontColor"
                    name="customization.storeNameFontColor"
                    value={formData.customization.storeNameFontColor}
                    onChange={handleInputChange}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.storeNameFontColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, storeNameFontColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="storeBioFontColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Bio Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="storeBioFontColor"
                    name="customization.storeBioFontColor"
                    value={formData.customization.storeBioFontColor}
                    onChange={handleInputChange}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.storeBioFontColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, storeBioFontColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>
            </div>

            {/* Border Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Border Colors</h3>
              
              <div>
                <label htmlFor="avatarBorderColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar Border Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="avatarBorderColor"
                    name="customization.avatarBorderColor"
                    value={formData.customization.avatarBorderColor}
                    onChange={handleInputChange}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.avatarBorderColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, avatarBorderColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="activeCategoryBorderColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Active Category Border Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="activeCategoryBorderColor"
                    name="customization.activeCategoryBorderColor"
                    value={formData.customization.activeCategoryBorderColor}
                    onChange={handleInputChange}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.activeCategoryBorderColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, activeCategoryBorderColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="#6366f1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Font Family */}
            <div>
              <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                id="fontFamily"
                name="customization.fontFamily"
                value={formData.customization.fontFamily}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            {/* Header Background Color */}
            <div>
              <label htmlFor="headerBackgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                Header Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="headerBackgroundColor"
                  name="customization.headerBackgroundColor"
                  value={formData.customization.headerBackgroundColor || '#000000'}
                  onChange={handleInputChange}
                  className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.customization.headerBackgroundColor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customization: { ...prev.customization, headerBackgroundColor: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="Leave empty for image background"
                />
              </div>
            </div>

            {/* Currency Symbol */}
            <div>
              <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                Currency Symbol
              </label>
              <select
                id="currencySymbol"
                name="customization.currencySymbol"
                value={formData.customization.currencySymbol}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
              >
                <option value="$">$ - US Dollar</option>
                <option value="€">€ - Euro</option>
                <option value="£">£ - British Pound</option>
                <option value="¥">¥ - Japanese Yen</option>
                <option value="₹">₹ - Indian Rupee</option>
                <option value="₽">₽ - Russian Ruble</option>
                <option value="₩">₩ - South Korean Won</option>
                <option value="₪">₪ - Israeli Shekel</option>
                <option value="₦">₦ - Nigerian Naira</option>
                <option value="₨">₨ - Pakistani Rupee</option>
                <option value="₱">₱ - Philippine Peso</option>
                <option value="₫">₫ - Vietnamese Dong</option>
                <option value="₡">₡ - Costa Rican Colón</option>
                <option value="₲">₲ - Paraguayan Guaraní</option>
                <option value="₴">₴ - Ukrainian Hryvnia</option>
                <option value="₵">₵ - Ghanaian Cedi</option>
                <option value="₶">₶ - Livre Tournois</option>
                <option value="₷">₷ - Spesmilo</option>
                <option value="₸">₸ - Kazakhstani Tenge</option>
                <option value="₹">₹ - Indian Rupee</option>
                <option value="₺">₺ - Turkish Lira</option>
                <option value="₻">₻ - Nordic Mark</option>
                <option value="₼">₼ - Azerbaijani Manat</option>
                <option value="₽">₽ - Russian Ruble</option>
                <option value="₾">₾ - Georgian Lari</option>
                <option value="₿">₿ - Bitcoin</option>
                <option value="﷼">﷼ - Saudi Riyal</option>
                <option value="¢">¢ - Cent</option>
                <option value="¤">¤ - Generic Currency</option>
                <option value="؋">؋ - Afghan Afghani</option>
                <option value="₳">₳ - Austral</option>
                <option value="₢">₢ - Cruzeiro</option>
                <option value="₣">₣ - French Franc</option>
                <option value="₤">₤ - Lira</option>
                <option value="₥">₥ - Mill</option>
                <option value="₦">₦ - Naira</option>
                <option value="₧">₧ - Peseta</option>
                <option value="₨">₨ - Rupee</option>
                <option value="₩">₩ - Won</option>
                <option value="₪">₪ - New Sheqel</option>
                <option value="₫">₫ - Dong</option>
                <option value="€">€ - Euro</option>
                <option value="₭">₭ - Kip</option>
                <option value="₮">₮ - Tugrik</option>
                <option value="₯">₯ - Drachma</option>
                <option value="₰">₰ - Pfennig</option>
                <option value="₱">₱ - Peso</option>
                <option value="₲">₲ - Guarani</option>
                <option value="₳">₳ - Austral</option>
                <option value="₴">₴ - Hryvnia</option>
                <option value="₵">₵ - Cedi</option>
                <option value="₶">₶ - Livre Tournois</option>
                <option value="₷">₷ - Spesmilo</option>
                <option value="₸">₸ - Tenge</option>
                <option value="₹">₹ - Indian Rupee</option>
                <option value="₺">₺ - Lira</option>
                <option value="₻">₻ - Nordic Mark</option>
                <option value="₼">₼ - Manat</option>
                <option value="₽">₽ - Ruble</option>
                <option value="₾">₾ - Lari</option>
                <option value="₿">₿ - Bitcoin</option>
              </select>
            </div>
          </div>

          {/* Slide Customization */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Slide Customization</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="slideOverlayColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Overlay Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="slideOverlayColor"
                    name="customization.slideOverlayColor"
                    value={formData.customization.slideOverlayColor}
                    onChange={handleInputChange}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.slideOverlayColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, slideOverlayColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="slideOverlayOpacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Overlay Opacity
                </label>
                <input
                  type="number"
                  id="slideOverlayOpacity"
                  name="customization.slideOverlayOpacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.customization.slideOverlayOpacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                />
                <p className="mt-1 text-xs text-gray-500">
                  0 = transparent, 1 = opaque
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Widget Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary-600" />
            Floating Widget Settings
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Widget Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Widget Image
              </label>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <Image
                    src={widgetPreview || avatarPreview || 'https://placehold.co/64x64/e5e7eb/9ca3af?text=Widget'}
                    alt="Widget Image"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload Widget Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'widget')}
                      className="hidden"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    If not set, will use store avatar as fallback
                  </p>
                </div>
              </div>
            </div>

            {/* Widget Link */}
            <div>
              <label htmlFor="widgetLink" className="block text-sm font-medium text-gray-700 mb-3">
                Widget Link (Optional)
              </label>
              <input
                type="url"
                id="widgetLink"
                name="widgetLink"
                value={formData.widgetLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="https://your-special-link.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                When visitors click the floating widget, they&apos;ll be redirected to this link. If empty, shows a popup message instead.
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg border transition-all duration-300 ${
            message.includes('success') 
              ? 'bg-primary-50 text-primary-700 border-primary-200' 
              : 'bg-danger-50 text-danger-700 border-danger-200'
          }`}>
            <div className="flex items-center">
              {message.includes('success') ? (
                <CheckCircle className="w-5 h-5 mr-2 text-primary-500" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 text-danger-500" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-11 font-medium"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving Changes...
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
  );
}
