'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Store, Product, Slide } from '@/lib/store';
import { Instagram, Twitter, Facebook, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface StoreTemplateProps {
  store: Store;
  products: Product[];
  slides: Slide[];
  categories: Category[];
}

export default function StoreTemplate({ store, products, slides, categories }: StoreTemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleProductClick = (product: Product) => {
    if (product.productLink) {
      window.open(product.productLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSlideClick = (slide: Slide) => {
    if (slide.link) {
      window.open(slide.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Store Info */}
            <div className="flex items-center space-x-4">
              {store.avatar && (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={store.avatar}
                    alt={store.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                <p className="text-sm text-gray-600 hidden sm:block">{store.description}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {store.socialLinks.instagram && (
                <a
                  href={store.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {store.socialLinks.twitter && (
                <a
                  href={store.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {store.socialLinks.facebook && (
                <a
                  href={store.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Slider */}
          {slides.length > 0 && (
            <section className="relative">
              <div className="slider-container aspect-[16/9] md:aspect-[21/9] max-h-96">
                <div 
                  className="slider-content"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="slider-slide cursor-pointer"
                      onClick={() => handleSlideClick(slide)}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="slider-overlay">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2 text-center">
                          {slide.title}
                        </h2>
                        {slide.description && (
                          <p className="text-lg md:text-xl text-center max-w-2xl">
                            {slide.description}
                          </p>
                        )}
                        {slide.link && (
                          <div className="mt-4 flex items-center text-white/80">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span className="text-sm">Click to visit</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {slides.length > 1 && (
                  <div className="slider-dots">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Categories */}
          {categories.length > 1 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="category-scroller flex space-x-4 overflow-x-auto pb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-circle ${
                      selectedCategory === category.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 bg-white hover:border-primary-300'
                    }`}
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-xs font-medium text-gray-700 text-center px-2">
                          {category.name}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Products Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
              </h2>
              <span className="text-sm text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-200 group"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                      {product.productLink && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/70 text-white p-1 rounded">
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2-custom mb-1">
                        {product.title}
                      </h3>
                      <p className="text-primary-600 font-bold text-lg">
                        ${product.price}
                      </p>
                      {product.description && (
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2-custom">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  {selectedCategory === 'all' 
                    ? 'This store doesn\'t have any products yet.'
                    : `No products found in the "${selectedCategory}" category.`
                  }
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating Store Avatar */}
      {store.avatar && (
        <div className="floating-widget">
          <Image
            src={store.avatar}
            alt={store.name}
            width={60}
            height={60}
            className="w-15 h-15"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
            <p className="text-gray-600 mb-4">{store.description}</p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4 mb-6">
              {store.socialLinks.instagram && (
                <a
                  href={store.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {store.socialLinks.twitter && (
                <a
                  href={store.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {store.socialLinks.facebook && (
                <a
                  href={store.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              © 2024 {store.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}