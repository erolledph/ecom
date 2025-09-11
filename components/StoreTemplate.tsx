'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Store, Product, Slide } from '@/lib/store';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface StoreTemplateProps {
  store: Store;
  products: Product[];
  slides: Slide[];
  categories: Array<{ id: string; name: string; image: string; count?: number }>;
  initialCategory?: string;
}

export default function StoreTemplate({ store, products, slides, categories, initialCategory }: StoreTemplateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [visibleProductsCount, setVisibleProductsCount] = useState(9);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  // Reset visible products count when category changes
  useEffect(() => {
    setVisibleProductsCount(9);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(newUrl, { scroll: false });
  };
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

  const visibleProducts = filteredProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = filteredProducts.length > visibleProductsCount;

  const loadMoreProducts = () => {
    setVisibleProductsCount(prev => Math.min(prev + 9, filteredProducts.length));
  };
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

  const handleWidgetClick = () => {
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans max-w-md mx-auto">
      {/* Header */}
      <header className="relative text-center text-white py-4 rounded-b-xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          {store.avatar && (
            <div className="w-32 h-32 rounded-full overflow-hidden mb-2 border-4 border-white shadow-lg">
              <Image
                src={store.avatar}
                alt={store.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-[0.8rem] font-extrabold text-white mb-1">{store.name}</h1>
          <p className="text-[0.8rem] text-gray-200 max-w-xs mb-2 leading-snug">{store.description}</p>
          <div className="flex space-x-[5px]">
            {store.socialLinks.instagram && (
              <a
                href={store.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {store.socialLinks.twitter && (
              <a
                href={store.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {store.socialLinks.facebook && (
              <a
                href={store.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Slider Section */}
      {slides.length > 0 && (
        <section className="py-6">
          <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out w-full h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="min-w-full relative cursor-pointer"
                  onClick={() => handleSlideClick(slide.link)}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={1200}
                    height={400}
                    className="w-full h-full object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
                    <h2 className="text-[0.8rem] font-bold mb-2">{slide.title}</h2>
                    {slide.description && (
                      <p className="text-[0.8rem] max-w-2xl">{slide.description}</p>
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Pagination Dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-[5px]">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 pb-4 overflow-x-auto category-scroller">
          <div className="flex space-x-[5px] px-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className="flex flex-col items-center cursor-pointer text-center text-gray-700"
              >
                <div
                  className={`w-20 h-20 rounded-full shadow-md overflow-hidden ${
                    selectedCategory === category.id
                      ? `bg-indigo-200 border-2`
                      : 'bg-gray-200'
                  } ${
                    category.id === 'all' 
                      ? 'grid grid-cols-2 grid-rows-2 gap-0' 
                      : 'flex items-center justify-center'
                  }`}
                  style={selectedCategory === category.id ? { borderColor: activeCategoryBorderColor } : {}}
                >
                  {category.id === 'all' ? (
                    // Photo collage for "All Products"
                    products
                      .filter(product => product.images && product.images[0])
                      .slice(0, 4)
                      .map((product, index) => (
                        <div key={`collage-${product.id}-${index}`} className="w-full h-full">
                          <Image
                            src={product.images![0]}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                  ) : category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[0.8rem] font-semibold text-gray-700">
                      {category.id === 'all' ? 'All' : category.name}
                    </span>
                  )}
                </div>
                <span className="text-[0.8rem] font-semibold mt-1 whitespace-nowrap">{category.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className="container mx-auto px-4 py-6" id="products">
        <div className="mb-6">
          <h2 className="text-[0.8rem] font-bold text-gray-900 mb-2">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
          </h2>
          <p className="text-[0.8rem] text-gray-600">Browse our complete collection</p>
          
          {/* Search Input */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        {searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {searchFilteredProducts.length} result{searchFilteredProducts.length !== 1 ? 's' : ''} found for "{searchTerm}"
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-[5px]">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.productLink)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                {product.images && product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-[5px]">
                <h3 className="font-semibold text-gray-800 line-clamp-2 text-[0.8rem] mb-[5px] min-h-[2.4rem]">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-600 text-[0.8rem]">{currencySymbol}{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMoreProducts && (
          <div className="text-center mt-6">
            <button
              onClick={loadMoreProducts}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Load More Products
            </button>
          </div>
        )}
        
        {/* No Results Message */}
        {searchTerm && searchFilteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all products.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner rounded-t-lg mt-4 p-4 md:p-6 text-center text-gray-600">
        <div className="flex justify-center space-x-[5px] mb-4">
          {store.socialLinks.instagram && (
            <a
              href={store.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {store.socialLinks.twitter && (
            <a
              href={store.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}
          {store.socialLinks.facebook && (
            <a
              href={store.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </a>
          )}
        </div>
        <p className="text-[0.8rem]">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
      </footer>

      {/* Floating Widget */}
      {(store.widgetImage || store.avatar) && (
        <button
          onClick={() => {
            if (store.widgetLink) {
              window.open(store.widgetLink, '_blank', 'noopener,noreferrer');
            } else {
              handleWidgetClick();
            }
          }}
          className="fixed bottom-4 right-4 z-50 animate-pulse"
          style={{ animation: 'pulse-animation 2s infinite cubic-bezier(0.4, 0, 0.6, 1)' }}
        >
          <Image
            src={store.widgetImage || store.avatar}
            alt={`${store.name} Store`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full shadow-lg"
          />
        </button>
      )}

      {/* Popup Message */}
      <div
        className={`absolute bottom-20 right-4 bg-gray-800 text-white text-[0.8rem] p-3 rounded-lg shadow-xl transition-opacity duration-300 ${
          isPopupVisible ? 'opacity-100' : 'opacity-0 hidden'
        }`}
      >
        Your special surprise awaits!
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .category-scroller::-webkit-scrollbar {
          display: none;
        }
        .category-scroller {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @keyframes pulse-animation {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
