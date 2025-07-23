import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'How it works', href: '#how-it-works', icon: null },
    { name: 'Pricing', href: '#pricing', icon: null },
    { name: 'Blog', href: '#blog', icon: null },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isHomePage ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm shadow-soft'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isHomePage ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-600'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className={`text-xl font-bold transition-colors ${
                isHomePage ? 'text-white' : 'text-neutral-900'
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
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-600 ${
                    isHomePage ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-primary-600'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/create-plan"
                className={isHomePage ? 'btn-hero' : 'btn-primary'}
              >
                Create a plan
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isHomePage ? 'text-white hover:bg-white/20' : 'text-neutral-600 hover:bg-neutral-100'
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
            className="md:hidden bg-white border-t border-neutral-200 shadow-large"
          >
            <div className="container-custom py-4">
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 py-2"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-neutral-200">
                  <Link
                    to="/create-plan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    Create a plan
                  </Link>
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
      <footer className="bg-neutral-900 text-white">
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VibeTrail</span>
              </Link>
              <p className="text-neutral-400 max-w-md leading-relaxed">
                Your perfect day, planned in seconds. AI-powered cultural intelligence 
                for personalized city experiences.
              </p>
              <div className="mt-6">
                <p className="text-sm text-neutral-500">
                  © 2024 VibeTrail. All rights reserved.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
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