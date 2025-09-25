'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getActiveGlobalBanner, GlobalBanner } from '@/lib/store';
import { X } from 'lucide-react';

export default function GlobalBannerDisplay() {
  const [banner, setBanner] = useState<GlobalBanner | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const activeBanner = await getActiveGlobalBanner();
        if (activeBanner && activeBanner.isActive) {
          setBanner(activeBanner);
          
          // Check if banner was already dismissed in this session
          const dismissedBanners = JSON.parse(
            sessionStorage.getItem('dismissedBanners') || '[]'
          );
          
          if (!dismissedBanners.includes(activeBanner.id)) {
            // Show banner immediately
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error loading global banner:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    
    // Remember that this banner was dismissed for this session
    if (banner) {
      const dismissedBanners = JSON.parse(
        sessionStorage.getItem('dismissedBanners') || '[]'
      );
      dismissedBanners.push(banner.id);
      sessionStorage.setItem('dismissedBanners', JSON.stringify(dismissedBanners));
    }
  };

  const handleBannerClick = () => {
    if (banner?.link) {
      window.open(banner.link, '_blank', 'noopener,noreferrer');
      handleClose();
    }
  };

  if (loading || !banner || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Banner Content */}
        <div
          className={banner.link ? 'cursor-pointer' : ''}
          onClick={handleBannerClick}
        >
          {/* Banner Image */}
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={banner.imageUrl}
              alt="Global Announcement"
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          
          {/* Banner Description */}
          {banner.description && (
            <div className="p-6">
              <p className="text-gray-800 text-base leading-relaxed">
                {banner.description}
              </p>
              {banner.link && (
                <div className="mt-3">
                  <span className="inline-flex items-center text-primary-600 text-base font-medium">
                    Click to learn more →
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}