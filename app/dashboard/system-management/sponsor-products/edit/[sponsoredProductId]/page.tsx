'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getSponsoredProductById, SponsoredProduct } from '@/lib/store';
import SponsoredProductForm from '@/components/SponsoredProductForm';
import { useAuth } from '@/hooks/useAuth';

export default function EditSponsoredProductPage() {
  const params = useParams();
  const sponsoredProductId = params.sponsoredProductId as string;
  const { user } = useAuth();
  const [sponsoredProduct, setSponsoredProduct] = useState<SponsoredProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsoredProduct = async () => {
      if (!user) return;
      
      try {
        const sponsoredProductData = await getSponsoredProductById(sponsoredProductId);
        if (sponsoredProductData) {
          setSponsoredProduct(sponsoredProductData);
        } else {
          setError('Sponsored product not found');
        }
      } catch (error) {
        console.error('Error fetching sponsored product:', error);
        setError('Failed to load sponsored product');
      } finally {
        setLoading(false);
      }
    };

    if (sponsoredProductId && user) {
      fetchSponsoredProduct();
    }
  }, [sponsoredProductId, user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="text-center py-12">
          <div className="text-danger-600 text-lg font-medium mb-2">{error}</div>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return <SponsoredProductForm sponsoredProduct={sponsoredProduct} mode="edit" />;
}