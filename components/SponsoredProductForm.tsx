'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  addSponsoredProduct, 
  updateSponsoredProduct, 
  uploadSponsoredProductImage, 
  SponsoredProduct 
} from '@/lib/store';
import Image from 'next/image';
import { ArrowLeft, Save, Upload } from 'lucide-react';

interface SponsoredProductFormProps {
  sponsoredProduct?: SponsoredProduct | null;
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

export default function SponsoredProductForm({ sponsoredProduct, mode }: SponsoredProductFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
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

  // Initialize form with sponsored product data if editing
  useEffect(() => {
    if (sponsoredProduct && mode === 'edit') {
      setProductData({
        title: sponsoredProduct.title,
        description: sponsoredProduct.description,
        price: sponsoredProduct.price.toString(),
        productLink: sponsoredProduct.productLink || '',
        category: sponsoredProduct.category,
        imageType: 'url',
        imageFile: null,
        imageUrl: sponsoredProduct.images?.[0] || '',
      });
      setImagePreview(sponsoredProduct.images?.[0] || '');
    }
  }, [sponsoredProduct, mode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showError('You must be logged in to manage sponsored products');
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
      let sponsoredProductId: string;
      
      if (mode === 'edit' && sponsoredProduct) {
        // Update existing sponsored product
        await updateSponsoredProduct(sponsoredProduct.id!, {
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          productLink: productData.productLink,
          category: productData.category.trim(),
        });
        sponsoredProductId = sponsoredProduct.id!;
      } else {
        // Create new sponsored product
        sponsoredProductId = await addSponsoredProduct({
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          productLink: productData.productLink,
          category: productData.category.trim(),
          ownerId: user.uid,
        }, user.uid);
      }
      
      // Handle image
      let finalImageUrl = sponsoredProduct?.images?.[0] || '';
      
      if (productData.imageType === 'upload' && productData.imageFile) {
        // Upload new image file
        finalImageUrl = await uploadSponsoredProductImage(productData.imageFile, sponsoredProductId);
      } else if (productData.imageType === 'url' && productData.imageUrl.trim()) {
        // Use provided URL
        finalImageUrl = productData.imageUrl.trim();
      }
      
      // Update the sponsored product with the final image URL
      if (finalImageUrl) {
        await updateSponsoredProduct(sponsoredProductId, {
          images: [finalImageUrl]
        });
      }
      
      showSuccess('Sponsored product saved successfully!');
      router.push('/dashboard/system-management/sponsor-products');
    } catch (error) {
      console.error('Save error:', error);
      showError('Failed to save sponsored product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/system-management/sponsor-products');
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
              {mode === 'edit' ? 'Edit Sponsored Product' : 'Add New Sponsored Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'edit' ? 'Update your sponsored product' : 'Create a new sponsored product to display in user stores'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              Users will be redirected to this affiliate URL when they click on the sponsored product
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
                  {mode === 'edit' ? 'Update Sponsored Product' : 'Save Sponsored Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}