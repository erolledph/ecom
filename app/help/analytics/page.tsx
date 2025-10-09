'use client';

import Link from 'next/link';
import { ArrowLeft, BarChart3, Eye, MousePointer, Search, TrendingUp } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function AnalyticsPage() {
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
              <BarChart3 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics</h1>
            <p className="text-xl text-gray-600">
              Understand your store performance and optimize for better conversions
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reading your analytics dashboard</h2>
            <p className="text-gray-700 mb-4">
              Your analytics dashboard provides insights into how visitors interact with your store. Access it from your Dashboard menu.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Key metrics explained:</h3>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Eye className="w-6 h-6 text-blue-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Store Views</h4>
                </div>
                <p className="text-gray-700">
                  Total number of times your store has been visited. Each unique page load counts as one view, regardless of whether it's from the same visitor.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center mb-2">
                  <MousePointer className="w-6 h-6 text-emerald-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Product Clicks</h4>
                </div>
                <p className="text-gray-700">
                  Number of times visitors clicked on your products. This is a critical metric as clicks lead to affiliate commissions. Track which products get the most clicks to optimize your catalog.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <Search className="w-6 h-6 text-purple-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Search Queries</h4>
                </div>
                <p className="text-gray-700">
                  What visitors are searching for in your store. Use this data to add products that match popular search terms and improve product discoverability.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Category Views</h4>
                </div>
                <p className="text-gray-700">
                  Which product categories are most popular with your visitors. Use this to prioritize high-performing categories and adjust your product mix.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tracking product clicks</h2>
            <p className="text-gray-700 mb-4">
              Product click tracking helps you understand which products resonate with your audience:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>View total clicks per product in the Products section</li>
              <li>Sort products by click count to identify top performers</li>
              <li>Track click-through rate (CTR) to measure engagement</li>
              <li>Compare clicks across different time periods</li>
              <li>Identify products with high views but low clicks for optimization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Using click data effectively:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Feature high-performing products in promotional slides</li>
              <li>Improve descriptions and images for low-click products</li>
              <li>Remove or replace products with consistently low engagement</li>
              <li>Test different product arrangements to boost visibility</li>
              <li>Add similar products to popular categories</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding visitor behavior</h2>
            <p className="text-gray-700 mb-4">
              Analytics reveal patterns in how visitors interact with your store:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Search behavior:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Review popular search terms to understand visitor intent</li>
              <li>Add products that match frequently searched keywords</li>
              <li>Look for searches with zero results and fill those gaps</li>
              <li>Optimize product names to match common search patterns</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Category preferences:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Identify which categories attract the most attention</li>
              <li>Add more products to popular categories</li>
              <li>Consider removing or consolidating underperforming categories</li>
              <li>Reorder categories to prioritize popular ones</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Traffic patterns:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Monitor store views over time to track growth</li>
              <li>Identify peak traffic times and days</li>
              <li>Correlate traffic spikes with marketing campaigns</li>
              <li>Calculate conversion rates (clicks ÷ views)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Exporting analytics data</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Premium feature only
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              Premium users can export their analytics data for deeper analysis:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Navigate to the Analytics dashboard</li>
              <li>Click the "Export Data" button</li>
              <li>Choose your date range</li>
              <li>Select which metrics to include</li>
              <li>Choose export format (CSV or JSON)</li>
              <li>Download the file</li>
            </ol>
            <p className="text-gray-700 mb-6">
              Use exported data for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Creating custom reports and visualizations</li>
              <li>Analyzing trends over longer time periods</li>
              <li>Sharing performance data with partners</li>
              <li>Importing into other analytics tools</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Optimization strategies</h2>
            <p className="text-gray-700 mb-4">
              Use your analytics insights to improve store performance:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Increase product clicks:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Use high-quality, compelling product images</li>
              <li>Write descriptive product titles with key benefits</li>
              <li>Show products with proven demand (based on clicks)</li>
              <li>Create urgency with limited-time offers in slides</li>
              <li>Optimize product placement and organization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Boost store traffic:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Share your store link on social media regularly</li>
              <li>Use SEO-friendly product descriptions</li>
              <li>Create content around popular search terms</li>
              <li>Collaborate with other creators for exposure</li>
              <li>Run targeted advertising campaigns</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Improve conversion rates:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Focus on products with high click-through rates</li>
              <li>Remove friction by ensuring fast load times</li>
              <li>Test different layouts and designs</li>
              <li>Highlight bestsellers and customer favorites</li>
              <li>Use social proof when possible</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Analytics best practices</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Check your analytics at least weekly</li>
              <li>Set goals and track progress toward them</li>
              <li>Compare performance month-over-month</li>
              <li>Look for patterns and anomalies</li>
              <li>Test changes one at a time to measure impact</li>
              <li>Document what works and what doesn't</li>
              <li>Use data to make informed decisions, not gut feelings</li>
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
