'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addSubscriber } from '@/lib/store';
import { trackSubscriptionEvent } from '@/lib/analytics';
import { useToast } from '@/hooks/useToast';
import { X, Mail, User, Send } from 'lucide-react';

interface StoreCustomization {
  loadMoreButtonBgColor?: string;
  loadMoreButtonTextColor?: string;
  avatarBorderColor?: string;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  storeName: string;
  storeAvatar?: string;
  customization?: StoreCustomization;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  storeId,
  storeName,
  storeAvatar,
  customization
}: SubscriptionModalProps) {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Define color variables with customization support and fallback values
  const modalBgColor = '#ffffff'; // white
  const modalTextColor = '#374151'; // gray-700
  const buttonBgColor = customization?.loadMoreButtonBgColor || '#84cc16'; // Use CTA button color
  const buttonTextColor = customization?.loadMoreButtonTextColor || '#ffffff'; // white
  const modalBorderColor = '#e5e7eb'; // gray-200
  const inputBgColor = '#ffffff'; // white
  const inputBorderColor = '#d1d5db'; // gray-300
  const inputTextColor = '#374151'; // gray-700
  const inputPlaceholderColor = '#9ca3af'; // gray-400

  // Track modal view when it opens
  useEffect(() => {
    if (isOpen && !hasTrackedView) {
      trackSubscriptionEvent('subscription_form_view', storeId, {
        store_name: storeName
      });
      setHasTrackedView(true);
    }
  }, [isOpen, hasTrackedView, storeId, storeName]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '' });
      setIsSubmitting(false);
      setIsSubscribed(false);
      setHasTrackedView(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      showError('Email is required');
      return;
    }

    if (!formData.name.trim()) {
      showError('Name is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await addSubscriber({
        name: formData.name.trim(),
        email: formData.email.trim(),
        storeId
      });

      // Track successful subscription
      await trackSubscriptionEvent('subscription_form_submit', storeId, {
        store_name: storeName,
        subscriber_email: formData.email.trim(),
        subscriber_name: formData.name.trim()
      });

      setIsSubscribed(true);
      
      // Auto-close modal after showing thank you message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error subscribing:', error);
      // Display the specific error message from the backend
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe: An unexpected error occurred. Please try again.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Track modal close
    trackSubscriptionEvent('subscription_form_close', storeId, {
      store_name: storeName,
      had_interaction: !!(formData.name || formData.email)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="rounded-xl shadow-2xl max-w-xs sm:max-w-sm w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden relative border"
        style={{
          backgroundColor: modalBgColor,
          borderColor: modalBorderColor
        }}
      >

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20 bg-opacity-80 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all shadow-sm min-h-[44px] min-w-[44px]"
          style={{ backgroundColor: modalBgColor }}
          aria-label="Close subscription form"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-3 sm:p-4 lg:p-5">
          {/* Header */}
          <div className="text-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              {storeAvatar ? (
                <Image
                  src={storeAvatar}
                  alt={storeName}
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2"
                  style={{ borderColor: customization?.avatarBorderColor || '#ffffff' }}
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              Stay Updated!
            </h2>
            <p className="text-xs sm:text-sm leading-snug px-2" style={{ color: modalTextColor, opacity: 0.8 }}>
              Subscribe to <strong>{storeName}</strong> and be the first to know about new products, exclusive deals, and special offers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-1" style={{ color: modalTextColor }}>
                Your Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-7 sm:pl-8 pr-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm min-h-[44px]"
                  style={{ 
                    backgroundColor: inputBgColor,
                    borderColor: inputBorderColor,
                    color: inputTextColor
                  }}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1" style={{ color: modalTextColor }}>
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-7 sm:pl-8 pr-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm min-h-[44px]"
                  style={{ 
                    backgroundColor: inputBgColor,
                    borderColor: inputBorderColor,
                    color: inputTextColor
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl text-sm min-h-[44px]"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : isSubscribed ? (
                'Thank you!'
              ) : (
                <>
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs" style={{ color: modalTextColor, opacity: 0.7 }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom styles for placeholder text */}
      <style jsx>{`
        input::placeholder {
          color: ${inputPlaceholderColor} !important;
          opacity: 1;
        }
        input::-webkit-input-placeholder {
          color: ${inputPlaceholderColor} !important;
        }
        input::-moz-placeholder {
          color: ${inputPlaceholderColor} !important;
          opacity: 1;
        }
        input:-ms-input-placeholder {
          color: ${inputPlaceholderColor} !important;
        }
        input:-moz-placeholder {
          color: ${inputPlaceholderColor} !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}