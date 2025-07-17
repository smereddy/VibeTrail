import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cities } from '../data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCity, setVibeInput, setIsLoading } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  const quickStartVibes = [
    'La La Land weekend',
    'Jazz and tacos',
    'Family science day',
    'Desert sunset vibes',
    'Vintage cinema night'
  ];

  const handleSubmit = async (vibe: string) => {
    if (!vibe.trim()) return;
    
    setVibeInput(vibe);
    setCurrentCity(selectedCity);
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  const handleQuickStart = (vibe: string) => {
    setInputValue(vibe);
    handleSubmit(vibe);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-purple-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">
              Turn any vibe into a day you can actually do
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Share your mood or list a few likes. We'll create a culturally coherent plan 
            with food, activities, and media that fit your vibe — all in your chosen city.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Describe your vibe or list things you love..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(inputValue)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCity.code}
                  onChange={(e) => setSelectedCity(cities.find(city => city.code === e.target.value) || cities[0])}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {cities.map(city => (
                    <option key={city.code} value={city.code}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => handleSubmit(inputValue)}
              disabled={!inputValue.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              Generate My Day Plan
            </button>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-4">Quick start with these vibes:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {quickStartVibes.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => handleQuickStart(vibe)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Privacy-first:</span> We use taste signals only — no personal data needed.
            <br />
            Powered by <span className="text-purple-600 font-semibold">Qloo Taste AI</span> for cross-category cultural intelligence.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;