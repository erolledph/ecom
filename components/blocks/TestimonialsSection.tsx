'use client';

import React from 'react';
import { Star, Quote, TrendingUp, DollarSign, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Tiangge transformed my blog into a profitable business. I went from $0 to $5,000/month in affiliate commissions within 3 months!',
    rating: 5,
    stats: { revenue: '$5,000', timeframe: '3 months' }
  },
  {
    name: 'Mike Chen',
    role: 'Tech Reviewer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'The analytics dashboard is incredible. I can see exactly which products perform best and optimize my strategy accordingly.',
    rating: 5,
    stats: { clicks: '50K+', conversion: '12%' }
  },
  {
    name: 'Emma Rodriguez',
    role: 'Lifestyle Influencer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Setting up my store was so easy! The customization options are endless, and my audience loves the professional look.',
    rating: 5,
    stats: { followers: '25K', engagement: '8.5%' }
  },
  {
    name: 'David Park',
    role: 'Fitness Coach',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'The mobile optimization is perfect. Most of my traffic comes from mobile, and the conversion rates are amazing.',
    rating: 5,
    stats: { mobile: '85%', conversion: '15%' }
  },
  {
    name: 'Lisa Thompson',
    role: 'Home Decor Enthusiast',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Customer support is outstanding. They helped me set up everything perfectly, and I was earning within the first week!',
    rating: 5,
    stats: { setup: '1 day', earnings: '1 week' }
  },
  {
    name: 'James Wilson',
    role: 'Gaming Content Creator',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'The SEO features helped my store rank on Google. I get organic traffic daily, which converts into steady passive income.',
    rating: 5,
    stats: { organic: '40%', passive: '$2,500' }
  }
];

export function TestimonialsSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary-50/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-secondary-50/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Join thousands of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              successful creators
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how entrepreneurs like you are building profitable affiliate businesses with Tiangge.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {[
            { icon: Users, label: 'Active Stores', value: '10,000+' },
            { icon: DollarSign, label: 'Revenue Generated', value: '$2.5M+' },
            { icon: TrendingUp, label: 'Avg. Growth', value: '300%' },
            { icon: Star, label: 'Satisfaction', value: '4.9/5' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 mb-3 sm:mb-4">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "relative p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-200",
                "hover:shadow-xl hover:border-gray-300 transition-all duration-300",
                "hover:-translate-y-1"
              )}
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gray-200" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-base sm:text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  {Object.entries(testimonial.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="font-semibold text-primary-600">{value}</div>
                      <div className="text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to join them?
            </h3>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Start your affiliate journey today and build a profitable online business that works for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href="/auth"
                className={cn(
                  "inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg",
                  "bg-white text-primary-600 hover:bg-gray-50",
                  "shadow-lg hover:shadow-xl transition-all duration-300",
                  "hover:scale-105"
                )}
              >
                Create Your Store Now
                <TrendingUp className="w-5 h-5 ml-2" />
              </a>
              <div className="flex items-center text-white/80">
                <Star className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="text-sm sm:text-base">Join 10,000+ successful creators</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}