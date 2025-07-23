import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../context/ThemeContext';
import { RecommendationCard, EnhancedRecommendation } from './RecommendationCard';
import { DynamicTabConfig, VibeContext } from '../types';

/**
 * Props for RecommendationGrid
 */
interface RecommendationGridProps {
    recommendations: EnhancedRecommendation[];
    dynamicTabs?: DynamicTabConfig[];
    vibeContext?: VibeContext;
    onCardAction?: (action: string, recommendation: EnhancedRecommendation) => void;
    onTabChange?: (tabId: string) => void;
    showRelevanceScores?: boolean;
    compactMode?: boolean;
    isLoading?: boolean;
    className?: string;
}

/**
 * Responsive recommendation grid with dynamic tabs
 */
export const RecommendationGrid: React.FC<RecommendationGridProps> = ({
    recommendations,
    dynamicTabs = [],
    vibeContext,
    onCardAction,
    onTabChange,
    showRelevanceScores = false,
    compactMode = false,
    isLoading = false,
    className = ''
}) => {
    const { colors, shadows } = useThemeStyles();
    const [activeTabId, setActiveTabId] = useState<string>('');
    const [filteredRecommendations, setFilteredRecommendations] = useState<EnhancedRecommendation[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    /**
     * Initialize active tab
     */
    useEffect(() => {
        if (dynamicTabs.length > 0 && !activeTabId) {
            const activeTab = dynamicTabs.find(tab => tab.isActive) || dynamicTabs[0];
            setActiveTabId(activeTab.id);
        }
    }, [dynamicTabs, activeTabId]);

    /**
     * Filter recommendations based on active tab
     */
    useEffect(() => {
        if (!activeTabId || dynamicTabs.length === 0) {
            setFilteredRecommendations(recommendations);
            return;
        }

        const activeTab = dynamicTabs.find(tab => tab.id === activeTabId);
        if (!activeTab) {
            setFilteredRecommendations(recommendations);
            return;
        }

        // Filter by entity type
        const filtered = recommendations.filter(rec => 
            rec.entityType === activeTab.entityType
        );

        // Sort by relevance score
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);

        setFilteredRecommendations(filtered);
    }, [activeTabId, recommendations, dynamicTabs]);

    /**
     * Handle tab change
     */
    const handleTabChange = (tabId: string) => {
        setActiveTabId(tabId);
        onTabChange?.(tabId);
    };

    /**
     * Handle card action
     */
    const handleCardAction = (action: string, recommendation: EnhancedRecommendation) => {
        console.log(`🎯 Card action: ${action} for ${recommendation.name}`);
        onCardAction?.(action, recommendation);
    };

    /**
     * Render dynamic tabs
     */
    const renderDynamicTabs = () => {
        if (dynamicTabs.length === 0) return null;

        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                        Recommendations
                    </h2>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                viewMode === 'grid' ? 'font-medium' : ''
                            }`}
                            style={{
                                backgroundColor: viewMode === 'grid' ? `${colors.primary}20` : 'transparent',
                                color: viewMode === 'grid' ? colors.primary : colors.textSecondary
                            }}
                        >
                            ⊞ Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                viewMode === 'list' ? 'font-medium' : ''
                            }`}
                            style={{
                                backgroundColor: viewMode === 'list' ? `${colors.primary}20` : 'transparent',
                                color: viewMode === 'list' ? colors.primary : colors.textSecondary
                            }}
                        >
                            ☰ List
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {dynamicTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                                ${activeTabId === tab.id
                                    ? 'font-medium shadow-md'
                                    : 'hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                            style={{
                                backgroundColor: activeTabId === tab.id ? `${colors.primary}15` : colors.surface,
                                borderColor: activeTabId === tab.id ? colors.primary : colors.border,
                                color: activeTabId === tab.id ? colors.primary : colors.text
                            }}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span className="text-sm">{tab.displayName}</span>
                            <span 
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: activeTabId === tab.id ? colors.primary : colors.textSecondary,
                                    color: colors.surface
                                }}
                            >
                                {tab.estimatedCount}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active Tab Info */}
                {activeTabId && (
                    <div 
                        className="p-3 rounded-lg mb-4"
                        style={{
                            backgroundColor: `${colors.primary}10`,
                            border: `1px solid ${colors.primary}30`
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                    {dynamicTabs.find(tab => tab.id === activeTabId)?.icon}
                                </span>
                                <span className="font-medium" style={{ color: colors.text }}>
                                    {dynamicTabs.find(tab => tab.id === activeTabId)?.displayName} 
                                </span>
                                <span className="text-sm" style={{ color: colors.textSecondary }}>
                                    ({filteredRecommendations.length} results)
                                </span>
                            </div>
                            <div className="text-sm" style={{ color: colors.textSecondary }}>
                                Priority: {dynamicTabs.find(tab => tab.id === activeTabId)?.priority.toFixed(2)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    /**
     * Render loading state
     */
    const renderLoadingState = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="p-6 rounded-xl animate-pulse"
                    style={{
                        backgroundColor: colors.surface,
                        boxShadow: shadows.md
                    }}
                >
                    <div className="flex items-start space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                        <div className="flex-1">
                            <div className="h-5 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    /**
     * Render empty state
     */
    const renderEmptyState = () => (
        <div 
            className="text-center py-12 rounded-xl"
            style={{
                backgroundColor: colors.surface,
                boxShadow: shadows.md
            }}
        >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                No recommendations found
            </h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
                Try adjusting your vibe input or context settings
            </p>
        </div>
    );

    /**
     * Get grid classes based on view mode
     */
    const getGridClasses = () => {
        if (viewMode === 'list') {
            return 'space-y-4';
        }
        
        if (compactMode) {
            return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';
        }
        
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    };

    return (
        <div className={`recommendation-grid ${className}`}>
            {/* Dynamic Tabs */}
            {renderDynamicTabs()}

            {/* Loading State */}
            {isLoading && renderLoadingState()}

            {/* Empty State */}
            {!isLoading && filteredRecommendations.length === 0 && renderEmptyState()}

            {/* Recommendations Grid */}
            {!isLoading && filteredRecommendations.length > 0 && (
                <div className={getGridClasses()}>
                    {filteredRecommendations.map((recommendation) => (
                        <RecommendationCard
                            key={recommendation.id}
                            recommendation={recommendation}
                            vibeContext={vibeContext}
                            onAction={handleCardAction}
                            showRelevanceScore={showRelevanceScores}
                            compact={compactMode || viewMode === 'list'}
                            className={viewMode === 'list' ? 'w-full' : ''}
                        />
                    ))}
                </div>
            )}

            {/* Results Summary */}
            {!isLoading && filteredRecommendations.length > 0 && (
                <div 
                    className="mt-6 p-4 rounded-lg text-center"
                    style={{
                        backgroundColor: `${colors.primary}10`,
                        border: `1px solid ${colors.primary}30`
                    }}
                >
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        Showing {filteredRecommendations.length} recommendations
                        {activeTabId && ` for ${dynamicTabs.find(tab => tab.id === activeTabId)?.displayName}`}
                        {vibeContext && (
                            <span className="ml-2">
                                • {vibeContext.isIndoor && '🏠 Indoor'}
                                {vibeContext.isOutdoor && '🌳 Outdoor'}
                                {vibeContext.isHybrid && '🌤️ Hybrid'}
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}; 