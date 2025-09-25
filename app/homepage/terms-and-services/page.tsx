import Link from 'next/link';
import { ArrowLeft, FileText, Shield, Users, CircleAlert as AlertCircle } from 'lucide-react';

export default function TermsAndServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/homepage"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Terms and Services</h1>
              <p className="text-gray-600 mt-2">Last updated: December 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                  <p className="text-blue-800 text-sm">
                    By using Tiangge's affiliate store builder platform, you agree to comply with these terms and services. 
                    Please read them carefully before using our services.
                  </p>
                </div>
              </div>
            </div>

            {/* 1. Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-primary-600 mr-3" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Tiangge! These Terms and Services ("Terms") govern your use of our affiliate store builder platform 
                and services provided by Tiangge ("we," "us," or "our"). By accessing or using our platform, you agree to be 
                bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you disagree with any part of these terms, then you may not access or use our services. 
                We reserve the right to update these Terms at any time, and your continued use of the platform 
                constitutes acceptance of any changes.
              </p>
            </section>

            {/* 2. Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-primary-600 mr-3" />
                2. Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tiangge provides a platform for creating and managing affiliate stores. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Store creation and customization tools</li>
                <li>Product management and affiliate link integration</li>
                <li>Analytics and performance tracking</li>
                <li>Email subscriber management</li>
                <li>Promotional content creation tools</li>
                <li>Image optimization and storage services</li>
              </ul>
            </section>

            {/* 3. User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 text-primary-600 mr-3" />
                3. User Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a user of our platform, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate and truthful information when creating your account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the platform only for lawful affiliate marketing purposes</li>
                <li>Respect intellectual property rights of others</li>
                <li>Not engage in spam, fraud, or deceptive practices</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not attempt to circumvent platform limitations or security measures</li>
              </ul>
            </section>

            {/* 4. Account and Store Management */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Account and Store Management</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Account Creation:</strong> You must provide a valid email address and create a secure password. 
                  Each user is entitled to one account and one store per account.
                </p>
                <p>
                  <strong>Store Content:</strong> You are solely responsible for all content uploaded to your store, 
                  including product descriptions, images, and affiliate links. Content must be appropriate and legal.
                </p>
                <p>
                  <strong>Product Limits:</strong> Free accounts are limited to 30 products. Premium accounts have unlimited products. 
                  We reserve the right to modify these limits with reasonable notice.
                </p>
              </div>
            </section>

            {/* 5. Prohibited Uses */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Uses</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not use our platform for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Selling illegal, counterfeit, or prohibited products</li>
                <li>Promoting adult content, gambling, or harmful substances</li>
                <li>Engaging in pyramid schemes or multi-level marketing</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Distributing malware or engaging in hacking activities</li>
                <li>Creating multiple accounts to circumvent limitations</li>
              </ul>
            </section>

            {/* 6. Payment and Billing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment and Billing</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Free Plan:</strong> Our free plan is provided at no cost and includes basic features with limitations.
                </p>
                <p>
                  <strong>Premium Plans:</strong> Premium subscriptions are billed monthly or annually. 
                  All fees are non-refundable except as required by law.
                </p>
                <p>
                  <strong>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date.
                </p>
              </div>
            </section>

            {/* 7. Data and Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data and Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take your privacy seriously. Our data practices include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Secure storage of your account and store data</li>
                <li>Analytics data collection for platform improvement</li>
                <li>No sharing of personal data with third parties without consent</li>
                <li>Right to export your data at any time</li>
                <li>Compliance with applicable data protection regulations</li>
              </ul>
            </section>

            {/* 8. Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Tiangge provides the platform "as is" without warranties. We are not liable for any indirect, 
                incidental, or consequential damages arising from your use of the platform. Our total liability 
                shall not exceed the amount paid by you for the services in the 12 months preceding the claim.
              </p>
            </section>

            {/* 9. Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                Either party may terminate the service relationship at any time. We reserve the right to suspend 
                or terminate accounts that violate these Terms. Upon termination, your access to the platform 
                will cease, but you may export your data before termination.
              </p>
            </section>

            {/* 10. Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Services, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> legal@tiangge.shop</p>
                  <p><strong>Website:</strong> <a href="https://tiangge.shop" className=\"text-primary-600 hover:text-primary-700">https://tiangge.shop</a></p>
                  <p><strong>Support:</strong> <Link href="/homepage/contact" className=\"text-primary-600 hover:text-primary-700">Contact Page</Link></p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Legal Disclaimer</h4>
                  <p className="text-yellow-800 text-sm">
                    These terms constitute a legally binding agreement. If you do not agree with any provision, 
                    please discontinue use of our services immediately. For specific legal questions, 
                    please consult with a qualified attorney.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}