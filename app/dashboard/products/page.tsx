'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  getStoreProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  Product,
  getUserStore
} from '@/lib/store';
import ProductForm from '@/components/ProductForm';
import { Copy, Check, Edit, Trash2, Plus } from 'lucide-react';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

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

  const copyStoreUrl = async () => {
    if (!storeSlug) return;
    
    const storeUrl = `${window.location.origin}/${storeSlug}`;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    // This function is now handled entirely by the ProductForm component
    // The form manages the product creation and image upload process
    fetchProducts();
    setShowForm(false);
  };

  const handleEditProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    // This function is now handled entirely by the ProductForm component
    // The form manages the product update and image upload process
    fetchProducts();
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Affiliate Products</h1>
            <p className="mt-2 text-gray-600 text-sm md:text-base">
              Manage your affiliate products and earn commissions from each sale.
            </p>
          </div>
          
          <div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                onSuccess={() => {
                  fetchProducts();
                }}
              />
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => product.id && handleDeleteProduct(product.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
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
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}