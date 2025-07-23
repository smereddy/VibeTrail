import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { TasteItem, DynamicTabConfig } from '../types';
import { ArrowLeft, MapPin, Star, Clock, ArrowRight, Heart, Share, Bookmark, Utensils, Camera, Music, Book, Headphones, Tv, Film, Target, Zap, Lightbulb, Shuffle } from 'lucide-react';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentCity, 
    selectedItems, 
    setSelectedItems, 
    vibeInput, 
    isLoading, 
    extractedSeeds,
    activeTabs,
    vibeContext,
    getRecommendationsByTab
  } = useApp();
  const { currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isSuprising, setIsSuprising] = useState(false);
  const [surpriseMessage, setSurpriseMessage] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    
    // Redirect if no vibe input
    if (!vibeInput && !isLoading) {
      navigate('/create-plan');
    }
  }, [vibeInput, isLoading, navigate]);

  // Set initial active tab when dynamic tabs are loaded
  useEffect(() => {
    if (activeTabs.length > 0 && !activeTab) {
      const firstActiveTab = activeTabs.find(tab => tab.isActive) || activeTabs[0];
      setActiveTab(firstActiveTab.displayName);
    }
  }, [activeTabs, activeTab]);

  const toggleItemSelection = (item: TasteItem) => {
    setSelectedItems(
      selectedItems.some(selected => selected.id === item.id)
        ? selectedItems.filter(selected => selected.id !== item.id)
        : [...selectedItems, item]
    );
  };

  const getSelectedCount = () => {
    const total = selectedItems.length;
    const categories = new Set(selectedItems.map(item => item.category)).size;
    return { total, categories };
  };

  const canBuildPlan = () => getSelectedCount().total >= 3;

  // Surprise Me functionality - intelligently selects items across categories
  const surpriseMe = () => {
    const recommendations = currentCity.recommendations || [];
    if (recommendations.length === 0) return;

    setIsSuprising(true);
    
    // Clear current selections first
    setSelectedItems([]);

    // Smart selection algorithm
    const selectedItems: TasteItem[] = [];
    const categoriesUsed = new Set<string>();
    
    // Get items from each active tab to ensure diversity
    const availableTabs = tabs.filter(tab => tab.items.length > 0);
    
    // Target: 5-8 items with good category diversity
    const targetCount = Math.min(8, Math.max(5, Math.floor(recommendations.length / 10)));
    
    // First, pick one high-quality item from each available category
    availableTabs.forEach(tab => {
      if (selectedItems.length < targetCount) {
        // Sort by taste strength and pick the best one
        const sortedItems = tab.items
          .filter(item => !selectedItems.some(selected => selected.id === item.id))
          .sort((a, b) => b.tasteStrength - a.tasteStrength);
        
        if (sortedItems.length > 0) {
          selectedItems.push(sortedItems[0]);
          categoriesUsed.add(tab.name);
        }
      }
    });

    // Then fill remaining slots with high-quality items from any category
    while (selectedItems.length < targetCount) {
      const remainingItems = recommendations
        .filter(item => !selectedItems.some(selected => selected.id === item.id))
        .sort((a, b) => b.tasteStrength - a.tasteStrength);
      
      if (remainingItems.length === 0) break;
      
      // Add some randomness - pick from top 3 remaining items
      const topItems = remainingItems.slice(0, 3);
      const randomItem = topItems[Math.floor(Math.random() * topItems.length)];
      selectedItems.push(randomItem);
    }

    // Apply selections with a staggered animation
    setTimeout(() => {
      setSelectedItems(selectedItems);
      setIsSuprising(false);
      
      // Show success message
      const categories = Array.from(categoriesUsed);
      setSurpriseMessage(
        `🎉 Selected ${selectedItems.length} items from ${categories.length} categories!`
      );
      
      // Clear message after 3 seconds
      setTimeout(() => setSurpriseMessage(''), 3000);
    }, 800);
  };

  const recommendations = currentCity.recommendations || [];
  
  // Debug: Log what we actually have in recommendations
  console.log('🔍 Results page - Current city:', currentCity.name);
  console.log('🔍 Results page - Current city object:', currentCity);
  console.log('🔍 Results page - Total recommendations:', recommendations.length);
  console.log('📊 Results page - Categories breakdown:', {
    food: recommendations.filter(item => item.category === 'food').length,
    activity: recommendations.filter(item => item.category === 'activity').length,
    movie: recommendations.filter(item => item.category === 'movie').length,
    tv_show: recommendations.filter(item => item.category === 'tv_show').length,
    artist: recommendations.filter(item => item.category === 'artist').length,
    book: recommendations.filter(item => item.category === 'book').length,
    podcast: recommendations.filter(item => item.category === 'podcast').length,
    media: recommendations.filter(item => item.category === 'media').length,
    other: recommendations.filter(item => !['food', 'activity', 'movie', 'tv_show', 'artist', 'book', 'podcast', 'media'].includes(item.category)).length
  });
  
  // Log first few items to see their structure
  if (recommendations.length > 0) {
    console.log('🔍 First 3 recommendations:', recommendations.slice(0, 3).map(item => ({
      name: item.name,
      category: item.category,
      id: item.id
    })));
  }
  
  const foodItems = recommendations.filter(item => item.category === 'food');
  const activityItems = recommendations.filter(item => item.category === 'activity');
  const mediaItems = recommendations.filter(item => item.category === 'media');

  // Separate media items by type for better organization
  const movieItems = recommendations.filter(item => item.category === 'movie');
  const tvItems = recommendations.filter(item => item.category === 'tv_show');
  const musicItems = recommendations.filter(item => item.category === 'artist');
  const bookItems = recommendations.filter(item => item.category === 'book');
  const podcastItems = recommendations.filter(item => item.category === 'podcast');

  // Icon mapping for dynamic tabs
  const getTabIcon = (displayName: string, iconString?: string) => {
    const iconMap: { [key: string]: any } = {
      'Places': Utensils,
      'Movies': Film,
      'TV Shows': Tv,
      'Music': Music,
      'Books': Book,
      'Podcasts': Headphones,
      'Games': Star,
      'Destinations': Camera
    };
    return iconMap[displayName] || Star;
  };

  const getTabColor = (displayName: string) => {
    const colorMap: { [key: string]: string } = {
      'Places': 'orange',
      'Movies': 'purple',
      'TV Shows': 'indigo',
      'Music': 'pink',
      'Books': 'green',
      'Podcasts': 'teal',
      'Games': 'yellow',
      'Destinations': 'blue'
    };
    return colorMap[displayName] || 'gray';
  };

  // DYNAMIC TABS: Use activeTabs from context with fallback to static tabs
  const tabs = activeTabs.length > 0 
    ? activeTabs.map(dynamicTab => {
        const items = getRecommendationsByTab(dynamicTab.displayName);
        return {
          id: dynamicTab.id,
          name: dynamicTab.displayName,
          icon: getTabIcon(dynamicTab.displayName, dynamicTab.icon),
          count: items.length,
          items: items,
          color: getTabColor(dynamicTab.displayName),
          priority: dynamicTab.priority,
          estimatedCount: dynamicTab.estimatedCount,
          isDynamic: true
        };
      }).filter(tab => tab.count > 0)
    : // Fallback to static tabs if dynamic tabs not available
      [
        {
          id: 'food',
          name: 'Food & Dining',
          icon: Utensils,
          count: foodItems.length,
          items: foodItems,
          color: 'orange',
          isDynamic: false
        },
        {
          id: 'activity',
          name: 'Things to Do',
          icon: Camera,
          count: activityItems.length,
          items: activityItems,
          color: 'blue',
          isDynamic: false
        },
        {
          id: 'movie',
          name: 'Movies',
          icon: Film,
          count: movieItems.length,
          items: movieItems,
          color: 'purple',
          isDynamic: false
        }
      ].filter(tab => tab.count > 0);

  const currentTabItems = tabs.find(tab => tab.name === activeTab)?.items || [];

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div data-testid="loading-spinner" className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Finding your perfect recommendations...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/create-plan"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Your Perfect Day in {currentCity.name}</h1>
                <p className="text-sm text-gray-600">Based on "{vibeInput}"</p>
              </div>
            </div>
            
            {/* Selection Status */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{getSelectedCount().total}</span> selected
              </div>
              
              {/* Surprise Me Button */}
              <button
                onClick={surpriseMe}
                data-testid="surprise-me-button"
                className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm ${
                  isSuprising ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={recommendations.length === 0 || isSuprising}
              >
                <Shuffle className={`w-4 h-4 ${isSuprising ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isSuprising ? 'Surprising...' : 'Surprise Me'}
                </span>
                <span className="sm:hidden">
                  {isSuprising ? '...' : 'Surprise'}
                </span>
              </button>
              
              <Link
                to="/plan"
                data-testid="create-plan-from-selections"
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  canBuildPlan() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                onClick={canBuildPlan() ? undefined : (e) => e.preventDefault()}
              >
                Build Plan
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Mobile Header */}
        <div className="sm:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Perfect Day in {currentCity.name}</h1>
          <p className="text-gray-600 mb-4">Based on "{vibeInput}"</p>
        </div>

        {/* Surprise Message */}
        {surpriseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-center"
          >
            <p className="text-purple-800 font-medium text-sm">
              {surpriseMessage}
            </p>
          </motion.div>
        )}

        {/* Cultural Ecosystem Link */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {extractedSeeds.length > 0 ? (
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Detected themes from your vibe</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Discover your cultural connections</span>
              </div>
            )}
            
            <Link 
              to="/cultural-ecosystem"
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md relative"
            >
              <Zap className="w-4 h-4" />
              <span>Explore Cultural Ecosystem</span>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded-full font-bold">
                NEW
              </span>
            </Link>
          </div>
          {extractedSeeds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {extractedSeeds.slice(0, 6).map((seed, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {seed.text} • {Math.round(seed.confidence * 100)}%
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Context Indicators */}
        {vibeContext && (vibeContext.isIndoor || vibeContext.isOutdoor || vibeContext.isHybrid) && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span className="font-medium">Context detected:</span>
              <div className="flex space-x-2">
                {vibeContext.isIndoor && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Indoor vibes
                  </span>
                )}
                {vibeContext.isOutdoor && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Outdoor vibes
                  </span>
                )}
                {vibeContext.isHybrid && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    Mixed vibes
                  </span>
                )}
                {vibeContext.timeOfDay && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                    {vibeContext.timeOfDay}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabbed Recommendations */}
        {tabs.length > 0 ? (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.id}
                    data-testid="category-tab"
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                    
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {tab.count}
                      </span>
                      
                      {/* Priority indicator for dynamic tabs */}
                      {(tab as any).isDynamic && (tab as any).priority > 1.5 && (
                        <Zap className="w-3 h-3 text-yellow-500" title={`High relevance (${((tab as any).priority).toFixed(1)})`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recommendations Grid */}
            <div data-testid="recommendations-grid" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tabs.find(tab => tab.name === activeTab)?.name}
                  </h2>
                  {activeTabs.length > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                      Smart recommendations
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {currentTabItems.length} recommendations based on your vibe
                  </p>
                  {activeTabs.length > 0 && (
                    <p className="text-xs text-gray-400">
                      Context-aware selection
                    </p>
                  )}
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentTabItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    data-testid="recommendation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedItems.some(selected => selected.id === item.id)
                        ? 'ring-2 ring-blue-500 bg-blue-50 selected border-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleItemSelection(item)}
                  >
                    {/* Card Content */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {selectedItems.some(selected => selected.id === item.id) && (
                            <Heart className="w-4 h-4 text-blue-500 fill-current" />
                          )}
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {Math.round(item.tasteStrength * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Location & Why it fits */}
                      {item.location && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}

                      {item.whyItFits && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.whyItFits}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty state */}
              {currentTabItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Camera className="w-12 h-12 mx-auto mb-4" />
                  </div>
                  <p className="text-gray-600">No recommendations found for this category</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different category or refine your vibe</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No recommendations fallback */
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Star className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-6">We're still finding the perfect matches for your vibe</p>
            <Link
              to="/create-plan"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try a different vibe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;