import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Globe } from 'lucide-react';

const Privacy: React.FC = () => {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "What We Collect",
      content: [
        "Vibe descriptions and preferences you share with us",
        "City and location preferences for recommendations",
        "Usage patterns to improve our AI recommendations",
        "Basic analytics to understand how you use VibeTrail",
        "Optional account information if you choose to create an account"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Your Data",
      content: [
        "Generate personalized recommendations using AI",
        "Improve our cultural intelligence algorithms",
        "Provide customer support when needed",
        "Send important updates about our service",
        "Analyze usage patterns to enhance user experience"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "How We Protect Your Data",
      content: [
        "All data is encrypted in transit and at rest",
        "We use industry-standard security practices",
        "Limited access to data on a need-to-know basis",
        "Regular security audits and updates",
        "No sale of personal data to third parties"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Data Sharing",
      content: [
        "We do not sell your personal information",
        "Anonymous, aggregated data may be used for research",
        "Third-party services (like OpenAI) process data for recommendations",
        "Legal compliance when required by law",
        "Service providers who help us operate VibeTrail"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "Access the data we have about you",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Opt out of non-essential communications",
        "Export your data in a portable format"
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cookies & Tracking",
      content: [
        "Essential cookies for basic functionality",
        "Analytics cookies to understand usage (optional)",
        "No advertising or tracking cookies",
        "You can control cookie preferences in your browser",
        "Clear data retention policies"
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Privacy
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Policy</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Your privacy matters to us. Here's how we collect, use, and protect your information.
            </p>
            <div className="mt-6 text-sm text-neutral-500">
              Last updated: January 2024
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
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Commitment to You</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-4">
              At VibeTrail, we believe great recommendations shouldn't come at the cost of your privacy. 
              We're committed to being transparent about what data we collect, how we use it, and giving 
              you control over your information.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              This policy explains our practices in plain English. If you have questions, 
              please don't hesitate to contact us.
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

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 border border-primary-100 mt-12"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Questions About Your Privacy?</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              We're here to help. If you have any questions about this privacy policy or how we handle your data, 
              please reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <div className="font-semibold text-neutral-900">Email Us</div>
                <div className="text-primary-600">privacy@vibetrail.com</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <div className="font-semibold text-neutral-900">Data Protection Officer</div>
                <div className="text-primary-600">dpo@vibetrail.com</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy; 