'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadWithDeleteProps {
  label: string;
  description?: string;
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<string>;
  onImageDelete: () => Promise<void>;
  accept?: string;
  maxSizeText?: string;
  disabled?: boolean;
}

export default function ImageUploadWithDelete({
  label,
  description,
  currentImageUrl,
  onImageUpload,
  onImageDelete,
  accept = "image/*",
  maxSizeText = "Max file size: 5MB",
  disabled = false
}: ImageUploadWithDeleteProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'bytes');
      // Don't call onImageUpload, just reset the input
      e.target.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      // Don't call onImageUpload, just reset the input
      e.target.value = '';
      return;
    }
    setIsUploading(true);
    try {
      await onImageUpload(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      // The error will be handled by the parent component's onImageUpload function
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (disabled) return;
    
    if (!currentImageUrl) return;
    
    setIsDeleting(true);
    try {
      await onImageDelete();
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{description}</p>
        )}
      </div>

      {/* Current Image Display */}
      {currentImageUrl && (
        <div className="relative inline-block">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={currentImageUrl}
              alt={label}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || disabled}
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1 sm:p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
            title="Delete image"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
            ) : (
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div className="relative">
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${
          disabled 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer hover:border-primary-400 hover:bg-primary-50'
        }`}>
          <div className="flex flex-col items-center justify-center pt-3 sm:pt-5 pb-3 sm:pb-6">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-600 mb-2"></div>
                <p className="text-xs sm:text-sm text-primary-600 font-medium">Uploading...</p>
              </>
            ) : (
              <>
                {currentImageUrl ? (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-400" />
                ) : (
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-400" />
                )}
                <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                  <span className="font-medium">
                    {disabled ? 'Upload disabled' : 'Click to upload'}
                  </span> 
                  {!disabled && ' or drag and drop'}
                </p>
                <p className="text-xs text-gray-400 text-center">{maxSizeText}</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading || disabled}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}