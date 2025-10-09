'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  getAllSponsoredProducts,
  deleteSponsoredProduct,
  SponsoredProduct
} from '@/lib/store';
import ConfirmModal from '@/components/ConfirmModal';
import { CreditCard as Edit, Trash2, Plus, ExternalLink, RefreshCcw, DollarSign } from 'lucide-react';

export default function SponsorProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [sponsoredProducts, setSponsoredProducts] = useState<SponsoredProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchSponsoredProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      const sponsoredProductsData = await getAllSponsoredProducts();
      setSponsoredProducts(sponsoredProductsData);
    } catch (error) {
      console.error('Error fetching sponsored products:', error);
      showError('Failed to load sponsored products');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  useEffect(() => {
    if (user) {
      fetchSponsoredProducts();
    }
  }, [user, fetchSponsoredProducts]);

  const handleDelete = async () => {
    if (!user || !productToDelete) return;

    showWarning('Deleting sponsored product...');

    try {
      await deleteSponsoredProduct(productToDelete);
      setProductToDelete(null);
      showSuccess('Sponsored product deleted successfully');
      await fetchSponsoredProducts();
    } catch (error) {
      console.error('Error deleting sponsored product:', error);
      // Display the specific error message from the backend
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete sponsored product: An unexpected error occurred. Please try again.';
      showError(errorMessage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchSponsoredProducts();
      showSuccess('Sponsored products refreshed successfully');
    } catch (error) {
      showError('Failed to refresh sponsored products');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Sponsor Products</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm min-h-[44px]"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.push('/dashboard/system-management/sponsor-products/add')}
              className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsored Product
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-3 sm:p-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-200">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1 text-sm sm:text-base">How Sponsored Products Work</h4>
              <div className="text-xs sm:text-sm text-green-800 space-y-1">
                <p>• Sponsored products appear randomly in user stores with 15+ products</p>
                <p>• Stores with 15-24 products show 1 sponsored product (1st position)</p>
                <p>• Stores with 25+ products show 2 sponsored products (1st and 6th positions)</p>
                <p>• Only displayed in "All Products" section, not in filters or search</p>
                <p>• Click tracking helps measure performance and revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Products Table */}
      {sponsoredProducts.length > 0 ? (
        <div className="p-3 sm:p-6">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Title
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Category
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Link
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Clicks
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sponsoredProducts.map((product) => (
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
                              <span className="text-gray-400 text-xs hidden sm:inline">No Image</span>
                              <span className="text-gray-400 text-xs sm:hidden">?</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 max-w-[100px] sm:max-w-[150px]">
                          {product.title}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        ${product.price}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        {product.productLink ? (
                          <a
                            href={product.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary-600 hover:text-primary-900 text-sm"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No link</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive !== false
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-danger-100 text-danger-800'
                        }`}>
                          {product.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.clickCount || 0} clicks
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/system-management/sponsor-products/edit/${product.id}`)}
                            className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[36px] min-w-[36px]"
                            title="Edit sponsored product"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (product.id) {
                                setProductToDelete(product.id);
                                setShowDeleteModal(true);
                              }
                            }}
                            className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 border border-danger-300 shadow-sm text-xs font-medium rounded text-danger-700 bg-danger-100 hover:bg-danger-100 transition-colors min-h-[36px] min-w-[36px]"
                            title="Delete sponsored product"
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
        </div>
      ) : (
        <div className="p-4 sm:p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No sponsored products yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto px-4">
              Create your first sponsored product to start earning passive income from user store traffic.
            </p>
            <button 
              onClick={() => router.push('/dashboard/system-management/sponsor-products/add')}
              className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Sponsored Product
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Sponsored Product"
        message="Are you sure you want to delete this sponsored product? This action cannot be undone."
        confirmText="Delete Product"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}