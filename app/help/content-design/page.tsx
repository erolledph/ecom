'use client';

import Link from 'next/link';
import { ArrowLeft, Image, Layout, Megaphone, Sparkles } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function ContentDesignPage() {
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
              <Image className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Content & Design</h1>
            <p className="text-xl text-gray-600">
              Create engaging visual content to boost conversions and highlight your best offers
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Creating promotional slides</h2>
            <p className="text-gray-700 mb-4">
              Promotional slides appear at the top of your store as an eye-catching carousel. Use them to highlight:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Special promotions and discounts</li>
              <li>Featured products</li>
              <li>Seasonal campaigns</li>
              <li>New arrivals</li>
              <li>Your best-selling items</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to create a slide:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Go to Dashboard and click on "Slides"</li>
              <li>Click "Add Slide"</li>
              <li>Upload a banner image (recommended: 1200x400px)</li>
              <li>Add a title and description (optional)</li>
              <li>Choose a link destination (product page or external URL)</li>
              <li>Set the display order</li>
              <li>Toggle visibility on/off</li>
              <li>Click "Create Slide"</li>
            </ol>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
              <p className="text-emerald-800 font-medium">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Pro Tip: Use high-contrast text and clear call-to-action buttons in your slide images
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Using custom HTML sections</h2>
            <p className="text-gray-700 mb-4">
              Add custom HTML content to your store for additional flexibility:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Custom announcements or notices</li>
              <li>Embedded videos or media</li>
              <li>Special formatting and layouts</li>
              <li>Third-party widgets and integrations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Adding custom HTML:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Navigate to "Store Settings" in your dashboard</li>
              <li>Scroll to the "Custom HTML" section</li>
              <li>Enable the custom HTML feature</li>
              <li>Enter your HTML code in the editor</li>
              <li>Preview your changes</li>
              <li>Click "Save Changes"</li>
            </ol>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                <Layout className="w-5 h-5 inline mr-2" />
                Note: Only basic HTML and CSS are supported. JavaScript is sanitized for security reasons
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adding floating widgets</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Premium feature only
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              Floating widgets appear as persistent elements on your store that visitors can interact with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Promotional badges or buttons</li>
              <li>Quick links to featured products</li>
              <li>Discount code reminders</li>
              <li>Social proof notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Setting up a floating widget:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Go to "Store Settings" in your dashboard</li>
              <li>Navigate to "Floating Widget" section</li>
              <li>Enable the widget</li>
              <li>Enter your widget text</li>
              <li>Add a destination URL</li>
              <li>Choose widget position (bottom-left, bottom-right, etc.)</li>
              <li>Customize colors to match your brand</li>
              <li>Save your changes</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Setting up pop-up banners</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Premium feature only
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              Pop-up banners appear when visitors first arrive at your store, perfect for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Welcome messages</li>
              <li>Limited-time offers</li>
              <li>Newsletter signups</li>
              <li>Special announcements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Creating a pop-up banner:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Access "Store Settings" from your dashboard</li>
              <li>Find the "Pop-up Banner" section</li>
              <li>Enable the pop-up feature</li>
              <li>Upload a banner image or create text-based content</li>
              <li>Add a title and description</li>
              <li>Include a call-to-action button with link</li>
              <li>Set display timing (delay before showing)</li>
              <li>Choose frequency (once per session, every visit, etc.)</li>
              <li>Save and test your pop-up</li>
            </ol>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
              <p className="text-emerald-800 font-medium">
                <Megaphone className="w-5 h-5 inline mr-2" />
                Best Practice: Don't show pop-ups too frequently as they can annoy visitors
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Design best practices</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Maintain consistent branding across all visual elements</li>
              <li>Use high-quality images that load quickly</li>
              <li>Ensure text is readable on all background colors</li>
              <li>Keep slide titles short and impactful</li>
              <li>Include clear calls-to-action on promotional content</li>
              <li>Test your design on mobile devices</li>
              <li>Update promotional content regularly to keep it fresh</li>
              <li>Use A/B testing to find what works best</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Image optimization tips</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Compress images before uploading to improve loading speed</li>
              <li>Use appropriate dimensions (slides: 1200x400px, products: 800x800px)</li>
              <li>Stick to web-friendly formats (JPEG, PNG, WebP)</li>
              <li>Optimize file sizes without sacrificing quality</li>
              <li>Ensure images look good on both desktop and mobile</li>
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
