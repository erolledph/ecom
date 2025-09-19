'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Store, Product, Slide } from '@/lib/store';
import { trackEvent } from '@/lib/analytics';
import { trackSubscriptionEvent } from '@/lib/analytics';
import SubscriptionModal from '@/components/SubscriptionModal';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  Linkedin,
  Github,
  Globe,
  MessageCircle,
  Camera,
  Music,
  Search 
} from 'lucide-react';

// Social platform icon mapping
const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music,
  snapchat: Camera,
  pinterest: MessageCircle,
  github: Github,
  website: Globe,
};

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
  const [visibleAllProductsCount, setVisibleAllProductsCount] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBannerPopup, setShowBannerPopup] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Show subscription modal on component mount if subscription is enabled
  useEffect(() => {
    if (store.subscriptionEnabled !== false) {
      const timer = setTimeout(() => {
        setShowSubscriptionModal(true);
      }, 5000); // Show subscription modal after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [store.subscriptionEnabled]);

  // Track store view on component mount (client-side only)
  useEffect(() => {
    const trackStoreView = async () => {
      try {
        await trackEvent('store_view', store.ownerId, {
          store_slug: store.slug,
          store_name: store.name,
          store_id: store.id,
          products_count: products.length,
          slides_count: slides.filter(slide => slide.isActive).length,
          categories_count: categories.length - 1, // Subtract 1 for "All" category
          initial_category: initialCategory || 'all',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Fail silently to not disrupt user experience
        console.warn('Failed to track store view:', error);
      }
    };

    trackStoreView();
  }, [store.ownerId, store.slug, store.name, store.id, products.length, slides.length, categories.length, initialCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(e.target.value);
    
    // Debounce search tracking to avoid too many events
    if (newSearchTerm.length >= 3) {
      const timeoutId = setTimeout(() => {
        const filteredProducts = products.filter(product =>
          product.title.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(newSearchTerm.toLowerCase())
        );
        
        trackEvent('product_search', store.ownerId, {
          search_term: newSearchTerm,
          store_slug: store.slug,
          store_name: store.name,
          results_count: filteredProducts.length,
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  // Get displayed products with category prioritization and search filtering
  const getDisplayedProducts = () => {
    // If search term is active, filter all products by search
    if (searchTerm) {
      return products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // If specific category is selected, show only that category
    if (selectedCategory !== 'all') {
      return products.filter(product => product.category === selectedCategory);
    }
    
    // Default: show all products
    return products;
  };

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
    setVisibleAllProductsCount(9);
  }, [selectedCategory]);

  // Show banner popup on component mount if banner is enabled
  useEffect(() => {
    if (store.bannerEnabled !== false && store.bannerImage) {
      const timer = setTimeout(() => {
        setShowBannerPopup(true);
      }, 2000); // Show banner after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [store.bannerEnabled, store.bannerImage]);

  const handleBannerClose = () => {
    setShowBannerPopup(false);
  };

  const activeCategoryBorderColor = store.customization?.activeCategoryBorderColor || '#6366f1';
  const currencySymbol = store.customization?.currencySymbol || '$';
  const storeNameColor = store.customization?.storeNameFontColor || '#ffffff';
  const priceColor = store.customization?.priceFontColor || '#059669';

  const handleCategoryChange = (categoryId: string) => {
    // Track category filter
    trackEvent('category_filter', store.ownerId, {
      category_name: categoryId,
      store_slug: store.slug,
      store_name: store.name,
      previous_category: selectedCategory,
    });
    
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const finalFilteredProducts = getDisplayedProducts();
  const visibleProducts = finalFilteredProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = finalFilteredProducts.length > visibleProductsCount;

  const loadMoreProducts = () => {
    setVisibleProductsCount(prev => Math.min(prev + 9, finalFilteredProducts.length));
  };

  const loadMoreAllProducts = () => {
    setVisibleAllProductsCount(prev => Math.min(prev + 9, products.length));
  };

  const handleProductClick = (productLink?: string) => {
    if (productLink) {
      // Track product click before redirect
      trackEvent('product_click', store.ownerId, {
        product_link: productLink,
        store_slug: store.slug,
        store_name: store.name,
      });
      window.open(productLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProductClickWithDetails = (product: Product) => {
    // Track product click with detailed information
    trackEvent('product_click', store.ownerId, {
      product_id: product.id,
      product_title: product.title,
      product_category: product.category,
      product_price: product.price,
      store_slug: store.slug,
      store_name: store.name,
      destination_link: product.productLink,
    });
    
    if (product.productLink) {
      window.open(product.productLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSlideClick = (slideLink?: string) => {
    if (slideLink) {
      // Track slide click before redirect
      trackEvent('slide_click', store.ownerId, {
        slide_link: slideLink,
        store_slug: store.slug,
        store_name: store.name,
      });
      window.open(slideLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSlideClickWithDetails = (slide: Slide) => {
    // Track slide click with detailed information
    trackEvent('slide_click', store.ownerId, {
      slide_id: slide.id,
      slide_title: slide.title,
      slide_order: slide.order,
      store_slug: store.slug,
      store_name: store.name,
      destination_link: slide.link,
    });
    
    if (slide.link) {
      window.open(slide.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWidgetClick = () => {
    // Track widget click
    trackEvent('widget_click', store.ownerId, {
      widget_image_url: store.widgetImage || store.avatar,
      store_slug: store.slug,
      store_name: store.name,
      destination_link: store.widgetLink,
      has_link: !!store.widgetLink,
    });
    
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
  };

  const handleSocialLinkClick = (platform: string, url: string) => {
    trackEvent('social_link_click', store.ownerId, {
      platform,
      store_slug: store.slug,
      store_name: store.name,
      destination_link: url,
    });
  };

  const handleSubscriptionModalClose = () => {
    // Track subscription modal close event
    trackSubscriptionEvent('subscription_form_close', store.ownerId, {
      store_slug: store.slug,
      store_name: store.name,
      had_interaction: false, // Could be enhanced to track if user interacted with form
    });
    
    setShowSubscriptionModal(false);
  };

  // Get header layout style
  const getHeaderLayoutStyle = () => {
    switch (store.headerLayout) {
      case 'right-left':
        return 'flex-row-reverse';
      case 'center':
        return 'flex-col items-center';
      default: // 'left-right'
        return 'flex-row';
    }
  };

  return (
    <div 
      className="min-h-screen max-w-md mx-auto"
      style={{
        fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
        color: store.customization?.bodyTextColor || '#374151',
        backgroundColor: store.customization?.storeBackgroundColor || '#f3f4f6',
        background: store.customization?.mainBackgroundGradientStartColor && store.customization?.mainBackgroundGradientEndColor
          ? `linear-gradient(135deg, ${store.customization.mainBackgroundGradientStartColor}, ${store.customization.mainBackgroundGradientEndColor})`
          : store.customization?.storeBackgroundColor || '#f3f4f6'
      }}
    >
      {/* Header Section */}
      <header 
        className="relative text-white py-4 overflow-hidden"
        style={{
          background: store.displayHeaderBackgroundImage !== false && store.backgroundImage
            ? `url('${store.backgroundImage}') center/cover, linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
            : 'transparent'
        }}
      >
        {/* Overlay for better text readability when using background image */}
        {store.displayHeaderBackgroundImage !== false && store.backgroundImage && (
          <div className="absolute inset-0 bg-black opacity-50"></div>
        )}
        
        <div className="relative z-10">
          {/* Header layout based on user preference */}
          {store.headerLayout === 'center' ? (
            <div className="px-4 mb-4">
              {/* Centered avatar */}
              <div className="flex justify-center mb-4">
                {store.avatar && (
                  <div 
                    className="w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg"
                    style={{
                      borderColor: store.customization?.avatarBorderColor || '#ffffff'
                    }}
                  >
                    <Image
                      src={store.avatar}
                      alt={store.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Centered social links */}
              <div className="flex justify-center space-x-3">
                {store.socialLinks?.map((socialLink, index) => {
                  const IconComponent = SOCIAL_ICONS[socialLink.platform] || Globe;
                  return (
                    <a
                      key={index}
                      href={socialLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                      onClick={() => handleSocialLinkClick(socialLink.platform, socialLink.url)}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`flex justify-between items-center px-4 mb-4 ${getHeaderLayoutStyle()}`}>
              {/* Avatar */}
              <div className="flex items-center">
                {store.avatar && (
                  <div 
                    className="w-16 h-16 rounded-full overflow-hidden border-4 shadow-lg"
                    style={{
                      borderColor: store.customization?.avatarBorderColor || '#ffffff'
                    }}
                  >
                    <Image
                      src={store.avatar}
                      alt={store.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Social links */}
              <div className="flex space-x-3">
                {store.socialLinks?.map((socialLink, index) => {
                  const IconComponent = SOCIAL_ICONS[socialLink.platform] || Globe;
                  return (
                    <a
                      key={index}
                      href={socialLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                      onClick={() => handleSocialLinkClick(socialLink.platform, socialLink.url)}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Centered store name and description */}
          <div className="text-center px-4">
            <h1 
              className="text-2xl font-extrabold mb-2" 
              style={{
                color: storeNameColor,
                fontFamily: store.customization?.headingFontFamily || store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              {store.name}
            </h1>
            <p 
              className="text-sm max-w-xs mx-auto leading-snug"
              style={{
                color: store.customization?.storeBioFontColor || '#e5e7eb',
                fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              {store.description}
            </p>
          </div>
        </div>
      </header>

      {/* Slides Section */}
      {store.slidesEnabled !== false && slides.length > 0 && (
        <section className="py-6">
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out w-full h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="min-w-full relative cursor-pointer"
                  onClick={() => handleSlideClickWithDetails(slide)}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={1200}
                    height={400}
                    className="w-full h-full object-cover"
                    priority={index === 0}
                  />
                  {/* Overlay layer */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundColor: store.customization?.slideOverlayColor || '#000000',
                      opacity: store.customization?.slideOverlayOpacity || 0.4
                    }}
                  />
                  {/* Text content layer */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                    <h2 
                      className="text-2xl font-bold mb-2"
                      style={{
                        color: store.customization?.slideTitleColor || '#ffffff',
                        fontFamily: store.customization?.headingFontFamily || store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
                      }}
                    >
                      {slide.title}
                    </h2>
                    {slide.description && (
                      <p 
                        className="text-sm max-w-2xl"
                        style={{
                          color: store.customization?.slideDescriptionColor || '#e5e7eb',
                          fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
                        }}
                      >
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-[5px]">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all store-name-color ${
                      index === currentSlide ? 'w-8' : 'opacity-50'
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
        <section className="container mx-auto px-4 pt-6 overflow-x-auto category-scroller">
          <div className="flex space-x-[5px] px-4">
            {categories.map((category) => {
              const categoryDisplayName = category.name.replace(/\s*\(\d+\)$/, '');
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className="flex flex-col items-center cursor-pointer text-center"
                >
                  <div
                    className={`w-20 h-20 rounded-full shadow-md overflow-hidden ${
                      selectedCategory === category.id
                        ? `bg-indigo-200 border-4`
                        : 'bg-gray-200'
                    } ${
                      category.id === 'all' 
                        ? 'grid grid-cols-2 grid-rows-2 gap-0' 
                        : 'flex items-center justify-center'
                    }`}
                    style={selectedCategory === category.id ? { borderColor: activeCategoryBorderColor } : {}}
                  >
                    {category.id === 'all' ? (
                      // Photo collage for All Products
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
                      <span 
                        className="text-[0.8rem] font-semibold"
                        style={{ color: priceColor }}
                      >
                        {category.id === 'all' ? 'All' : categoryDisplayName}
                      </span>
                    )}
                  </div>
                  <span 
                    className="text-[0.8rem] font-semibold mt-1 whitespace-nowrap"
                    style={{ 
                      color: priceColor,
                      fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
                    }}
                  >
                    {category.id === 'all' ? 'All Products' : categoryDisplayName}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className="container mx-auto px-4 py-6" id="products">
        <div className="mb-6">
          <h2 
            className="text-[0.8rem] font-bold mb-2"
            style={{ 
              color: priceColor,
              fontFamily: store.customization?.headingFontFamily || store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
            }}
          >
            {searchTerm 
              ? `Search Results for "${searchTerm}"` 
              : selectedCategory === 'all'
                ? 'All Products'
                : `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Products`}
          </h2>
          <p className="text-[0.8rem] text-gray-600">
            {searchTerm
              ? `Found ${finalFilteredProducts.length} result${finalFilteredProducts.length !== 1 ? 's' : ''}`
              : ''
            }
          </p>
          
          {/* Search Input */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products&hellip;"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900"
            />
          </div>
        </div>
        
        {searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {finalFilteredProducts.length} result{finalFilteredProducts.length !== 1 ? 's' : ''} found for &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-[5px]">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClickWithDetails(product)}
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
                {store.displayPriceOnProducts !== false && (
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-bold text-[0.8rem]"
                      style={{ 
                        color: priceColor,
                        fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
                      }}
                    >
                      {currencySymbol}{product.price}
                    </span>
                  </div>
                )}
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
        {searchTerm && finalFilteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all products.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              style={{
                fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* All Products Section - Only show when category filtering is active (not for search) */}
      {selectedCategory !== 'all' && !searchTerm && (
        <section className="container mx-auto px-4 pt-6 pb-6" id="all-products">
          <div className="mb-6">
            <h2 
              className="text-[0.8rem] font-bold mb-2"
              style={{ 
                color: priceColor,
                fontFamily: store.customization?.headingFontFamily || store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              All Products
            </h2>
          </div>
          
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-[5px]">
            {products.slice(0, visibleAllProductsCount).map((product) => (
              <div
                key={`all-${product.id}`}
                onClick={() => handleProductClickWithDetails(product)}
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
                  {store.displayPriceOnProducts !== false && (
                    <div className="flex items-center justify-between">
                      <span 
                        className="font-bold text-[0.8rem]"
                        style={{ 
                          color: priceColor,
                          fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
                        }}
                      >
                        {currencySymbol}{product.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Button for All Products */}
          {products.length > visibleAllProductsCount && (
            <div className="text-center mt-6">
              <button
                onClick={loadMoreAllProducts}
                className="inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
              >
                Load More Products
              </button>
            </div>
          )}
        </section>
      )}

      {/* Custom HTML Section */}
      {store.customHtml && store.customHtml.trim() && (
        <section className="container mx-auto px-4 py-6">
          <div 
            dangerouslySetInnerHTML={{ __html: store.customHtml }}
            className="prose prose-sm max-w-none"
            style={{
              fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit',
              color: store.customization?.bodyTextColor || '#374151'
            }}
          />
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white shadow-inner rounded-t-lg mt-4 p-4 md:p-6 text-center text-gray-600">
        <div className="space-y-4">
          {/* Tagline */}
          <div>
            <p 
              className="text-sm font-medium text-gray-800 mb-2"
              style={{
                fontFamily: store.customization?.headingFontFamily || store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              Discover Amazing Products & Deals
            </p>
            <p className="text-xs text-gray-500">Your trusted affiliate marketplace</p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
              style={{
                fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              Terms & Privacy
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
              style={{
                fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              Contact
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
              style={{
                fontFamily: store.customization?.bodyFontFamily || store.customization?.fontFamily || 'inherit'
              }}
            >
              Career
            </a>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-[0.8rem] text-gray-500">
              &copy; {new Date().getFullYear()} Affiliate Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Widget */}
      {store.widgetEnabled !== false && (store.widgetImage || store.avatar) && (
        <button
          onClick={() => {
            if (store.widgetLink) {
              trackEvent('widget_click', store.ownerId, {
                widget_image_url: store.widgetImage || store.avatar,
                store_slug: store.slug,
                store_name: store.name,
                destination_link: store.widgetLink,
                has_link: true,
              });
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

      {/* Pop-up Banner */}
      {store.bannerEnabled !== false && showBannerPopup && store.bannerImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={handleBannerClose}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              ✕
            </button>
            
            {/* Banner Content */}
            <div
              className={store.bannerLink ? 'cursor-pointer' : ''}
              onClick={() => {
                if (store.bannerLink) {
                  trackEvent('banner_click', store.ownerId, {
                    banner_image_url: store.bannerImage,
                    banner_description: store.bannerDescription,
                    store_slug: store.slug,
                    store_name: store.name,
                    destination_link: store.bannerLink,
                  });
                  window.open(store.bannerLink, '_blank', 'noopener,noreferrer');
                  handleBannerClose();
                }
              }}
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={store.bannerImage}
                  alt="Banner"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {store.bannerDescription && (
                <div className="p-4">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {store.bannerDescription}
                  </p>
                  {store.bannerLink && (
                    <div className="mt-3">
                      <span className="inline-flex items-center text-primary-600 text-sm font-medium">
                        Click to learn more →
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={handleSubscriptionModalClose}
        storeId={store.ownerId}
        storeName={store.name}
      />

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
        .store-name-color {
          background-color: ${storeNameColor};
        }
      `}</style>
    </div>
  );
}
