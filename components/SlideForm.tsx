'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { trackEvent } from '@/lib/analytics';
import { addSlide, updateSlide, uploadSlideImage, Slide } from '@/lib/store';
import Image from 'next/image';
import { Save, Upload, ArrowLeft } from 'lucide-react';

interface SlideFormProps {
  slide?: Slide | null;
  mode: 'add' | 'edit';
}

export default function SlideForm({ slide, mode }: SlideFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    order: 0,
    isActive: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Initialize form with slide data if editing
  useEffect(() => {
    if (slide && mode === 'edit') {
      setFormData({
        title: slide.title,
        description: slide.description || '',
        link: slide.link || '',
        order: slide.order,
        isActive: slide.isActive
      });
      setImagePreview(slide.image);
    }
  }, [slide, mode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!imageFile && mode === 'add') {
      showError('Please select an image for the slide.');
      return;
    }

    setSaving(true);

    try {
      let imageUrl = slide?.image || '';
      
      if (imageFile) {
        const slideId = slide?.id || `temp_${Date.now()}`;
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

      if (mode === 'edit' && slide) {
        await updateSlide(user.uid, slide.id, slideData);
      } else {
        await addSlide({
          ...slideData,
          storeId: user.uid
        });
      }

      // Track successful save
      // Removed dashboard action tracking - focusing on public store interactions only

      showSuccess(mode === 'edit' ? 'Slide updated successfully!' : 'Slide created successfully!');
      router.push('/dashboard/slides');
    } catch (error) {
      console.error('Error saving slide:', error);
      
      // Removed dashboard action tracking - focusing on public store interactions only
      
      showError('Failed to save slide. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/slides');
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Slide' : 'Add New Slide'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'edit' ? 'Update your promotional slide' : 'Create a new promotional slide for your store'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
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
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
              placeholder="https://affiliate-link.com/product"
            />
            <p className="mt-1 text-xs text-gray-500">
              Link to your affiliate product or landing page
            </p>
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              min="0"
              value={formData.order}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first in the slider
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Slide Image *
            </label>
            {imagePreview && (
              <div className="mb-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={200}
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {imageFile ? 'Change Image' : 'Upload Slide Image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (visible on store)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {mode === 'edit' ? 'Update Slide' : 'Create Slide'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}