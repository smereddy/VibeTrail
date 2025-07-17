import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, ExternalLink, Coffee, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Coffee className="h-12 w-12 text-purple-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">vibetrail</h1>
        </div>
        <p className="text-xl text-gray-600">
          Turn any vibe into a day you can actually do
        </p>
      </div>

      {/* Project Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Project</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            vibetrail is a hackathon prototype built for the <strong>Qloo Global Hackathon</strong>. 
            It demonstrates how combining Large Language Models with Qloo's Taste AI can transform 
            simple user vibes into actionable, culturally coherent day plans.
          </p>
          <p>
            The challenge was to create something that neither an LLM nor Qloo's API could accomplish 
            alone - showcasing the power of cross-domain cultural intelligence paired with natural 
            language understanding.
          </p>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 rounded-full p-2">
              <span className="text-purple-600 font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vibe Input</h3>
              <p className="text-gray-600">User enters a mood, vibe, or list of preferences</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 rounded-full p-2">
              <span className="text-purple-600 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">LLM Processing</h3>
              <p className="text-gray-600">AI interprets the vibe and extracts taste signals</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 rounded-full p-2">
              <span className="text-purple-600 font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Qloo Taste AI</h3>
              <p className="text-gray-600">Cross-domain recommendations spanning food, activities, and media</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 rounded-full p-2">
              <span className="text-purple-600 font-semibold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Scheduling</h3>
              <p className="text-gray-600">LLM creates explanations and helps organize into a day plan</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Privacy First</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            vibetrail is designed with privacy as a core principle, aligned with Qloo's 
            privacy-first approach to cultural intelligence:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>No Personal Data:</strong> We only use taste signals and city preferences</li>
            <li><strong>No Accounts:</strong> No registration or login required</li>
            <li><strong>No Tracking:</strong> No cookies, analytics, or user tracking</li>
            <li><strong>Local Processing:</strong> All selections and plans stay in your browser</li>
          </ul>
        </div>
      </motion.div>

      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Current (Prototype)</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• React + TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Framer Motion</li>
              <li>• D3.js (Graph visualization)</li>
              <li>• Mock data simulation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Production (Future)</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Qloo Taste AI API</li>
              <li>• OpenAI GPT-4 / Claude</li>
              <li>• Real-time event data</li>
              <li>• Booking integrations</li>
              <li>• Mobile app</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Demo Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-yellow-50 rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Demo Instructions</h2>
        <div className="space-y-4 text-gray-700">
          <p className="font-medium">For the hackathon demo video (under 3 minutes):</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Start with vibe input (try "La La Land weekend" in Los Angeles)</li>
            <li>Show cross-domain recommendations across food, activities, and media</li>
            <li>Demonstrate the taste relationship graph</li>
            <li>Build a day plan using drag-and-drop or AI auto-arrange</li>
            <li>Export to calendar to show functional output</li>
          </ol>
          <p className="text-sm text-gray-600">
            Remember: Devpost encourages concise, story-driven videos that clearly demonstrate 
            the problem, solution, and technical innovation.
          </p>
        </div>
      </motion.div>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Links & Resources</h2>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Github size={16} />
            <span>Public GitHub Repository</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Users size={16} />
            <span>Qloo Global Hackathon</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ExternalLink size={16} />
            <span>Devpost Submission</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>Built with ❤️ for the Qloo Global Hackathon</p>
        <p>Showcasing the power of LLM + Qloo Taste AI synergy</p>
      </div>
    </div>
  );
};

export default About;