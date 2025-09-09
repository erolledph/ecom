'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { addProduct, updateProduct, Product, uploadProductImages, uploadBase64Images } from '@/lib/store';
import Image from 'next/image';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImagesFromUrls } from '@/lib/store';

interface ProductFormProps {
  product?: Product | null;
  onCancel: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onSuccess?: () => void;
}

interface ProductData {
  title: string;
  description: string;
  price: string;
  productLink: string;
  category: string;
  images: File[];
}

interface ScrapedData {
  name: string;
  description: string;
  price: string;
  images: string[]; // image URLs
}

export default function ProductForm({ product, onCancel, onSubmit, onSuccess }: ProductFormProps) {
  const { user } = useAuth();
  const [productData, setProductData] = useState<ProductData>({
    title: '',
    description: '',
    price: '',
    productLink: '',
    category: 'electronics',
    images: [],
  });
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedImages, setScrapedImages] = useState<string[]>([]);
  const [useScrapedImages, setUseScrapedImages] = useState(true);
  const [manualImagePreviews, setManualImagePreviews] = useState<string[]>([]);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setProductData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        productLink: product.productLink || '',
        category: product.category,
        images: [], // Reset images for editing
      });
      setScrapedImages([]);
      setUseScrapedImages(false);
    }
  }, [product]);

  const categories = [
    'electronics',
    'clothing',
    'accessories',
    'home',
    'books',
    'sports',
    'beauty',
    'toys',
    'outdoors',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }
    
    setProductData(prev => ({
      ...prev,
      images: files,
    }));

    // Create previews for manual images
    const previews = files.map(file => URL.createObjectURL(file));
    setManualImagePreviews(previews);
    
    // If user selects manual images, prefer them over scraped images
    if (files.length > 0) {
      setUseScrapedImages(false);
    }
  };

  const handleScrapeProduct = async () => {
    if (!scrapeUrl.trim()) {
      alert('Please enter a product URL');
      return;
    }

    setIsScraping(true);
    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      
      if (response.ok) {
        const scrapedData: ScrapedData = await response.json();
        
        // Update form data with scraped information
        setProductData(prev => ({
          ...prev,
          title: scrapedData.name || prev.title,
          description: scrapedData.description || prev.description,
          price: scrapedData.price || prev.price,
          productLink: scrapeUrl,
        }));
        
        // Set scraped images
        setScrapedImages(scrapedData.images || []);
        
        // If no manual images are selected, use scraped images
        if (productData.images.length === 0) {
          setUseScrapedImages(true);
        }
        
        alert(`Product details scraped successfully! Found ${scrapedData.images?.length || 0} images.`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to scrape product details: ${errorMessage}`);
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
    
    // Validate that we have either manual images or scraped images
    const hasManualImages = productData.images.length > 0;
    const hasScrapedImages = scrapedImages.length > 0 && useScrapedImages;
    
    if (!hasManualImages && !hasScrapedImages && !product) {
      alert('Please either upload images manually or scrape images from a URL');
      return;
    }
    
    setIsLoading(true);

    try {
      // First, create/update the product to get the product ID
      let productId: string;
      
      if (product) {
        // Update existing product
        await updateDoc(doc(db, 'products', product.id!), {
          title: productData.title,
          description: productData.description,
         price: parseFloat(productData.price),
         productLink: productData.productLink,
          category: productData.category,
        });
        productId = product.id!;
      } else {
        // Create new product
        const docRef = await addDoc(collection(db, 'products'), {
          title: productData.title,
          description: productData.description,
         price: parseFloat(productData.price),
         productLink: productData.productLink,
          category: productData.category,
          storeId: user.uid,
          isActive: true,
        });
        productId = docRef.id;
      }
      
      // Now handle image uploads
      let finalImageUrls: string[] = product?.images || [];
      
      if (hasManualImages) {
        // Upload manual images
        const manualImageUrls = await uploadProductImages(user.uid, productData.images, productId);
        finalImageUrls = manualImageUrls;
      } else if (hasScrapedImages) {
        // Upload scraped images from URLs
        const scrapedImageUrls = await uploadImagesFromUrls(user.uid, scrapedImages, productId);
        finalImageUrls = scrapedImageUrls;
      }
      
      // Update the product with the final image URLs
      await updateProduct(productId, {
        images: finalImageUrls
      });
      
      alert('Product saved successfully!');
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      manualImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [manualImagePreviews]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {product ? 'Edit Product' : 'Add New Affiliate Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Scraping Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            🔍 Auto-fill from Product URL
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Paste any product URL to automatically extract product details and images
          </p>
          <div className="flex gap-3">
            <input
              type="url"
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="https://example.com/product-page"
              className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <button
              type="button"
              onClick={handleScrapeProduct}
              disabled={isScraping}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isScraping ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scraping...
                </>
              ) : (
                'Scrape Product'
              )}
            </button>
          </div>
        </div>

        {/* Product Images Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
          
          {/* Image Source Selection */}
          <div className="flex flex-col space-y-4">
            {/* Manual Upload Option */}
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id="manual-images"
                  name="image-source"
                  checked={!useScrapedImages || productData.images.length > 0}
                  onChange={() => setUseScrapedImages(false)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="manual-images" className="ml-2 text-sm font-medium text-gray-700">
                  Upload Images Manually (Max 5)
                </label>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {manualImagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {manualImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Manual upload ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scraped Images Option */}
            {scrapedImages.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="scraped-images"
                    name="image-source"
                    checked={useScrapedImages && productData.images.length === 0}
                    onChange={() => setUseScrapedImages(true)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="scraped-images" className="ml-2 text-sm font-medium text-gray-700">
                    Use Scraped Images ({scrapedImages.length} found)
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {scrapedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Scraped image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <span className="absolute top-1 right-1 bg-green-600 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            placeholder="Enter product description"
          />
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="$0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={productData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            placeholder="https://affiliate-link.com/product"
          />
          <p className="mt-1 text-sm text-gray-500">
            Visitors will be redirected to this affiliate URL when they click on the product
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
