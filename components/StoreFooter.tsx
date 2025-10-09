'use client';

import React from 'react';

export default function StoreFooter() {
  return (
    <footer className="bg-white mt-0 p-4 sm:p-6 text-center text-gray-600">
      <div className="space-y-3 sm:space-y-4">
        {/* Tagline */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2">
            Discover Amazing Products & Deals
          </p>
          <p className="text-xs text-gray-500">Your trusted affiliate marketplace</p>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs">
          <a
            href="/help"
            className="text-gray-600 hover:text-gray-800 transition-colors px-2 py-1"
          >
            Help Center
          </a>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <a
            href="/contact"
            className="text-gray-600 hover:text-gray-800 transition-colors px-2 py-1"
          >
            Contact Us
          </a>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-800 transition-colors px-2 py-1"
          >
            Privacy
          </a>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <a
            href="/terms"
            className="text-gray-600 hover:text-gray-800 transition-colors px-2 py-1"
          >
            Terms
          </a>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Affiliate Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}