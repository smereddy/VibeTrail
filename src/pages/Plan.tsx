import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TasteItem } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  Calendar, 
  Coffee, 
  Utensils, 
  Camera, 
  ArrowRight, 
  Download,
  Sparkles,
  Users,
  DollarSign,
  Phone,
  Globe,
  Heart,
  CheckCircle
} from 'lucide-react';

const Plan: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentCity, 
    selectedItems, 
    vibeInput, 
    buildDayPlan, 
    dayPlan, 
    isLoading, 
    apiError
  } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const planBuiltForItems = useRef<string>('');

  useEffect(() => {
    // Redirect if no selected items
    if (selectedItems.length === 0) {
      navigate('/results');
      return;
    }

    // Create a unique key for the current set of selected items
    const itemsKey = selectedItems.map(item => item.id).sort().join(',');
    
    // Only build day plan if we haven't already built one for these exact items
    if (planBuiltForItems.current !== itemsKey && selectedItems.length > 0) {
      console.log('🏗️ Building day plan for selected items:', selectedItems.length);
      planBuiltForItems.current = itemsKey;
      buildDayPlan(selectedItems);
    }
  }, [selectedItems, navigate, buildDayPlan]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'activity': return <Camera className="w-4 h-4" />;
      case 'media': return <Coffee className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'activity': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'media': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getTotalDuration = () => {
    return dayPlan.reduce((total, slot) => total + (slot.duration || 90), 0);
  };

  const getScheduledItems = () => {
    return dayPlan.filter(slot => slot.item);
  };

  const handleExportPlan = () => {
    navigate('/export');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-neutral-200/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/results" className="btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">Your Day Plan</h1>
                <p className="text-xs text-neutral-600">{currentCity.name}</p>
              </div>
            </div>
            <button
              onClick={handleExportPlan}
              disabled={getScheduledItems().length === 0}
              className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Compact Overview + Date Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              {/* Stats */}
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-primary-600">{selectedItems.length}</div>
                <div className="text-xs text-neutral-600">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-orange-600">{Math.round(getTotalDuration() / 60)}h</div>
                <div className="text-xs text-neutral-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-blue-600">{new Set(selectedItems.map(item => item.category)).size}</div>
                <div className="text-xs text-neutral-600">Categories</div>
              </div>
              
              {/* Date Selector */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <label className="text-sm font-medium text-neutral-700">Date</label>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
                />
                <p className="text-xs text-neutral-500 mt-1">{formatDate(selectedDate)}</p>
              </div>
            </div>
            
            {/* Vibe Display */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 text-center">
                <span className="font-medium">Vibe:</span> "{vibeInput}"
              </p>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-6 text-center mb-6"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin w-6 h-6 border-2 border-primary-600/30 border-t-primary-600 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Creating Your Schedule</h3>
                  <p className="text-sm text-neutral-600">AI is optimizing your day...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-4 mb-6 border-red-200 bg-red-50"
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                <div>
                  <h3 className="font-medium text-red-800 text-sm">Planning Error</h3>
                  <p className="text-xs text-red-700">{apiError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Compact Timeline */}
          {!isLoading && getScheduledItems().length > 0 && (
            <div className="space-y-4">
              {getScheduledItems().map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-3 sm:p-4 hover:shadow-medium transition-shadow"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Time */}
                    <div className="flex-shrink-0 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">{slot.time}</p>
                      <p className="text-xs text-neutral-500 hidden sm:block">{slot.duration || 90}min</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Mobile Header */}
                      <div className="sm:hidden mb-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-neutral-900 text-sm truncate pr-2">{slot.item?.name}</h3>
                          <div className="flex items-center space-x-1 bg-primary-50 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>{Math.round((slot.item?.tasteStrength || 0.8) * 100)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-neutral-500 mt-1">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${getCategoryColor(slot.item?.category || '')}`}>
                            {getCategoryIcon(slot.item?.category || '')}
                          </div>
                          <span className="capitalize">{slot.item?.category}</span>
                          <span>•</span>
                          <span>{slot.duration || 90}min</span>
                          {slot.item?.rating && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{slot.item.rating}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Desktop Header */}
                      <div className="hidden sm:flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${getCategoryColor(slot.item?.category || '')}`}>
                            {getCategoryIcon(slot.item?.category || '')}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-neutral-900 truncate">{slot.item?.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-neutral-500">
                              <span className="capitalize">{slot.item?.category}</span>
                              {slot.item?.rating && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{slot.item.rating}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 bg-primary-50 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>{Math.round((slot.item?.tasteStrength || 0.8) * 100)}%</span>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{slot.item?.description}</p>

                      {/* AI Reasoning - Compact */}
                      {slot.reasoning && (
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-2 sm:p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-primary-700 mb-1">AI Logic</p>
                              <p className="text-xs text-primary-600 leading-relaxed">{slot.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Details - Mobile/Desktop Responsive */}
                      <div className="space-y-1 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0 text-xs text-neutral-500">
                        <div className="flex items-center space-x-1 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{slot.item?.location}</span>
                        </div>
                        
                        {slot.item?.priceRange && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 flex-shrink-0" />
                            <span>{slot.item.priceRange}</span>
                          </div>
                        )}
                        
                        {slot.item?.phone && (
                          <div className="flex items-center space-x-1 truncate">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{slot.item.phone}</span>
                          </div>
                        )}
                        
                        {slot.item?.website && (
                          <div className="flex items-center space-x-1">
                            <Globe className="w-3 h-3 flex-shrink-0" />
                            <span>Website</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Simple Footer */}
          {getScheduledItems().length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 p-4 bg-primary-50 rounded-xl"
            >
              <p className="text-sm text-primary-700">
                🤖 AI-optimized schedule for natural flow • ✨ Powered by Qloo + OpenAI
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plan;