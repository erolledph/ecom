'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
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
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  PlusSquare,
  TrendingUp,
  Users
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Store Settings', href: '/dashboard/store', icon: Store },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Subscribers', href: '/dashboard/subscribers', icon: Users },
  { name: 'Add Slide', href: '/dashboard/slides/add', icon: PlusSquare },
  { name: 'Manage Slides', href: '/dashboard/slides', icon: Image },
  { name: 'Add Product', href: '/dashboard/products/add', icon: PlusCircle },
  { name: 'Manage Products', href: '/dashboard/products', icon: Package },
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
          
          {/* Desktop Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-2 py-4 space-y-1 border-t border-gray-200 ${isCollapsed ? 'md:px-1' : ''}`}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  min-h-11 relative
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'md:px-2 md:justify-center' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <IconComponent 
                  className={`
                    flex-shrink-0 transition-colors
                    ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}
                    ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                  `} 
                />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'md:px-2' : ''}`}>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 rounded-lg 
              hover:bg-danger-50 hover:text-danger-700 transition-all duration-200 disabled:opacity-50
              min-h-11 relative
              ${isCollapsed ? 'md:px-2 md:justify-center' : ''}
            `}
            title={isCollapsed ? (isLoggingOut ? 'Logging out...' : 'Logout') : undefined}
          >
            <LogOut 
              className={`
                flex-shrink-0 text-gray-500 group-hover:text-danger-600 transition-colors
                ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
              `} 
            />
            {!isCollapsed && (
              <span className="ml-3 truncate text-gray-700 group-hover:text-danger-700">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}