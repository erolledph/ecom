'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { getAnalyticsEvents, clearAnalyticsEvents, AnalyticsEvent } from '@/lib/analytics';
import { getStoreProducts, Product, getStoreProductsWithTrialLimits } from '@/lib/store';
import { TrendingUp, Eye, MousePointer, ChartBar as BarChart3, ChartPie as PieChart, Activity, Trash2, RefreshCw, Megaphone, Package, Users, Search, ListFilter as Filter, Share2, ArrowUp, ArrowDown, Download } from 'lucide-react';

interface TopProduct {
  id: string;
  title: string;
  image?: string;
  clickCount: number;
}

interface TopCategory {
  name: string;
  count: number;
}

interface TopSearchTerm {
  term: string;
  count: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { userProfile } = useAuth();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Analytics insights
  const [totalProductClicks, setTotalProductClicks] = useState(0);
  const [totalStoreViews, setTotalStoreViews] = useState(0);
  const [totalSlideClicks, setTotalSlideClicks] = useState(0);
  const [totalSocialLinkClicks, setTotalSocialLinkClicks] = useState(0);
  const [totalSearches, setTotalSearches] = useState(0);
  const [topPerformingProducts, setTopPerformingProducts] = useState<TopProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [mostSearchedTerms, setMostSearchedTerms] = useState<TopSearchTerm[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch analytics events and products in parallel
      const [analyticsEvents, storeProducts] = await Promise.all([
        getAnalyticsEvents(user.uid),
        getStoreProducts(user.uid) // Use regular getStoreProducts for analytics since we're in authenticated context
      ]);
      
      setEvents(analyticsEvents);
      setProducts(storeProducts);
      
      // Calculate insights
      calculateInsights(analyticsEvents, storeProducts);
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateInsights = (events: AnalyticsEvent[], products: Product[]) => {
    // Count different event types
    const storeViews = events.filter(e => e.eventName === 'store_view').length;
    const slideClicks = events.filter(e => e.eventName === 'slide_click').length;
    const socialClicks = events.filter(e => e.eventName === 'social_link_click').length;
    const searches = events.filter(e => e.eventName === 'product_search').length;
    
    setTotalStoreViews(storeViews);
    setTotalSlideClicks(slideClicks);
    setTotalSocialLinkClicks(socialClicks);
    setTotalSearches(searches);
    
    // Calculate total product clicks from products' clickCount
    const totalClicks = products.reduce((sum, product) => sum + (product.clickCount || 0), 0);
    setTotalProductClicks(totalClicks);
    
    // Get top performing products (sorted by clickCount)
    const topProducts = products
      .filter(product => (product.clickCount || 0) > 0)
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 10)
      .map(product => ({
        id: product.id || '',
        title: product.title,
        image: product.images?.[0],
        clickCount: product.clickCount || 0
      }));
    setTopPerformingProducts(topProducts);
    
    // Calculate top categories from category filter events
    const categoryEvents = events.filter(e => e.eventName === 'category_filter');
    const categoryCount: Record<string, number> = {};
    
    categoryEvents.forEach(event => {
      const categoryName = event.properties?.category_name;
      if (categoryName && categoryName !== 'all') {
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      }
    });
    
    const topCats = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    setTopCategories(topCats);
    
    // Calculate most searched terms from product search events
    const searchEvents = events.filter(e => e.eventName === 'product_search');
    const searchTermCount: Record<string, number> = {};
    
    searchEvents.forEach(event => {
      const searchTerm = event.properties?.search_term;
      if (searchTerm && searchTerm.trim().length > 0) {
        const normalizedTerm = searchTerm.toLowerCase().trim();
        searchTermCount[normalizedTerm] = (searchTermCount[normalizedTerm] || 0) + 1;
      }
    });
    
    const topSearchTerms = Object.entries(searchTermCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([term, count]) => ({ term, count }));
    setMostSearchedTerms(topSearchTerms);
  };

