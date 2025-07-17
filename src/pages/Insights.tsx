import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { creatorInsights } from '../data/mockData';
import { TrendingUp, Target, Palette, Lightbulb, Copy } from 'lucide-react';

const Insights: React.FC = () => {
  const { currentCity, vibeInput } = useApp();
  const insights = creatorInsights[currentCity.code];

  const InsightCard: React.FC<{ 
    icon: React.ComponentType<any>, 
    title: string, 
    items: string[], 
    color: string 
  }> = ({ icon: Icon, title, items, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Icon size={20} className={`text-${color}-600`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className={`w-2 h-2 bg-${color}-500 rounded-full mt-2 flex-shrink-0`} />
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Insights</h1>
        <p className="text-gray-600">
          Cultural intelligence for content creators and marketers based on "{vibeInput}" in {currentCity.name}
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Taste Profile Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{currentCity.recommendations.length}</div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{currentCity.seeds.length}</div>
            <div className="text-sm text-gray-600">Taste Seeds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{currentCity.relationships.length}</div>
            <div className="text-sm text-gray-600">Cross-Domain Links</div>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard
          icon={TrendingUp}
          title="Top Cuisines"
          items={insights.topCuisines}
          color="blue"
        />
        <InsightCard
          icon={Target}
          title="Music Genres"
          items={insights.topGenres}
          color="green"
        />
        <InsightCard
          icon={Palette}
          title="Style Adjectives"
          items={insights.styleAdjectives}
          color="purple"
        />
        <InsightCard
          icon={Lightbulb}
          title="Partnership Ideas"
          items={insights.partnershipIdeas}
          color="orange"
        />
      </div>

      {/* Copy Hooks */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Copy size={20} className="text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Copy Hooks</h3>
        </div>
        <div className="space-y-3">
          {insights.copyHooks.map((hook, index) => (
            <div key={index} className="bg-pink-50 rounded-lg p-4">
              <p className="text-gray-800 italic">"{hook}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-4">Marketing Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-purple-900 mb-2">Campaign Personalization</h3>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• Audience segmentation by taste profile</li>
              <li>• Cross-category product recommendations</li>
              <li>• Content curation strategies</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-purple-900 mb-2">Experience Planning</h3>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• Event programming optimization</li>
              <li>• Venue partnership strategies</li>
              <li>• Seasonal content planning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Powered By */}
      <div className="text-center text-sm text-gray-500">
        <p>Insights powered by <span className="text-purple-600 font-semibold">Qloo Taste AI</span></p>
        <p>Cross-domain cultural intelligence for creators and marketers</p>
      </div>
    </div>
  );
};

export default Insights;