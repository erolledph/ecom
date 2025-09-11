'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Store, Product, Slide } from '@/lib/store';
import { Instagram, Twitter, Facebook, Search, ShoppingCart } from 'lucide-react';

interface StoreTemplateProps {
  store: Store;
  products: Product[];
  slides: Slide[];
  categories: Array<{ id: string; name: string; image: string }>;
}

export default function StoreTemplate({ store, products, slides, categories }: StoreTemplateProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Featured or flash sale products (e.g., first 4 as flash sales)
  const flashSales = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-orange-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {store.avatar && (
              <Image
                src={store.avatar}
                alt={store.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <h1 className="text-xl font-bold">{store.name}</h1>
          </div>
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
            <div className="flex space-x-2">
              {store.socialLinks.instagram && (
                <a href={store.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {store.socialLinks.twitter && (
                <a href={store.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {store.socialLinks.facebook && (
                <a href={store.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
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
                  className="w-full h-64 md:h-96 object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center p-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                  {slide.description && <p className="text-lg">{slide.description}</p>}
                  <button className="mt-4 bg-white text-orange-500 px-6 py-2 rounded-full font-bold">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center cursor-pointer min-w-[80px] ${
                  selectedCategory === category.id ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">{category.name[0]}</span>
                  )}
                </div>
                <span className="text-xs text-center">{category.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sales Section */}
      <section className="container mx-auto px-4 py-4 bg-red-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Flash Sales</h2>
          <div className="text-red-600 font-bold">Ends in 02:59:59</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSales.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.productLink)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-20%</span>
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold line-clamp-2">{product.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-red-600 font-bold">${product.price}</span>
                  <span className="text-gray-500 line-through text-xs ml-2">${(product.price * 1.25).toFixed(2)}</span>
                </div>
                <div className="flex items-center text-yellow-400 text-xs mt-1">
                  ★★★★☆ (123)
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.productLink)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <Image
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-semibold line-clamp-2">{product.title}</h3>
                <span className="text-orange-500 font-bold">${product.price}</span>
                <div className="flex items-center text-yellow-400 text-xs mt-1">
                  ★★★★☆ (456)
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.productLink)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <Image
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-semibold line-clamp-2">{product.title}</h3>
                <span className="text-orange-500 font-bold">${product.price}</span>
                <div className="flex items-center text-yellow-400 text-xs mt-1">
                  ★★★★☆ (789)
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 py-8">No products found.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">About Us</h3>
              <p className="text-sm text-gray-600">{store.description}</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Customer Service</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Help Center</li>
                <li>Returns</li>
                <li>Shipping</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Instagram className="w-6 h-6 text-gray-600" />
                <Twitter className="w-6 h-6 text-gray-600" />
                <Facebook className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Payment Methods</h3>
              <div className="flex space-x-2">
                <Image src="/visa.png" alt="Visa" width={40} height={25} />
                <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">&copy; 2025 {store.name}. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Widget (Chat/Support) */}
      {store.avatar && (
        <button
          onClick={handleWidgetClick}
          className="fixed bottom-6 right-6 z-50 bg-orange-500 text-white p-4 rounded-full shadow-lg animate-pulse"
        >
          <Image
            src={store.avatar}
            alt="Support"
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>
      )}

      {/* Popup Message */}
      <div
        className={`fixed bottom-20 right-6 bg-white text-gray-800 p-4 rounded-lg shadow-xl max-w-sm transition-opacity duration-300 ${
          isPopupVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p>Your special surprise awaits! Check out our latest deals.</p>
      </div>
    </div>
  );
}
