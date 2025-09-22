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
  storeAvatar?: string;
  requireNameForSubscription?: boolean;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  storeId,
  storeName,
  storeAvatar,
  requireNameForSubscription = true
}: SubscriptionModalProps) {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Track modal view when it opens
  useEffect(() => {
    if (isOpen && !hasTrackedView) {
      trackSubscriptionEvent('subscription_form_view', storeId, {
        store_name: storeName,
        require_name: requireNameForSubscription
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
        subscriber_name: formData.name.trim(),
        require_name: requireNameForSubscription
      });

      setIsSubscribed(true);
      
      // Auto-close modal after showing thank you message
      setTimeout(() => {
        onClose();
      }, 1500);
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
      require_name: requireNameForSubscription
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full max-h-[80vh] overflow-hidden relative">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 rounded-full w-6 h-6 flex items-center justify-center transition-all shadow-sm"
          aria-label="Close subscription form"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              {storeAvatar ? (
                <Image
                  src={storeAvatar}
                  alt={storeName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Stay Updated!
            </h2>
            <p className="text-gray-600 text-xs leading-snug">
              Subscribe to <strong>{storeName}</strong> and be the first to know about new products, exclusive deals, and special offers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <User className="h-3 w-3 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Mail className="h-3 w-3 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : isSubscribed ? (
                'Thank you!'
              ) : (
                <>
                  <Send className="w-3 h-3 mr-2" />
                  Subscribe Now
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 text-xs">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}