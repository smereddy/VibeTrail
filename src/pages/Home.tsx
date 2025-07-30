import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, Target, Globe, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const quickStartOptions = [
    { text: "cozy coffee shop vibes", icon: "☕", category: "indoor" },
    { text: "outdoor adventure day", icon: "🏔️", category: "outdoor" },
    { text: "cultural exploration", icon: "🎭", category: "culture" },
    { text: "foodie paradise tour", icon: "🍽️", category: "dining" },
    { text: "nightlife and music", icon: "🎵", category: "nightlife" },
    { text: "family-friendly fun", icon: "👨‍👩‍👧‍👦", category: "family" }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Our cultural AI understands your preferences and discovers hidden connections between your tastes."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Contextual Recommendations",
      description: "Get suggestions that match your mood, time, location, and social context perfectly."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Domain Discovery",
      description: "Discover connections between food, music, activities, and culture you never knew existed."
    }
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
                className="mb-12"
              >
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                  vibetrail
                </h1>
                <p className="text-2xl md:text-3xl text-white/95 font-light tracking-wide drop-shadow-lg mb-8">
                  AI-powered cultural recommendations
                </p>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                  Transform your vibes into personalized experiences. Discover food, activities, and culture that perfectly match your mood.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-16"
              >
                <Link
                  to="/create-plan"
                  className="inline-flex items-center bg-white text-orange-500 px-10 py-5 rounded-full text-xl font-bold hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Start Your Vibe Journey
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Quick Start Options */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mb-8"
            >
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-center text-white/90 text-lg font-medium mb-8"
              >
                Popular vibes to get you started
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickStartOptions.map((option, index) => (
                  <motion.div
                    key={option.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  >
                    <Link
                      to="/create-plan"
                      className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{option.icon}</div>
                        <div>
                          <h4 className="text-white font-medium text-lg group-hover:text-white/90 transition-colors">
                            {option.text}
                          </h4>
                          <p className="text-white/70 text-sm capitalize">{option.category}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-pink-50">
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
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
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
                className="group relative p-8 bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
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

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="relative p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to discover your
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {" "}perfect day?
                </span>
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Join thousands who've found their ideal experiences with VibeTrail's 
                AI-powered cultural intelligence.
              </p>
              <Link
                to="/create-plan"
                className="group inline-flex items-center px-10 py-5 bg-white text-orange-500 rounded-full font-bold text-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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