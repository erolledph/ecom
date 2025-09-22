'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

interface ImageUploadWithDeleteProps {
  label: string;
  description?: string;
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<string>;
  onImageDelete: () => Promise<void>;
  accept?: string;
  maxSizeText?: string;
}

export default function ImageUploadWithDelete({
  label,
  description,
  currentImageUrl,
  onImageUpload,
  onImageDelete,
  accept = "image/*",
  maxSizeText = "Max file size: 5MB"
}: ImageUploadWithDeleteProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onImageUpload(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        )}
      </div>

      {/* Current Image Display */}
      {currentImageUrl && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={currentImageUrl}
              alt={label}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Delete image"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div className="relative">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                <p className="text-sm text-primary-600 font-medium">Uploading...</p>
              </>
            ) : (
              <>
                {currentImageUrl ? (
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                ) : (
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                )}
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">{maxSizeText}</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}