  const handleClearEvents = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      try {
        await clearAnalyticsEvents(user.uid);
        setEvents([]);
        // Reset all insights
        setTotalProductClicks(0);
        setTotalStoreViews(0);
        setTotalSlideClicks(0);
        setTotalSocialLinkClicks(0);
        setTotalSearches(0);
        setTopPerformingProducts([]);
        setTopCategories([]);
        setMostSearchedTerms([]);
      } catch (error) {
        console.error('Failed to clear analytics events:', error);
      }
    }
  };

  const getEventCount = (eventName: string): number => {
    return events.filter(event => event.eventName === eventName).length;
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={loadAnalyticsData}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
       <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600" />
          Key Metrics
        </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700 mb-1">Product Clicks</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{totalProductClicks.toLocaleString()}</p>
              <div className="flex items-center mt-1 sm:mt-2">
                <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600 font-medium">Revenue</span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-green-200 rounded-lg sm:rounded-xl">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-700 mb-1">Widget Clicks</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">{getEventCount('widget_click').toLocaleString()}</p>
              <div className="flex items-center mt-1 sm:mt-2">
                <MousePointer className="w-2 h-2 sm:w-3 sm:h-3 text-orange-600 mr-1" />
                <span className="text-xs text-orange-600 font-medium">Engagement</span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-orange-200 rounded-lg sm:rounded-xl">
              <MousePointer className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-pink-700 mb-1">Banner Clicks</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-900">{getEventCount('banner_click').toLocaleString()}</p>
              <div className="flex items-center mt-1 sm:mt-2">
                <Megaphone className="w-2 h-2 sm:w-3 sm:h-3 text-pink-600 mr-1" />
                <span className="text-xs text-pink-600 font-medium">Promotions</span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-pink-200 rounded-lg sm:rounded-xl">
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-pink-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700 mb-1">Searches</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">{totalSearches.toLocaleString()}</p>
              <div className="flex items-center mt-1 sm:mt-2">
                <Search className="w-2 h-2 sm:w-3 sm:h-3 text-purple-600 mr-1" />
                <span className="text-xs text-purple-600 font-medium">User intent</span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-purple-200 rounded-lg sm:rounded-xl">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>
       </div>

      {/* Detailed Insights */}
      <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600" />
          Detailed Insights
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Store Visits</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{totalStoreViews}</p>
                <p className="text-xs text-blue-600 mt-1">Unique visitors</p>
              </div>
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 sm:p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-indigo-700 mb-1">Slide Clicks</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-900">{totalSlideClicks}</p>
                <p className="text-xs text-indigo-600 mt-1">Promotional content</p>
              </div>
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 sm:p-4 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-emerald-700 mb-1">Social Clicks</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900">{totalSocialLinkClicks}</p>
                <p className="text-xs text-emerald-600 mt-1">Social engagement</p>
              </div>
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg p-3 sm:p-4 border border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-violet-700 mb-1">Category Filters</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-violet-900">{getEventCount('category_filter')}</p>
                <p className="text-xs text-violet-600 mt-1">Browse behavior</p>
              </div>
              <Filter className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      {topPerformingProducts.length > 0 && (
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600" />
            Top Performing Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {topPerformingProducts.map((product, index) => (
              <div key={product.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      #{index + 1}
                    </div>
                  </div>
                  
                  {product.image && (
                    <div className="flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={32}
                        height={32}
                        className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg object-cover border border-gray-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <div className="flex items-center mt-1">
                      <MousePointer className="w-2 h-2 sm:w-3 sm:h-3 text-primary-600 mr-1" />
                      <span className="text-xs text-gray-600">{product.clickCount} clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Filtered Categories */}
      {topCategories.length > 0 && (
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600" />
            Most Filtered Categories
          </h2>
          
          <div className="space-y-2 sm:space-y-3">
            {topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <Filter className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500 mr-1" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">{category.count} filters</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Searched Products */}
      {mostSearchedTerms.length > 0 && (
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600" />
            Most Searched Products
          </h2>
          
          <div className="space-y-2 sm:space-y-3">
            {mostSearchedTerms.map((searchTerm, index) => (
              <div key={searchTerm.term} className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <span className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">"{searchTerm.term}"</span>
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                      Search Term
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Search className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500 mr-1" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">{searchTerm.count} searches</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs sm:text-sm text-purple-700 font-medium mb-1">💡 Insight</p>
            <p className="text-xs text-purple-600">
              These are the most popular search terms your visitors use. Consider adding products that match these searches to improve conversion rates.
            </p>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {events.length === 0 && (
        <div className="p-6 sm:p-8">
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary-600" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
              No Analytics Data Yet
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 max-w-md mx-auto leading-relaxed px-4">
              Start sharing your store to see analytics data appear here. Events are tracked automatically as users interact with your store.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 max-w-lg mx-auto">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Tracked events include:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <Eye className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-blue-500" />
                  Store visits and visitor traffic
                </div>
                <div className="flex items-center">
                  <Package className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-green-500" />
                  Product clicks and interactions
                </div>
                <div className="flex items-center">
                  <Activity className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-purple-500" />
                  Promotional slide clicks
                </div>
                <div className="flex items-center">
                  <Search className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-orange-500" />
                  Search queries and filters
                </div>
                <div className="flex items-center">
                  <Share2 className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-pink-500" />
                  Social media link clicks
                </div>
                <div className="flex items-center">
                  <MousePointer className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-indigo-500" />
                  Widget and banner clicks
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}