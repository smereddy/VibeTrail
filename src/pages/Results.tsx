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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
        <div data-testid="loading-spinner" className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-neutral-700">Finding your perfect recommendations...</p>
            <p className="text-sm text-neutral-500 mt-2">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      {/* Optimized Header - More Compact */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/create-plan"
                className="btn-ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-neutral-800">Your Perfect Day in {currentCity.name}</h1>
                <p className="text-sm text-neutral-600">Based on "{vibeInput}"</p>
              </div>
            </div>
            
            {/* Compact Selection Status */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-neutral-600">
                <span className="font-semibold text-primary-600">{getSelectedCount().total}</span> selected
              </div>
              
              {/* Surprise Me Button */}
              <button
                onClick={surpriseMe}
                data-testid="surprise-me-button"
                className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm ${
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
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  canBuildPlan() 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md' 
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
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

      {/* Main Content - Optimized Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Mobile Header */}
        <div className="sm:hidden mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Your Perfect Day in {currentCity.name}</h1>
          <p className="text-neutral-600 mb-4">Based on "{vibeInput}"</p>
        </div>

        {/* Surprise Message */}
        {surpriseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg text-center"
          >
            <p className="text-purple-800 font-medium text-sm">
              {surpriseMessage}
            </p>
          </motion.div>
        )}

        {/* Cultural Ecosystem Link - Always visible */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {extractedSeeds.length > 0 ? (
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-neutral-700">Detected themes from your vibe</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-neutral-700">Discover your cultural connections</span>
              </div>
            )}
            
            {/* Cultural Ecosystem Link - Always visible */}
            <Link 
              to="/cultural-ecosystem"
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md relative"
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
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                >
                  {seed.text} • {Math.round(seed.confidence * 100)}%
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Context Indicators - Display only when context is detected */}
        {vibeContext && (vibeContext.isIndoor || vibeContext.isOutdoor || vibeContext.isHybrid) && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
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

        {/* Optimized Tabbed Recommendations */}
        {tabs.length > 0 ? (
          <div className="space-y-6">
            {/* Dynamic Horizontal Scrollable Tab Navigation */}
            <div className="flex space-x-1 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.id}
                    data-testid="category-tab"
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                    
                    {/* Enhanced count display with priority indicator for dynamic tabs */}
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive 
                          ? `bg-${tab.color}-100 text-${tab.color}-700` 
                          : 'bg-neutral-200 text-neutral-500'
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

            {/* Optimized Recommendations Grid */}
            <div data-testid="recommendations-grid" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-neutral-800">
                    {tabs.find(tab => tab.name === activeTab)?.name}
                  </h2>
                  {/* Show dynamic tab indicator */}
                  {activeTabs.length > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                      Smart recommendations
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">
                    {currentTabItems.length} recommendations based on your vibe
                  </p>
                  {/* Show estimated count for dynamic tabs */}
                  {activeTabs.length > 0 && (
                    <p className="text-xs text-neutral-400">
                      Context-aware selection
                    </p>
                  )}
                </div>
              </div>

              {/* Dense Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentTabItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    data-testid="recommendation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedItems.some(selected => selected.id === item.id)
                        ? 'ring-2 ring-primary-500 bg-primary-50 selected'
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => toggleItemSelection(item)}
                  >
                    {/* Compact Card Content */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-neutral-800 text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {selectedItems.some(selected => selected.id === item.id) && (
                            <Heart className="w-4 h-4 text-primary-500 fill-current" />
                          )}
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-neutral-600 ml-1">
                              {Math.round(item.tasteStrength * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-600 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Location & Why it fits */}
                      {item.location && (
                        <div className="flex items-center text-xs text-neutral-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}

                      {item.whyItFits && (
                        <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                          {item.whyItFits}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show more button if there are many items */}
              {currentTabItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-neutral-400 mb-2">
                    <Camera className="w-12 h-12 mx-auto mb-4" />
                  </div>
                  <p className="text-neutral-600">No recommendations found for this category</p>
                  <p className="text-sm text-neutral-500 mt-1">Try a different category or refine your vibe</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No recommendations fallback */
          <div className="text-center py-16">
            <div className="text-neutral-400 mb-4">
              <Star className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No recommendations yet</h3>
            <p className="text-neutral-600 mb-6">We're still finding the perfect matches for your vibe</p>
            <Link
              to="/create-plan"
              className="btn-primary"
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