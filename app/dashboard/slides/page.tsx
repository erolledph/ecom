'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { trackEvent } from '@/lib/analytics';
import { getStoreSlides, deleteSlide, Slide, getUserStore } from '@/lib/store';
import { Edit, Trash2, Plus, ExternalLink } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';

export default function SlidesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSlides = useCallback(async () => {
    if (!user) return;
    
    try {
      const slidesData = await getStoreSlides(user.uid);
      setSlides(slidesData);
      
      // Fetch store data for URL
      const storeData = await getUserStore(user.uid);
      if (storeData) {
        setStoreSlug(storeData.slug);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSlides();
    }
  }, [user, fetchSlides]);

  const handleDelete = async (slideId: string) => {
    if (!user) return;
    
    // Removed dashboard action tracking - focusing on public store interactions only
    
    showWarning('Deleting slide...');
    
    try {
      await deleteSlide(user.uid, slideId);
      // Removed dashboard action tracking - focusing on public store interactions only
      showSuccess('Slide deleted successfully');
      await fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      // Removed dashboard action tracking - focusing on public store interactions only
      showError('Failed to delete slide. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchSlides();
      showSuccess('Slides refreshed successfully');
    } catch (error) {
      showError('Failed to refresh slides');
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Slides</h1>
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
              onClick={() => {
               // Removed dashboard action tracking - focusing on public store interactions only
                router.push('/dashboard/slides/add');
              }}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </button>
          </div>
        </div>
      </div>

      {/* Slides Table */}
      {slides.length > 0 ? (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slide Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-16">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          width={64}
                          height={48}
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {slide.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {slide.order}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {slide.link ? (
                        <a
                          href={slide.link}
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
                        slide.isActive 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-danger-100 text-danger-800'
                      }`}>
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {slide.clickCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            // Removed dashboard action tracking - focusing on public store interactions only
                            router.push(`/dashboard/slides/edit/${slide.id}`);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          title="Edit slide"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(slide.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-danger-300 shadow-sm text-xs font-medium rounded text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors"
                          title="Delete slide"
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
            <span className="text-6xl mb-4 block">🖼️</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No slides yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first promotional slide to showcase your affiliate products and special offers.
            </p>
            <button 
              onClick={() => {
                // Removed dashboard action tracking - focusing on public store interactions only
                router.push('/dashboard/slides/add');
              }}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Slide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}