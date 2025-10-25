'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { Store, Package, TrendingUp, Users, Eye, MousePointer, ArrowRight, Star, StarHalf, RefreshCw, CircleCheck as CheckCircle, Zap, Code, Globe, Mail, Image as ImageIcon, SquarePlus, X, ChevronLeft, ChevronRight, Bell, Clock, Gift } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Jane Doe',
      role: 'Affiliate Marketing Pro',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      quote: 'Tiangge transformed my affiliate business. The customization options are incredible, and the analytics help me optimize everything. My earnings have doubled!'
    },
    {
      name: 'John Smith',
      role: 'E-commerce Entrepreneur',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      quote: 'I love how easy it is to add products and create stunning slides. The product scraping feature saves me so much time. Highly recommend!'
    },
    {
      name: 'Sarah Lee',
      role: 'Content Creator',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      quote: 'Finally, a platform that understands affiliate marketing. The built-in SEO and responsive design mean my stores look great and perform well on any device.'
    },
    {
      name: 'Michael Chen',
      role: 'Digital Marketer',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      quote: 'The subscriber management and notification system helped me build a loyal audience. My conversion rates increased by 40% in just two months.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Lifestyle Blogger',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      quote: 'Beautiful templates and easy customization made launching my affiliate store a breeze. I was up and running in less than an hour!'
    }
  ];

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length, isPaused]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
    <>
      <Head>
        <title>Tiangge - Create Your Online Affiliate Store | Earn Commissions Today</title>
        <meta name="description" content="Build and customize your own affiliate store with Tiangge. Add products, create promotional slides, track analytics, and start earning commissions through affiliate marketing. Free 7-day trial." />
        <meta name="keywords" content="affiliate store, affiliate marketing, online store builder, earn commissions, product management, analytics, affiliate business" />
        <meta property="og:title" content="Tiangge - Create Your Online Affiliate Store" />
        <meta property="og:description" content="Build and customize your own affiliate store. Add products, create promotional slides, and start earning commissions through affiliate marketing." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tiangge - Create Your Online Affiliate Store" />
        <meta name="twitter:description" content="Build and customize your own affiliate store with Tiangge. Start earning commissions through affiliate marketing." />
        <link rel="canonical" href="https://tiangge.shop" />
      </Head>
      <div className="min-h-screen bg-white">
        <HomeHeader />

      {/* Hero Section - Enhanced Copy and CTA */}
      <section className="relative min-h-[80vh] pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            Create Your Online Affiliate Store and
            <span className="text-emerald-600 block mt-2">Earn Commissions Today</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
            Effortlessly build, customize, and manage your own high-converting affiliate store. Maximize your earnings with powerful tools designed for success.
          </p>
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="bg-emerald-100 border border-emerald-300 rounded-lg px-5 py-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-semibold text-base">7-Day FREE Premium Trial</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg text-lg font-semibold transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase Section - Mobile Mockup with Floating Cards on Desktop */}
      <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              See Your Store Come to Life
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
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
                          
                          {/* Store Name and Description */}
                          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">The Coffee Maker</h2>
                          <p className="text-sm text-gray-600 mb-4">Welcome to my awesome store! Discover unique products curated just for you.</p>
                          
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

                      
                        </div>

                        {/* Categories */}
                        <div className="px-4 mb-4">
                          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1">
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden border-2 border-emerald-500 grid grid-cols-2 grid-rows-2 gap-0">
                                <div className="w-full h-full">
                                  <img src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.pexels.com/photos/27609746/pexels-photo-27609746.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.pexels.com/photos/1627820/pexels-photo-1627820.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-emerald-600">All</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Fashion category" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Fashion</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.pexels.com/photos/414720/pexels-photo-414720.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Health category" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Health</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Office category" className="w-full h-full object-cover" />
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
                              { name: 'Wireless Headphones', price: '$149.99', image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                              { name: 'High Smart Watch Pro', price: '$299.99', image: 'https://images.pexels.com/photos/27609746/pexels-photo-27609746.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                              { name: 'Designer Backpack', price: '$89.99', image: 'https://images.pexels.com/photos/1627820/pexels-photo-1627820.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                              { name: 'Sport Sneakers', price: '$129.99', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                              { name: 'Laptop Computer', price: '$999.99', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                              { name: 'Bluetooth Speaker', price: '$79.99', image: 'https://images.pexels.com/photos/31683433/pexels-photo-31683433.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' }
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
                              <img src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-full">
                              <img src="https://images.pexels.com/photos/27609746/pexels-photo-27609746.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-full">
                              <img src="https://images.pexels.com/photos/1627820/pexels-photo-1627820.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-full">
                              <img src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Product collage" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-emerald-600">All</p>
                        </div>
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Fashion category" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-gray-600">Fashion</p>
                        </div>
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.pexels.com/photos/414720/pexels-photo-414720.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Health category" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-gray-600">Health</p>
                        </div>
                        <div className="flex-shrink-0 mx-0.5 sm:mx-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md overflow-hidden bg-gray-200">
                            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Office category" className="w-full h-full object-cover" />
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
                          { name: 'Wireless Headphones', price: '$149.99', image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                          { name: 'Smart Watch Pro', price: '$299.99', image: 'https://images.pexels.com/photos/27609746/pexels-photo-27609746.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                          { name: 'Designer Backpack', price: '$89.99', image: 'https://images.pexels.com/photos/1627820/pexels-photo-1627820.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                          { name: 'Sport Sneakers', price: '$129.99', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                          { name: 'Laptop Computer', price: '$999.99', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
                          { name: 'Bluetooth Speaker', price: '$79.99', image: 'https://images.pexels.com/photos/31683433/pexels-photo-31683433.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' }
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

      {/* Features Section - Visual Mockups with Alternating Layout */}
      <section id="features" className="py-20 sm:py-28 lg:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to build, customize, and grow your affiliate marketing business.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {/* Feature 1: Product Scraper - Left */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Smart Product Scraper</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Paste any product URL and our smart scraper automatically extracts product details, images, prices, and descriptions. Save hours of manual data entry.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-white flex-1 overflow-auto">
                    <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-3 shadow-sm mb-4">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <input type="text" placeholder="amazon.com/product/..." className="flex-1 text-sm text-gray-500 bg-transparent border-none outline-none" readOnly />
                    </div>
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow mb-4">
                      Scrape Product
                    </button>
                    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                      <div className="flex items-center text-xs font-semibold bg-gray-200 border-b border-gray-200">
                        <div className="p-3 w-1/12 min-w-[50px]">
                          <div className="h-3 bg-gray-400 rounded w-full"></div>
                        </div>
                        <div className="p-3 w-7/12">
                          <div className="h-3 bg-gray-400 rounded w-1/2"></div>
                        </div>
                        <div className="p-3 w-4/12">
                          <div className="h-3 bg-gray-400 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200">
                        <div className="p-3 w-1/12 min-w-[50px]">
                          <div className="aspect-square w-full bg-gray-200 rounded"></div>
                        </div>
                        <div className="p-3 w-7/12">
                          <div className="h-3 bg-gray-300 rounded w-11/12 mb-1.5"></div>
                          <div className="h-2 bg-gray-200 rounded w-8/12"></div>
                        </div>
                        <div className="p-3 w-4/12">
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200">
                        <div className="p-3 w-1/12 min-w-[50px]">
                          <div className="aspect-square w-full bg-gray-200 rounded"></div>
                        </div>
                        <div className="p-3 w-7/12">
                          <div className="h-3 bg-gray-300 rounded w-9/12 mb-1.5"></div>
                          <div className="h-2 bg-gray-200 rounded w-7/12"></div>
                        </div>
                        <div className="p-3 w-4/12">
                          <div className="h-3 bg-gray-300 rounded w-3/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Store Customization - Right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Custom Store Builder</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Design your perfect store with our intuitive customization tools. Choose colors, fonts, layouts, and branding to match your unique style.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-white flex-1 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex gap-3 justify-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white shadow-lg"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
                        <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white shadow-lg"></div>
                      </div>
                      <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-md">
                        <div className="flex flex-col items-center text-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mb-3"></div>
                          <div className="space-y-2 w-full">
                            <div className="h-2.5 bg-gray-300 rounded w-2/3 mx-auto"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg"></div>
                          <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg"></div>
                          <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Analytics Dashboard - Left */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Real-Time Analytics</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Track every metric that matters. Monitor store views, product clicks, conversion rates, and user behavior with detailed real-time analytics.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-white flex-1 flex flex-col justify-center">
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-md space-y-3">
                      <div className="text-center pb-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Real-Time Dashboard</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
                          <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600 mb-1">Views</p>
                          <p className="text-lg font-bold text-blue-600">1,234</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
                          <MousePointer className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600 mb-1">Clicks</p>
                          <p className="text-lg font-bold text-green-600">567</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 mb-2">Traffic Trend</p>
                        <div className="h-16 flex items-end gap-1">
                          <div className="flex-1 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t" style={{height: '45%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t" style={{height: '65%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-orange-600 to-orange-500 rounded-t" style={{height: '85%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-orange-700 to-orange-600 rounded-t" style={{height: '100%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-orange-600 to-orange-500 rounded-t" style={{height: '75%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Email Subscriptions - Right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Email Subscriptions</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Build your audience with built-in subscription forms. Send notifications about new products and keep your customers engaged.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-white flex-1 flex flex-col justify-center items-center">
                    <div className="bg-white rounded-2xl border-2 border-pink-200 shadow-2xl p-8 max-w-md w-full">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Mail className="w-8 h-8 text-pink-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Stay Updated!</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <input type="email" placeholder="Enter your email" className="flex-1 text-sm text-gray-500 bg-transparent border-none outline-none" readOnly />
                        </div>
                        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white text-base font-semibold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Promotional Slides - Left */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Promotional Slides</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Create eye-catching promotional slides and pop-up banners to highlight special offers, featured products, and drive conversions.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-white flex-1 flex flex-col justify-center">
                    <div className="relative h-48 overflow-hidden shadow-lg rounded-lg">
                      <div className="relative h-full">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                          <ImageIcon className="w-24 h-24 text-white/60" />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                          <h2 className="text-2xl font-bold mb-2 text-white">Summer Sale</h2>
                          <p className="text-sm text-gray-100">Up to 50% off on selected items</p>
                        </div>
                      </div>

                      <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all z-20">
                        <span className="text-sm font-bold">‹</span>
                      </button>

                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all z-20">
                        <span className="text-sm font-bold">›</span>
                      </button>

                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
                        <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 6: Bulk Import - Right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <SquarePlus className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Bulk CSV Import</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Upload hundreds of products at once with CSV import. Perfect for scaling your store quickly with our easy-to-use bulk upload feature.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-white flex-1 flex flex-col justify-center">
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                        <Code className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-700">products.csv</p>
                        <div className="text-sm text-gray-500 mt-1">250 products ready to import</div>
                      </div>
                      <div className="pt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Uploading... 75%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 7: Popup Banner - Left */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Pop-up Banner</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Capture attention with customizable pop-up banners. Promote special offers, new products, or important announcements to your visitors.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col relative">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-white flex-1 flex flex-col justify-center items-center relative">
                    <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center z-10">
                      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-[240px] w-full">
                        <button className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-700 shadow-lg z-10">
                          ✕
                        </button>
                        <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 h-48 flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-white/60" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center opacity-50">
                      <div className="text-center text-gray-400">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-16 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 8: Floating Widget - Right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Floating Widget</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Add an eye-catching floating widget that follows visitors as they scroll. Perfect for promoting special offers or driving engagement.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col relative">
                  <div className="p-6 bg-gradient-to-br from-cyan-50 to-white flex-1 flex flex-col justify-center relative">
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md h-full relative overflow-hidden">
                      <div className="p-5">
                        <div className="flex flex-col items-center text-center mb-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 mb-3"></div>
                          <div className="space-y-2 w-full">
                            <div className="h-2.5 bg-gray-300 rounded w-2/3 mx-auto"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg"></div>
                          <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg"></div>
                          <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 rounded-full shadow-xl flex items-center justify-center border-2 border-white">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 9: SEO Optimization - Left */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Built-in SEO Optimization</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your store comes with powerful SEO features out of the box. Optimize meta titles, descriptions, Open Graph tags, and more to rank higher in search engines and drive organic traffic.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[320px] flex flex-col">
                  <div className="p-6 bg-gradient-to-br from-teal-50 to-white flex-1 flex flex-col justify-center">
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl border-2 border-teal-200 p-3 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-teal-600" />
                          <span className="text-xs font-semibold text-gray-700">Search Engine Preview</span>
                        </div>
                        <div>
                          <div className="text-base font-semibold text-blue-600 mb-1 line-clamp-1">My Awesome Store - Best Products</div>
                          <div className="text-xs text-green-700 mb-1">https://tiangge.shop/my-store</div>
                          <div className="text-xs text-gray-600 line-clamp-2">Discover amazing products curated just for you. Shop the latest trends with exclusive deals and fast shipping.</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-600 rounded"></div>
                          <span className="text-xs font-semibold text-gray-700">Social Media Card</span>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                          <div className="h-16 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white/40" />
                          </div>
                          <div className="p-2">
                            <div className="h-2 bg-gray-300 rounded w-4/5 mb-1"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-3/5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Slider */}
      <section className="py-20 sm:py-28 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hear from successful affiliate marketers who are growing their businesses with Tiangge.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="px-8 sm:px-12 md:px-16">
              <div
                className="testimonial-slider-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className="testimonial-slider-track"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-slide">
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-12 shadow-lg border border-gray-200">
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-4 sm:mb-6">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-emerald-500 shadow-md"
                            />
                          </div>
                          <div className="flex text-yellow-400 mb-3 sm:mb-4">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                          </div>
                          <p className="text-base sm:text-lg md:text-xl text-gray-700 italic mb-4 sm:mb-6 leading-relaxed max-w-2xl">
                            &ldquo;{testimonial.quote}&rdquo;
                          </p>
                          <div>
                            <p className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</p>
                            <p className="text-emerald-600 font-medium text-sm sm:text-base">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex justify-center mt-6 sm:mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all ${
                    index === currentTestimonial
                      ? 'w-6 sm:w-8 bg-emerald-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  } h-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Compatibility Section - Infinite Brand Carousel */}
      <section className="py-20 sm:py-28 lg:py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Compatible with Leading Platforms
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Promote products from top affiliate programs and platforms worldwide. Create your unique store selling anything from online courses to hosting services, fashion to finance.
            </p>
          </div>

          {/* Infinite Carousel Container */}
          <div className="relative">
            {/* Top Row - Scrolling Right */}
            <div className="carousel-wrapper mb-8">
              <div className="carousel-track">
                {[
                  { name: 'Amazon', domain: 'amazon.com' },
                  { name: 'Shopee', domain: 'shopee.com' },
                  { name: 'Lazada', domain: 'lazada.com' },
                  { name: 'eBay', domain: 'ebay.com' },
                  { name: 'AliExpress', domain: 'aliexpress.com' },
                  { name: 'Walmart', domain: 'walmart.com' },
                  { name: 'Udemy', domain: 'udemy.com' },
                  { name: 'Coursera', domain: 'coursera.org' },
                  { name: 'Skillshare', domain: 'skillshare.com' },
                  { name: 'LinkedIn Learning', domain: 'linkedin.com' },
                  { name: 'Teachable', domain: 'teachable.com' },
                  { name: 'MasterClass', domain: 'masterclass.com' }
                ].map((platform, idx) => (
                  <div key={idx} className="carousel-item">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all h-24 flex items-center justify-center">
                      <img
                        src={`https://logo.clearbit.com/${platform.domain}`}
                        alt={platform.name}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const textFallback = target.nextElementSibling as HTMLElement;
                          if (textFallback) textFallback.style.display = 'block';
                        }}
                      />
                      <span className="text-gray-900 font-semibold text-lg hidden">{platform.name}</span>
                    </div>
                  </div>
                ))}
                {[
                  { name: 'Amazon', domain: 'amazon.com' },
                  { name: 'Shopee', domain: 'shopee.com' },
                  { name: 'Lazada', domain: 'lazada.com' },
                  { name: 'eBay', domain: 'ebay.com' },
                  { name: 'AliExpress', domain: 'aliexpress.com' },
                  { name: 'Walmart', domain: 'walmart.com' },
                  { name: 'Udemy', domain: 'udemy.com' },
                  { name: 'Coursera', domain: 'coursera.org' },
                  { name: 'Skillshare', domain: 'skillshare.com' },
                  { name: 'LinkedIn Learning', domain: 'linkedin.com' },
                  { name: 'Teachable', domain: 'teachable.com' },
                  { name: 'MasterClass', domain: 'masterclass.com' }
                ].map((platform, idx) => (
                  <div key={`dup-${idx}`} className="carousel-item">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all h-24 flex items-center justify-center">
                      <img
                        src={`https://logo.clearbit.com/${platform.domain}`}
                        alt={platform.name}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const textFallback = target.nextElementSibling as HTMLElement;
                          if (textFallback) textFallback.style.display = 'block';
                        }}
                      />
                      <span className="text-gray-900 font-semibold text-lg hidden">{platform.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Row - Scrolling Left */}
            <div className="carousel-wrapper mb-8">
              <div className="carousel-track-reverse">
                {[
                  { name: 'Bluehost', domain: 'bluehost.com' },
                  { name: 'HostGator', domain: 'hostgator.com' },
                  { name: 'SiteGround', domain: 'siteground.com' },
                  { name: 'GoDaddy', domain: 'godaddy.com' },
                  { name: 'Namecheap', domain: 'namecheap.com' },
                  { name: 'WP Engine', domain: 'wpengine.com' },
                  { name: 'HubSpot', domain: 'hubspot.com' },
                  { name: 'Shopify', domain: 'shopify.com' },
                  { name: 'ConvertKit', domain: 'convertkit.com' },
                  { name: 'Canva', domain: 'canva.com' },
                  { name: 'Grammarly', domain: 'grammarly.com' },
                  { name: 'Adobe', domain: 'adobe.com' }
                ].map((platform, idx) => (
                  <div key={idx} className="carousel-item">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all h-24 flex items-center justify-center">
                      <img
                        src={`https://logo.clearbit.com/${platform.domain}`}
                        alt={platform.name}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const textFallback = target.nextElementSibling as HTMLElement;
                          if (textFallback) textFallback.style.display = 'block';
                        }}
                      />
                      <span className="text-gray-900 font-semibold text-lg hidden">{platform.name}</span>
                    </div>
                  </div>
                ))}
                {[
                  { name: 'Bluehost', domain: 'bluehost.com' },
                  { name: 'HostGator', domain: 'hostgator.com' },
                  { name: 'SiteGround', domain: 'siteground.com' },
                  { name: 'GoDaddy', domain: 'godaddy.com' },
                  { name: 'Namecheap', domain: 'namecheap.com' },
                  { name: 'WP Engine', domain: 'wpengine.com' },
                  { name: 'HubSpot', domain: 'hubspot.com' },
                  { name: 'Shopify', domain: 'shopify.com' },
                  { name: 'ConvertKit', domain: 'convertkit.com' },
                  { name: 'Canva', domain: 'canva.com' },
                  { name: 'Grammarly', domain: 'grammarly.com' },
                  { name: 'Adobe', domain: 'adobe.com' }
                ].map((platform, idx) => (
                  <div key={`dup-${idx}`} className="carousel-item">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all h-24 flex items-center justify-center">
                      <img
                        src={`https://logo.clearbit.com/${platform.domain}`}
                        alt={platform.name}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const textFallback = target.nextElementSibling as HTMLElement;
                          if (textFallback) textFallback.style.display = 'block';
                        }}
                      />
                      <span className="text-gray-900 font-semibold text-lg hidden">{platform.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row - Scrolling Right */}
            <div className="carousel-wrapper">
              <div className="carousel-track">
                {[
                  { name: 'Booking.com', domain: 'booking.com' },
                  { name: 'Airbnb', domain: 'airbnb.com' },
                  { name: 'Expedia', domain: 'expedia.com' },
                  { name: 'TripAdvisor', domain: 'tripadvisor.com' },
                  { name: 'Nike', domain: 'nike.com' },
                  { name: 'Adidas', domain: 'adidas.com' },
                  { name: 'Sephora', domain: 'sephora.com' },
                  { name: 'Steam', domain: 'steampowered.com' },
                  { name: 'Spotify', domain: 'spotify.com' },
                  { name: 'Netflix', domain: 'netflix.com' },
                  { name: 'Fiverr', domain: 'fiverr.com' },
                  { name: 'Upwork', domain: 'upwork.com' }
                ].map((platform, idx) => (
                  <div key={idx} className="carousel-item">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all h-24 flex items-center justify-center">
                      <img
                        src={`https://logo.clearbit.com/${platform.domain}`}
                        alt={platform.name}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const textFallback = target.nextElementSibling as HTMLElement;
                          if (textFallback) textFallback.style.display = 'block';
                        }}
                      />
                      <span className="text-gray-900 font-semibold text-lg hidden">{platform.name}</span>
                    </div>
                  </div>
                ))}
                {[
                  { name: 'Booking.com', domain: 'booking.com' },
                  { name: 'Airbnb', domain: 'airbnb.com' },
                  { name: 'Expedia', domain: 'expedia.com' },
                  { name: 'TripAdvisor', domain: 'tripadvisor.com' },
                  { name: 'Nike', domain: 'nike.com' },
                  { name: 'Adidas', domain: 'adidas.com' },
                  { name: 'Sephora', domain: 'sephora.com' },
                  { name: 'Steam', domain: 'steampowered.com' },
                  { name: 'Spotify', domain: 'spotify.com' },
                  { name: 'Netflix', domain: 'netflix.com' },
                  { name: 'Fiverr', domain: 'fiverr.com' },
                  { name: 'Upwork', domain: 'upwork.com' }
                ].map((platform, idx) => (
                  <div key={`dup-${idx}`} className="carousel-item">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all h-24 flex items-center justify-center">
                      <img
                        src={`https://logo.clearbit.com/${platform.domain}`}
                        alt={platform.name}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const textFallback = target.nextElementSibling as HTMLElement;
                          if (textFallback) textFallback.style.display = 'block';
                        }}
                      />
                      <span className="text-gray-900 font-semibold text-lg hidden">{platform.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-4">
              And hundreds more affiliate programs across all industries
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Credit Cards & Finance
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Trading & Crypto
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Digital Downloads
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Health & Fitness
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Gaming & Entertainment
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Insurance
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                Custom Affiliate Links
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - New Section */}
      <section id="pricing" className="py-20 sm:py-28 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your ambition. Upgrade anytime for more power.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10 shadow-lg border-2 border-gray-200 flex flex-col">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Standard</h3>
              <p className="text-gray-600 mb-6 text-base lg:text-lg">Perfect for new affiliate marketers.</p>
              <div className="text-4xl lg:text-5xl font-extrabold text-emerald-600 mb-2">
                Free
                <span className="text-xl lg:text-2xl text-gray-500 font-medium"> / forever</span>
              </div>
              <ul className="space-y-4 text-gray-700 flex-grow mt-8">
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Up to 30 Products
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Store Customization & Theming
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Product Scraping
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Promotional Slides
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Basic Analytics Dashboard
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  Email Subscriptions
                </li>
                <li className="flex items-center text-gray-500 text-base">
                  <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  No Bulk Import
                </li>
                <li className="flex items-center text-gray-500 text-base">
                  <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  No Data Export
                </li>
                <li className="flex items-center text-gray-500 text-base">
                  <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
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
            <div className="bg-emerald-600 text-white rounded-2xl p-8 lg:p-10 shadow-xl border-2 border-emerald-700 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-800 text-white text-sm font-bold px-4 py-2 rounded-bl-xl">
                Most Popular
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Premium</h3>
              <p className="text-emerald-100 mb-6 text-base lg:text-lg">Unlock advanced features for serious growth.</p>
              <div className="mb-4">
                <div className="text-4xl lg:text-5xl font-extrabold mb-2">
                  $3
                  <span className="text-xl lg:text-2xl text-emerald-200 font-medium"> / month</span>
                </div>
                <p className="text-sm lg:text-base text-emerald-100">
                  Save more with quarterly or annual billing
                </p>
              </div>
              <ul className="space-y-4 flex-grow mt-8">
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Unlimited Products
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Advanced Customization
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Bulk Product Import (CSV)
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Floating Widget & Pop-up Banner
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Advanced Analytics & Data Export
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Priority Support
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  Custom Domain Support (Coming Soon)
                </li>
                <li className="flex items-center text-base">
                  <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
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
      <section className="py-20 sm:py-28 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to know about Tiangge
            </p>
          </div>

          <div className="space-y-5">
            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What is Tiangge?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                An affiliate store builder for creating and managing your own online store with products, analytics, and commissions.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Is Tiangge free to use?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Yes! Get a 7-day FREE trial with full Premium access. After the trial, it switches to the free Standard plan (30 products). Upgrade to Premium anytime starting at $3/month with quarterly or annual plans.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>How do I earn money with Tiangge?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Earn affiliate commissions when visitors click products and make purchases through your affiliate links. Tiangge provides the tools to showcase and track products.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Can I customize my store design?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Yes! Customize colors, fonts, layouts, backgrounds, and social media integration to match your brand.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What are sponsored products?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Products placed in stores with 15+ products. They're clearly marked and help keep the platform affordable.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>How does the analytics feature work?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Track store views, product clicks, search queries, and category selections to understand visitor behavior and optimize conversions.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Can I import products in bulk?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Yes! Premium users can import hundreds of products using CSV files. Standard users can add products one at a time or use URL scraping.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What happens after my 7-day trial ends?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Your account switches to the free Standard plan. Premium features are disabled, and only your 30 most recent products remain visible. Upgrade anytime to restore full access.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 group shadow-sm hover:shadow-md transition-shadow">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What if I need help?</span>
                <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Access our Help Center with guides and tutorials, or contact support through the Contact page. Premium users receive priority support.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 lg:py-32 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
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

        /* Testimonial Slider Styles */
        .testimonial-slider-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          isolation: isolate;
        }
        .testimonial-slider-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .testimonial-slide {
          min-width: 100%;
          max-width: 100%;
          flex-shrink: 0;
          padding: 0 8px;
          box-sizing: border-box;
        }
        .testimonial-slide > div {
          width: 100%;
          box-sizing: border-box;
          min-height: 320px;
          display: flex;
          align-items: center;
        }
        @media (max-width: 640px) {
          .testimonial-slide {
            padding: 0 4px;
          }
          .testimonial-slide > div {
            min-height: 280px;
          }
        }

        /* Infinite Brand Carousel Styles */
        .carousel-wrapper {
          overflow: hidden;
          position: relative;
        }
        .carousel-track, .carousel-track-reverse {
          display: flex;
          gap: 1.5rem;
          width: fit-content;
        }
        .carousel-track {
          animation: scroll-left 40s linear infinite;
        }
        .carousel-track-reverse {
          animation: scroll-right 40s linear infinite;
        }
        .carousel-item {
          flex-shrink: 0;
          width: 200px;
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .carousel-track:hover, .carousel-track-reverse:hover {
          animation-play-state: paused;
        }
        `}</style>
      </div>
    </>
  );
}
