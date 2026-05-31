import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { 
  Shield, 
  FileText, 
  Database, 
  Settings, 
  Globe, 
  UserCheck, 
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronUp
} from 'lucide-react';

const navigationSections = [
  { id: 'introduction', label: 'Introduction', icon: FileText },
  { id: 'data-collection', label: 'Data Collection', icon: Database },
  { id: 'use-of-data', label: 'Use of Data', icon: Settings },
  { id: 'cookies', label: 'Cookies', icon: Globe },
  { id: 'third-party', label: 'Third-party Services', icon: Shield },
  { id: 'your-rights', label: 'Your Rights', icon: UserCheck },
  { id: 'contact', label: 'Contact Us', icon: Mail }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      const sections = navigationSections.map(section => section.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F8FA' }}>
      {/* Hero Section */}
      <div className="relative" style={{ backgroundColor: '#071773' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl text-white mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We're committed to protecting your privacy and ensuring transparency about how we collect, 
              use, and safeguard your personal information on our educational platform.
            </p>
            <p className="text-blue-200 mt-4">Last updated: August 1, 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:gap-12">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-8">
              <Card className="p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">Quick Navigation</h3>
                <nav className="space-y-2">
                  {navigationSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                          activeSection === section.id
                            ? 'text-white'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        style={activeSection === section.id ? { backgroundColor: '#ED8B00' } : {}}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden mb-8">
            <Card className="p-4 bg-white border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {navigationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Introduction</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Welcome to EduPlatform. This Privacy Policy explains how we collect, use, disclose, 
                    and safeguard your information when you visit our educational platform and use our services.
                  </p>
                  <p>
                    By accessing or using our platform, you agree to the collection and use of information 
                    in accordance with this policy. We are committed to protecting your privacy and ensuring 
                    your personal information is handled responsibly.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Data Collection */}
              <section id="data-collection" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Data Collection</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>We collect information you provide directly to us, such as when you:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create an account or profile</li>
                    <li>Enroll in courses or educational programs</li>
                    <li>Submit assignments or participate in discussions</li>
                    <li>Contact us for support or inquiries</li>
                    <li>Subscribe to our newsletters or updates</li>
                  </ul>
                  <p>
                    The types of information we may collect include your name, email address, 
                    educational background, course progress, and any other information you choose to provide.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Use of Data */}
              <section id="use-of-data" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Use of Data</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our educational services</li>
                    <li>Process enrollments and track course progress</li>
                    <li>Send you important updates about your courses and account</li>
                    <li>Respond to your comments, questions, and support requests</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Comply with legal obligations and protect our rights</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Cookies and Tracking</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience on our platform. 
                    Cookies help us remember your preferences and provide personalized content.
                  </p>
                  <p>Types of cookies we use:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                    <li><strong>Performance Cookies:</strong> Help us understand how you use our platform</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant educational content</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Third-party Services */}
              <section id="third-party" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Third-party Services</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may use third-party services to enhance our educational platform. These services 
                    have their own privacy policies and may collect information about you.
                  </p>
                  <p>Third-party services we use include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analytics services to understand platform usage</li>
                    <li>Payment processors for course enrollments</li>
                    <li>Email services for communications</li>
                    <li>Cloud storage providers for content delivery</li>
                    <li>Video hosting platforms for educational content</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Your Rights */}
              <section id="your-rights" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <UserCheck className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Your Rights</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>You have several rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Ask us to correct any inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                    <li><strong>Restriction:</strong> Ask us to limit how we use your information</li>
                    <li><strong>Objection:</strong> Object to certain uses of your personal information</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information provided 
                    in the Contact Us section below.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Contact */}
              <section id="contact" className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6" style={{ color: '#ED8B00' }} />
                  <h2 className="text-gray-900">Contact Us</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about this Privacy Policy or our privacy practices, 
                    please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <p><strong>Email:</strong> privacy@eduplatform.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
                    <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                  </div>
                  <p>
                    We will respond to your inquiry within 30 days of receiving your request.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-gray-900 mb-4">EduPlatform</h3>
              <p className="text-gray-600 mb-4">
                Empowering learners worldwide with quality education and innovative learning experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 EduPlatform. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-2 sm:mt-0">
              Made with ❤️ for educators and learners
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg z-50 p-0"
          style={{ backgroundColor: '#ED8B00' }}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}