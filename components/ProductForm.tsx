'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { addProduct, uploadProductImages, Product } from '@/lib/store';

interface ProductFormProps {
  product?: Product | null;
  onCancel: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onSuccess?: () => void;
}

interface ProductData {
  name: string;
  description: string;
  price: string;
  productLink: string;
  category: string;
  images: File[];
}

export default function ProductForm({ product, onCancel, onSubmit, onSuccess }: ProductFormProps) {
  const { user } = useAuth();
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    price: '',
    productLink: '',
    category: 'electronics',
    images: [],
  });
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description,
        price: product.price,
        productLink: product.productLink,
        category: product.category,
        images: [], // Reset images for editing
      });
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
  };

  const handleScrapeProduct = async () => {
    if (!scrapeUrl.trim()) {
      alert('Please enter a product URL');
      return;
    }

    setIsScraping(true);
    try {
      // TODO: Implement Firebase Cloud Function call for scraping
      // For now, we'll simulate the scraping process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated scraped data
      setProductData(prev => ({
        ...prev,
        name: 'Scraped Product Name',
        description: 'This is a scraped product description that would come from the website.',
        price: '99.99',
        productLink: scrapeUrl,
      }));
      
      alert('Product details scraped successfully!');
    } catch (error) {
      console.error('Scraping error:', error);
      alert('Failed to scrape product details. Please fill manually.');
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
    
    setIsLoading(true);

    try {
      let imageUrls: string[] = [];
      
      // Upload images if any are selected
      if (productData.images.length > 0) {
        const tempProductId = `temp_${Date.now()}`;
        imageUrls = await uploadProductImages(user.uid, tempProductId, productData.images);
      }
      
      await onSubmit({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        productLink: productData.productLink,
        category: productData.category,
        images: imageUrls,
        isActive: true,
      });
      
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Scraping Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Auto-fill from URL (Optional)
        </h3>
        <div className="flex gap-3">
          <input
            type="url"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder="Enter product URL to auto-fill details"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleScrapeProduct}
            disabled={isScraping}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScraping ? 'Scraping...' : 'Scrape Details'}
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images (Max 5)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {productData.images.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {productData.images.length} image(s) selected
          </p>
        )}
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={productData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          Product Link *
        </label>
        <input
          type="url"
          id="productLink"
          name="productLink"
          required
          value={productData.productLink}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="https://example.com/product"
        />
        <p className="mt-1 text-sm text-gray-500">
          Customers will be redirected to this URL when they click on the product
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
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}