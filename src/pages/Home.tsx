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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Your perfect day,
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}planned in seconds
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12">
                AI-powered cultural intelligence that understands your vibe and creates 
                personalized experiences across food, activities, and entertainment.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  to="/create-plan"
                  className="group relative px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/how-it-works"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg font-semibold text-white text-lg hover:bg-white/20 transition-all duration-300"
                >
                  See How It Works
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/15 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-white/90 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm text-white/70">
                      {stat.subtext}
                    </div>
                  </div>
                </div>
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