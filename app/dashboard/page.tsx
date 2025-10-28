'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { isPremium, isOnTrial, hasTrialExpired, getTrialDaysRemaining } from '@/lib/auth';
import { getUserStore, getStoreProducts, getStoreSlides, Store } from '@/lib/store';
import { Store as StoreIcon, Package, Image as ImageIcon, Users, ExternalLink, Plus, ChartBar as BarChart3, Eye, Settings, TrendingUp, Clock, Crown } from 'lucide-react';

export default function DashboardOverview() {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSlides: 0,
    activeProducts: 0,
    activeSlides: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAtProductLimit, setIsAtProductLimit] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch store data
        const storeData = await getUserStore(user.uid);
        if (storeData) {
          setStore(storeData);

          // Fetch products and slides for stats
          const [products, slides] = await Promise.all([
            getStoreProducts(user.uid),
            getStoreSlides(user.uid)
          ]);

          setStats({
            totalProducts: products.length,
            totalSlides: slides.length,
            activeProducts: products.filter(p => p.isActive !== false).length,
            activeSlides: slides.filter(s => s.isActive).length
          });

          // Check product limit for normal users
          if (userProfile && !isPremium(userProfile)) {
            setIsAtProductLimit(products.length >= 30);
          }
        } else {
          setError('No store found. Please contact support if this issue persists.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Error loading dashboard data. Please refresh the page.');
        setError('Error loading dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-10"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <div className="h-7 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <div className="h-7 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-5 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl font-semibold mb-3">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md"
              aria-label="Refresh Page"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          </div>
          {store && (
            <Link
              href={`/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md text-sm sm:text-base min-h-[44px]"
              aria-label="View Store"
              onClick={() => showInfo('Opening your store in a new tab!')}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              View Store
            </Link>
          )}
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              {userProfile && !isPremium(userProfile) && (
                <p className="text-xs text-green-600 mt-1">
                  {stats.totalProducts}/30 limit
                </p>
              )}
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-green-600 font-medium">{stats.activeProducts}</span>
            <span className="text-gray-500 ml-1">active</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Slides</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalSlides}</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <ImageIcon className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-green-600 font-medium">{stats.activeSlides}</span>
            <span className="text-gray-500 ml-1">active</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Store Status</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {store?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg ${store?.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <StoreIcon className={`w-5 h-5 sm:w-7 sm:h-7 ${store?.isActive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className={store?.isActive ? 'text-green-600' : 'text-red-600'}>
              {store?.isActive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Quick Actions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">Manage</p>
            </div>
            <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg">
              <Settings className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <Link
              href="/dashboard/store"
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
              aria-label="Go to Settings"
            >
              Go to Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {/* Products Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 sm:gap-3">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              Products
            </h3>
            <Link
              href="/dashboard/products"
              className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
              aria-label="View All Products"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/products/add"
              className={`flex items-center p-3 sm:p-4 border-2 border-dashed rounded-lg transition-all group min-h-[60px] ${
                isAtProductLimit 
                  ? 'border-red-200 bg-red-50 cursor-not-allowed' 
                  : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50'
              }`}
              onClick={(e) => {
                if (isAtProductLimit) {
                  e.preventDefault();
                  showError('Cannot add more products: You have reached the 30-product limit for standard users. Please upgrade to premium for unlimited products or contact an administrator for assistance.');
                }
              }}
              aria-label="Add New Product"
            >
              <Plus className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${
                isAtProductLimit 
                  ? 'text-red-400' 
                  : 'text-gray-400 group-hover:text-primary-600'
              }`} />
              <div>
                <p className={`font-medium text-sm sm:text-base ${
                  isAtProductLimit 
                    ? 'text-red-800' 
                    : 'text-gray-800 group-hover:text-primary-700'
                }`}>
                  {isAtProductLimit ? 'Product Limit Reached' : 'Add New Product'}
                </p>
                <p className={`text-xs sm:text-sm ${
                  isAtProductLimit 
                    ? 'text-red-600' 
                    : 'text-gray-500'
                }`}>
                  {isAtProductLimit 
                    ? 'Upgrade to premium for unlimited products and advanced features' 
                    : 'Add affiliate products to your store'
                  }
                </p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/products"
              className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all min-h-[60px]"
              aria-label="Manage Products"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2 sm:mr-3" />
              <div>
                <p className="font-medium text-gray-800 text-sm sm:text-base">Manage Products</p>
                <p className="text-xs sm:text-sm text-gray-500">Edit, organize, and manage your products</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Slides Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 sm:gap-3">
              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              Promotional Slides
            </h3>
            <Link
              href="/dashboard/slides"
              className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
              aria-label="View All Slides"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/slides/add"
              className="flex items-center p-3 sm:p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all group min-h-[60px]"
              aria-label="Create New Slide"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-primary-600 mr-2 sm:mr-3" />
              <div>
                <p className="font-medium text-gray-800 group-hover:text-primary-700 text-sm sm:text-base">Create New Slide</p>
                <p className="text-xs sm:text-sm text-gray-500">Add promotional slides to showcase offers</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/slides"
              className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all min-h-[60px]"
              aria-label="Manage Slides"
            >
              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2 sm:mr-3" />
              <div>
                <p className="font-medium text-gray-800 text-sm sm:text-base">Manage Slides</p>
                <p className="text-xs sm:text-sm text-gray-500">Edit and organize your promotional slides</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Tips */}
      <div className="p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Getting Started Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg shadow-sm">
            <div className="flex items-center mb-2 sm:mb-3">
              <StoreIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900 text-sm sm:text-base">Customize Your Store</h4>
            </div>
            <p className="text-xs sm:text-sm text-blue-700">
              Set up your store branding, colors, and social media links in store settings.
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-green-50 rounded-lg shadow-sm">
            <div className="flex items-center mb-2 sm:mb-3">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900 text-sm sm:text-base">Add Products</h4>
            </div>
            <p className="text-xs sm:text-sm text-green-700">
              Start adding affiliate products with compelling descriptions and competitive prices.
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-purple-50 rounded-lg shadow-sm">
            <div className="flex items-center mb-2 sm:mb-3">
              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900 text-sm sm:text-base">Create Slides</h4>
            </div>
            <p className="text-xs sm:text-sm text-purple-700">
              Design eye-catching promotional slides to highlight your best offers and deals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}