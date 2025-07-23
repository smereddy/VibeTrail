import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';

const Plan: React.FC = () => {
  const { selectedItems, currentCity, vibeInput, removeFromSelectedItems, dayPlan, buildDayPlan, isDayPlanBuilding } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

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
          text: `Check out my personalized day plan: ${selectedItems.length} amazing recommendations!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">No plan created yet</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Start by creating a vibe and selecting some recommendations to build your perfect day.
          </p>
          <div className="space-y-4">
            <Link
              to="/create-plan"
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Your Plan
            </Link>
            <Link
              to="/results"
              className="block w-full px-6 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              Back to Results
            </Link>
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="container-custom py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                to="/results"
                className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Results
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Your Perfect Day Plan
                </h1>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-slate-600 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{currentCity?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{selectedItems.length} recommendations</span>
                </div>
              </div>

              {vibeInput && (
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-blue-800">
                    <span className="font-medium">Your vibe:</span> "{vibeInput}"
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleShare}
                className="group inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Share Plan
              </button>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="group inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Export Plan
                  </>
                )}
              </button>

              <Link
                to="/results"
                className="group inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Add More
              </Link>
            </div>

            {exportSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
              >
                <p className="text-green-800 font-medium">
                  ✅ Plan exported successfully!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* AI Scheduled Day Plan */}
      {dayPlan.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center space-x-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span>Your AI-Planned Day</span>
                </h2>
                <p className="text-slate-600">Optimally scheduled based on timing, location, and flow</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {dayPlan.map((timeSlot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex-shrink-0 text-center">
                          <div className="text-lg font-bold text-blue-600">{timeSlot.time}</div>
                          <div className="text-xs text-slate-500 capitalize">{timeSlot.period}</div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-lg mb-1">
                            {timeSlot.item?.name || 'Free Time'}
                          </h3>
                          
                          {timeSlot.item && (
                            <>
                              <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                                <span className="capitalize">{timeSlot.item.category}</span>
                                <span>•</span>
                                <span>{timeSlot.duration || 90} minutes</span>
                                {timeSlot.item.location && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{timeSlot.item.location}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {timeSlot.reasoning && (
                                <p className="text-sm text-slate-600 italic">
                                  "{timeSlot.reasoning}"
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className="text-2xl">
                            {timeSlot.item ? getCategoryIcon(timeSlot.item.category) : '⏰'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Generate Day Plan Button */}
      {selectedItems.length > 0 && dayPlan.length === 0 && (
        <section className="py-8 bg-gradient-to-r from-green-50 to-blue-50 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Schedule Your Day?</h2>
              <p className="text-slate-600 mb-6">
                Let AI create an optimal timeline for your {selectedItems.length} selected items
              </p>
              <button
                onClick={() => buildDayPlan(selectedItems)}
                disabled={isDayPlanBuilding}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isDayPlanBuilding ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                    Creating Schedule...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create AI Day Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Plan Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {Object.entries(categoryGroups).map(([category, items]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${getCategoryColor(category)} p-6`}>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {categoryNames[category] || category}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {items.length} {items.length === 1 ? 'recommendation' : 'recommendations'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start space-x-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900 text-lg mb-2">
                                    {item.name}
                                  </h3>
                                  
                                  {item.description && (
                                    <p className="text-slate-600 mb-3 leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}

                                  <div className="flex items-center flex-wrap gap-4 text-sm text-slate-500">
                                    {item.location && (
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{item.location}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span className="font-medium">
                                        {Math.round(item.tasteStrength * 100)}% match
                                      </span>
                                    </div>
                                  </div>

                                  {item.whyItFits && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                      <p className="text-sm text-blue-800">
                                        <span className="font-medium">Why it fits:</span> {item.whyItFits}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => removeFromSelectedItems(item.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Remove from plan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              
                              {item.externalUrl && (
                                <a
                                  href={item.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                  title="View details"
                                >
                                  <ExternalLink className="w-4 h-4" />
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

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-slate-200 p-8 text-center"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Your Perfect Day Awaits! 🎉
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  You've curated {selectedItems.length} amazing recommendations across{' '}
                  {Object.keys(categoryGroups).length} categories. Ready to make some memories?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/results"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add More Items
                  </Link>
                  <Link
                    to="/create-plan"
                    className="inline-flex items-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create New Plan
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plan;