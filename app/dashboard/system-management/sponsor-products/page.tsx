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
import { Edit, Trash2, Plus, ExternalLink, RefreshCcw, DollarSign } from 'lucide-react';

export default function SponsorProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [sponsoredProducts, setSponsoredProducts] = useState<SponsoredProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleDelete = async (sponsoredProductId: string) => {
    if (!user) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this sponsored product? This action cannot be undone.');
    if (!confirmed) return;
    
    showWarning('Deleting sponsored product...');
    
    try {
      await deleteSponsoredProduct(sponsoredProductId);
      showSuccess('Sponsored product deleted successfully');
      await fetchSponsoredProducts();
    } catch (error) {
      console.error('Error deleting sponsored product:', error);
      showError('Failed to delete sponsored product. Please try again.');
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
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sponsor Products</h1>
              <p className="text-gray-600 mt-1">
                Manage sponsored products that appear in user stores ({sponsoredProducts.length} total)
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.push('/dashboard/system-management/sponsor-products/add')}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsored Product
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1">How Sponsored Products Work</h4>
              <div className="text-sm text-green-800 space-y-1">
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
        <div className="p-6">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">
                    Product Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sponsoredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
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
                    <td className="px-4 py-3 whitespace-nowrap">
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive !== false
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-danger-100 text-danger-800'
                      }`}>
                        {product.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.clickCount || 0} clicks
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/system-management/sponsor-products/edit/${product.id}`)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          title="Edit sponsored product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => product.id && handleDelete(product.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-danger-300 shadow-sm text-xs font-medium rounded text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors"
                          title="Delete sponsored product"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No sponsored products yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first sponsored product to start earning passive income from user store traffic.
            </p>
            <button 
              onClick={() => router.push('/dashboard/system-management/sponsor-products/add')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Sponsored Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}