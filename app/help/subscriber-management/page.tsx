'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Mail, Download, CheckCircle } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function SubscriberManagementPage() {
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
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscriber Management</h1>
            <p className="text-xl text-gray-600">
              Build your email list and engage with your audience effectively
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Enabling subscription forms</h2>
            <p className="text-gray-700 mb-4">
              Email subscriptions help you build a direct line of communication with your audience. When enabled, a subscription form appears on your store page.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to enable subscriptions:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Navigate to your Dashboard</li>
              <li>Click on "Store Settings"</li>
              <li>Scroll to the "Subscription Form" section</li>
              <li>Toggle the subscription form to "Enabled"</li>
              <li>Customize the form text and button label (optional)</li>
              <li>Choose the form position (footer, below header, etc.)</li>
              <li>Save your changes</li>
            </ol>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
              <p className="text-emerald-800 font-medium">
                <Mail className="w-5 h-5 inline mr-2" />
                The subscription form is automatically mobile-responsive and matches your store's theme
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Subscription form customization:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Custom placeholder text for the email input</li>
              <li>Personalized button text (e.g., "Subscribe", "Join Now", "Get Updates")</li>
              <li>Optional privacy policy link</li>
              <li>Success message after subscription</li>
              <li>Choose colors to match your branding</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing subscribers</h2>
            <p className="text-gray-700 mb-4">
              View and manage your email subscribers from the Subscribers dashboard:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Subscriber dashboard features:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>View total subscriber count</li>
              <li>See recent subscription activity</li>
              <li>Search for specific subscribers by email</li>
              <li>Sort subscribers by date added</li>
              <li>View subscriber growth over time</li>
              <li>Delete individual subscribers if needed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Subscriber information displayed:</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Email address</li>
                <li>Subscription date and time</li>
                <li>Subscriber status (active/unsubscribed)</li>
                <li>Source (which page they subscribed from)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Exporting subscriber data</h2>
            <p className="text-gray-700 mb-4">
              Both Standard and Premium users can export their subscriber list to use with email marketing platforms:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to export subscribers:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Go to Dashboard and click on "Subscribers"</li>
              <li>Click the "Export" button at the top</li>
              <li>Choose your export format:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>CSV - Compatible with most email platforms</li>
                  <li>JSON - For developers and advanced integrations</li>
                </ul>
              </li>
              <li>Select which fields to include</li>
              <li>Click "Download"</li>
            </ol>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                <Download className="w-5 h-5 inline mr-2" />
                Exported subscriber lists include all active subscribers and their subscription dates
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Using exported data:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Import into email marketing platforms (Mailchimp, ConvertKit, etc.)</li>
              <li>Create targeted email campaigns</li>
              <li>Segment your audience for personalized messaging</li>
              <li>Back up your subscriber list</li>
              <li>Analyze subscriber growth trends</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best practices for email marketing</h2>
            <p className="text-gray-700 mb-4">
              Growing and maintaining a healthy email list requires following best practices:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Growing your list:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Place subscription forms prominently on your store</li>
              <li>Offer incentives for subscribing (exclusive deals, early access)</li>
              <li>Mention benefits clearly ("Get notified of new products")</li>
              <li>Promote your store on social media and encourage subscriptions</li>
              <li>Use pop-ups strategically (Premium feature)</li>
              <li>Make the subscription process simple (just email, no extra fields)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Engaging subscribers:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Send welcome emails to new subscribers</li>
              <li>Share new product additions and updates</li>
              <li>Notify subscribers about sales and promotions</li>
              <li>Provide exclusive content or early access</li>
              <li>Send regular newsletters (weekly or monthly)</li>
              <li>Personalize content based on subscriber interests</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Maintaining list health:</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Always provide an easy unsubscribe option</li>
              <li>Remove inactive subscribers periodically</li>
              <li>Never buy email lists or add people without consent</li>
              <li>Comply with email marketing laws (CAN-SPAM, GDPR)</li>
              <li>Monitor engagement rates and adjust strategy</li>
              <li>Test different email formats and content</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Email marketing tools integration</h2>
            <p className="text-gray-700 mb-4">
              While Tiangge collects subscribers, you'll need an email marketing platform to send campaigns. Popular options include:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mailchimp</h4>
                <p className="text-gray-700 text-sm">
                  Free tier available. Easy-to-use interface with automation features.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">ConvertKit</h4>
                <p className="text-gray-700 text-sm">
                  Built for creators. Advanced segmentation and automation.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Sendinblue</h4>
                <p className="text-gray-700 text-sm">
                  Generous free tier. Includes email and SMS marketing.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">MailerLite</h4>
                <p className="text-gray-700 text-sm">
                  Affordable pricing. Simple and effective for small businesses.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Integration process:</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
              <li>Export your subscribers from Tiangge</li>
              <li>Create an account with your chosen email platform</li>
              <li>Import your subscriber CSV file</li>
              <li>Create email campaigns and automations</li>
              <li>Regularly update your list with new Tiangge exports</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy and compliance</h2>
            <p className="text-gray-700 mb-4">
              When collecting and using email addresses, you must comply with privacy regulations:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Only collect emails with explicit consent</li>
              <li>Clearly explain what subscribers will receive</li>
              <li>Always include an unsubscribe option in emails</li>
              <li>Store subscriber data securely</li>
              <li>Honor unsubscribe requests promptly</li>
              <li>Include your physical address in marketing emails (CAN-SPAM requirement)</li>
              <li>Keep records of consent for GDPR compliance</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Important: Familiarize yourself with email marketing laws in your jurisdiction
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Measuring success</h2>
            <p className="text-gray-700 mb-4">
              Track these metrics to evaluate your email marketing efforts:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Subscriber growth rate</li>
              <li>Email open rates</li>
              <li>Click-through rates on links</li>
              <li>Unsubscribe rate</li>
              <li>Conversion rate from emails to affiliate clicks</li>
              <li>Revenue generated from email campaigns</li>
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
