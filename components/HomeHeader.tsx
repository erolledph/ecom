import Link from 'next/link';
import { Store } from 'lucide-react';

export default function HomeHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Store className="w-8 h-8 text-emerald-600 mr-3" />
            <span className="text-xl font-bold text-gray-900">Tiangge</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/#pricing"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
