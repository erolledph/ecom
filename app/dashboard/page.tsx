'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStore, getStoreProducts, getStoreSlides, Store } from '@/lib/store';

export default function DashboardOverview() {
  const { user, userProfile } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    slides: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load store data
        const storeData = await getUserStore(user.uid);
        setStore(storeData);
        
        // Load stats
        const [products, slides] = await Promise.all([
          getStoreProducts(user.uid),
          getStoreSlides(user.uid)
        ]);
        
        setStats({
          products: products.length,
          slides: slides.length,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userProfile?.displayName || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your affiliate store from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Store Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-2xl">🏪</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{store?.name || 'Your Store'}</h3>
              <p className="text-gray-600">{store?.isActive ? "Store is live" : "Set up your store details"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <p className="text-gray-600">{stats.products} products added</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
              <p className="text-gray-600">{stats.slides} slides created</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Set Up Your Store
            </h3>
            <p className="text-gray-600 mb-4">
              Add your store name, description, and branding to get started.
            </p>
            <a 
              href="/dashboard/store"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Configure Store
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Your First Product
            </h3>
            <p className="text-gray-600 mb-4">
              Start adding products to your affiliate store.
            </p>
            <a 
              href="/dashboard/products"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Product
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}