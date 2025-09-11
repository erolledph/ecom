'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
        } else {
          setError('No store found. Please contact support if this issue persists.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error loading dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
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
      <div className="space-y-6 md:space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-danger-600 text-lg font-medium mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
          </div>
          {store && (
            <Link
              href={`/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Store
            </Link>
          )}
        </div>
      </div>

      {/* Store Info */}
      {store && (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{store.name}</h2>
              <p className="text-primary-100 mb-3 max-w-2xl">{store.description}</p>
              <div className="flex items-center text-primary-100">
                <ExternalLink className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {typeof window !== "undefined" ? window.location.origin : ""}/<strong>{store.slug}</strong>
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/store"
              className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.activeProducts}</span>
            <span className="text-gray-600 ml-1">active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Slides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSlides}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.activeSlides}</span>
            <span className="text-gray-600 ml-1">active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Store Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {store?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${store?.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <StoreIcon className={`w-6 h-6 ${store?.isActive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={store?.isActive ? 'text-green-600' : 'text-red-600'}>
              {store?.isActive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Slides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSlides}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.activeSlides}</span>
            <span className="text-gray-600 ml-1">active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Store Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {store?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${store?.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <StoreIcon className={`w-6 h-6 ${store?.isActive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={store?.isActive ? 'text-green-600' : 'text-red-600'}>
              {store?.isActive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary-600" />
              Products
            </h3>
            <Link
              href="/dashboard/products"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/products/add"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary-700">Add New Product</p>
                <p className="text-sm text-gray-600">Add affiliate products to your store</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/products"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Package className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-600">Edit, organize, and manage your products</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Slides Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
              Promotional Slides
            </h3>
            <Link
              href="/dashboard/slides"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/slides/add"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary-700">Create New Slide</p>
                <p className="text-sm text-gray-600">Add promotional slides to showcase offers</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/slides"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Slides</p>
                <p className="text-sm text-gray-600">Edit and organize your promotional slides</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity or Tips */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <StoreIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Customize Your Store</h4>
            </div>
            <p className="text-sm text-blue-700">
              Set up your store branding, colors, and social media links in store settings.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Add Products</h4>
            </div>
            <p className="text-sm text-green-700">
              Start adding affiliate products with compelling descriptions and competitive prices.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <ImageIcon className="w-5 h-5 text-purple-600 mr-2" />
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