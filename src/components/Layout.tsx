import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Coffee } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </Link>
              )}
              <Link to="/" className="flex items-center space-x-2">
                <Coffee className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">TasteTrails</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by</span>
              <span className="text-sm font-semibold text-purple-600">Qloo Taste AI</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-purple-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Hackathon Prototype • Privacy-First Cultural Intelligence</p>
            <p className="mt-2">
              <Link to="/about" className="text-purple-600 hover:text-purple-800">About & Privacy</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;