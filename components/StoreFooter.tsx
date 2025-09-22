'use client';

import React from 'react';

export default function StoreFooter() {
  return (
    <footer className="bg-white shadow-inner mt-4 p-4 md:p-6 text-center text-gray-600">
      <div className="space-y-4">
        {/* Tagline */}
        <div>
          <p className="text-sm font-medium text-gray-800 mb-2">
            Discover Amazing Products & Deals
          </p>
          <p className="text-xs text-gray-500">Your trusted affiliate marketplace</p>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Terms & Privacy
          </a>
          <span className="text-gray-400">•</span>
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Contact
          </a>
          <span className="text-gray-400">•</span>
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Career
          </a>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Affiliate Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}