'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getStoreBySlug, getStoreProducts, getStoreSlides, generateCategoriesFromProducts, Store, Product, Slide } from '@/lib/store';

// This ensures the page is dynamically rendered
export const dynamic = 'force-dynamic';


export default function StorePage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Widget state
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        
        // Fetch store by slug
        const storeData = await getStoreBySlug(storeSlug);
        if (!storeData) {
          setNotFound(true);
          return;
        }
        
        setStore(storeData);
        
        // Fetch products, slides, and generate categories
        const [productsData, slidesData, categoriesData] = await Promise.all([
          getStoreProducts(storeData.id),
          getStoreSlides(storeData.id),
          generateCategoriesFromProducts(storeData.id)
        ]);
        
        setProducts(productsData.filter(p => p.isActive));
        setSlides(slidesData.filter(s => s.isActive).sort((a, b) => a.order - b.order));
        setCategories(categoriesData);
        
      } catch (error) {
        console.error('Error fetching store data:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (storeSlug) {
      fetchStoreData();
    }
  }, [storeSlug]);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (productLink: string) => {
    window.open(productLink, '_blank');
  };

  const handleGiftWidget = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600">The store you&apos;re looking for doesn&apos;t exist or has been deactivated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <main className="container mx-auto p-2">
        {/* Header */}
        <header className="relative text-center text-white py-4 compact-section rounded-b-xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: store.backgroundImage ? `url('${store.backgroundImage}')` : 'none' }}
          ></div>
          <div className={`absolute inset-0 ${store.backgroundImage ? 'bg-black opacity-50' : 'bg-gray-600'}`}></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            {store.avatar ? (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-2 border-4 border-white shadow-lg relative">
                <Image 
                  src={store.avatar} 
                  alt="Store Avatar" 
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-2 border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-gray-600 text-sm">No Avatar</span>
              </div>
            )}
            <h1 className="text-2xl font-extrabold text-white mb-1">{store.name}</h1>
            <p className="text-gray-200 max-w-xs mb-2 leading-snug">{store.description}</p>
            <div className="flex space-x-2">
              {store.socialLinks.instagram && (
                <a href={store.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition-colors">
                  <i className="fab fa-instagram text-2xl"></i>
                </a>
              )}
              {store.socialLinks.twitter && (
                <a href={store.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
              )}
              {store.socialLinks.facebook && (
                <a href={store.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-600 transition-colors">
                  <i className="fab fa-facebook text-2xl"></i>
                </a>
              )}
            </div>
          </div>
        </header>
        
        {/* Categories */}
        {categories.length > 0 && (
          <section className="mt-4 pb-4 overflow-x-auto category-scroller">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex flex-col items-center cursor-pointer text-center text-gray-700"
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  <div className="category-circle shadow-md overflow-hidden">
                    {category.image ? (
                      <Image 
                        src={category.image} 
                        alt={category.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold mt-1 whitespace-nowrap">{category.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '5px' }}>
          {/* Slider Card */}
          {slides.length > 0 && (
            <div className="product-card bg-white rounded-md shadow-lg overflow-hidden">
              <div className="slider-container">
                <div 
                  className="slider-content"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={slide.id} className="slider-slide">
                      <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                      <div className="slider-overlay">
                        <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
                        {slide.description && (
                          <p className="text-lg mt-2">{slide.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {slides.length > 1 && (
                  <div className="slider-dots">
                    {slides.map((_, index) => (
                      <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="product-card bg-white rounded-md shadow-lg overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product.productLink)}
            >
              <div className="aspect-square overflow-hidden relative">
                {product.images && product.images.length > 0 && product.images[0] ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-2 flex flex-col items-start" style={{ height: '75px' }}>
                <h2 className="font-bold text-gray-800 line-clamp-2-custom mb-1" style={{ fontSize: '0.8rem' }}>
                  {product.name}
                </h2>
                <span className="font-bold text-indigo-600 mt-auto" style={{ fontSize: '0.8rem' }}>
                  ${product.price}
                </span>
              </div>
            </div>
          ))}

          {/* Featured Card - Show if we have products */}
          {products.length > 0 && (
            <div className="featured-card bg-white rounded-md shadow-lg overflow-hidden flex flex-col justify-between cursor-pointer" style={{ height: '100%' }}>
              <div className="p-2">
                <h2 className="font-bold text-gray-800" style={{ fontSize: '0.8rem' }}>Featured Products</h2>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 p-2">
                {products.slice(0, 4).map((product, index) => (
                  <div key={product.id} className="aspect-square overflow-hidden rounded-lg relative">
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <Image 
                        src={product.images[0]}
                        fill
                        className="object-cover"
                        alt={product.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-500 line-clamp-2-custom">A curated selection of our best-selling items.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner rounded-t-lg mt-2 p-4 md:p-6 text-center text-gray-500">
        <p className="text-sm">&copy; 2025 {store.name}. All rights reserved.</p>
      </footer>

      {/* Floating Widget */}
      <button onClick={handleGiftWidget} className="floating-widget">
        <Image 
          src="https://placehold.co/100x100/fuchsia-600/ffffff?text=🎁" 
          alt="Gift Box" 
          width={64}
          height={64}
          className="rounded-full shadow-lg"
        />
      </button>
      
      {/* Popup Message */}
      {showPopup && (
        <div className="fixed bottom-20 right-4 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-xl transition-opacity duration-300">
          Your special surprise awaits!
        </div>
      )}
    </div>
  );
}