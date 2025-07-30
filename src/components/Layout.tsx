import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'How it works', href: '/how-it-works', icon: null },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isHomePage ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isHomePage ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className={`text-xl font-bold transition-colors ${
                isHomePage ? 'text-white' : 'text-gray-900'
              }`}>
                VibeTrail
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                    isHomePage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Qloo Badge */}
            <div className="hidden md:flex items-center space-x-4">
              <div className={`inline-flex items-center rounded-full px-4 py-2 transition-all duration-200 ${
                isHomePage 
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white' 
                  : 'bg-gray-100 border border-gray-200 text-gray-800'
              }`}>
                <span className="text-sm font-medium mr-2">Powered by</span>
                <span className="text-lg font-bold">Qloo</span>
                <span className="text-xs ml-1 opacity-80">Taste AI</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isHomePage ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 py-2"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg">
                    <span className="text-sm font-medium mr-2">Powered by</span>
                    <span className="text-lg font-bold">Qloo</span>
                    <span className="text-xs ml-1 opacity-80">Taste AI</span>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className={isHomePage ? '' : 'pt-16 md:pt-20'}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VibeTrail</span>
              </Link>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Your perfect day, planned in seconds. AI-powered cultural intelligence 
                for personalized city experiences.
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  © 2025 VibeTrail. All rights reserved.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;