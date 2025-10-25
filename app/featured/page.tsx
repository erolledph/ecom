'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

const featuredStores = [
  {
    id: 1,
    name: 'Fashion Paradise',
    owner: 'StyleMaster',
    description: 'Award-winning fashion store with stunning visual design',
    image: 'https://images.pexels.com/photos/32574415/pexels-photo-32574415.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 2,
    name: 'Tech Haven',
    owner: 'GadgetGuru',
    description: 'Modern tech store with sleek minimalist design',
    image: 'https://images.pexels.com/photos/3184451/pexels-photo-3184451.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 3,
    name: 'Artisan Crafts',
    owner: 'CraftLover',
    description: 'Handmade goods showcase with warm aesthetic',
    image: 'https://images.pexels.com/photos/34151703/pexels-photo-34151703.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 4,
    name: 'Fitness Pro',
    owner: 'HealthyLife',
    description: 'Energetic fitness store with vibrant layout',
    image: 'https://images.pexels.com/photos/29149073/pexels-photo-29149073.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 5,
    name: 'Book Nook',
    owner: 'BookWorm',
    description: 'Cozy bookstore with classic elegant design',
    image: 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 6,
    name: 'Gourmet Delights',
    owner: 'ChefSpecial',
    description: 'Food store with appetizing color scheme',
    image: 'https://images.pexels.com/photos/1639561/pexels-photo-1639561.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 7,
    name: 'Garden Oasis',
    owner: 'PlantLover',
    description: 'Natural plant store with fresh green theme',
    image: 'https://images.pexels.com/photos/13644281/pexels-photo-13644281.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 8,
    name: 'Pet Paradise',
    owner: 'AnimalFriend',
    description: 'Fun pet store with playful design elements',
    image: 'https://images.pexels.com/photos/15731657/pexels-photo-15731657.jpeg',
    link: '#',
    badge: '',
  },
  {
    id: 9,
    name: 'Luxury Goods',
    owner: 'EliteShop',
    description: 'Premium store with sophisticated elegance',
    image: 'https://images.pexels.com/photos/5243552/pexels-photo-5243552.jpeg',
    link: '#',
    badge: 'Elegance Highlight',
  },
];

function StoreCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  );
}

export default function FeaturedPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
            Inspirational Customizations
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
            Featured Stores
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most beautifully customized stores from our community. These store owners have mastered the art of customization and design.
          </p>
          <p className="text-base sm:text-lg text-gray-500 mt-4">
            Get inspired and create your own stunning store to be featured next!
          </p>
        </div>

        {/* Featured Stores Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {Array.from({ length: 9 }).map((_, index) => (
              <StoreCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={store.link}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100"
              >
                {/* Store Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  {/* Badge */}
               {/*
                  <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {store.badge}
                  </div>
                  */}
                </div>

                {/* Store Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    by <span className="font-semibold text-gray-700">{store.owner}</span>
                  </p>
                  {/* 
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {store.description}
                  </p>
                  */}

                  {/* Visit Button */}
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    Visit Store
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Want to be featured?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Create your own beautifully customized store and share it with the community. Show off your creativity and design skills to inspire others!
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
