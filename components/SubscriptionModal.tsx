'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addSubscriber } from '@/lib/store';
import { trackSubscriptionEvent } from '@/lib/analytics';
import { useToast } from '@/hooks/useToast';
import { X, Mail, User, Send } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  storeName: string;
  requireName?: boolean;
  backgroundImage?: string;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  storeId,
  storeName,
  requireName = true,
  backgroundImage
}: SubscriptionModalProps) {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Track modal view when it opens
  useEffect(() => {
    if (isOpen && !hasTrackedView) {
      trackSubscriptionEvent('subscription_form_view', storeId, {
        store_name: storeName,
        require_name: requireName,
        has_background_image: !!backgroundImage
      });
      setHasTrackedView(true);
    }
  }, [isOpen, hasTrackedView, storeId, storeName, requireName, backgroundImage]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '' });
      setIsSubmitting(false);
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

    if (requireName && !formData.name.trim()) {
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
        name: requireName ? formData.name.trim() : undefined,
        email: formData.email.trim(),
        storeId
      });

      // Track successful subscription
      await trackSubscriptionEvent('subscription_form_submit', storeId, {
        store_name: storeName,
        subscriber_email: formData.email.trim(),
        subscriber_name: requireName ? formData.name.trim() : undefined,
        require_name: requireName
      });

      showSuccess('Thank you for subscribing! You\'ll receive updates from our store.');
      onClose();
    } catch (error) {
      console.error('Error subscribing:', error);
      showError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Track modal close
    trackSubscriptionEvent('subscription_form_close', storeId, {
      store_name: storeName,
      had_interaction: !!(formData.name || formData.email),
      require_name: requireName
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative">
        {/* Background Image */}
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Subscription background"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white/95" />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm"
          aria-label="Close subscription form"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Stay Updated!
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Subscribe to <strong>{storeName}</strong> and be the first to know about new products, exclusive deals, and special offers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {requireName && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={requireName}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}