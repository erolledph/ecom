'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 mb-4">
            <Search className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium min-w-[160px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium min-w-[160px] shadow-lg shadow-blue-500/30"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
