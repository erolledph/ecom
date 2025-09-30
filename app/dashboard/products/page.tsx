'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { trackEvent } from '@/lib/analytics';
import { isPremium } from '@/lib/auth';
import { 
  getStoreProducts, 
  deleteProduct,
  updateProduct,
  Product,
  getUserStore
} from '@/lib/store';
import { Edit, Trash2, Plus, Check, X, Users } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import ProductCSVImporter from '@/components/ProductCSVImporter';

export default function ProductsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAtProductLimit, setIsAtProductLimit] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      const productsData = await getStoreProducts(user.uid);
      setProducts(productsData);
      
      // Check product limit for normal users
      if (userProfile && !isPremium(userProfile)) {
        setIsAtProductLimit(productsData.length >= 30);
      } else {
        setIsAtProductLimit(false);
      }
      
      // Fetch store data for URL
      const storeData = await getUserStore(user.uid);
      if (storeData) {
        setStoreSlug(storeData.slug);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return;
    
    showWarning('Deleting product...');
    
    try {
      await deleteProduct(user.uid, productId);
      showSuccess('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
      showSuccess('Products refreshed successfully');
    } catch (error) {
      showError('Failed to refresh products');
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg shadow">
            <div className="h-16 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
              {userProfile && !isPremium(userProfile) && (
                <p className="text-sm text-gray-600 mt-1">
                  {products.length}/30 products used
                  {isAtProductLimit && (
                    <span className="text-red-600 font-medium ml-2">
                      • Limit reached
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Manage Products</h1>
          </div>
          
         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
           <button
             onClick={handleRefresh}
             disabled={refreshing}
             className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm min-h-[44px]"
           >
             <RefreshCcw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
             {refreshing ? 'Refreshing...' : 'Refresh'}
           </button>
            <button
              onClick={() => {
                if (isAtProductLimit) {
                  showError('Cannot add more products. You have reached the 30-product limit for normal users.');
                  return;
                }
                router.push('/dashboard/products/add');
              }}
              disabled={isAtProductLimit}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
              title={isAtProductLimit ? 'Product limit reached. Enhanced access required for more products.' : 'Add new product'}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
        
        {/* Product Limit Warning */}
        {userProfile && !isPremium(userProfile) && isAtProductLimit && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-1 text-sm sm:text-base">Product Limit Reached</h4>
                <p className="text-xs sm:text-sm text-red-800">
                  You have reached the maximum of 30 products. 
                  To add more products, you will need enhanced access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSV Import Section */}
      <ProductCSVImporter />

      {/* Products Table */}
      {products.length > 0 ? (
        <div className="overflow-hidden mx-2 sm:mx-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px] sm:max-w-[150px]">
                    Product Title
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Clicks
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            width={32}
                            height={32}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 max-w-[120px] sm:max-w-[150px]">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                        {product.title}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {product.price}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {product.clickCount || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                          className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[36px] min-w-[36px]"
                          title="Edit product"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => product.id && handleDeleteProduct(product.id)}
                          className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-danger-300 shadow-sm text-xs font-medium rounded text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors min-h-[36px] min-w-[36px]"
                          title="Delete product"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-8 sm:py-12">
            <span className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 block">🛍️</span>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No affiliate products yet
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              Add your first affiliate product to start earning commissions from sales.
            </p>
            <button 
              onClick={() => router.push('/dashboard/products/add')}
              className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base min-h-[44px]"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
