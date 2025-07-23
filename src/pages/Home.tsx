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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="container-custom section-padding">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                Your perfect day,
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}planned in seconds
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
                AI-powered cultural intelligence that understands your vibe and creates 
                personalized experiences across food, activities, and entertainment.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  to="/create-plan"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-semibold text-white text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/how-it-works"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-semibold text-white text-lg hover:bg-white/20 transition-all duration-300"
                >
                  See How It Works
                </Link>
              </div>
            </motion.div>

            {/* Stats with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
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
      <section className="relative z-10 py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powered by
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {" "}Cultural AI
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
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
                className="group relative p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="relative z-10 py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Try These
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Popular Vibes
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
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
                  className="group relative block p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${option.gradient} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                      {option.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                        {option.text}
                      </span>
                      <div className="text-sm text-white/60 capitalize">
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
      <section className="relative z-10 py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="relative p-12 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to discover your
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}perfect day?
                </span>
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Join thousands who've found their ideal experiences with VibeTrail's 
                AI-powered cultural intelligence.
              </p>
              <Link
                to="/create-plan"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl font-bold text-white text-xl hover:from-pink-400 hover:to-purple-400 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 hover:scale-105"
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