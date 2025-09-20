'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { trackEvent } from '@/lib/analytics';
import { addProduct, updateProduct, Product, uploadProductImage } from '@/lib/store';
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
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToast();
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
        showSuccess('Product information scraped successfully!');
      } else {
        showInfo('Product metadata scraped successfully! Only meta data available, please manually enter the product price.');
      }
      
    } catch (error) {
      console.error('Error scraping product:', error);
      showError('Failed to scrape product information. Please try again or enter details manually.');
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
      // First, create/update the product to get the product ID
      let productId: string;
      
      if (mode === 'edit' && product) {
        // Update existing product
        await updateDoc(doc(db, 'users', user.uid, 'stores', user.uid, 'products', product.id!), {
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          productLink: productData.productLink,
          category: productData.category.trim(),
        });
        productId = product.id!;
      } else {
        // Create new product
        const docRef = await addDoc(collection(db, 'users', user.uid, 'stores', user.uid, 'products'), {
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          productLink: productData.productLink,
          category: productData.category.trim(),
          storeId: user.uid,
          isActive: true,
        });
        productId = docRef.id;
      }
      
      // Handle image
      let finalImageUrl = product?.images?.[0] || '';
      
      if (productData.imageType === 'upload' && productData.imageFile) {
        // Upload new image file
        finalImageUrl = await uploadProductImage(user.uid, productData.imageFile, productId);
      } else if (productData.imageType === 'url' && productData.imageUrl.trim()) {
        // Use provided URL
        finalImageUrl = productData.imageUrl.trim();
      }
      
      // Update the product with the final image URL
      if (finalImageUrl) {
        await updateProduct(user.uid, productId, {
          images: [finalImageUrl]
        });
      }
      
      // Track successful save
      // Removed dashboard action tracking - focusing on public store interactions only
      
      showSuccess('Product saved successfully!');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Save error:', error);
      
      // Removed dashboard action tracking - focusing on public store interactions only
      
      showError('Failed to save product. Please try again.');
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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'edit' ? 'Update your affiliate product' : 'Add a new affiliate product to your store'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product URL Scraping Section */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Auto-Fill Product Information</h3>
            <p className="text-sm text-gray-600">
              Enter a product URL to automatically scrape and fill the product details below.
            </p>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Product URL
                </label>
                <input
                  type="url"
                  id="productUrl"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="https://example.com/product-page"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleScrape}
                  disabled={isScraping || !productUrl.trim()}
                  className="flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                >
                  {isScraping ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Scraping...
                    </>
                  ) : (
                    'Scrape Product Info'
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• The scraper will attempt to extract product title, description, price, and image</p>
              <p>• You can still manually edit all fields after scraping</p>
              <p>• If price is not found, you'll need to enter it manually</p>
            </div>
          </div>

          {/* Product Image Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Product Image</h3>
            
            {/* Image Type Selection */}
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="imageType"
                  value="upload"
                  checked={productData.imageType === 'upload'}
                  onChange={() => handleImageTypeChange('upload')}
                  className="mr-2"
                />
                <span className="text-gray-700">Upload Image</span>
              </label>
              <label className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={productData.imageType === 'url'}
                  onChange={() => handleImageTypeChange('url')}
                  className="mr-2"
                />
                <span className="text-gray-700">Image URL</span>
              </label>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-4">
              {productData.imageType === 'upload' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={productData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Paste a direct link to an image to save storage space
                  </p>
                </div>
              )}
              
              {imagePreview && (
                <div className="mt-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={productData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={productData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                required
                value={productData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={productData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="Enter category (e.g., Electronics, Fashion)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Create your own category name for better organization
              </p>
            </div>
          </div>

          {/* Product Link */}
          <div>
            <label htmlFor="productLink" className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate Product Link *
            </label>
            <input
              type="url"
              id="productLink"
              name="productLink"
              required
              value={productData.productLink}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
              placeholder="https://affiliate-link.com/product"
            />
            <p className="mt-1 text-sm text-gray-500">
              Visitors will be redirected to this affiliate URL when they click on the product
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {mode === 'edit' ? 'Update Product' : 'Save Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
