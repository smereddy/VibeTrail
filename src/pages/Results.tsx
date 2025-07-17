import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TasteItem } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import TasteStrengthBar from '../components/TasteStrengthBar';
import TasteGraph from '../components/TasteGraph';
import { Check, Plus, Eye, BarChart3, Music, Utensils, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Results: React.FC = () => {
  const { currentCity, selectedItems, setSelectedItems, vibeInput, isLoading, setIsLoading } = useApp();
  const [activeTab, setActiveTab] = useState<'food' | 'activity' | 'media' | 'graph'>('food');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
        setMounted(true);
      }, 2000);
    } else {
      setMounted(true);
    }
  }, [isLoading, setIsLoading]);

  const toggleItemSelection = (item: TasteItem) => {
    setSelectedItems(
      selectedItems.some(selected => selected.id === item.id)
        ? selectedItems.filter(selected => selected.id !== item.id)
        : [...selectedItems, item]
    );
  };

  const getItemsByCategory = (category: 'food' | 'activity' | 'media') => {
    return currentCity.recommendations
      .filter(item => item.category === category)
      .sort((a, b) => b.tasteStrength - a.tasteStrength);
  };

  const isItemSelected = (item: TasteItem) => selectedItems.some(selected => selected.id === item.id);

  const getSelectedCount = () => {
    const categories = new Set(selectedItems.map(item => item.category));
    return { total: selectedItems.length, categories: categories.size };
  };

  const canBuildPlan = () => {
    const counts = getSelectedCount();
    return counts.total >= 3 && counts.categories >= 2;
  };

  const ItemCard: React.FC<{ item: TasteItem }> = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 ${
        isItemSelected(item) ? 'border-purple-500 bg-purple-50' : 'border-transparent'
      }`}
      onClick={() => toggleItemSelection(item)}
    >
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          {isItemSelected(item) ? (
            <div className="bg-purple-500 text-white rounded-full p-1">
              <Check size={16} />
            </div>
          ) : (
            <div className="bg-white text-gray-600 rounded-full p-1 opacity-80">
              <Plus size={16} />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.location}</p>
        <p className="text-sm text-gray-700 mb-3">{item.description}</p>
        <div className="bg-purple-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-purple-700 italic">"{item.whyItFits}"</p>
        </div>
        <TasteStrengthBar strength={item.tasteStrength} />
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'food', label: 'Food', icon: Utensils, count: getItemsByCategory('food').length },
    { id: 'activity', label: 'Things To Do', icon: MapPin, count: getItemsByCategory('activity').length },
    { id: 'media', label: 'Media', icon: Music, count: getItemsByCategory('media').length },
    { id: 'graph', label: 'Taste Graph', icon: BarChart3, count: 0 }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your taste profile...</h1>
          <p className="text-gray-600">Finding culturally coherent recommendations for "{vibeInput}" in {currentCity.name}</p>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your {currentCity.name} Taste Profile</h1>
        <p className="text-gray-600 mb-4">Based on "{vibeInput}"</p>
        
        {/* Interpreted Seeds */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {currentCity.seeds.map(seed => (
            <span 
              key={seed.id}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
            >
              {seed.text} • {Math.round(seed.confidence * 100)}%
            </span>
          ))}
        </div>
      </div>

      {/* Selection Status */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Selected: <span className="font-semibold">{getSelectedCount().total}</span> items 
            across <span className="font-semibold">{getSelectedCount().categories}</span> categories
          </div>
          {canBuildPlan() && (
            <span className="text-sm text-green-600 font-medium">✓ Ready to build plan!</span>
          )}
        </div>
        <Link
          to="/plan"
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            canBuildPlan() 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={canBuildPlan() ? undefined : (e) => e.preventDefault()}
        >
          Build Day Plan
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'graph' ? (
          <TasteGraph />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getItemsByCategory(activeTab).map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;