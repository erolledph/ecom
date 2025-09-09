'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStore, updateStore, uploadStoreImage, checkSlugAvailability, Store } from '@/lib/store';

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
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
        <p className="mt-2 text-gray-600">
          Customize your store&apos;s appearance and information.
        </p>
        {store && (
          <p className="mt-2 text-sm text-indigo-600">
            Your store URL: <strong>{typeof window !== "undefined" ? window.location.origin : ""}/{store.slug}</strong>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="My Awesome Store"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Store URL (Slug) *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  {typeof window !== "undefined" ? window.location.origin : ""}/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Welcome to my awesome store! Discover unique products curated just for you."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Avatar
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={avatarPreview || 'https://placehold.co/300x300/e5e7eb/9ca3af?text=No+Avatar'}
                    alt="Store Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'avatar')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image
              </label>
              <div className="space-y-2">
                {backgroundPreview ? (
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={backgroundPreview}
                      alt="Background"
                      width={400}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Background Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'background')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fab fa-instagram text-pink-500 mr-2"></i>
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://instagram.com/yourstore"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fab fa-twitter text-blue-400 mr-2"></i>
                Twitter
              </label>
              <input
                type="url"
                id="twitter"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://twitter.com/yourstore"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fab fa-facebook text-blue-600 mr-2"></i>
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                name="socialLinks.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://facebook.com/yourstore"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-md transition-all duration-300 ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center">
              {message.includes('success') ? (
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          {message && !message.includes('success') && (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Dismiss
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}