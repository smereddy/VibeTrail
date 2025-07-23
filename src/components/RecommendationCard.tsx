import React, { useState } from 'react';
import { useThemeStyles } from '../context/ThemeContext';
import { QlooEntityType, VibeContext } from '../types';

/**
 * Enhanced recommendation data structure
 */
export interface EnhancedRecommendation {
    id: string;
    name: string;
    description: string;
    entityType: QlooEntityType;
    confidence: number;
    relevanceScore: number;
    
    // Entity-specific metadata
    metadata: {
        // Places
        address?: string;
        phone?: string;
        website?: string;
        hours?: { [day: string]: string };
        rating?: number;
        priceLevel?: number;
        categories?: string[];
        
        // Movies/TV Shows
        year?: number;
        genre?: string[];
        director?: string;
        cast?: string[];
        duration?: string;
        imdbRating?: number;
        
        // Books
        author?: string;
        isbn?: string;
        pages?: number;
        publishedYear?: number;
        goodreadsRating?: number;
        
        // Music/Artists
        albumCount?: number;
        topSongs?: string[];
        spotifyUrl?: string;
        
        // Games
        platform?: string[];
        developer?: string;
        releaseDate?: string;
        metacriticScore?: number;
        
        // Destinations
        country?: string;
        bestTimeToVisit?: string;
        attractions?: string[];
        travelTips?: string[];
    };
    
    // Context-aware data
    contextRelevance?: {
        indoor: number;
        outdoor: number;
        timeOfDay: { [period: string]: number };
        season: { [season: string]: number };
    };
    
    // Quick actions
    actions?: {
        addToPlan?: boolean;
        getDirections?: boolean;
        moreInfo?: boolean;
        share?: boolean;
        bookmark?: boolean;
    };
}

/**
 * Props for RecommendationCard
 */
interface RecommendationCardProps {
    recommendation: EnhancedRecommendation;
    vibeContext?: VibeContext;
    onAction?: (action: string, recommendation: EnhancedRecommendation) => void;
    showRelevanceScore?: boolean;
    compact?: boolean;
    className?: string;
}

/**
 * Enhanced recommendation card component with entity-specific layouts
 */
