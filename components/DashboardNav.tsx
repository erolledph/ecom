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
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Store Settings', href: '/dashboard/store', icon: Store },
  { name: 'Promotional Slides', href: '/dashboard/slides', icon: Image },
  { name: 'Affiliate Products', href: '/dashboard/products', icon: Package },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
          fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'md:w-16' : 'md:w-72'}
          md:translate-x-0 w-64
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 ${isCollapsed ? 'md:px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-indigo-600" />
            </div>
            {!isCollapsed && (
              <h1 className="ml-3 text-lg font-bold text-white truncate">
                Affiliate Store
              </h1>
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

        {/* User Info */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'md:px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-2 py-4 space-y-1 ${isCollapsed ? 'md:px-1' : ''}`}>
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
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'md:px-2 md:justify-center' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <IconComponent 
                  className={`
                    flex-shrink-0 transition-colors
                    ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}
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
              hover:bg-red-50 hover:text-red-700 transition-all duration-200 disabled:opacity-50
              min-h-11 relative
              ${isCollapsed ? 'md:px-2 md:justify-center' : ''}
            `}
            title={isCollapsed ? (isLoggingOut ? 'Logging out...' : 'Logout') : undefined}
          >
            <LogOut 
              className={`
                flex-shrink-0 text-gray-400 group-hover:text-red-600 transition-colors
                ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
              `} 
            />
            {!isCollapsed && (
              <span className="ml-3 truncate">
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