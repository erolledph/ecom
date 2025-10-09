'use client';

import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Tiangge. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our affiliate store builder platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Account Information</h3>
            <p className="text-gray-700 mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Email address</li>
              <li>Store name and custom URL</li>
              <li>Profile information you provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Store Content</h3>
            <p className="text-gray-700 mb-4">
              Information you add to your store:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Product information and images</li>
              <li>Store customization settings</li>
              <li>Promotional content and slides</li>
              <li>Affiliate links</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analytics Data</h3>
            <p className="text-gray-700 mb-4">
              We collect analytics to help you understand your store performance:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Store visitor counts</li>
              <li>Product click data</li>
              <li>Search queries</li>
              <li>Category selections</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To enable you to create and manage your affiliate store</li>
              <li>To provide analytics and insights about your store performance</li>
              <li>To communicate with you about service updates</li>
              <li>To improve our platform and user experience</li>
              <li>To prevent fraud and ensure platform security</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Storage and Security</h2>
            <p className="text-gray-700 mb-4">
              Your data is stored securely using Firebase, Google's trusted backend platform. We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Encrypted data transmission</li>
              <li>Secure authentication protocols</li>
              <li>Regular security updates</li>
              <li>Access controls and monitoring</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Sharing</h2>
            <p className="text-gray-700 mb-4">
              Your store content is publicly accessible by design, as it is intended to be shared with visitors. However:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>We do not sell your personal information to third parties</li>
              <li>Your email address is never shared publicly</li>
              <li>Analytics data is private to your account</li>
              <li>Subscriber information remains confidential</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use essential cookies to maintain your session and ensure the platform functions properly. We do not use tracking cookies for advertising purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Firebase for authentication and data storage</li>
              <li>Netlify for hosting</li>
              <li>Product scraping APIs for auto-fill features</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this privacy policy or how we handle your data, please contact us:
            </p>
            <p className="text-gray-700 mb-4">
              Email: <a href="mailto:privacy@tiangge.shop" className="text-emerald-600 hover:text-emerald-700">privacy@tiangge.shop</a>
            </p>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
