import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { exportPlan } from '../utils/export';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Download, 
  Star, 
  Heart,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Edit3,
  Trash2,
  Plus,
  Zap,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Users,
  Timer
} from 'lucide-react';

const Plan: React.FC = () => {
  const { 
    selectedItems, 
    currentCity, 
    vibeInput, 
    removeFromSelectedItems, 
    dayPlan, 
    buildDayPlan, 
    isDayPlanBuilding 
  } = useApp();
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'schedule' | 'categories'>('schedule');
  
    // No longer auto-generate - plan is built on Results page before navigation

  const handleExport = async () => {
    if (selectedItems.length === 0) return;
    
    setIsExporting(true);
    try {
      await exportPlan(selectedItems, currentCity?.name || 'Unknown City', vibeInput || '');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Perfect Day in ${currentCity?.name}`,
          text: `Check out my AI-planned day: ${selectedItems.length} amazing recommendations scheduled perfectly!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRegeneratePlan = () => {
    if (selectedItems.length > 0) {
      console.log('🔄 Manual replan triggered, calling buildDayPlan...');
      buildDayPlan(selectedItems);
    }
  };
  
  // Debug current state
  React.useEffect(() => {
    console.log('🗓️ Plan page state:', {
      isDayPlanBuilding,
      selectedItemsCount: selectedItems.length,
      dayPlanLength: dayPlan.length,
      hasItems: dayPlan.some(slot => slot.item)
    });
  }, [isDayPlanBuilding, selectedItems.length, dayPlan]);

  const getPeriodIcon = (timeSlot: any) => {
    const hour = parseInt(timeSlot.time.split(':')[0]);
    const isPM = timeSlot.time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;
    
    if (hour24 >= 6 && hour24 < 12) return Sun;
    if (hour24 >= 12 && hour24 < 17) return Sun;
    if (hour24 >= 17 && hour24 < 21) return Sunset;
    return Moon;
  };

  const getPeriodColor = (timeSlot: any) => {
    const hour = parseInt(timeSlot.time.split(':')[0]);
    const isPM = timeSlot.time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;
    
    if (hour24 >= 6 && hour24 < 12) return 'bg-yellow-100 text-yellow-800';
    if (hour24 >= 12 && hour24 < 17) return 'bg-blue-100 text-blue-800';
    if (hour24 >= 17 && hour24 < 21) return 'bg-purple-100 text-purple-800';
    return 'bg-indigo-100 text-indigo-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      food: '🍽️',
      activity: '🎯',
      movie: '🎬',
      tv_show: '📺',
      artist: '🎵',
      book: '📚',
      podcast: '🎧',
      videogame: '🎮',
      destination: '📍'
    };
    return icons[category] || '✨';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      food: 'from-orange-500 to-red-500',
      activity: 'from-blue-500 to-cyan-500',
      movie: 'from-purple-500 to-pink-500',
      tv_show: 'from-indigo-500 to-blue-500',
      artist: 'from-pink-500 to-rose-500',
      book: 'from-green-500 to-teal-500',
      podcast: 'from-teal-500 to-cyan-500',
      videogame: 'from-violet-500 to-purple-500',
      destination: 'from-emerald-500 to-green-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/results"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">Your Plan</h1>
              </div>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No plan created yet</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start by creating a vibe and selecting some recommendations to build your perfect day.
            </p>
            <div className="space-y-3">
              <Link
                to="/create-plan"
                className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Create Your Plan
              </Link>
              <Link
                to="/results"
                className="block w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Back to Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryGroups = selectedItems.reduce((groups, item) => {
    const category = item.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as { [key: string]: typeof selectedItems });

  const categoryNames: { [key: string]: string } = {
    food: 'Food & Dining',
    activity: 'Things to Do',
    movie: 'Movies',
    tv_show: 'TV Shows',
    artist: 'Music',
    book: 'Books',
    podcast: 'Podcasts',
    videogame: 'Games',
    destination: 'Destinations',
    other: 'Other'
  };

  const totalDuration = dayPlan.reduce((sum, slot) => sum + (slot.duration || 90), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/results"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Your Perfect Day Plan</h1>
                <p className="text-sm text-gray-500">{currentCity?.name} • {selectedItems.length} items</p>
              </div>
            </div>
                         <div className="flex items-center space-x-2">
               <button
                 onClick={handleShare}
                 className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                 title="Share plan"
               >
                 <Share2 className="w-4 h-4" />
               </button>
               <button
                 onClick={handleExport}
                 disabled={isExporting}
                 className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                 title="Quick export"
               >
                 {isExporting ? (
                   <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                 ) : (
                   <Download className="w-4 h-4" />
                 )}
               </button>
               <Link
                 to="/export"
                 className="px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                 title="More export options"
               >
                 <ExternalLink className="w-4 h-4" />
               </Link>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Plan Overview</h2>
                {vibeInput && (
                  <p className="text-gray-600">
                    <span className="font-medium">Your vibe:</span> "{vibeInput}"
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{selectedItems.length}</div>
                <div className="text-sm text-gray-500">recommendations</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-900">
                  {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                </div>
                <div className="text-xs text-gray-500">Total time</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-900">{currentCity?.name}</div>
                <div className="text-xs text-gray-500">Location</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-900">
                  {Object.keys(categoryGroups).length}
                </div>
                <div className="text-xs text-gray-500">Categories</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Zap className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-900">AI Planned</div>
                <div className="text-xs text-gray-500">Optimized</div>
              </div>
            </div>
          </motion.div>

          {/* View Toggle */}
          {dayPlan.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('schedule')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'schedule'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2 inline" />
                  Schedule
                </button>
                <button
                  onClick={() => setViewMode('categories')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'categories'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Categories
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRegeneratePlan}
                  disabled={isDayPlanBuilding}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDayPlanBuilding ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2 inline"></div>
                      Replanning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2 inline" />
                      Replan with AI
                    </>
                  )}
                </button>
                <Link
                  to="/results"
                  className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add More
                </Link>
              </div>
            </div>
          )}

          {/* AI Day Plan Building */}
          {isDayPlanBuilding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-8 text-center mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="relative">
                  <div className="animate-spin w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full"></div>
                  <div className="absolute inset-0 animate-ping w-8 h-8 border border-blue-400 rounded-full opacity-20"></div>
                </div>
                <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">🤖 AI is Planning Your Perfect Day</h3>
              
              <div className="space-y-2 mb-6">
                <p className="text-gray-700 font-medium">Analyzing your {selectedItems.length} selected items...</p>
                <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Optimizing timing</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Minimizing travel</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>Maximizing flow</span>
                  </span>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
              
              <p className="text-sm text-gray-500">This usually takes 5-10 seconds...</p>
            </motion.div>
          )}

          {/* Schedule View */}
          {viewMode === 'schedule' && dayPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
                             {dayPlan.map((timeSlot, index) => {
                 const PeriodIcon = getPeriodIcon(timeSlot);
                 return (
                   <motion.div
                     key={`${timeSlot.id}-${index}`}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                   >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Time */}
                        <div className="flex-shrink-0 text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getPeriodColor(timeSlot)}`}>
                            <PeriodIcon className="w-5 h-5" />
                          </div>
                          <div className="mt-2">
                            <div className="text-sm font-semibold text-gray-900">{timeSlot.time}</div>
                            <div className="text-xs text-gray-500">{timeSlot.name}</div>
                          </div>
                        </div>
                        
                        {/* Activity */}
                        <div className="flex-1">
                          {timeSlot.item ? (
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">{getCategoryIcon(timeSlot.item.category)}</span>
                                <h3 className="text-lg font-semibold text-gray-900">{timeSlot.item.name}</h3>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="capitalize font-medium">{timeSlot.item.category}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Timer className="w-3 h-3 mr-1" />
                                  {timeSlot.duration || 90} min
                                </span>
                                {timeSlot.item.location && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {timeSlot.item.location}
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              {timeSlot.reasoning && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-blue-800">
                                    <strong>Why now:</strong> {timeSlot.reasoning}
                                  </p>
                                </div>
                              )}
                              
                              {timeSlot.item.description && (
                                <p className="text-gray-600 text-sm mb-3">{timeSlot.item.description}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Time</h3>
                              <p className="text-gray-600 text-sm">Enjoy some flexibility in your schedule</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        {timeSlot.item && (
                          <div className="flex-shrink-0 flex items-center space-x-2">
                            <button
                              onClick={() => removeFromSelectedItems(timeSlot.item!.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {timeSlot.item.externalUrl && (
                              <a
                                href={timeSlot.item.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View details"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Category View */}
          {viewMode === 'categories' && (
            <div className="space-y-6">
              {Object.entries(categoryGroups).map(([category, items]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${getCategoryColor(category)} p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {categoryNames[category] || category}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {items.length} {items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                              
                              {item.description && (
                                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                              )}

                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                {item.location && (
                                  <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {item.location}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                                  {Math.round(item.tasteStrength * 100)}% match
                                </span>
                              </div>

                              {item.whyItFits && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                                  <strong>Why it fits:</strong> {item.whyItFits}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-1 ml-4">
                              <button
                                onClick={() => removeFromSelectedItems(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              
                              {item.externalUrl && (
                                <a
                                  href={item.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="View details"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Success Message */}
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              ✅ Plan exported successfully!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plan;