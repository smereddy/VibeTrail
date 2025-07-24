import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import CulturalNetworkVisualization from '../components/CulturalNetworkVisualization';
import { 
  ArrowLeft, 
  Network, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap,
  Eye,
  Heart,
  Share2,
  Download,
  Sparkles,
  Globe,
  BookOpen,
  Music,
  Film,
  MapPin,
  Coffee
} from 'lucide-react';

const CulturalEcosystem: React.FC = () => {
  const navigate = useNavigate();
  const { 
    culturalEcosystem, 
    isEcosystemLoading, 
    vibeInput,
    currentCity,
    vibeContext,
    processVibeInput
  } = useApp();
  const { currentTheme } = useTheme();
  
  const [activeView, setActiveView] = useState<'overview' | 'connections' | 'themes' | 'insights'>('overview');
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshEcosystem = async () => {
    if (!vibeInput || !currentCity) return;
    
    setIsRefreshing(true);
    
    try {
      await processVibeInput(vibeInput, currentCity.name);
    } catch (error) {
      console.error('❌ Ecosystem refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Only redirect if we have no vibe input AND we're not loading
    // Allow the page to show even if ecosystem is null (we'll show a message)
    if (!vibeInput && !isEcosystemLoading) {
      navigate('/create-plan');
    }
  }, [vibeInput, isEcosystemLoading, navigate, culturalEcosystem]);

  if (!mounted) {
    return null;
  }

  // Loading state
  if (isEcosystemLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
              <Sparkles className="w-6 h-6 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Building Your Cultural Ecosystem</h2>
            <p className="text-neutral-600 mb-4">Discovering connections across music, places, books, and more...</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No ecosystem available
  if (!culturalEcosystem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Globe className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Cultural Ecosystem Not Available</h2>
            <p className="text-neutral-600 mb-8">We couldn't build your cultural ecosystem. This might be due to limited data for your vibe or city.</p>
            <div className="space-x-4">
              <Link to="/create-plan" className="btn-primary">
                Try Different Vibe
              </Link>
              <Link to="/results" className="btn-secondary">
                View Standard Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getEntityIcon = (entityType: string) => {
    const iconMap: { [key: string]: any } = {
      'places': MapPin,
      'music': Music,
      'movies': Film,
      'books': BookOpen,
      'tv_shows': Film,
      'destinations': Globe,
      'podcasts': Coffee,
      'brands': Target
    };
    return iconMap[entityType] || Target;
  };

  const getEntityColor = (entityType: string) => {
    const colorMap: { [key: string]: string } = {
      'places': 'orange',
      'music': 'pink',
      'movies': 'purple',
      'books': 'green',
      'tv_shows': 'indigo',
      'destinations': 'blue',
      'podcasts': 'teal',
      'brands': 'gray'
    };
    return colorMap[entityType] || 'gray';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/results" className="btn-ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Link>
              <div>
                <h1 className="text-xl font-bold text-neutral-800 flex items-center">
                  <Network className="w-5 h-5 mr-2 text-primary-600" />
                  Cultural Ecosystem
                </h1>
                <p className="text-sm text-neutral-600">
                  Cross-domain insights for "{vibeInput}" in {currentCity.name}
                </p>
              </div>
            </div>
            
            {/* Ecosystem Score */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-neutral-600">Ecosystem Coherence</div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(culturalEcosystem.ecosystemScore * 100)}%
                  </div>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="btn-ghost p-2">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="btn-ghost p-2">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-neutral-100 p-1 rounded-xl mb-8">
          {[
            { id: 'overview', name: 'Overview', icon: Eye },
            { id: 'connections', name: 'Connections', icon: Network },
            { id: 'themes', name: 'Themes', icon: Target },
            { id: 'insights', name: 'Insights', icon: Lightbulb }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Ecosystem Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Your Cultural Universe</h2>
                


                {/* AI-Generated Ecosystem Narrative */}
                {culturalEcosystem.ecosystemNarrative && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-purple-900 mb-2">AI Cultural Analysis</h4>
                        <p className="text-purple-800 leading-relaxed">{culturalEcosystem.ecosystemNarrative}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {Object.keys(culturalEcosystem.entities).length}
                    </div>
                    <div className="text-sm text-neutral-600">Cultural Domains</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {culturalEcosystem.connections.length}
                    </div>
                    <div className="text-sm text-neutral-600">Cross-Domain Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {culturalEcosystem.culturalThemes.length}
                    </div>
                    <div className="text-sm text-neutral-600">Unifying Themes</div>
                  </div>
                </div>
              </div>

              {/* Entity Types Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(culturalEcosystem.entities).map(([entityType, entities]) => {
                  const Icon = getEntityIcon(entityType);
                  const color = getEntityColor(entityType);
                  
                  return (
                    <motion.div
                      key={entityType}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-white rounded-xl p-4 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg bg-${color}-100`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-800 capitalize">{entityType}</h3>
                          <p className="text-xs text-neutral-500">{entities.length} recommendations</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {entities.slice(0, 2).map((entity: any, index: number) => (
                          <div key={index} className="text-xs text-neutral-600 truncate">
                            {entity.name}
                          </div>
                        ))}
                        {entities.length > 2 && (
                          <div className="text-xs text-neutral-400">
                            +{entities.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeView === 'connections' && (
            <motion.div
              key="connections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Network Visualization */}
              <CulturalNetworkVisualization 
                connections={culturalEcosystem.connections}
                entities={culturalEcosystem.entities}
                width={800}
                height={500}
              />
              
              {/* Connection Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Connection Details</h2>
                <p className="text-neutral-600 mb-6">
                  Explore the strongest cultural connections in your ecosystem
                </p>
                
                <div className="space-y-4">
                  {culturalEcosystem.connections.slice(0, 8).map((connection: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedConnection(connection)}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-neutral-800">{connection.fromEntity.name}</span>
                          <Network className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium text-neutral-800">{connection.toEntity.name}</span>
                        </div>
                        <p className="text-sm text-neutral-600">{connection.connectionReason}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex space-x-1">
                            {connection.sharedThemes.slice(0, 3).map((theme: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                                {theme}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {Math.round(connection.connectionStrength * 100)}% match
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Cultural Themes</h2>
                <p className="text-neutral-600 mb-6">
                  The underlying themes that unify your cultural ecosystem
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {culturalEcosystem.culturalThemes.map((theme: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-neutral-800 capitalize">{theme.theme}</h3>
                        <div className="text-sm text-primary-600 font-medium">
                          {Math.round(theme.strength * 100)}%
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3">{theme.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {theme.entityTypes.map((entityType: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white text-neutral-700 text-xs rounded">
                            {entityType}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Examples: {theme.examples.slice(0, 2).join(', ')}
                        {theme.examples.length > 2 && '...'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Cultural Insights</h2>
                <p className="text-neutral-600 mb-6">
                  AI-powered analysis of your cultural preferences and patterns
                </p>
                
                <div className="space-y-4">
                  {culturalEcosystem.insights.map((insight: any, index: number) => {
                    const getInsightIcon = (type: string) => {
                      switch (type) {
                        case 'pattern': return Target;
                        case 'connection': return Network;
                        case 'trend': return TrendingUp;
                        case 'recommendation': return Heart;
                        case 'psychological': return Sparkles;
                        default: return Lightbulb;
                      }
                    };

                    const getInsightColor = (type: string) => {
                      switch (type) {
                        case 'pattern': return 'blue';
                        case 'connection': return 'green';
                        case 'trend': return 'purple';
                        case 'recommendation': return 'pink';
                        case 'psychological': return 'purple';
                        default: return 'gray';
                      }
                    };

                    const Icon = getInsightIcon(insight.type);
                    const color = getInsightColor(insight.type);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-${color}-100 flex-shrink-0`}>
                            <Icon className={`w-5 h-5 text-${color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-neutral-800">{insight.title}</h3>
                              <div className="text-sm text-neutral-500">
                                {Math.round(insight.confidence * 100)}% confidence
                              </div>
                            </div>
                            <p className="text-neutral-600 mb-3">{insight.description}</p>
                            
                            {/* AI-Generated Actionable Advice */}
                            {insight.actionableAdvice && (
                              <div className="mb-3 p-3 bg-white rounded border border-purple-100">
                                <div className="flex items-start space-x-2">
                                  <Target className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-purple-700 font-medium">{insight.actionableAdvice}</p>
                                </div>
                              </div>
                            )}
                            
                            {insight.supportingEntities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {insight.supportingEntities.slice(0, 4).map((entity: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-white text-neutral-600 text-xs rounded border">
                                    {entity}
                                  </span>
                                ))}
                                {insight.supportingEntities.length > 4 && (
                                  <span className="px-2 py-1 bg-neutral-200 text-neutral-500 text-xs rounded">
                                    +{insight.supportingEntities.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CulturalEcosystem; 