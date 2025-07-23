import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CityData } from '../types';
import { cities } from '../data/mockData';
import { MapPin, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const { processVibeInput, setVibeInput, setCurrentCity, isLoading, setSelectedItems } = useApp();
  
  const [selectedCity, setSelectedCity] = useState<CityData>(cities[0]);
  const [inputValue, setInputValue] = useState('');

  // Clear selected items when component mounts (user navigated to create new plan)
  React.useEffect(() => {
    setSelectedItems([]);
  }, [setSelectedItems]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    try {
      setVibeInput(inputValue);
      setCurrentCity(selectedCity);
      
      await processVibeInput(inputValue, selectedCity.name);
      navigate('/results');
      
    } catch (error) {
      console.error('Error processing vibe:', error);
    }
  };

  const quickStartOptions = [
    { text: "cozy coffee shop vibes", icon: "☕" },
    { text: "outdoor adventure day", icon: "🏔️" },
    { text: "cultural exploration", icon: "🎭" },
    { text: "foodie paradise tour", icon: "🍽️" },
    { text: "nightlife and music", icon: "🎵" },
    { text: "family-friendly fun", icon: "👨‍👩‍👧‍👦" }
  ];

  const handleQuickStart = (vibe: string) => {
    setInputValue(vibe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-neutral-200/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">Create Your Plan</h1>
              </div>
            </div>
            <div className="w-16"></div> {/* Balance spacer */}
          </div>
        </div>
      </div>

             <div className="container-custom py-4 sm:py-8">
         <div className="max-w-5xl mx-auto">
          {/* Quick Start - More Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Quick Start Ideas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {quickStartOptions.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleQuickStart(option.text)}
                  className="card p-4 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200 text-center group"
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors leading-tight">
                    {option.text}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Form - Side by Side Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vibe Input - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-lg font-semibold text-neutral-800">Describe your perfect day</h3>
                </div>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tell us what you're in the mood for... (e.g., 'cozy coffee shops and indie bookstores', 'outdoor adventure with great food')"
                  className="w-full h-24 p-4 border-2 border-neutral-200 rounded-xl resize-none focus:border-primary-500 focus:outline-none transition-colors text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey && inputValue.trim()) {
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-neutral-500">
                    Press ⌘ + Enter to create plan
                  </p>
                  <Link 
                    to="/qloo-explorer" 
                    className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    🔍 Explore available data
                  </Link>
                </div>
              </div>

              {/* City Selection - Takes 1 column */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Choose your city</h3>
                <div className="relative mb-4">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <select
                    value={selectedCity.name}
                    onChange={(e) => {
                      const city = cities.find(c => c.name === e.target.value);
                      if (city) setSelectedCity(city);
                    }}
                    className="w-full pl-10 pr-8 py-3 border-2 border-neutral-200 rounded-xl bg-white focus:border-primary-500 focus:outline-none transition-colors appearance-none text-neutral-800 font-medium text-sm"
                  >
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Action Button - Moved to city column */}
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Plan
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Optional: Add a subtle footer with tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-neutral-500">
              💡 Tip: Be specific about your interests for better recommendations
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlan; 