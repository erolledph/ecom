'use client';

import { Globe, Share2, MessageCircle } from 'lucide-react';

interface SeoPreviewCardsProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export default function SeoPreviewCards({ title, description, imageUrl, url }: SeoPreviewCardsProps) {
  const displayUrl = url || 'your-store-url.com';
  const truncatedUrl = displayUrl.length > 40 ? displayUrl.substring(0, 40) + '...' : displayUrl;

  const defaultAvatar = '/default-avatar.webp';
  const favicon = '/favicon.ico';
  const displayImage = imageUrl || defaultAvatar;
  const displayFavicon = favicon;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <Globe className="w-4 h-4" />
        <span>Preview How Your Store Appears</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Google Search Preview */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Google Search</h3>
          </div>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-1">
                <img
                  src={displayFavicon}
                  alt="Favicon"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-xs text-gray-600">{truncatedUrl}</span>
              </div>
              <h4 className="text-lg text-blue-600 hover:underline cursor-pointer font-normal leading-tight">
                {title || 'Your Store Name'}
              </h4>
              <p className="text-sm text-gray-600 leading-snug line-clamp-2">
                {description || 'Your store description will appear here. Add a compelling description to attract visitors from search results.'}
              </p>
            </div>
          </div>
        </div>

        {/* Facebook Preview */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Facebook</h3>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="relative aspect-[1.91/1] bg-gray-200">
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">{truncatedUrl}</p>
              <h4 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {title || 'Your Store Name'}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {description || 'Your store description'}
              </p>
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-sky-500" />
            <h3 className="text-sm font-semibold text-gray-900">Twitter</h3>
          </div>
          <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="relative aspect-[2/1] bg-gray-200">
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                {title || 'Your Store Name'}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {description || 'Your store description'}
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <Globe className="w-3 h-3 mr-1" />
                {truncatedUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex-shrink-0 mt-0.5">
          <Globe className="w-4 h-4 text-gray-600" />
        </div>
        <p className="text-xs text-gray-600">
          These previews show how your store will appear when shared on social media or found in search results. Make sure your title and description are compelling to maximize engagement.
        </p>
      </div>
    </div>
  );
}
