'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    // Only track page views for authenticated users in dashboard
    if (user && pathname.startsWith('/dashboard')) {
      trackPageView(pathname, user.uid, document.title);
    }
  }, [pathname, user]);

  return <>{children}</>;
}