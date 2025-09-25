'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { canAccessFeature } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Store, 
  Image, 
  Package, 
  LogOut, 
  Menu, 
  X, 
  User,
  PlusCircle,
  PlusSquare,
  TrendingUp,
  Users,
  Settings,
  DollarSign,
  Radio,
} from 'lucide-react';

const navigation = [
  { type: 'header', name: 'Dashboard' },
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  
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

interface DashboardNavProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function DashboardNav({ isCollapsed, toggleCollapse }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [autoCollapseTimer, setAutoCollapseTimer] = useState<NodeJS.Timeout | null>(null);


  // Auto-collapse functionality
  useEffect(() => {
    const handleMouseMove = () => {
      // Clear existing timer
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }

      // Set new timer to collapse after 3 seconds of inactivity
      const timer = setTimeout(() => {
        if (!isHovered) {
          // Auto-collapse only on desktop
          if (window.innerWidth >= 768) {
            // Force collapse if not already collapsed
            if (!isCollapsed) {
              toggleCollapse();
            }
          }
        }
      }, 3000);

      setAutoCollapseTimer(timer);
    };

    // Add mouse move listener to document
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
    };
  }, [isHovered, isCollapsed, toggleCollapse, autoCollapseTimer]);

  // Close system menu on mobile menu close
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
        { name: 'Sponsor Products', href: '/dashboard/system-management/sponsor-products', icon: DollarSign },
      );
    }

    return navigation;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarMouseEnter = () => {
    setIsHovered(true);
    // Clear auto-collapse timer when hovering
    if (autoCollapseTimer) {
      clearTimeout(autoCollapseTimer);
      setAutoCollapseTimer(null);
    }
    // Auto-expand on hover if collapsed (desktop only)
    if (isCollapsed && window.innerWidth >= 768) {
      toggleCollapse();
    }
  };

  const handleSidebarMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-gray-200 z-40 flex flex-col
          transition-all duration-300 ease-in-out overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'md:w-16' : 'md:w-72'}
          md:translate-x-0 w-64
        `}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 ${isCollapsed ? 'md:px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-600" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">
                  {userProfile?.displayName || 'User'}
                </p>
                <p className="text-xs text-white text-opacity-80 truncate">
                  {userProfile?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-2 py-4 space-y-1 border-t border-gray-200 ${isCollapsed ? 'md:px-1' : ''}`}>
          {getNavigationItems().map((item, index) => {
            // Render group headers
            if (item.type === 'header') {
              return (
                <div
                  key={`${item.name}-${index}`}
                  className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                    isCollapsed ? 'md:hidden' : ''
                  }`}
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
                onClick={closeMobileMenu}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  min-h-12 relative
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'md:px-3 md:justify-center md:w-12 md:mx-auto' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <IconComponent 
                  className={`
                    flex-shrink-0 transition-colors w-5 h-5
                    ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}
                  `} 
                />
                {!isCollapsed && (
                  <span className="ml-3 truncate flex-1">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}

        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'md:px-3' : ''}`}>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 rounded-lg 
              hover:bg-danger-50 hover:text-danger-700 transition-all duration-200 disabled:opacity-50
              min-h-12 relative
              ${isCollapsed ? 'md:px-3 md:justify-center md:w-12 md:mx-auto' : ''}
            `}
            title={isCollapsed ? (isLoggingOut ? 'Logging out...' : 'Logout') : undefined}
          >
            <LogOut 
              className={`
                flex-shrink-0 text-gray-500 group-hover:text-danger-600 transition-colors w-5 h-5
              `} 
            />
            {!isCollapsed && (
              <span className="ml-3 truncate text-gray-700 group-hover:text-danger-700 flex-1">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}