'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getStoreSlides, addSlide, updateSlide, deleteSlide, uploadSlideImage, Slide, getUserStore } from '@/lib/store';
import { Copy, Check, Edit, Trash2, Plus, ExternalLink } from 'lucide-react';

export default function SlidesPage() {
  const { user } = useAuth();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    order: 0,
    isActive: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      order: slides.length,
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setEditingSlide(null);
    setShowForm(false);
  };

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description || '',
      link: slide.link || '',
      order: slide.order,
      isActive: slide.isActive
    });
    setImagePreview(slide.image);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!imageFile && !editingSlide) {
      alert('Please select an image for the slide.');
      return;
    }

    setSaving(true);

    try {
      let imageUrl = editingSlide?.image || '';
      
      if (imageFile) {
        const slideId = editingSlide?.id || `temp_${Date.now()}`;
        imageUrl = await uploadSlideImage(user.uid, imageFile, slideId);
      }

      const slideData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        link: formData.link,
        order: formData.order,
        isActive: formData.isActive
      };

      if (editingSlide) {
        await updateSlide(editingSlide.id, slideData);
      } else {
        await addSlide({
          ...slideData,
          storeId: user.uid
        });
      }

      await fetchSlides();
      resetForm();
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Failed to save slide. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slideId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        await deleteSlide(slideId);
        await fetchSlides();
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert('Failed to delete slide. Please try again.');
      }
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Promotional Slides</h1>
            <p className="mt-2 text-gray-600 text-sm md:text-base">
              Create promotional slides to showcase your best affiliate products and offers.
            </p>
          </div>
          
          <div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                    placeholder="New Summer Collection!"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Create catchy titles to grab visitor attention
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                    placeholder="Promote your best affiliate products or special offers"
                  />
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    Affiliate Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                    placeholder="https://affiliate-link.com/product"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Link to your affiliate product or landing page
                  </p>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    min="0"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slide Image *
                  </label>
                  {imagePreview && (
                    <div className="mb-2">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (visible on store)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {saving ? 'Saving...' : (editingSlide ? 'Update Slide' : 'Create Slide')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Slides Table */}
      {slides.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm"
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
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(slide)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slide.id)}
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
            <span className="text-6xl mb-4 block">🖼️</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No slides yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first promotional slide to showcase your affiliate products and special offers.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
