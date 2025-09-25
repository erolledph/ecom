import Link from 'next/link';
import Image from 'next/image';
import { Store, Package, ChartBar as BarChart3, Palette, Users, Zap, Shield, Globe, CircleCheck as CheckCircle, Star, ArrowRight, Play, TrendingUp, Image as ImageIcon, Mail, Crown, Building2 } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Free Forever Plan Available
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Build Your Dream
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  {" "}Affiliate Store
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Create and customize your own affiliate store in minutes. Add products, track performance, 
                and start earning commissions with our powerful, user-friendly platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-all font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No Credit Card Required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free Forever Plan
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Setup in Minutes
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Affiliate Store Builder Dashboard"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to create, customize, 
              and monetize your affiliate store effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Store Customization */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Customization</h3>
              <p className="text-gray-600 leading-relaxed">
                Personalize your store with custom branding, colors, typography, layouts, and social media integration. 
                Make your store truly unique.
              </p>
            </div>

            {/* Product Management */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Product Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Add products manually or use our URL scraping feature. Bulk import with CSV files. 
                Automatic image optimization and category generation.
              </p>
            </div>

            {/* Analytics */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Track store views, product clicks, user behavior, and conversion metrics. 
                Export data and gain insights to optimize performance.
              </p>
            </div>

            {/* Promotional Tools */}
            <div className="group p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Promotional Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Create eye-catching slides, floating widgets, pop-up banners, and custom HTML sections 
                to engage visitors and boost conversions.
              </p>
            </div>

            {/* Email Marketing */}
            <div className="group p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Marketing</h3>
              <p className="text-gray-600 leading-relaxed">
                Collect subscriber emails with customizable popup forms. Manage your mailing list 
                and export subscriber data for marketing campaigns.
              </p>
            </div>

            {/* Security & Performance */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with modern security practices, automatic image optimization, 
                responsive design, and SEO-friendly structure for maximum performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your affiliate store up and running in just a few simple steps. 
              No technical knowledge required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up Free</h3>
              <p className="text-gray-600">
                Create your account with a custom store URL. No credit card required to get started.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customize Store</h3>
              <p className="text-gray-600">
                Set up your store branding, colors, layout, and social media links to match your style.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Products</h3>
              <p className="text-gray-600">
                Add affiliate products manually, use URL scraping, or bulk import with CSV files.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Earning</h3>
              <p className="text-gray-600">
                Share your store URL and start earning commissions from affiliate sales and clicks.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Track Performance</h4>
              <p className="text-gray-600 text-sm">
                Monitor clicks, views, and user behavior with detailed analytics dashboard.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <Globe className="w-8 h-8 text-secondary-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">SEO Optimized</h4>
              <p className="text-gray-600 text-sm">
                Built-in SEO features, meta tags, and responsive design for better visibility.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-accent-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Grow Your Audience</h4>
              <p className="text-gray-600 text-sm">
                Collect email subscribers and build your audience with integrated marketing tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Up to 30 products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Store customization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Email subscribers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Promotional slides</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Mobile responsive</span>
                  </li>
                </ul>
                
                <Link
                  href="/auth"
                  className="block w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-center"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border-2 border-primary-300 hover:border-primary-400 transition-all hover:shadow-xl transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Unlimited products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Bulk CSV import</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Data export capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">All free features</span>
                  </li>
                </ul>
                
                <Link
                  href="/auth"
                  className="block w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all font-semibold text-center shadow-lg"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="relative p-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">White-label solution</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Custom domain</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">API access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">All premium features</span>
                  </li>
                </ul>
                
                <Link
                  href="/homepage/contact"
                  className="block w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-center"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              All plans include SSL security, automatic backups, and 99.9% uptime guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Affiliate Marketers
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful affiliate marketers who trust Tiangge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">Stores Created</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-secondary-600 mb-2">$2M+</div>
              <div className="text-gray-600">Commissions Earned</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-accent-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Affiliate Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliate marketers who are already earning with Tiangge. 
            Create your store today and start monetizing your audience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg font-semibold"
            >
              Create Your Store Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/homepage/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-all font-semibold"
            >
              Talk to Sales
            </Link>
          </div>
          
          <p className="text-primary-100 text-sm mt-6">
            No setup fees • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
       `}</style>
     </div>
   );
 }
