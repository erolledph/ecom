'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getActiveGlobalBanner, GlobalBanner } from '@/lib/store';
import { trackEvent } from '@/lib/analytics';
import { X } from 'lucide-react';

const BANNER_STORAGE_KEY = 'globalBannerShown';

export default function GlobalBannerDisplay() {
  const { user, loading: authLoading } = useAuth();
  const [banner, setBanner] = useState<GlobalBanner | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      const hasShownBanner = sessionStorage.getItem(BANNER_STORAGE_KEY);

      if (hasShownBanner) {
        setLoading(false);
        return;
      }

      let timeoutId: NodeJS.Timeout;

      const loadBanner = async () => {
        try {
          const activeBanner = await getActiveGlobalBanner();
          if (activeBanner && activeBanner.isActive) {
            setBanner(activeBanner);
            sessionStorage.setItem(BANNER_STORAGE_KEY, 'true');

            timeoutId = setTimeout(() => {
              setIsVisible(true);
            }, 2000);
          }
        } catch (error) {
          console.error('Error loading global banner:', error);
        } finally {
          setLoading(false);
        }
      };

      loadBanner();

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBannerClick = () => {
    if (banner?.link) {
      // Track banner click
      trackEvent('global_banner_click', banner.ownerId, {
        banner_id: banner.id,
        banner_link: banner.link,
        store_name: 'Global Banner',
        destination_link: banner.link
      });

      window.open(banner.link, '_blank', 'noopener,noreferrer');
      handleClose();
    }
  };

  // Don't show banner if:
  // - Auth is still loading
  // - User is not authenticated
  // - Banner is still loading
  // - No banner exists
  // - Banner is not visible
  if (authLoading || !user || loading || !banner || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
      <div className="relative max-w-2xl w-full pointer-events-auto">
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
          <div className="overflow-hidden rounded-lg">
            <img
              src={banner.imageUrl}
              alt="Global Announcement"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}