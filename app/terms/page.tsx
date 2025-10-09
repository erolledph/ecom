'use client';

import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Tiangge, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-4">
              Tiangge is an affiliate store builder platform that enables users to create, customize, and manage online stores for affiliate marketing purposes. We provide tools for product management, analytics, and store customization.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Accounts</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Account Creation</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>One person or entity may not maintain multiple accounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Account Responsibilities</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You are responsible for all activities under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>You must not share your account credentials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acceptable Use</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">You agree NOT to:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Use the service for any illegal purposes</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or harmful content</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use automated systems to scrape or collect data</li>
              <li>Sell counterfeit or prohibited products</li>
              <li>Engage in fraudulent affiliate marketing practices</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Content Guidelines</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">User Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you upload to your store. However:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You grant us a license to host and display your content</li>
              <li>You are responsible for ensuring you have rights to use all content</li>
              <li>Your content must not violate any laws or third-party rights</li>
              <li>We reserve the right to remove content that violates these terms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Prohibited Content</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Illegal products or services</li>
              <li>Adult or explicit content</li>
              <li>Hate speech or discriminatory content</li>
              <li>Misleading or fraudulent information</li>
              <li>Copyrighted material without permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Subscription Plans</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Standard Plan</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Free forever with basic features</li>
              <li>Limited to 30 products</li>
              <li>Access to core functionality</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Premium Plan</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Monthly subscription fee</li>
              <li>Unlimited products and advanced features</li>
              <li>Billed monthly, cancel anytime</li>
              <li>No refunds for partial months</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Affiliate Marketing</h2>
            <p className="text-gray-700 mb-4">
              As an affiliate marketer using our platform:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You must comply with all affiliate program terms</li>
              <li>You must disclose affiliate relationships where required</li>
              <li>You are responsible for all affiliate earnings and taxes</li>
              <li>We are not responsible for affiliate program payments</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sponsored Products</h2>
            <p className="text-gray-700 mb-4">
              We may display sponsored products in your store:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Sponsored products appear in stores with 15+ products</li>
              <li>You cannot remove sponsored products</li>
              <li>Sponsored product placement helps keep our platform affordable</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Tiangge platform, including its design, features, and functionality, is owned by us and protected by copyright, trademark, and other laws. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Copy or reproduce the platform</li>
              <li>Modify or create derivative works</li>
              <li>Reverse engineer the platform</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              The service is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>Any specific results or earnings</li>
              <li>The accuracy of analytics data</li>
              <li>Compatibility with all devices or browsers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              We are not liable for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits or revenue</li>
              <li>Loss of data or business opportunities</li>
              <li>Actions of third parties or affiliate programs</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              We may suspend or terminate your account:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>For violation of these terms</li>
              <li>For fraudulent or illegal activities</li>
              <li>For excessive system abuse</li>
              <li>At our discretion with notice</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You may cancel your account at any time through your dashboard.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of significant changes. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms are governed by applicable laws. Any disputes shall be resolved through binding arbitration.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these terms, contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: <a href="mailto:legal@tiangge.shop" className="text-emerald-600 hover:text-emerald-700">legal@tiangge.shop</a>
            </p>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
