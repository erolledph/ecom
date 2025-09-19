'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getUserStore, getStoreProducts, getStoreSlides, Store } from '@/lib/store';
import { 
  Store as StoreIcon,
  Package,
  Image as ImageIcon,
  Users,
  ExternalLink,
  Plus,
  BarChart3,
  Eye,
  Settings,
  TrendingUp
} from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();
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
          
          // Show welcome toast for new users
          if (products.length === 0 && slides.length === 0) {
            showInfo('Welcome to your dashboard! Start by adding products or creating slides.');
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
  }, [user]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <BarChart3 className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
          </div>
          {store && (
            <Link
              href={`/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md"
              aria-label="View Store"
              onClick={() => showInfo('Opening your store in a new tab!')}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Store
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.activeProducts}</span>
            <span className="text-gray-500 ml-1">active</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Slides</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSlides}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ImageIcon className="w-7 h-7 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.activeSlides}</span>
            <span className="text-gray-500 ml-1">active</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Store Status</p>
              <p className="text-2xl font-bold text-gray-800">
                {store?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${store?.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <StoreIcon className={`w-7 h-7 ${store?.isActive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={store?.isActive ? 'text-green-600' : 'text-red-600'}>
              {store?.isActive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Actions</p>
              <p className="text-2xl font-bold text-gray-800">Manage</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Settings className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/dashboard/store"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              aria-label="Go to Settings"
            >
              Go to Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Products Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <Package className="w-6 h-6 text-primary-600" />
              Products
            </h3>
            <Link
              href="/dashboard/products"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              aria-label="View All Products"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/products/add"
              className="flex items-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all group"
              aria-label="Add New Product"
            >
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800 group-hover:text-primary-700">Add New Product</p>
                <p className="text-sm text-gray-500">Add affiliate products to your store</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/products"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="Manage Products"
            >
              <Package className="w-6 h-6 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">Manage Products</p>
                <p className="text-sm text-gray-500">Edit, organize, and manage your products</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Slides Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary-600" />
              Promotional Slides
            </h3>
            <Link
              href="/dashboard/slides"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              aria-label="View All Slides"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/slides/add"
              className="flex items-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all group"
              aria-label="Create New Slide"
            >
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800 group-hover:text-primary-700">Create New Slide</p>
                <p className="text-sm text-gray-500">Add promotional slides to showcase offers</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/slides"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="Manage Slides"
            >
              <ImageIcon className="w-6 h-6 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">Manage Slides</p>
                <p className="text-sm text-gray-500">Edit and organize your promotional slides</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Tips */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md p-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Getting Started Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <StoreIcon className="w-6 h-6 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Customize Your Store</h4>
            </div>
            <p className="text-sm text-blue-700">
              Set up your store branding, colors, and social media links in store settings.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <Package className="w-6 h-6 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Add Products</h4>
            </div>
            <p className="text-sm text-green-700">
              Start adding affiliate products with compelling descriptions and competitive prices.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <ImageIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900">Create Slides</h4>
            </div>
            <p className="text-sm text-purple-700">
              Design eye-catching promotional slides to highlight your best offers and deals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}