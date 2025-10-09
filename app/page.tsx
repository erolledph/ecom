'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Store, Package, TrendingUp, Users, Eye, MousePointer, ArrowRight, Star, StarHalf, RefreshCw, CheckCircle, Crown, Lock, DollarSign, Zap, ShieldCheck, LayoutDashboard, Code, Globe, Mail, Settings, BarChart3, Image as ImageIcon, PlusCircle, SquarePlus, LogOut, X, User, Copy, ChevronDown, Calendar, Clock, CircleAlert as AlertCircle } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />

      {/* Hero Section - Enhanced Copy and CTA */}
      <section className="relative min-h-[70vh] pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Launch Your Profitable
            <span className="text-emerald-600 block">Affiliate Store Today</span>
          </h1>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Effortlessly build, customize, and manage your own high-converting affiliate store. Maximize your earnings with powerful tools designed for success.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-emerald-100 border border-emerald-300 rounded-lg px-4 py-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-semibold">7-Day FREE Premium Trial</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg transform hover:scale-105"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-colors transform hover:scale-105"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase Section - Mobile Mockup with Floating Cards on Desktop */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See Your Store Come to Life
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visualize the power of a fully customized, high-performance affiliate store.
            </p>
          </div>
          <div className="relative flex justify-center items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px]">
            {/* Floating Metric Cards Container - Hidden on Mobile */}
            <div className="absolute inset-0 hidden md:flex justify-center items-center pointer-events-none">
              <div className="relative w-full h-full max-w-[800px] lg:max-w-[1000px]">
                {/* Top Left - Affiliate Earnings */}
                <div className="absolute top-[8%] left-0 w-40 lg:w-48 xl:w-52 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-6 -translate-x-6 lg:-translate-x-8">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-1 text-emerald-600">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-1 flex-shrink-0" />
                    <span>$2,250</span>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Monthly Earnings</div>
                </div>

                {/* Top Right - Store Visits */}
                <div className="absolute top-[8%] right-0 w-40 lg:w-48 xl:w-52 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-1 translate-x-6 lg:translate-x-8">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-1 text-emerald-600">
                    <Store className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-1 flex-shrink-0" />
                    <span>9,800</span>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Store Visits</div>
                </div>

                {/* Middle Left - Total Clicks */}
                <div className="absolute top-[40%] left-0 w-40 lg:w-48 xl:w-52 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-2 -translate-x-6 lg:-translate-x-8">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-1 text-emerald-600">
                    <MousePointer className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-1 flex-shrink-0" />
                    <span>3,450</span>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Product Clicks</div>
                </div>

                {/* Middle Right - Conversion Rate */}
                <div className="absolute top-[40%] right-0 w-40 lg:w-48 xl:w-52 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-4 translate-x-6 lg:translate-x-8">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-1 text-emerald-600">
                    <RefreshCw className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-1 flex-shrink-0" />
                    <span>12%</span>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Conversion Rate</div>
                </div>

                {/* Bottom Left - Average Rating */}
                <div className="absolute bottom-[15%] left-0 w-40 lg:w-48 xl:w-52 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-3 -translate-x-6 lg:-translate-x-8">
                  <div className="flex items-center text-base lg:text-lg xl:text-xl font-bold mb-1">
                    <div className="flex text-yellow-400 mr-1 flex-shrink-0">
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 fill-current" />
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 fill-current" />
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 fill-current" />
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 fill-current" />
                      <StarHalf className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 fill-current" />
                    </div>
                    <span className="text-emerald-600 text-lg lg:text-xl xl:text-2xl font-extrabold">4.5</span>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Average Rating</div>
                </div>

                {/* Bottom Right - Product Views */}
                <div className="absolute bottom-[15%] right-0 w-40 lg:w-48 xl:w-52 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-5 translate-x-6 lg:translate-x-8">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-1 text-emerald-600">
                    <Eye className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-1 flex-shrink-0" />
                    <span>5,600</span>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Product Views</div>
                </div>

                {/* Central Phone Mockup - Desktop */}
                <div className="relative z-30 w-full max-w-xs lg:max-w-sm xl:max-w-md mx-auto">
                  <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-gray-800/50">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
                      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative overflow-hidden h-[500px] lg:h-[600px] xl:h-[700px]">
                        {/* Phone Content */}
                        <div className="text-center pt-6 lg:pt-8 py-0 px-4 scale-90 lg:scale-95 origin-top">
                          {/* Store Avatar */}
                          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl">
                            <Store className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                          </div>

                          {/* Social Icons */}
                          <div className="flex justify-center space-x-3 mb-3">
                            <div className="w-5 h-5 text-gray-700">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div className="w-5 h-5 text-gray-700">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div className="w-5 h-5 text-gray-700">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="none" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                          </div>

                          {/* Store Name and Description */}
                          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">The Coffee Maker</h2>
                          <p className="text-sm text-gray-600 mb-4">Welcome to my awesome store! Discover unique products curated just for you.</p>
                        </div>

                        {/* Categories */}
                        <div className="px-4 mb-4">
                          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1">
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden border-2 border-emerald-500 grid grid-cols-2 grid-rows-2 gap-0">
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-emerald-600">All</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="Fashion category" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Fashion</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop" alt="Health category" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Health</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=100&h=100&fit=crop" alt="Office category" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Office</p>
                            </div>
                          </div>
                        </div>

                        {/* Products Section */}
                        <div className="px-4 pb-8">
                          <h3 className="text-sm font-bold text-gray-900 mb-3">All Products</h3>
                          
                          {/* Search Bar */}
                          <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.34-4.34M11 19a8 8 0 100-16 8 8 0 000 16z" />
                              </svg>
                            </div>
                            <input
                              placeholder="Search products..."
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-xs bg-white text-gray-900 placeholder-gray-500"
                              readOnly
                              type="text"
                            />
                          </div>

                          {/* Product Grid */}
                          <div className="grid grid-cols-3 gap-2 lg:gap-3">
                            {[
                              { name: 'Wireless Headphones', price: '$149.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
                              { name: 'Smart Watch Pro', price: '$299.99', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop' },
                              { name: 'Designer Backpack', price: '$89.99', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop' },
                              { name: 'Sunglasses', price: '$129.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
                              { name: 'Laptop Computer', price: '$999.99', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200&h=200&fit=crop' },
                              { name: 'Bluetooth Speaker', price: '$79.99', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=200&h=200&fit=crop' }
                            ].map((product, index) => (
                              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                                <div className="aspect-square overflow-hidden">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <div className="p-2">
                                  <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                                  <p className="text-xs font-bold text-emerald-600">{product.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Phone Mockup - Mobile Only */}
            <div className="block md:hidden relative z-30 w-full max-w-[280px] sm:max-w-xs mx-auto">
              <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-gray-800/50">
                <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
                  <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative overflow-hidden h-[400px] sm:h-[450px]">
                    {/* Phone Content */}
                    <div className="text-center pt-4 sm:pt-6 py-0 px-3 sm:px-4 scale-85 sm:scale-90 origin-top">
                      {/* Store Avatar */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center border-4 border-white shadow-xl">
                        <Store className="w-5 h-5 text-white" />
                      </div>

                      {/* Social Icons */}
                      <div className="flex justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                      </div>

                      {/* Store Name and Description */}
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">The Coffee Maker</h2>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Welcome to my awesome store! Discover unique products curated just for you.</p>
                    </div>

                    {/* Categories */}
                    <div className="px-3 sm:px-4 mb-3 sm:mb-4">
                      <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 -mx-0.5 sm:-mx-1">
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden border-2 border-emerald-500 grid grid-cols-2 grid-rows-2 gap-0">
                            <div className="w-full h-full">
                              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-full">
                              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-full">
                              <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-full">
                              <img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-emerald-600">All</p>
                        </div>
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="Fashion category" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-gray-600">Fashion</p>
                        </div>
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop" alt="Health category" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-gray-600">Health</p>
                        </div>
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=100&h=100&fit=crop" alt="Office category" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-gray-600">Office</p>
                        </div>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className="px-3 sm:px-4 pb-6 sm:pb-8">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">All Products</h3>
                      
                      {/* Search Bar */}
                      <div className="mb-3 sm:mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                          <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.34-4.34M11 19a8 8 0 100-16 8 8 0 000 16z" />
                          </svg>
                        </div>
                        <input
                          placeholder="Search products..."
                          className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-xs bg-white text-gray-900 placeholder-gray-500"
                          readOnly
                          type="text"
                        />
                      </div>

                      {/* Product Grid - 3 columns for consistency */}
                      <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                        {[
                          { name: 'Wireless Headphones', price: '$149.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
                          { name: 'Smart Watch Pro', price: '$299.99', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop' },
                          { name: 'Designer Backpack', price: '$89.99', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop' },
                          { name: 'Sunglasses', price: '$129.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
                          { name: 'Laptop Computer', price: '$999.99', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200&h=200&fit=crop' },
                          { name: 'Bluetooth Speaker', price: '$79.99', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=200&h=200&fit=crop' }
                        ].map((product, index) => (
                          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                            <div className="aspect-square overflow-hidden">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="p-1 sm:p-1.5">
                              <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                              <p className="text-xs font-bold text-emerald-600">{product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Refined Content */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to build, customize, and grow your affiliate marketing business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Store,
                title: 'Custom Store Builder',
                description: 'Create a beautiful, professional store with our easy-to-use customization tools. No coding required.'
              },
              {
                icon: Package,
                title: 'Smart Product Management',
                description: 'Add products with ease, auto-fill details by scraping URLs, and manage your inventory efficiently.'
              },
              {
                icon: TrendingUp,
                title: 'Actionable Analytics',
                description: 'Track store views, product clicks, and conversions with a detailed, real-time dashboard.'
              },
              {
                icon: Users,
                title: 'Engage Your Audience',
                description: 'Build your mailing list with subscription forms and keep customers informed with notifications.'
              },
              {
                icon: ShieldCheck,
                title: 'Secure & Optimized',
                description: 'Benefit from robust security, image optimization, and SEO-friendly features for better visibility.'
              },
              {
                icon: Zap,
                title: 'Boost Conversions',
                description: 'Utilize promotional slides, widgets, and banners to highlight offers and drive sales.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from successful affiliate marketers who are growing their businesses with Tiangge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="User Avatar" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Jane Doe</p>
                  <p className="text-sm text-gray-600">Affiliate Marketing Pro</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 italic">
                &ldquo;Tiangge transformed my affiliate business. The customization options are incredible, and the analytics help me optimize everything. My earnings have doubled!&rdquo;
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="User Avatar" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-600">E-commerce Entrepreneur</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 italic">
                &ldquo;I love how easy it is to add products and create stunning slides. The product scraping feature saves me so much time. Highly recommend!&rdquo;
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="User Avatar" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Lee</p>
                  <p className="text-sm text-gray-600">Content Creator</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 italic">
                &ldquo;Finally, a platform that understands affiliate marketing. The built-in SEO and responsive design mean my stores look great and perform well on any device.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - New Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your ambition. Upgrade anytime for more power.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Standard</h3>
              <p className="text-gray-600 mb-6">Perfect for new affiliate marketers getting started. Now Enjoy 7days Full Premium Access</p>
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">
                Free
                <span className="text-xl text-gray-500 font-medium"> / forever</span>
              </div>
              <ul className="space-y-3 text-gray-700 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  Up to 30 Products
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  Store Customization & Theming
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  Product Scraping
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  Promotional Slides
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  Basic Analytics Dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                  Email Subscriptions
                </li>
                <li className="flex items-center text-gray-500">
                  <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  No Bulk Import
                </li>
                <li className="flex items-center text-gray-500">
                  <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  No Data Export
                </li>
                <li className="flex items-center text-gray-500">
                  <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  No Floating Widget / Pop-up Banner
                </li>
              </ul>
              <Link
                href="/auth"
                className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-emerald-600 text-white rounded-xl p-8 shadow-lg border border-emerald-700 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <p className="text-emerald-100 mb-6">Unlock advanced features for serious growth.</p>
              <div className="text-4xl font-extrabold mb-2">
                $29
                <span className="text-xl text-emerald-200 font-medium"> / month</span>
              </div>
              <ul className="space-y-3 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Unlimited Products
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Advanced Customization
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Bulk Product Import (CSV)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Floating Widget & Pop-up Banner
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Advanced Analytics & Data Export
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Priority Support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  Custom Domain Support (Coming Soon)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  All Standard Features
                </li>
              </ul>
              <Link
                href="/auth"
                className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Tiangge
            </p>
          </div>

          <div className="space-y-6">
            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What is Tiangge?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Tiangge is an affiliate store builder platform that allows you to create, customize, and manage your own online store for affiliate marketing. You can add products, track analytics, and earn commissions through affiliate links.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Is Tiangge free to use?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Yes! When you sign up, you get a 7-day FREE trial with full Premium access to all features. After the trial, your account automatically switches to the free Standard plan with up to 30 products and core features. You can upgrade to Premium anytime for $29/month to unlock unlimited products and advanced features.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>How do I earn money with Tiangge?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                You earn money through affiliate commissions. When visitors click on products in your store and make purchases through your affiliate links, you earn a commission from the affiliate program. Tiangge provides the tools to showcase products and track performance, but earnings come from your affiliate programs.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Can I customize my store design?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Absolutely! Tiangge offers extensive customization options including custom colors, fonts, layouts, backgrounds, and social media integration. You can create a unique store that matches your brand identity.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What are sponsored products?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Sponsored products are products placed in stores with 15 or more products. These products provide an additional revenue stream and help keep the platform affordable. They are clearly marked and blend naturally with your store content.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>How does the analytics feature work?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Our analytics dashboard tracks important metrics including store views, product clicks, search queries, and category selections. This data helps you understand visitor behavior and optimize your store for better conversions.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Can I import products in bulk?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Yes! Premium users can import hundreds of products at once using CSV files. This feature is perfect for quickly scaling your store. Standard users can add products one at a time or use the product URL scraping feature for auto-fill.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What happens after my 7-day trial ends?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                After your 7-day trial, your account automatically switches to the free Standard plan. Premium features like bulk import, floating widgets, and data export will be disabled. If you have more than 30 products, only your 30 most recent products will remain visible. You can upgrade to Premium anytime to restore full access.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6 border border-gray-200 group">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What if I need help?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                We offer comprehensive support through our Help Center with detailed guides and tutorials. You can also contact our support team directly through the Contact page, and Premium users receive priority support.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliate marketers who are already earning with Tiangge.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg transform hover:scale-105"
          >
            Create Your Store Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <HomeFooter />

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes float-6 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 6s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 6s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 6s ease-in-out infinite; }
        .animate-float-6 { animation: float-6 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
