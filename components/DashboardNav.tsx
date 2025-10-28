'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { canAccessFeature, isPremium } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToUnreadTicketsCount } from '@/lib/helpdesk';
import { ChartBar as BarChart3, Image, Package, CirclePlus as PlusCircle, SquarePlus as PlusSquare, TrendingUp, Users, Settings, DollarSign, Radio, Bell, HelpCircle, CreditCard } from 'lucide-react';

interface DashboardNavProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardNav({ isSidebarOpen, toggleSidebar }: DashboardNavProps) {
  const pathname = usePathname();
  const { userProfile } = useAuth();
  const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);

  // Generate navigation items based on user role and premium status
  const getNavigationItems = () => {
    let navigation = [
      { type: 'header', name: 'Dashboard' },
      { name: 'Overview', href: '/dashboard', icon: BarChart3 },

      { type: 'header', name: 'Store Management' },
      { name: 'Store Settings', href: '/dashboard/store', icon: Settings },
      { name: 'Subscribers', href: '/dashboard/subscribers', icon: Users },

      { type: 'header', name: 'Subscription' },
      { name: 'Upgrade Account', href: '/dashboard/subscription', icon: CreditCard },

      { type: 'header', name: 'Products' },
      { name: 'Products', href: '/dashboard/products', icon: Package },
      { name: 'Add Product', href: '/dashboard/products/add', icon: PlusCircle },

      { type: 'header', name: 'Slides' },
      { name: 'Slides', href: '/dashboard/slides', icon: Image },
      { name: 'Add Slide', href: '/dashboard/slides/add', icon: PlusSquare },
    ];

    // Add analytics for premium users
    if (canAccessFeature(userProfile, 'analytics')) {
      const analyticsIndex = navigation.findIndex(item => item.name === 'Store Settings');
      if (analyticsIndex !== -1) {
        navigation.splice(analyticsIndex + 1, 0,
          { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp }
        );
      }
    }

    // Add help desk for all premium users
    if (isPremium(userProfile) || canAccessFeature(userProfile, 'admin')) {
      const slidesIndex = navigation.findIndex(item => item.name === 'Add Slide');
      if (slidesIndex !== -1) {
        navigation.splice(slidesIndex + 1, 0,
          { type: 'header', name: 'Support' },
          { name: 'Help Desk', href: '/dashboard/helpdesk', icon: HelpCircle }
        );
      }
    }

    // Add admin-only features
    if (canAccessFeature(userProfile, 'admin')) {
      navigation.push(
        { type: 'header', name: 'Administration' },
        { name: 'Manage Users', href: '/dashboard/system-management/users', icon: Users },
        { name: 'Subscription Requests', href: '/dashboard/system-management/subscription-requests', icon: CreditCard },
        { name: 'Global Broadcast', href: '/dashboard/system-management/global-broadcast', icon: Radio },
        { name: 'Broadcast Notifications', href: '/dashboard/system-management/broadcast-notifications', icon: Bell },
        { name: 'Sponsor Products', href: '/dashboard/system-management/sponsor-products', icon: DollarSign },
        { name: 'Helpdesk Management', href: '/dashboard/system-management/helpdesk', icon: HelpCircle },
      );
    }

    return navigation;
  };

  useEffect(() => {
    if (canAccessFeature(userProfile, 'admin')) {
      const unsubscribe = subscribeToUnreadTicketsCount((count) => {
        setUnreadTicketsCount(count);
      });

      return () => unsubscribe();
    }
  }, [userProfile]);

  const closeSidebar = () => {
    toggleSidebar();
  };

  return (
    <div
      id="dashboard-sidebar"
      className={`
        fixed top-16 left-0 bottom-0 bg-white shadow-lg border-r border-gray-200 z-40 flex flex-col
        transition-transform duration-300 ease-in-out overflow-y-auto w-64 sm:w-72
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {getNavigationItems().map((item, index) => {
          // Render group headers
          if (item.type === 'header') {
            return (
              <div
                key={`${item.name}-${index}`}
                className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider first:pt-0"
              >
                {item.name}
              </div>
            );
          }

          // Render navigation links
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={`${item.name}-${index}`}
              href={item.href}
              onClick={closeSidebar}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                min-h-[44px] relative
                ${isActive
                  ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <IconComponent
                className={`
                  flex-shrink-0 transition-colors w-5 h-5
                  ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                `}
              />
              <span className="ml-3 truncate flex-1">{item.name}</span>
              {item.name === 'Helpdesk Management' && unreadTicketsCount > 0 && (
                <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white min-w-[20px]">
                  {unreadTicketsCount > 99 ? '99+' : unreadTicketsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
