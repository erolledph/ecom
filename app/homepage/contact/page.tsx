import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageSquare, Send, Users, Headphones, Building2 } from 'lucide-react';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'Get help with technical issues, account questions, or general support.',
      contact: 'support@tiangge.shop',
      action: 'Send Email'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Sales Inquiries',
      description: 'Interested in enterprise plans or custom solutions? Let\'s talk business.',
      contact: 'sales@tiangge.shop',
      action: 'Contact Sales'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Partnerships',
      description: 'Explore partnership opportunities and business collaborations with our team.',
      contact: 'partnerships@tiangge.shop',
      action: 'Discuss Partnership'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with Tiangge?',
      answer: 'Simply sign up for a free account, customize your store, and start adding affiliate products. No credit card required for the free plan.'
    },
    {
      question: 'What\'s the difference between free and premium plans?',
      answer: 'Free plans include up to 30 products and basic features. Premium plans offer unlimited products, advanced analytics, bulk import, and data export capabilities.'
    },
    {
      question: 'Can I use my own domain name?',
      answer: 'Currently, all stores use tiangge.shop subdomains. Custom domains are available for enterprise customers. Contact sales for more information.'
    },
    {
      question: 'How do affiliate commissions work?',
      answer: 'Tiangge doesn\'t handle affiliate commissions directly. You earn commissions through the affiliate programs you join (Amazon, ClickBank, etc.) when visitors click your affiliate links.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for any plan. Free accounts remain free forever, and premium plans are billed monthly with no hidden costs.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/homepage"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
                <MessageSquare className="w-10 h-10 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about Tiangge? Need help with your affiliate store? 
              Our team is here to help you succeed.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Can We Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                <div className="mb-4">
                  <a 
                    href={`mailto:${method.contact}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {method.contact}
                  </a>
                </div>
                <a
                  href={`mailto:${method.contact}`}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {method.action}
                  <Send className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Send Us a Message</h2>
              <p className="text-gray-600 text-center mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="career">Career Application</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Office Hours */}
        <section>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
            <div className="text-center">
              <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600">24/7 - We respond within 24 hours</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600">Monday - Friday, 9 AM - 6 PM PST</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}