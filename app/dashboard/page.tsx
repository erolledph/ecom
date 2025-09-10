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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {userProfile?.displayName || 'User'}! 👋
            </h1>
            <p className="text-indigo-100 text-sm md:text-base">
              Manage your affiliate store and start earning commissions.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-indigo-100">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Ready to grow</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Store Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <StoreIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              store ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {store ? 'Live' : 'Setup'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {store?.name || 'Your Store'}
          </h3>
          <p className="text-sm text-gray-600">
            {store ? "Store is live and ready" : "Complete store setup"}
          </p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
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
            <div className="p-3 bg-purple-100 rounded-lg">
              <Image className="w-6 h-6 text-purple-600"/>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.slides}</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Slides</h3>
          <p className="text-sm text-gray-600">Promotional slides created</p>
        </div>

        {/* Potential Earnings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">$0</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Earnings</h3>
          <p className="text-sm text-gray-600">Start promoting to earn</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Setup Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-indigo-600" />
            Quick Setup
          </h2>
          
          <div className="space-y-3">
            <Link 
              href="/dashboard/store"
              className="group block bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <StoreIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Configure Store
                    </h3>
                    <p className="text-sm text-gray-600">
                      Customize branding and appearance
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </Link>

            <Link 
              href="/dashboard/products"
              className="group block bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                      Add Products
                    </h3>
                    <p className="text-sm text-gray-600">
                      Start earning with affiliate products
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </Link>

            <Link 
              href="/dashboard/slides"
              className="group block bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Image className="w-5 h-5 text-purple-600" alt="" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      Create Slides
                    </h3>
                    <p className="text-sm text-gray-600">
                      Design promotional content
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Tips & Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
            Growth Tips
          </h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 text-sm">Maximize Earnings</h4>
                  <ul className="text-xs text-blue-800 mt-1 space-y-1">
                    <li>• Choose products relevant to your audience</li>
                    <li>• Write compelling product descriptions</li>
                    <li>• Use high-quality product images</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 text-sm">Drive Traffic</h4>
                  <ul className="text-xs text-blue-800 mt-1 space-y-1">
                    <li>• Share your store on social media</li>
                    <li>• Create engaging promotional slides</li>
                    <li>• Optimize for search engines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Store Link */}
          {store && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Your Store URL</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {typeof window !== "undefined" ? window.location.origin : ""}/<span className="font-mono">{store.slug}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(`${window.location.origin}/${store.slug}`, '_blank');
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="Visit your store"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
