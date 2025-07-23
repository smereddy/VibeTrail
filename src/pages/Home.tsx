import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Clock, Heart, ArrowRight, Star, Users, Zap } from 'lucide-react';

const Home: React.FC = () => {



  const quickStartOptions = [
    { text: "cozy coffee shop vibes", icon: "☕", category: "indoor" },
    { text: "outdoor adventure day", icon: "🏔️", category: "outdoor" },
    { text: "cultural exploration", icon: "🎭", category: "hybrid" },
    { text: "foodie paradise tour", icon: "🍽️", category: "hybrid" },
    { text: "nightlife and music", icon: "🎵", category: "indoor" },
    { text: "family-friendly fun", icon: "👨‍👩‍👧‍👦", category: "hybrid" }
  ];

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Choose your city",
      description: "Select the city you're exploring or planning to visit."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Share your vibe",
      description: "Tell us your interests or desired vibe for the day."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Get your plan",
      description: "Receive a personalized one-day plan with activities and locations."
    }
  ];

  const stats = [
    { number: "10+", label: "Cities" },
    { number: "1000+", label: "Recommendations" },
    { number: "AI-Powered", label: "Personalization" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="City skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        <div className="relative z-10 container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
                Your perfect day, planned in seconds
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto text-shadow-sm">
                Tell us your vibe or a few things you like, and we'll craft a one-day plan you'll love, in any city.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/create-plan"
                className="btn-hero"
              >
                Create a plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/80 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">How it works</h2>
            <p className="body-lg max-w-2xl mx-auto">
              VibeTrail makes planning your day effortless and fun.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="heading-sm mb-3">{feature.title}</h3>
                <p className="body-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Quick Start Ideas</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Not sure what you're in the mood for? Try one of these popular vibes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            {quickStartOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/create-plan"
                  className="card-hover p-6 text-left group block"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium text-neutral-800 group-hover:text-primary-600 transition-colors">
                      {option.text}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to explore? Start planning your perfect day now.
          </h2>
          <Link
            to="/create-plan"
            className="btn-secondary mt-6"
          >
            Create a plan
          </Link>
        </div>
      </section>


    </div>
  );
};

export default Home;