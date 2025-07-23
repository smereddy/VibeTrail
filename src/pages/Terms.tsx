import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, Users, Shield, Gavel } from 'lucide-react';

const Terms: React.FC = () => {
  const sections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Using VibeTrail",
      content: [
        "You must be at least 13 years old to use our service",
        "Provide accurate information when using our recommendations",
        "Use the service for personal, non-commercial purposes",
        "Don't attempt to reverse engineer or copy our algorithms",
        "Respect other users and our community guidelines"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Your Account",
      content: [
        "You're responsible for keeping your account secure",
        "Don't share your account credentials with others",
        "Notify us immediately of any unauthorized access",
        "You can delete your account at any time",
        "We may suspend accounts that violate these terms"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Our Service",
      content: [
        "We provide AI-powered recommendation services",
        "Recommendations are suggestions, not guarantees",
        "Service availability may vary by location",
        "We continuously improve our algorithms",
        "Some features may require internet connectivity"
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intellectual Property",
      content: [
        "VibeTrail owns all rights to our platform and algorithms",
        "You retain rights to content you provide to us",
        "You grant us permission to use your data for recommendations",
        "Don't use our content without permission",
        "Respect third-party intellectual property rights"
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Limitations",
      content: [
        "Our service is provided 'as is' without warranties",
        "We're not liable for decisions made based on recommendations",
        "Third-party venues and services are beyond our control",
        "Use recommendations as starting points for your own research",
        "We're not responsible for external website content"
      ]
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: "Disputes",
      content: [
        "Most issues can be resolved through customer support",
        "These terms are governed by applicable law",
        "Disputes will be handled through appropriate legal channels",
        "We encourage open communication to resolve conflicts",
        "Changes to terms will be communicated in advance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Terms of
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Service</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              The ground rules for using VibeTrail. We've kept them simple and fair.
            </p>
            <div className="mt-6 text-sm text-neutral-500">
              Last updated: January 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-neutral-100 mb-12"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Welcome to VibeTrail</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-4">
              These terms outline the agreement between you and VibeTrail when you use our service. 
              We've written them in plain English to make them as clear as possible.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              By using VibeTrail, you agree to these terms. If you don't agree with any part, 
              please don't use our service.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-neutral-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 border border-primary-100 mt-12"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Changes to These Terms</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We may update these terms from time to time to reflect changes in our service or legal requirements. 
              When we make significant changes, we'll notify you through the app or via email.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Continued use of VibeTrail after changes means you accept the updated terms.
            </p>
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <div className="font-semibold text-neutral-900 mb-2">Questions about these terms?</div>
              <div className="text-primary-600">legal@vibetrail.com</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Terms; 