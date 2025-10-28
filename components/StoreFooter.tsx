'use client';

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