import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Zap, Calendar, Download, ArrowRight, Brain, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Tell us your vibe",
      description: "Describe what you're in the mood for - whether it's 'cozy coffee shop vibes', 'adventure with friends', or 'cultural exploration'.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "AI finds your matches",
      description: "Our cultural intelligence engine analyzes your preferences and discovers personalized recommendations across food, activities, and entertainment.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart recommendations",
      description: "Get curated suggestions that match your taste profile, with cultural connections and cross-domain insights you never knew existed.",
      color: "from-pink-500 to-orange-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Build your perfect day",
      description: "Select your favorites or use 'Surprise Me' for instant curation. Our AI organizes everything into a perfectly timed itinerary.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export and enjoy",
      description: "Download your plan, share with friends, or sync to your calendar. Your perfect day is ready to experience.",
      color: "from-red-500 to-pink-500"
    }
  ];

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Cultural Intelligence",
      description: "Discover connections between your favorite music, food, movies, and activities you never knew existed."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Curation",
      description: "Get personalized recommendations in seconds, not hours of research."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Context Aware",
      description: "Whether you're solo, with friends, or on a date - we understand the vibe you're going for."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              How VibeTrail
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              From vibe to perfect day in 5 simple steps. Our AI-powered cultural intelligence creates personalized experiences just for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="text-sm font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                      Step {index + 1}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-lg text-neutral-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-neutral-100">
                    <div className={`w-full h-48 bg-gradient-to-br ${step.color} rounded-xl opacity-10`}></div>
                    <div className="mt-6 space-y-3">
                      <div className="h-4 bg-neutral-100 rounded-full"></div>
                      <div className="h-4 bg-neutral-100 rounded-full w-3/4"></div>
                      <div className="h-4 bg-neutral-100 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why VibeTrail?</h2>
            <p className="text-lg text-neutral-600">Powered by advanced cultural intelligence and machine learning</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-neutral-50 border border-neutral-100"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Ready to discover your perfect day?</h2>
          <p className="text-lg text-neutral-600 mb-8">Join thousands who've found their ideal experiences with VibeTrail</p>
          <Link
            to="/create-plan"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks; 