import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Clock, Heart, ArrowRight, Star, Users, Zap, Brain, Target, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const quickStartOptions = [
    { text: "cozy coffee shop vibes", icon: "☕", category: "indoor", gradient: "from-amber-400 to-orange-500" },
    { text: "outdoor adventure day", icon: "🏔️", category: "outdoor", gradient: "from-green-400 to-blue-500" },
    { text: "cultural exploration", icon: "🎭", category: "hybrid", gradient: "from-purple-400 to-pink-500" },
    { text: "foodie paradise tour", icon: "🍽️", category: "hybrid", gradient: "from-red-400 to-orange-500" },
    { text: "nightlife and music", icon: "🎵", category: "indoor", gradient: "from-indigo-400 to-purple-500" },
    { text: "family-friendly fun", icon: "👨‍👩‍👧‍👦", category: "hybrid", gradient: "from-blue-400 to-cyan-500" }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Our cultural AI understands your preferences and discovers hidden connections between your tastes.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Contextual Recommendations",
      description: "Get suggestions that match your mood, time, location, and social context perfectly.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Domain Discovery",
      description: "Discover connections between food, music, activities, and culture you never knew existed.",
      gradient: "from-pink-500 to-red-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Cultural Connections", subtext: "AI-discovered relationships" },
    { number: "10+", label: "Cities", subtext: "Growing rapidly" },
    { number: "95%", label: "Satisfaction", subtext: "Users love their plans" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Phoenix City Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Phoenix City Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/phoenix-banner.jpg)',
          }}
        />
        
        {/* Gradient Overlay to enhance text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/60 via-pink-500/50 to-purple-600/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              {/* Logo/Brand */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
                  vibetrail
                </h1>
                <p className="text-xl md:text-2xl text-white/95 font-light tracking-wide drop-shadow-lg">
                  Privacy-first recommendations
                </p>
              </motion.div>

              {/* Category Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 mb-12 inline-flex items-center space-x-8 shadow-2xl"
              >
                <div className="flex items-center space-x-3 px-6 py-3 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl">🍴</span>
                  <span className="text-lg font-medium text-gray-800">Food</span>
                </div>
                <div className="flex items-center space-x-3 px-6 py-3 hover:bg-white/50 rounded-xl transition-colors">
                  <MapPin className="w-6 h-6 text-gray-600" />
                  <span className="text-lg font-medium text-gray-700">Things To Do</span>
                </div>
                <div className="flex items-center space-x-3 px-6 py-3 hover:bg-white/50 rounded-xl transition-colors">
                  <Star className="w-6 h-6 text-gray-600" />
                  <span className="text-lg font-medium text-gray-700">Media</span>
                </div>
                <div className="flex items-center space-x-3 px-6 py-3 hover:bg-white/50 rounded-xl transition-colors">
                  <Sparkles className="w-6 h-6 text-gray-600" />
                  <span className="text-lg font-medium text-gray-700">More</span>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <Link
                  to="/create-plan"
                  className="inline-flex items-center bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Start Your Vibe Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Quick Start Options */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
            >
              {quickStartOptions.map((option, index) => (
                <motion.div
                  key={option.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div>
                      <h3 className="text-white font-medium text-lg group-hover:text-white/90 transition-colors">
                        {option.text}
                      </h3>
                      <p className="text-white/70 text-sm capitalize">{option.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Cultural AI
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our advanced AI doesn't just recommend—it understands the cultural connections 
              between your preferences to create truly personalized experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Try These
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}Popular Vibes
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Not sure where to start? These are some of our most loved experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quickStartOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/create-plan"
                  className="group relative block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${option.gradient} rounded-lg flex items-center justify-center text-white text-xl shadow-sm`}>
                      {option.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {option.text}
                      </span>
                      <div className="text-sm text-gray-500 capitalize">
                        {option.category} experience
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="relative p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to discover your
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}perfect day?
                </span>
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Join thousands who've found their ideal experiences with VibeTrail's 
                AI-powered cultural intelligence.
              </p>
              <Link
                to="/create-plan"
                className="group inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-lg font-bold text-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Sparkles className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                Create Your Perfect Day
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;