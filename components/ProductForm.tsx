'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { addProduct, updateProduct, Product } from '@/lib/store';
import Image from 'next/image';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

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
  imageType: 'upload' | 'url';
  imageFile: File | null;
  imageUrl: string;
}

export default function ProductForm({ product, onCancel, onSubmit, onSuccess }: ProductFormProps) {
  const { user } = useAuth();
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
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
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
  }, [product]);

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

  const uploadSingleImage = async (file: File, productId: string): Promise<string> => {
    try {
      const fileName = `${productId}_${Date.now()}`;
      const imageRef = ref(storage, `product_images/${user!.uid}/${productId}/${fileName}`);
      await uploadBytes(imageRef, file);
      return getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to add products');
      return;
    }
    
    // Validate that we have an image
    if (productData.imageType === 'upload' && !productData.imageFile && !product) {
      alert('Please upload a product image');
      return;
    }
    
    if (productData.imageType === 'url' && !productData.imageUrl.trim()) {
      alert('Please provide an image URL');
      return;
    }
    
    if (!productData.category.trim()) {
      alert('Please enter a category name');
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
          category: productData.category.trim(),
        });
        productId = product.id!;
      } else {
        // Create new product
        const docRef = await addDoc(collection(db, 'products'), {
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
        finalImageUrl = await uploadSingleImage(productData.imageFile, productId);
      } else if (productData.imageType === 'url' && productData.imageUrl.trim()) {
        // Use provided URL
        finalImageUrl = productData.imageUrl.trim();
      }
      
      // Update the product with the final image URL
      if (finalImageUrl) {
        await updateProduct(productId, {
          images: [finalImageUrl]
        });
      }
      
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
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {product ? 'Edit Product' : 'Add New Affiliate Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Image Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Product Image</h3>
          
          {/* Image Type Selection */}
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="imageType"
                value="upload"
                checked={productData.imageType === 'upload'}
                onChange={() => handleImageTypeChange('upload')}
                className="mr-2"
              />
              Upload Image
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="imageType"
                value="url"
                checked={productData.imageType === 'url'}
                onChange={() => handleImageTypeChange('url')}
                className="mr-2"
              />
              Image URL
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-32 h-32 object-cover rounded-md border"
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
              Category Name *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={productData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
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