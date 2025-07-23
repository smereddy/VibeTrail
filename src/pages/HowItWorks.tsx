import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Zap, Calendar, Download, ArrowRight, Brain, Target, Users, MessageSquare, Lightbulb, MapPin, Star, Heart, Clock, Camera, Music, Film, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Tell us your vibe",
      description: "Describe what you're in the mood for - whether it's 'cozy coffee shop vibes', 'adventure with friends', or 'cultural exploration'.",
      color: "from-blue-500 to-purple-500",
      visualization: (
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 flex flex-col justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">Your vibe input:</span>
            </div>
            <div className="text-base text-gray-700 font-medium leading-relaxed">
              "cozy coffee shops and indie bookstores with a creative atmosphere..."
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      )
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "AI finds your matches",
      description: "Our cultural intelligence engine analyzes your preferences and discovers personalized recommendations across food, activities, and entertainment.",
      color: "from-purple-500 to-pink-500",
      visualization: (
        <div className="w-full h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
          <div className="grid grid-cols-3 gap-6 h-full items-center">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                <Camera className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Places</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                <Music className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Music</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                <Film className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Movies</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                <Book className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Books</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart recommendations",
      description: "Get curated suggestions that match your taste profile, with cultural connections and cross-domain insights you never knew existed.",
      color: "from-pink-500 to-orange-500",
      visualization: (
        <div className="w-full h-64 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-8">
          <div className="space-y-4">
            {[
              { name: "Blue Bottle Coffee", rating: 4.5, category: "Cafe", match: 95 },
              { name: "The Strand Bookstore", rating: 4.8, category: "Books", match: 92 },
              { name: "Washington Square Park", rating: 4.3, category: "Activity", match: 88 }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">{item.match}%</span>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Build your perfect day",
      description: "Select your favorites or use 'Surprise Me' for instant curation. Our AI organizes everything into a perfectly timed itinerary.",
      color: "from-orange-500 to-red-500",
      visualization: (
        <div className="w-full h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8">
          <div className="space-y-3">
            {[
              { time: "9:00 AM", activity: "Blue Bottle Coffee", type: "Morning Coffee", selected: true },
              { time: "11:00 AM", activity: "The Strand Bookstore", type: "Browse & Explore", selected: true },
              { time: "1:00 PM", activity: "Washington Square Park", type: "Outdoor Time", selected: false },
              { time: "3:00 PM", activity: "Local Art Gallery", type: "Cultural Experience", selected: true }
            ].map((slot, index) => (
              <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                slot.selected 
                  ? 'bg-white shadow-lg border border-gray-100' 
                  : 'bg-white/50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-bold text-gray-800 min-w-[70px]">{slot.time}</span>
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900">{slot.activity}</div>
                  <div className="text-sm text-gray-500">{slot.type}</div>
                </div>
                {slot.selected && <Heart className="w-5 h-5 text-red-500 fill-current" />}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export and enjoy",
      description: "Download your plan, share with friends, or sync to your calendar. Your perfect day is ready to experience.",
      color: "from-red-500 to-pink-500",
      visualization: (
        <div className="w-full h-64 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 flex flex-col justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Your Perfect Day in NYC</h4>
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-sm text-gray-600 mb-6">4 stops • 6 hours • Cultural exploration</div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                Download PDF
              </button>
              <button className="bg-gray-100 text-gray-700 text-sm py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Share Link
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How VibeTrail
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Works</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              From vibe to perfect day in 5 simple steps. Our AI-powered cultural intelligence creates personalized experiences just for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
              >
                {/* Content */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                      Step {index + 1}
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 leading-tight">{step.title}</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Enhanced Visual */}
                <div className="flex-1 max-w-2xl">
                  <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
                    {step.visualization}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why VibeTrail?</h2>
            <p className="text-xl text-gray-600">Powered by advanced cultural intelligence and machine learning</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to discover your perfect day?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands who've found their ideal experiences with VibeTrail</p>
          <Link
            to="/create-plan"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks; 