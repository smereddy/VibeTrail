import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Target, Globe, Users, Zap, Heart, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Our cultural AI understands your preferences and discovers hidden connections between your tastes across food, activities, and entertainment.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Contextual Recommendations",
      description: "Get suggestions that match your mood, time, location, and social context perfectly for truly personalized experiences.",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Domain Discovery",
      description: "Discover unexpected connections between music, food, activities, and culture that you never knew existed.",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Cultural Connections", subtext: "AI-discovered relationships" },
    { number: "10+", label: "Cities", subtext: "Growing rapidly" },
    { number: "95%", label: "User Satisfaction", subtext: "Love their plans" }
  ];

  const team = [
    {
      name: "AI Cultural Intelligence",
      role: "Powered by Qloo + OpenAI",
      description: "Our AI combines cultural data with natural language understanding to create truly personalized experiences.",
      color: "from-blue-500 to-purple-500"
    },
    {
      name: "Cross-Domain Analysis",
      role: "Cultural Ecosystem Mapping",
      description: "We analyze connections between food, music, activities, and entertainment to build your cultural profile.",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Context-Aware Planning",
      role: "Smart Recommendations",
      description: "Our system considers your mood, time, location, and social context to suggest the perfect experiences.",
      color: "from-pink-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 py-20 lg:py-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
                  About VibeTrail
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                We're revolutionizing how people discover and experience cities through 
                AI-powered cultural intelligence that understands your unique vibe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Every person has a unique cultural fingerprint – a combination of tastes, 
                  preferences, and interests that makes them who they are. Traditional 
                  recommendation systems only scratch the surface.
                </p>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  VibeTrail goes deeper. We use advanced AI to understand the cultural 
                  connections between your preferences across food, music, activities, 
                  and entertainment to create truly personalized city experiences.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Powered by Cultural AI</h3>
                    <p className="text-slate-600">Understanding the why behind your preferences</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-slate-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-slate-900 mb-2">The VibeTrail Difference</h4>
                      <p className="text-slate-600">Traditional vs. Cultural AI</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-600">Traditional: "Popular restaurants"</span>
                        <span className="text-green-600 font-semibold">✓</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-slate-900 font-medium">VibeTrail: "Cozy spots that match your indie music taste"</span>
                        <span className="text-blue-600 font-semibold">🎯</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              How We Do It
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our AI doesn't just recommend—it understands the cultural connections 
              between your preferences to create truly personalized experiences.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Making an Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Helping thousands discover their perfect city experiences every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-slate-200"
              >
                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-slate-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500">
                  {stat.subtext}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our technology stack combines the best of cultural intelligence and natural language processing.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${member.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to discover your vibe?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands who've found their perfect city experiences with VibeTrail's 
              AI-powered cultural intelligence.
            </p>
            <Link
              to="/create-plan"
              className="inline-flex items-center px-10 py-5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-xl"
            >
              <Sparkles className="mr-3 w-6 h-6" />
              Start Your Journey
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;