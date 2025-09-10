'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStore, getStoreProducts, getStoreSlides, Store } from '@/lib/store';
import { 
  Store as StoreIcon, 
  Package, 
  Image, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

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
        
        console.log('Loading dashboard data for user:', user.uid);
        // Load store data
        const storeData = await getUserStore(user.uid);
        console.log('Dashboard store data:', storeData);
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
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
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
    <div className="space-y-6 md:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Store Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <StoreIcon className="w-6 h-6 text-primary-600" />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              store ? 'bg-primary-100 text-primary-800' : 'bg-accent-100 text-accent-800'
            }`}>
              {store ? 'Live' : 'Setup'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {store?.name || 'Your Store'}
          </h3>
          <p className="text-sm text-gray-600">
            {store ? "Store is live and ready" : "Complete store setup,"}
          </p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <Package className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.products}</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Products</h3>
          <p className="text-sm text-gray-600">Affiliate products added</p>
        </div>

        {/* Slides */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-100 rounded-lg">
              <Image className="w-6 h-6 text-accent-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.slides}</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Slides</h3>
          <p className="text-sm text-gray-600">Promotional slides created</p>
        </div>
      </div>

      {/* Quick Actions */}
      {/* Setup Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600" />
          Quick Setup
        </h2>
        
        <div className="space-y-3">
          <Link 
            href="/dashboard/store"
            className="group block bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <StoreIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    Configure Store
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customize branding and appearance
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
          </Link>

          <Link 
            href="/dashboard/products"
            className="group block bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-secondary-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                  <Package className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-secondary-600 transition-colors">
                    Add Products
                  </h3>
                  <p className="text-sm text-gray-600">
                    Start earning with affiliate products
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary-600 transition-colors" />
            </div>
          </Link>

          <Link 
            href="/dashboard/slides"
            className="group block bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-accent-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-accent-100 rounded-lg mr-3">
                  <Image className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-accent-600 transition-colors">
                    Create Slides
                  </h3>
                  <p className="text-sm text-gray-600">
                    Design promotional content
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent-600 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
