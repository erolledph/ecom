'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { canAccessFeature } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ChartBar as BarChart3, Store, Image, Package, LogOut, X, User, CirclePlus as PlusCircle, SquarePlus as PlusSquare, TrendingUp, Users, Settings, DollarSign, Radio, Bell } from 'lucide-react';

interface DashboardNavProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardNav({ isSidebarOpen, toggleSidebar }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuth();
  const { clearAll } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Generate navigation items based on user role and premium status
  const getNavigationItems = () => {
    let navigation = [
      { type: 'header', name: 'Dashboard' },
      { name: 'Overview', href: '/dashboard', icon: BarChart3 },
      
      { type: 'header', name: 'Store Management' },
      { name: 'Store Settings', href: '/dashboard/store', icon: Settings },
      { name: 'Subscribers', href: '/dashboard/subscribers', icon: Users },
      
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

    // Add admin-only features
    if (canAccessFeature(userProfile, 'admin')) {
      navigation.push(
        { type: 'header', name: 'Administration' },
        { name: 'Manage Users', href: '/dashboard/system-management/users', icon: Users },
        { name: 'Global Broadcast', href: '/dashboard/system-management/global-broadcast', icon: Radio },
        { name: 'Broadcast Notifications', href: '/dashboard/system-management/broadcast-notifications', icon: Bell },
        { name: 'Sponsor Products', href: '/dashboard/system-management/sponsor-products', icon: DollarSign },
      );
    }

    return navigation;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    clearAll();
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeSidebar = () => {
    toggleSidebar();
  };

  return (
    <div
      id="dashboard-sidebar"
      className={`
        fixed top-0 left-0 h-full min-h-screen bg-white shadow-xl border-r border-gray-200 z-40 flex flex-col
        transition-transform duration-300 ease-in-out overflow-y-auto w-64 sm:w-72
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{
        height: '100%', // Dynamic viewport height for mobile browsers
      }}
    >
      {/* Sidebar Header with Close Button */}
      <div className="flex items-center justify-between h-16 px-3 sm:px-4 bg-gradient-to-r from-primary-500 to-secondary-500 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          </div>
          <div className="ml-2 sm:ml-3">
            <p className="text-sm sm:text-base font-bold text-white">
              Tiangge
            </p>
            <p className="text-xs text-white text-opacity-80">
              Dashboard
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={closeSidebar}
          className="p-1 sm:p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 sm:py-4 space-y-1">
        {getNavigationItems().map((item, index) => {
          // Render group headers
          if (item.type === 'header') {
            return (
              <div
                key={`${item.name}-${index}`}
                className="px-2 sm:px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
                group flex items-center px-2 sm:px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                min-h-[44px] relative
                ${isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              onFocus={() => {
                // Keep sidebar open when navigating with keyboard
              }}
            >
              <IconComponent 
                className={`
                  flex-shrink-0 transition-colors w-4 h-4 sm:w-5 sm:h-5
                  ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}
                `} 
              />
              <span className="ml-2 sm:ml-3 truncate flex-1 text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group flex items-center w-full px-2 sm:px-3 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-danger-50 hover:text-danger-700 transition-all duration-200 disabled:opacity-50 min-h-[44px]"
        >
          <LogOut className="flex-shrink-0 text-gray-500 group-hover:text-danger-600 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-2 sm:ml-3 truncate text-gray-700 group-hover:text-danger-700 flex-1">
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </div>
  );
}
