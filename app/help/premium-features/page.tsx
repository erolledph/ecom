'use client';

import Link from 'next/link';
import { ArrowLeft, Crown, Upload, Download, Maximize2, Bell, CheckCircle, X } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function PremiumFeaturesPage() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Features</h1>
            <p className="text-xl text-gray-600">
              Unlock advanced capabilities to scale your affiliate marketing business
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Premium vs Standard features</h2>
            <p className="text-gray-700 mb-6">
              Understand the differences between our plans to choose what's right for you:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Standard (Free)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Up to 30 products</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Store customization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Product scraping</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Promotional slides</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Email subscriptions</span>
                  </li>
                  <li className="flex items-start text-gray-500">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No bulk import</span>
                  </li>
                  <li className="flex items-start text-gray-500">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No data export</span>
                  </li>
                  <li className="flex items-start text-gray-500">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No floating widgets</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-2 border-emerald-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Premium</h3>
                  <Crown className="w-6 h-6 text-emerald-600" />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Unlimited products</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Bulk CSV import</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Floating widgets</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Pop-up banners</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Analytics export</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Subscriber export</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">All Standard features</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Upgrading to Premium</h2>
            <p className="text-gray-700 mb-4">
              Ready to unlock all features? Upgrading is simple:
            </p>

            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Log in to your Tiangge account</li>
              <li>Go to your Dashboard</li>
              <li>Click on your profile or "Account Settings"</li>
              <li>Select "Upgrade to Premium"</li>
              <li>Choose your payment method</li>
              <li>Complete the checkout process</li>
              <li>Premium features activate immediately</li>
            </ol>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
              <p className="text-emerald-800 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                New users get a 7-day FREE Premium trial. No credit card required!
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Pricing:</h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">$29</div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-gray-500 mt-2">Cancel anytime, no long-term commitment</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bulk import capabilities</h2>
            <div className="flex items-center mb-4">
              <Upload className="w-6 h-6 text-emerald-600 mr-3" />
              <span className="text-emerald-600 font-semibold">Premium Feature</span>
            </div>
            <p className="text-gray-700 mb-4">
              Save hours of work by importing hundreds of products at once with CSV files:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Benefits:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Add 100+ products in minutes instead of hours</li>
              <li>Perfect for scaling your affiliate business quickly</li>
              <li>Easy to maintain and update product catalogs</li>
              <li>Supports all product fields including images and categories</li>
              <li>Error checking and validation before import</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Use cases:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Launching a new store with a large product catalog</li>
              <li>Migrating products from another platform</li>
              <li>Seasonal product additions (holiday sales, back-to-school, etc.)</li>
              <li>Testing different product mixes quickly</li>
              <li>Maintaining multiple niche stores efficiently</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Advanced customization options</h2>
            <div className="flex items-center mb-4">
              <Maximize2 className="w-6 h-6 text-emerald-600 mr-3" />
              <span className="text-emerald-600 font-semibold">Premium Feature</span>
            </div>
            <p className="text-gray-700 mb-4">
              Premium users get access to advanced design and functionality options:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Floating widgets:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Add persistent promotional badges to your store</li>
              <li>Drive attention to special offers or new products</li>
              <li>Customize position, color, and messaging</li>
              <li>Increase click-through rates with strategic placement</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Pop-up banners:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Capture visitor attention immediately</li>
              <li>Promote limited-time offers effectively</li>
              <li>Grow your email list faster with popup forms</li>
              <li>Control display timing and frequency</li>
              <li>Track performance with built-in analytics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data export:</h3>
            <div className="flex items-center mb-4">
              <Download className="w-6 h-6 text-emerald-600 mr-3" />
              <span className="text-emerald-600 font-semibold">Premium Feature</span>
            </div>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Export all analytics data for custom analysis</li>
              <li>Download subscriber lists for email marketing</li>
              <li>Create custom reports and visualizations</li>
              <li>Share performance data with partners or clients</li>
              <li>Backup your data regularly</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Priority support</h2>
            <div className="flex items-center mb-4">
              <Bell className="w-6 h-6 text-emerald-600 mr-3" />
              <span className="text-emerald-600 font-semibold">Premium Feature</span>
            </div>
            <p className="text-gray-700 mb-4">
              Premium users receive priority support with faster response times:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Guaranteed response within 24 hours</li>
              <li>Access to advanced troubleshooting</li>
              <li>Direct support channel</li>
              <li>Feature requests given higher priority</li>
              <li>Personalized onboarding assistance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Coming soon: Custom domains</h2>
            <p className="text-gray-700 mb-4">
              Premium users will soon be able to use custom domains for their stores:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Use your own domain (e.g., shop.yoursite.com)</li>
              <li>Increase brand credibility and trust</li>
              <li>Better SEO with custom domain authority</li>
              <li>Professional appearance for serious businesses</li>
              <li>Easy setup with guided instructions</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                This feature is currently in development and will be available to all Premium users at no extra cost
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Is Premium right for you?</h2>
            <p className="text-gray-700 mb-4">
              Consider upgrading to Premium if:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>You need more than 30 products</li>
              <li>You want to scale your affiliate business quickly</li>
              <li>You need bulk import for efficiency</li>
              <li>You want advanced promotional tools (widgets, pop-ups)</li>
              <li>You need data export for analysis or backup</li>
              <li>You value priority support</li>
              <li>You're serious about maximizing affiliate earnings</li>
            </ul>

            <p className="text-gray-700 mb-6">
              The Standard plan is perfect if you're just getting started or have a smaller product catalog. You can always upgrade later when your business grows.
            </p>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-center text-white mt-8">
              <h3 className="text-2xl font-bold mb-4">Ready to upgrade?</h3>
              <p className="mb-6">
                Start your 7-day FREE Premium trial today
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started Free
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
