'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStore, updateStore, uploadStoreImage, checkSlugAvailability, Store } from '@/lib/store';
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
  Facebook
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
    socialLinks: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');

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
            socialLinks: storeData.socialLinks
          });
          setAvatarPreview(storeData.avatar);
          setBackgroundPreview(storeData.backgroundImage);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setBackgroundFile(file);
      setBackgroundPreview(URL.createObjectURL(file));
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

      // Upload new images if selected
      if (avatarFile) {
        avatarUrl = await uploadStoreImage(user.uid, avatarFile, 'avatar');
      }
      
      if (backgroundFile) {
        backgroundUrl = await uploadStoreImage(user.uid, backgroundFile, 'background');
      }

      // Update store
      await updateStore(user.uid, {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        socialLinks: formData.socialLinks
      });

      setMessage('Store settings updated successfully!');
      
      // Reset file states after successful save
      setAvatarFile(null);
      setBackgroundFile(null);
      
      // Update local store state
      setStore(prev => prev ? {
        ...prev,
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        socialLinks: formData.socialLinks
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
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <StoreIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600 text-sm md:text-base">
              3-20 characters, lowercase letters and numbers only
            </p>
          </div>
        </div>
        
        {store && (
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center">
              <LinkIcon className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm text-indigo-800">
                Your store URL: <span className="font-mono font-medium">{typeof window !== "undefined" ? window.location.origin : ""}/{store.slug}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <StoreIcon className="w-5 h-5 mr-2 text-indigo-600" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="My Awesome Store"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Store URL (Slug) *
              </label>
              <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
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
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none text-gray-900"
              placeholder="Welcome to my affiliate store! Discover amazing products and deals curated just for you."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
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
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
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
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
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
            <LinkIcon className="w-5 h-5 mr-2 text-indigo-600" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="https://facebook.com/yourstore"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg border transition-all duration-300 ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <div className="flex items-center">
              {message.includes('success') ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
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
           className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-11 font-medium"
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