export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation,
    vibeContext,
    onAction,
    showRelevanceScore = false,
    compact = false,
    className = ''
}) => {
    const { colors, shadows, gradients } = useThemeStyles();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Get entity-specific icon
     */
    const getEntityIcon = (entityType: QlooEntityType): string => {
        const iconMap: { [key in QlooEntityType]: string } = {
            'urn:entity:place': '🏪',
            'urn:entity:movie': '🎬',
            'urn:entity:tv_show': '📺',
            'urn:entity:book': '📚',
            'urn:entity:artist': '🎵',
            'urn:entity:podcast': '🎧',
            'urn:entity:videogame': '🎮',
            'urn:entity:destination': '✈️'
        };
        return iconMap[entityType] || '🔸';
    };

    /**
     * Get context-aware styling
     */
    const getContextStyling = () => {
        if (!vibeContext) return {};

        let accentColor = colors.accent;
        let borderStyle = 'solid';

        // Adjust styling based on context relevance
        if (recommendation.contextRelevance) {
            if (vibeContext.isIndoor && recommendation.contextRelevance.indoor > 0.7) {
                accentColor = '#E67E22'; // Warm orange for high indoor relevance
                borderStyle = 'solid';
            } else if (vibeContext.isOutdoor && recommendation.contextRelevance.outdoor > 0.7) {
                accentColor = '#4CAF50'; // Green for high outdoor relevance
                borderStyle = 'solid';
            }
        }

        return { accentColor, borderStyle };
    };

    /**
     * Handle action clicks
     */
    const handleAction = async (action: string) => {
        setIsLoading(true);
        try {
            await onAction?.(action, recommendation);
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Render entity-specific content
     */
    const renderEntitySpecificContent = () => {
        const { metadata } = recommendation;

        switch (recommendation.entityType) {
            case 'urn:entity:place':
                return (
                    <div className="space-y-2">
                        {metadata.rating && (
                            <div className="flex items-center space-x-2">
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-sm font-medium">{metadata.rating.toFixed(1)}</span>
                                {metadata.priceLevel && (
                                    <span className="text-sm text-gray-500">
                                        {'$'.repeat(metadata.priceLevel)}
                                    </span>
                                )}
                            </div>
                        )}
                        {metadata.address && (
                            <div className="flex items-start space-x-2">
                                <span className="text-gray-500 mt-0.5">📍</span>
                                <span className="text-sm" style={{ color: colors.textSecondary }}>
                                    {metadata.address}
                                </span>
                            </div>
                        )}
                        {metadata.categories && metadata.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {metadata.categories.slice(0, 3).map((category, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs rounded-full"
                                        style={{
                                            backgroundColor: `${colors.primary}20`,
                                            color: colors.primary
                                        }}
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'urn:entity:movie':
            case 'urn:entity:tv_show':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                            {metadata.year && (
                                <span style={{ color: colors.textSecondary }}>{metadata.year}</span>
                            )}
                            {metadata.duration && (
                                <span style={{ color: colors.textSecondary }}>{metadata.duration}</span>
                            )}
                            {metadata.imdbRating && (
                                <div className="flex items-center space-x-1">
                                    <span className="text-yellow-500">⭐</span>
                                    <span>{metadata.imdbRating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                        {metadata.genre && metadata.genre.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {metadata.genre.slice(0, 3).map((genre, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs rounded-full"
                                        style={{
                                            backgroundColor: `${colors.secondary}30`,
                                            color: colors.text
                                        }}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                        {metadata.director && (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                Directed by {metadata.director}
                            </p>
                        )}
                    </div>
                );

            case 'urn:entity:book':
                return (
                    <div className="space-y-2">
                        {metadata.author && (
                            <p className="text-sm font-medium" style={{ color: colors.text }}>
                                by {metadata.author}
                            </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm">
                            {metadata.publishedYear && (
                                <span style={{ color: colors.textSecondary }}>{metadata.publishedYear}</span>
                            )}
                            {metadata.pages && (
                                <span style={{ color: colors.textSecondary }}>{metadata.pages} pages</span>
                            )}
                            {metadata.goodreadsRating && (
                                <div className="flex items-center space-x-1">
                                    <span className="text-yellow-500">⭐</span>
                                    <span>{metadata.goodreadsRating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'urn:entity:artist':
                return (
                    <div className="space-y-2">
                        {metadata.albumCount && (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                {metadata.albumCount} albums
                            </p>
                        )}
                        {metadata.topSongs && metadata.topSongs.length > 0 && (
                            <div>
                                <p className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                                    Popular songs:
                                </p>
                                <p className="text-sm" style={{ color: colors.text }}>
                                    {metadata.topSongs.slice(0, 2).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 'urn:entity:videogame':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                            {metadata.releaseDate && (
                                <span style={{ color: colors.textSecondary }}>{metadata.releaseDate}</span>
                            )}
                            {metadata.metacriticScore && (
                                <div className="flex items-center space-x-1">
                                    <span className="text-green-500">🎯</span>
                                    <span>{metadata.metacriticScore}</span>
                                </div>
                            )}
                        </div>
                        {metadata.platform && metadata.platform.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {metadata.platform.slice(0, 3).map((platform, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs rounded-full"
                                        style={{
                                            backgroundColor: `${colors.accent}20`,
                                            color: colors.accent
                                        }}
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        )}
                        {metadata.developer && (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                by {metadata.developer}
                            </p>
                        )}
                    </div>
                );

            case 'urn:entity:destination':
                return (
                    <div className="space-y-2">
                        {metadata.country && (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                📍 {metadata.country}
                            </p>
                        )}
                        {metadata.bestTimeToVisit && (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                🗓️ Best time: {metadata.bestTimeToVisit}
                            </p>
                        )}
                        {metadata.attractions && metadata.attractions.length > 0 && (
                            <div>
                                <p className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                                    Top attractions:
                                </p>
                                <p className="text-sm" style={{ color: colors.text }}>
                                    {metadata.attractions.slice(0, 2).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    /**
     * Render quick actions
     */
    const renderQuickActions = () => {
        if (!recommendation.actions) return null;

        const actions = Object.entries(recommendation.actions)
            .filter(([_, enabled]) => enabled)
            .map(([action]) => action);

        if (actions.length === 0) return null;

        const actionIcons: { [key: string]: string } = {
            addToPlan: '📅',
            getDirections: '🧭',
            moreInfo: 'ℹ️',
            share: '📤',
            bookmark: '🔖'
        };

        const actionLabels: { [key: string]: string } = {
            addToPlan: 'Add to Plan',
            getDirections: 'Directions',
            moreInfo: 'More Info',
            share: 'Share',
            bookmark: 'Bookmark'
        };

        return (
            <div className="flex flex-wrap gap-2 mt-4">
                {actions.map((action) => (
                    <button
                        key={action}
                        onClick={() => handleAction(action)}
                        disabled={isLoading}
                        className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}30`
                        }}
                    >
                        <span>{actionIcons[action]}</span>
                        <span>{actionLabels[action]}</span>
                    </button>
                ))}
            </div>
        );
    };

    const { accentColor, borderStyle } = getContextStyling();

    return (
        <div
            className={`recommendation-card transition-all duration-300 hover:scale-[1.02] ${className} ${
                compact ? 'p-4' : 'p-6'
            }`}
            style={{
                backgroundColor: colors.surface,
                borderRadius: '12px',
                border: `2px ${borderStyle} ${colors.border}`,
                boxShadow: shadows.md,
                borderLeftColor: accentColor,
                borderLeftWidth: '4px'
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl flex-shrink-0">
                        {getEntityIcon(recommendation.entityType)}
                    </span>
                    <div className="flex-1 min-w-0">
                        <h3 
                            className={`font-semibold leading-tight ${compact ? 'text-base' : 'text-lg'}`}
                            style={{ color: colors.text }}
                        >
                            {recommendation.name}
                        </h3>
                        <p 
                            className={`mt-1 leading-relaxed ${compact ? 'text-sm' : 'text-base'}`}
                            style={{ color: colors.textSecondary }}
                        >
                            {recommendation.description}
                        </p>
                    </div>
                </div>
                
                {/* Relevance Score */}
                {showRelevanceScore && (
                    <div className="flex flex-col items-end space-y-1 ml-3">
                        <div 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                                backgroundColor: `${accentColor}20`,
                                color: accentColor
                            }}
                        >
                            {Math.round(recommendation.relevanceScore * 100)}%
                        </div>
                        <div 
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                        >
                            Match
                        </div>
                    </div>
                )}
            </div>

            {/* Entity-specific content */}
            {!compact && renderEntitySpecificContent()}

            {/* Quick Actions */}
            {!compact && renderQuickActions()}

            {/* Expand/Collapse for compact mode */}
            {compact && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-3 text-sm font-medium transition-colors duration-200"
                    style={{ color: colors.primary }}
                >
                    {isExpanded ? '▲ Less' : '▼ More'}
                </button>
            )}

            {/* Expanded content for compact mode */}
            {compact && isExpanded && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                    {renderEntitySpecificContent()}
                    {renderQuickActions()}
                </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-current"></div>
                </div>
            )}
        </div>
    );
}; 