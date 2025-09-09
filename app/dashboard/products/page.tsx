'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  getStoreProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  Product 
} from '@/lib/store';
import ProductForm from '@/components/ProductForm';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      const productsData = await getStoreProducts(user.uid);
      setProducts(productsData);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Products</h1>
          <p className="mt-2 text-gray-600">
            Manage your affiliate products and earn commissions from each sale.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Affiliate Product
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            {product.images && product.images.length > 0 && (
              <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{product.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
            <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setShowForm(true);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => product.id && handleDeleteProduct(product.id)}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8">
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
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
