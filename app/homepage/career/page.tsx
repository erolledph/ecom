import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock, Users, Heart, Zap, Globe, Code, Palette } from 'lucide-react';

export default function CareerPage() {
  const jobOpenings = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our engineering team to build scalable affiliate marketing solutions using Next.js, React, and Firebase.',
      requirements: ['5+ years experience with React/Next.js', 'Experience with Firebase/Firestore', 'Strong TypeScript skills']
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design intuitive user experiences for our affiliate store builder platform and help shape the future of e-commerce.',
      requirements: ['3+ years UI/UX design experience', 'Proficiency in Figma/Sketch', 'E-commerce design experience']
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead our marketing efforts to grow the Tiangge platform and help affiliate marketers discover our tools.',
      requirements: ['Digital marketing experience', 'Content creation skills', 'Analytics and growth hacking experience']
    },
    {
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our users succeed with their affiliate stores by providing exceptional support and guidance.',
      requirements: ['Customer service experience', 'Technical aptitude', 'Excellent communication skills']
    }
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Remote First',
      description: 'Work from anywhere in the world with flexible hours and async communication.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness stipends.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Growth Opportunities',
      description: 'Learn new skills, attend conferences, and grow your career with our learning budget.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Amazing Team',
      description: 'Work with passionate, talented people who care about building great products.'
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
                <Briefcase className="w-10 h-10 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Join the Tiangge Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Help us build the future of affiliate marketing. We're looking for passionate, 
              talented individuals to join our growing team and make a real impact.
            </p>
          </div>
        </div>

        {/* Company Values */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Work at Tiangge?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
                    <div className="text-primary-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Key Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <Link
                  href="/homepage/contact"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 lg:p-12 border border-primary-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Hiring Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Application</h3>
                <p className="text-gray-600 text-sm">Submit your application through our contact form</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Screening</h3>
                <p className="text-gray-600 text-sm">Initial review and phone/video screening call</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interview</h3>
                <p className="text-gray-600 text-sm">Technical and cultural fit interviews with the team</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Offer</h3>
                <p className="text-gray-600 text-sm">Reference check and job offer with onboarding</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. 
              Send us your resume and let us know how you'd like to contribute.
            </p>
            
            <Link
              href="/homepage/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}