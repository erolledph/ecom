'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  getStoreProducts, 
  deleteProduct,
  updateProduct,
  Product,
  getUserStore
} from '@/lib/store';
import { Edit, Trash2, Plus, Check, X, Users } from 'lucide-react';

export default function ProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isGrouping, setIsGrouping] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      const productsData = await getStoreProducts(user.uid);
      setProducts(productsData);
      
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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(products.map(p => p.id!).filter(Boolean));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds(prev => [...prev, productId]);
    } else {
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    }
  };

  const handleBulkDelete = async () => {
    if (!user || selectedProductIds.length === 0) return;
    
    showWarning(`Deleting ${selectedProductIds.length} selected products...`);
    
    try {
      await Promise.all(selectedProductIds.map(id => deleteProduct(id)));
      setSelectedProductIds([]);
      showSuccess(`Successfully deleted ${selectedProductIds.length} products`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      showError('Failed to delete some products. Please try again.');
    }
  };

  const handleBulkGroup = async () => {
    if (!user || selectedProductIds.length === 0 || !newGroupName.trim()) return;
    
    setIsGrouping(true);
    try {
      await Promise.all(
        selectedProductIds.map(id => 
          updateProduct(id, { category: newGroupName.trim() })
        )
      );
      setSelectedProductIds([]);
      setShowGroupModal(false);
      setNewGroupName('');
      fetchProducts();
    } catch (error) {
      console.error('Error grouping products:', error);
      showError('Failed to group products. Please try again.');
    } finally {
      setIsGrouping(false);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    if (!user) return;
    
    showWarning('Deleting product...');
    
    try {
      await deleteProduct(productId);
      showSuccess('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product. Please try again.');
    }
  };

  const isAllSelected = products.length > 0 && selectedProductIds.length === products.length;
  const isIndeterminate = selectedProductIds.length > 0 && selectedProductIds.length < products.length;
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Products</h1>
          </div>
          
          <div>
            <button
              onClick={() => router.push('/dashboard/products/add')}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProductIds.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <span className="text-primary-700 font-medium">
                {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowGroupModal(true)}
                className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Group Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Products Table */}
      {products.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">
                    Product Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id!)}
                        onChange={(e) => handleSelectProduct(product.id!, e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[150px]">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {product.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                        </button>
                        <button
                          onClick={() => product.id && handleDeleteProduct(product.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-danger-300 shadow-sm text-xs font-medium rounded text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
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
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🛍️</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No affiliate products yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first affiliate product to start earning commissions from sales.
            </p>
            <button 
              onClick={() => router.push('/dashboard/products/add')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        </div>
      )}
      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Section</h3>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setNewGroupName('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Group {selectedProductIds.length} selected products into a new section.
              </p>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Section Name
              </label>
              <input
                type="text"
                id="groupName"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="e.g., Shoes, Electronics, Fashion"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setNewGroupName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkGroup}
                disabled={!newGroupName.trim() || isGrouping}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGrouping ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Section
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}