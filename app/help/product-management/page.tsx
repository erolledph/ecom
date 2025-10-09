'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Upload, Link2, FileText } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function ProductManagementPage() {
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
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Management</h1>
            <p className="text-xl text-gray-600">
              Learn how to add, manage, and organize your affiliate products effectively
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adding products manually</h2>
            <p className="text-gray-700 mb-4">
              Manual product addition gives you full control over product details:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Navigate to Dashboard and click on "Products"</li>
              <li>Click the "Add Product" button</li>
              <li>Fill in the product information:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Product name</li>
                  <li>Description (supports rich text formatting)</li>
                  <li>Price</li>
                  <li>Category</li>
                  <li>Affiliate link (where users will be redirected)</li>
                  <li>Product image (upload or provide URL)</li>
                </ul>
              </li>
              <li>Click "Create Product" to publish</li>
            </ol>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                <FileText className="w-5 h-5 inline mr-2" />
                Tip: Use detailed descriptions and high-quality images to increase conversion rates
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Using product URL scraping</h2>
            <p className="text-gray-700 mb-4">
              Save time by automatically fetching product details from Amazon or other supported platforms:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Click "Add Product" in your dashboard</li>
              <li>Look for the "Scrape Product" option</li>
              <li>Paste the product URL from Amazon or other supported retailers</li>
              <li>Click "Fetch Details"</li>
              <li>The system will automatically fill in:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Product name</li>
                  <li>Description</li>
                  <li>Price</li>
                  <li>Product images</li>
                </ul>
              </li>
              <li>Review and edit the information as needed</li>
              <li>Add your affiliate link</li>
              <li>Save the product</li>
            </ol>
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
              <p className="text-emerald-800 font-medium">
                <Link2 className="w-5 h-5 inline mr-2" />
                Note: Always replace the product link with your affiliate link before saving
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Importing products via CSV</h2>
            <p className="text-gray-700 mb-4">
              Premium users can import hundreds of products at once using CSV files:
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                This feature is only available for Premium subscribers
              </p>
            </div>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Go to Dashboard and click on "Products"</li>
              <li>Click "Import CSV"</li>
              <li>Download the CSV template to see the required format</li>
              <li>Fill in your product data in the template with columns:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>name (required)</li>
                  <li>description (required)</li>
                  <li>price (required)</li>
                  <li>affiliateLink (required)</li>
                  <li>category (optional)</li>
                  <li>imageUrl (optional)</li>
                </ul>
              </li>
              <li>Upload your completed CSV file</li>
              <li>Review the preview and confirm import</li>
              <li>All products will be added to your store</li>
            </ol>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                <Upload className="w-5 h-5 inline mr-2" />
                Tip: Test with a small CSV file first to ensure your data is formatted correctly
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing product categories</h2>
            <p className="text-gray-700 mb-4">
              Organize your products into categories for better navigation:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Create custom categories in your Store Settings</li>
              <li>Assign products to categories during creation or editing</li>
              <li>Upload custom category images for visual appeal</li>
              <li>Reorder categories to prioritize important ones</li>
              <li>Use the "All" category to display all products</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Categories appear as circular icons on your store page, making it easy for visitors to browse specific types of products.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Product limits</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Plan</h3>
                <p className="text-gray-700">
                  Limited to 30 products. If you exceed this limit, only your 30 most recent products will be visible.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Plan</h3>
                <p className="text-gray-700">
                  Unlimited products. Add as many products as you need to grow your affiliate business.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best practices</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Use high-quality product images for better engagement</li>
              <li>Write detailed descriptions that highlight key features and benefits</li>
              <li>Keep prices up-to-date to maintain customer trust</li>
              <li>Organize products into relevant categories</li>
              <li>Test your affiliate links to ensure they work correctly</li>
              <li>Regularly update your product catalog with trending items</li>
              <li>Use descriptive product names that include key search terms</li>
            </ul>
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
