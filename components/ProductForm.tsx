'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { trackEvent } from '@/lib/analytics';
import { addProduct, updateProduct, Product, uploadProductImage, getStoreProducts } from '@/lib/store';
import { isPremium, isOnTrial, hasTrialExpired, getTrialDaysRemaining } from '@/lib/auth';
import Image from 'next/image';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Save } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  mode: 'add' | 'edit';
}

interface ProductData {
  title: string;
  description: string;
  price: string;
  productLink: string;
  category: string;
  imageType: 'upload' | 'url';
  imageFile: File | null;
  imageUrl: string;
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToast();
  const [currentProductCount, setCurrentProductCount] = useState(0);
  const [isAtProductLimit, setIsAtProductLimit] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    title: '',
    description: '',
    price: '',
    productLink: '',
    category: '',
    imageType: 'upload',
    imageFile: null,
    imageUrl: '',
  });
  const [productUrl, setProductUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form with product data if editing
  useEffect(() => {
    if (product && mode === 'edit') {
      setProductData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        productLink: product.productLink || '',
        category: product.category,
        imageType: 'url',
        imageFile: null,
        imageUrl: product.images?.[0] || '',
      });
      setImagePreview(product.images?.[0] || '');
    }
  }, [product, mode]);

  // Check product limit for normal users
  useEffect(() => {
    const checkProductLimit = async () => {
      if (!user || !userProfile || mode === 'edit') return;
      
      try {
        const products = await getStoreProducts(user.uid);
        setCurrentProductCount(products.length);
        
        // Check if user is at product limit (30 for normal users)
        const isUserPremium = isPremium(userProfile);
        const atLimit = !isUserPremium && products.length >= 30;
        setIsAtProductLimit(atLimit);
        
        if (atLimit) {
          showError('Product limit reached (30/30)');
        }
      } catch (error) {
        console.error('Error checking product limit:', error);
      }
    };

    checkProductLimit();
  }, [user, userProfile, mode, showError]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageTypeChange = (type: 'upload' | 'url') => {
    setProductData(prev => ({
      ...prev,
      imageType: type,
      imageFile: null,
      imageUrl: '',
    }));
    setImagePreview('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductData(prev => ({
        ...prev,
        imageFile: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProductData(prev => ({
      ...prev,
      imageUrl: url,
    }));
    setImagePreview(url);
  };

  const handleScrape = async () => {
    if (!productUrl.trim()) {
      showError('Please enter a product URL to scrape');
      return;
    }

    setIsScraping(true);
    
    try {
      const apiUrl = `https://basahin-to.netlify.app/.netlify/functions/scrape?url=${encodeURIComponent(productUrl)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to scrape product information');
      }
      
      const scrapedData = await response.json();
      
      // Extract image URL from Open Graph data with fallbacks
      let scrapedImageUrl = '';
      if (scrapedData.open_graph?.images && scrapedData.open_graph.images.length > 0) {
        scrapedImageUrl = scrapedData.open_graph.images[0].url;
      } else if (scrapedData.twitter_card?.images && scrapedData.twitter_card.images.length > 0) {
        scrapedImageUrl = scrapedData.twitter_card.images[0].url;
      } else if (scrapedData.image) {
        // Fallback to direct image property if it exists
        scrapedImageUrl = scrapedData.image;
      }
      
      // Update form data with scraped information
      setProductData(prev => ({
        ...prev,
        title: scrapedData.title || prev.title,
        description: scrapedData.description || prev.description,
        price: scrapedData.price ? scrapedData.price.toString() : prev.price,
        productLink: productUrl,
        imageType: scrapedImageUrl ? 'url' : prev.imageType,
        imageUrl: scrapedImageUrl || prev.imageUrl,
      }));
      
      // Update image preview if image was scraped
      if (scrapedImageUrl) {
        setImagePreview(scrapedImageUrl);
      }
      
      // Show appropriate success message
      if (scrapedData.price) {
        showSuccess('Product information scraped');
      } else {
        showInfo('Product metadata scraped (price not available)');
      }
      
    } catch (error) {
      console.error('Error scraping product:', error);
      showError('Failed to scrape product information');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to add products');
      return;
    }
    
    // Check product limit for normal users when adding new products
    if (mode === 'add' && isAtProductLimit) {
      showError('Product limit reached (30/30)');
      return;
    }
    
    // Validate that we have an image
    if (productData.imageType === 'upload' && !productData.imageFile && mode === 'add') {
      showError('Please upload a product image');
      return;
    }
    
    if (productData.imageType === 'url' && !productData.imageUrl.trim()) {
      showError('Please provide an image URL');
      return;
    }
    
    if (!productData.category.trim()) {
      showError('Please enter a category name');
      return;
    }
    
    setIsLoading(true);

    try {
      if (mode === 'edit' && product) {
        // Handle image first for editing
        let finalImageUrl = product.images?.[0] || '';
        
        if (productData.imageType === 'upload' && productData.imageFile) {
          finalImageUrl = await uploadProductImage(user.uid, productData.imageFile, product.id!);
        } else if (productData.imageType === 'url' && productData.imageUrl.trim()) {
          finalImageUrl = productData.imageUrl.trim();
        }
        
        // Update existing product with all data including image
        await updateProduct(user.uid, product.id!, {
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          productLink: productData.productLink,
          category: productData.category.trim(),
          images: finalImageUrl ? [finalImageUrl] : []
        });
      } else {
        // Handle image for new product
        let finalImageUrl = '';
        
        if (productData.imageType === 'upload' && productData.imageFile) {
          // We'll upload the image after creating the product
          const tempProductId = `temp_${Date.now()}`;
          finalImageUrl = await uploadProductImage(user.uid, productData.imageFile, tempProductId);
        } else if (productData.imageType === 'url' && productData.imageUrl.trim()) {
          finalImageUrl = productData.imageUrl.trim();
        }
        
        // Create new product using the addProduct function with premium status
        const productId = await addProduct({
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          productLink: productData.productLink,
          category: productData.category.trim(),
          storeId: user.uid,
          images: [finalImageUrl]
        }, isPremium(userProfile));
      }
      showSuccess(mode === 'edit' ? 'Product updated successfully!' : 'Successfully added new product!');

      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      
      // Display the specific error message from the backend
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product: An unexpected error occurred. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCancel = () => {
    router.push('/dashboard/products');
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>
      
      {/* Form */}
      <div className="p-3 sm:p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Product URL Scraping Section */}
          <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Auto-Fill Product Information</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Enter a product URL to automatically scrape and fill the product details below.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1">
                <label htmlFor="productUrl" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Product URL
                </label>
                <input
                  type="url"
                  id="productUrl"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
                  placeholder="https://example.com/product-page"
                />
              </div>
              <div className="flex items-end sm:items-end">
                <button
                  type="button"
                  onClick={handleScrape}
                  disabled={isScraping || !productUrl.trim()}
                  className="flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap text-sm min-h-[44px] w-full sm:w-auto justify-center"
                >
                  {isScraping ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Scraping...
                    </>
                  ) : (
                    'Scrape Product Info'
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• The scraper will attempt to extract product title, description, price, and image</p>
              <p>• You can still manually edit all fields after scraping</p>
              <p>• If price is not found, you'll need to enter it manually</p>
            </div>
          </div>

          {/* Product Image Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Product Image</h3>
            
            {/* Image Type Selection */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
              <label className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px]">
                <input
                  type="radio"
                  name="imageType"
                  value="upload"
                  checked={productData.imageType === 'upload'}
                  onChange={() => handleImageTypeChange('upload')}
                  className="mr-2"
                />
                <span className="text-gray-700 text-sm">Upload Image</span>
              </label>
              <label className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px]">
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={productData.imageType === 'url'}
                  onChange={() => handleImageTypeChange('url')}
                  className="mr-2"
                />
                <span className="text-gray-700 text-sm">Image URL</span>
              </label>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-3 sm:p-4">
              {productData.imageType === 'upload' ? (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={productData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Paste a direct link to an image to save storage space
                  </p>
                </div>
              )}
              
              {imagePreview && (
                <div className="mt-2 sm:mt-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={productData.title}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={productData.description}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900 text-sm"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                required
                value={productData.price}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={productData.category}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
                placeholder="Enter category (e.g., Electronics, Fashion)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Create your own category name for better organization
              </p>
            </div>
          </div>

          {/* Product Link */}
          <div>
            <label htmlFor="productLink" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Affiliate Product Link *
            </label>
            <input
              type="url"
              id="productLink"
              name="productLink"
              required
              value={productData.productLink}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm min-h-[44px]"
              placeholder="https://affiliate-link.com/product"
            />
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Visitors will be redirected to this affiliate URL when they click on the product
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
            {/* Product Limit Warning for Normal Users */}
            {mode === 'add' && !isPremium(userProfile) && (
              <div className="w-full sm:flex-1 sm:mr-4 order-1 sm:order-none">
                <div className={`p-2 sm:p-3 rounded-lg border ${
                  isAtProductLimit
                    ? 'bg-red-50 border-red-200'
                    : currentProductCount >= 25
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isAtProductLimit
                      ? 'text-red-800'
                      : currentProductCount >= 25
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                  }`}>
                    {isAtProductLimit
                      ? '⚠️ Product Limit Reached'
                      : currentProductCount >= 25
                        ? '⚠️ Approaching Product Limit'
                        : '📦 Product Count'
                    }
                  </p>
                  <p className={`text-xs mt-1 ${
                    isAtProductLimit
                      ? 'text-red-600'
                      : currentProductCount >= 25
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                  }`}>
                    {isAtProductLimit
                      ? 'You have reached the 30-product limit for standard users. To add more products, please upgrade to premium access or contact an administrator for assistance.'
                      : `${currentProductCount}/30 products used. ${30 - currentProductCount} remaining.`
                    }
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-2 sm:order-none">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || (mode === 'add' && isAtProductLimit)}
                className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm min-h-[44px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {mode === 'edit' ? 'Update Product' : 'Save Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
