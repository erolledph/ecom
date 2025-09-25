'use client';

import React from 'react';
import { Store, Palette, ChartBar as BarChart3, Smartphone, Globe, Zap, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Store,
    title: 'Easy Store Creation',
    description: 'Build your affiliate store in minutes with our intuitive drag-and-drop interface.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Palette,
    title: 'Full Customization',
    description: 'Customize colors, fonts, layouts, and branding to match your unique style.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track clicks, conversions, and revenue with detailed analytics dashboard.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Your store looks perfect on all devices with responsive design.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Globe,
    title: 'SEO Ready',
    description: 'Built-in SEO optimization to help your store rank higher in search results.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with automatic image compression and caching.',
    color: 'from-yellow-500 to-orange-500'
  }
];

export function FeaturesSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Everything you need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              succeed online
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Build, customize, and grow your affiliate business with our comprehensive suite of tools designed for modern entrepreneurs.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-200",
                  "hover:shadow-xl hover:border-gray-300 transition-all duration-300",
                  "hover:-translate-y-1"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-6",
                  "bg-gradient-to-br", feature.color,
                  "group-hover:scale-110 transition-transform duration-300"
                )}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a
              href="/auth"
              className={cn(
                "inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg",
                "bg-gradient-to-r from-primary-600 to-secondary-600 text-white",
                "hover:from-primary-700 hover:to-secondary-700",
                "shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-105"
              )}
            >
              Start Building Your Store
              <Store className="w-5 h-5 ml-2" />
            </a>
            <div className="flex items-center text-gray-600">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              <span className="text-sm sm:text-base">Free to start • No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}