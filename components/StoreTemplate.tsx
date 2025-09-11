'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Store, Product, Slide } from '@/lib/store';
import { Instagram, Twitter, Facebook, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoreTemplateProps {
  store: Store;
  products: Product[];
  slides: Slide[];
  categories: Array<{ id: string; name: string; image: string }>;
}

export default function StoreTemplate({ store, products, slides, categories }: StoreTemplateProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleProductClick = (productLink?: string) => {
    if (productLink) {
      window.open(productLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSlideClick = (slideLink?: string) => {
    if (slideLink) {
      window.open(slideLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {store.avatar && (
                <Image
                  src={store.avatar}
                  alt={store.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {store.socialLinks.instagram && (
                <a
                  href={store.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {store.socialLinks.twitter && (
                <a
                  href={store.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {store.socialLinks.facebook && (
                <a
                  href={store.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with New Arrivals and Slider */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* New Arrivals - Left Column */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">New Arrivals</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.productLink)}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {product.images && product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      )}
                      {/* Centered hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-primary-600 font-semibold text-sm">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Slider - Right Column */}
            <div>
              {slides.length > 0 && (
                <div className="slider-container relative">
                  <div 
                    className="slider-content"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className="slider-slide cursor-pointer"
                        onClick={() => handleSlideClick(slide.link)}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                          priority={index === 0}
                        />
                        <div className="slider-overlay">
                          <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            {slide.title}
                          </h2>
                          {slide.description && (
                            <p className="text-lg opacity-90 mb-4">
                              {slide.description}
                            </p>
                          )}
                          {slide.link && (
                            <div className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                              Shop Now
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      <div className="slider-dots">
                        {slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Store Description */}
      <section className="bg-gray-50 compact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto">
            {store.description}
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 1 && (
        <section className="bg-white compact-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Shop by Category
            </h2>
            <div className="flex justify-center">
              <div className="category-scroller flex space-x-4 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-circle ${
                      selectedCategory === category.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {category.image && category.id !== 'all' ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-700 text-center px-2">
                        {category.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
          </h2>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.productLink)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {product.images && product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                    {/* Centered hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-primary-600 font-semibold text-lg">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Widget */}
      {store.avatar && (
        <div className="floating-widget">
          <Image
            src={store.avatar}
            alt={`${store.name} Store`}
            width={60}
            height={60}
            className="w-15 h-15"
          />
        </div>
      )}
    </div>
  );
}
