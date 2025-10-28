'use client';

import React from 'react';

export default function StoreFooter() {
  return (
    <footer className="bg-white mt-0 pt-8 pb-8 sm:pt-12 sm:pb-12 text-center text-gray-600">
      <div className="space-y-3 sm:space-y-4">
        {/* Tagline */}
        <div>
          <p className="text-lg text-gray-500">
            <span className="font-semibold text-gray-700">Tiangge</span>
          </p>
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
          </a>'use client';

import React from 'react';

export default function StoreFooter() {
  return (
    <footer className="bg-white mt-0 py-16 text-center text-gray-600">
      <div className="space-y-6">
        
        <div>
          <p className="text-xl font-bold text-gray-700">
            Tiangge
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          <a
            href="/help"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Help Center
          </a>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <a
            href="/contact"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Contact Us
          </a>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Privacy
          </a>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <a
            href="/terms"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Terms
          </a>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Tiangge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Tiangge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}