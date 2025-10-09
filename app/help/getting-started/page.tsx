'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, Store } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <Link
          href="/help"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Help Center
        </Link>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Store className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
            <p className="text-xl text-gray-600">
              Learn the basics of setting up your store and start your affiliate marketing journey
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to create your first store</h2>
            <p className="text-gray-700 mb-4">
              Creating your first Tiangge store is simple and takes just a few minutes. Follow these steps:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Sign up for a free account using your email address</li>
              <li>Choose a unique store slug (this will be your store URL)</li>
              <li>Complete your store profile with a name and description</li>
              <li>Start adding products to your store</li>
              <li>Customize your store appearance to match your brand</li>
              <li>Share your store link and start earning commissions</li>
            </ol>
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
              <p className="text-emerald-800 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Pro Tip: Your store URL will be tiangge.shop/your-store-slug
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Customizing your store appearance</h2>
            <p className="text-gray-700 mb-4">
              Make your store stand out by customizing its appearance:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Choose a custom background color or upload a background image</li>
              <li>Select a theme color that matches your brand</li>
              <li>Upload a store avatar or logo</li>
              <li>Customize fonts and text styles</li>
              <li>Set up category images for better navigation</li>
              <li>Enable or disable features like search and categories</li>
            </ul>
            <p className="text-gray-700 mb-6">
              All customization options are available in your Dashboard under the "Store Settings" section.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adding social media links</h2>
            <p className="text-gray-700 mb-4">
              Connect your social media accounts to drive more traffic to your store:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Go to Dashboard and click on "Store Settings"</li>
              <li>Scroll to the "Social Media" section</li>
              <li>Add your Instagram, Facebook, and Twitter profile URLs</li>
              <li>Click "Save Changes"</li>
              <li>Your social media icons will appear on your store page</li>
            </ol>
            <p className="text-gray-700 mb-6">
              Social media integration helps build trust and allows visitors to connect with you on multiple platforms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding user roles</h2>
            <p className="text-gray-700 mb-4">
              Tiangge has three user roles:
            </p>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard User</h3>
                <p className="text-gray-700">
                  Free forever plan with access to core features. Limited to 30 products but includes store customization, product management, analytics, and promotional slides.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium User</h3>
                <p className="text-gray-700">
                  Full access to all features including unlimited products, bulk CSV import, floating widgets, pop-up banners, advanced analytics, and data export capabilities.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin</h3>
                <p className="text-gray-700">
                  System administrators with access to user management, sponsored products, and platform-wide settings. This role is reserved for Tiangge staff.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next steps</h2>
            <p className="text-gray-700 mb-4">
              Once you've set up your store, explore these features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Link href="/help/product-management" className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
                <p className="text-gray-600 text-sm">Learn how to add and manage products</p>
              </Link>
              <Link href="/help/content-design" className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content & Design</h3>
                <p className="text-gray-600 text-sm">Create engaging promotional content</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-emerald-50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need more help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to assist you
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
