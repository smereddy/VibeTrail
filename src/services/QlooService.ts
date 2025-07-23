import { BaseAPIService } from './BaseAPIService';
import { getEnvironmentConfig } from '../config/environment';
import {
    ExtractedSeed,
    QlooEntityMap,
    QlooInsight,
    NormalizedInsight,
    QlooCategory,
    APIResponse,
    VibeContext,
    DynamicTabConfig,
} from '../types';

/**
 * Qloo Entity Types - All available entity types from Qloo API
 */
export type QlooEntityType = 
    | 'urn:entity:place'
    | 'urn:entity:artist'
    | 'urn:entity:book'
    | 'urn:entity:brand'
    | 'urn:entity:destination'
    | 'urn:entity:movie'
    | 'urn:entity:person'
    | 'urn:entity:podcast'
    | 'urn:entity:tv_show'
    | 'urn:entity:videogame';



/**
 * Internal Tab Configuration for scoring
 */
interface TabConfiguration {
    entityType: QlooEntityType;
    tags: string[];
    priority: number;
    displayName: string;
    icon: string;
}

/**
 * Qloo API integration service - Uses proxy for secure API key management
 * Implements dynamic tab system based on entity types and context
 */
export class QlooService extends BaseAPIService {
    private config: ReturnType<typeof getEnvironmentConfig>;

    constructor() {
        const config = getEnvironmentConfig();
        
        // Use proxy server for secure API key management (production ready)
        const apiUrl = config?.app?.apiProxyUrl || '/api';
        
        super(apiUrl, config.qloo.timeout);
        this.config = config;
        
        console.log('Qloo Service: Using secure proxy at', apiUrl);
    }

    protected getServiceName(): 'qloo' {
        return 'qloo';
    }

    /**
     * Get dynamic tab configurations based on comprehensive vibe context
     * This is the core of VibeTrail 2.0's adaptive interface
     */
    getDynamicTabs(vibeContext: VibeContext): DynamicTabConfig[] {
        const baseConfigs: TabConfiguration[] = [
            // Places - Always included (restaurants, venues, attractions)
            {
                entityType: 'urn:entity:place',
                tags: ['urn:tag:genre:place:restaurant', 'urn:tag:category:place:venue', 'urn:tag:category:place:attraction'],
                priority: 10,
                displayName: 'Places',
                icon: '🏪'
            },
            // Entertainment - Movies
            {
                entityType: 'urn:entity:movie',
                tags: ['urn:tag:keyword:qloo:cinema', 'urn:tag:genre:movie', 'urn:tag:keyword:qloo:film'],
                priority: 6,
                displayName: 'Movies',
                icon: '🎬'
            },
            // Entertainment - TV Shows
            {
                entityType: 'urn:entity:tv_show',
                tags: ['urn:tag:genre:tv_show', 'urn:tag:keyword:qloo:streaming', 'urn:tag:keyword:qloo:series'],
                priority: 5,
                displayName: 'TV Shows',
                icon: '📺'
            },
            // Entertainment - Music/Artists
            {
                entityType: 'urn:entity:artist',
                tags: ['urn:tag:genre:music', 'urn:tag:keyword:qloo:live_music', 'urn:tag:keyword:qloo:concert'],
                priority: 7,
                displayName: 'Music',
                icon: '🎵'
            },
            // Culture - Books
            {
                entityType: 'urn:entity:book',
                tags: ['urn:tag:genre:book', 'urn:tag:keyword:qloo:literature', 'urn:tag:keyword:qloo:reading'],
                priority: 4,
                displayName: 'Books',
                icon: '📚'
            },
            // Culture - Podcasts
            {
                entityType: 'urn:entity:podcast',
                tags: ['urn:tag:genre:podcast', 'urn:tag:keyword:qloo:audio', 'urn:tag:keyword:qloo:storytelling'],
                priority: 3,
                displayName: 'Podcasts',
                icon: '🎧'
            },
            // Activities - Games
            {
                entityType: 'urn:entity:videogame',
                tags: ['urn:tag:genre:videogame', 'urn:tag:keyword:qloo:gaming', 'urn:tag:keyword:qloo:interactive'],
                priority: 3,
                displayName: 'Games',
                icon: '🎮'
            },
            // Travel - Destinations
            {
                entityType: 'urn:entity:destination',
                tags: ['urn:tag:category:destination:city', 'urn:tag:keyword:qloo:travel', 'urn:tag:keyword:qloo:neighborhood'],
                priority: 4,
                displayName: 'Destinations',
                icon: '✈️'
            }
        ];

        // Calculate sophisticated relevance scores for each tab
        const scoredConfigs = baseConfigs.map(config => {
            const score = this.calculateTabRelevanceScore(config, vibeContext);
            return {
                ...config,
                relevanceScore: score.totalScore,
                scoringDetails: score.details
            };
        });

        // Sort by relevance score and convert to DynamicTabConfig
        const sortedConfigs = scoredConfigs
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, vibeContext.entityRelevance ? 5 : 3); // Show more tabs if we have entity relevance data

        const dynamicTabs: DynamicTabConfig[] = sortedConfigs.map((config, index) => ({
            id: `tab_${config.entityType.split(':').pop()}`,
            entityType: config.entityType,
            displayName: config.displayName,
            icon: config.icon,
            tags: config.tags,
            priority: config.relevanceScore,
            isActive: index === 0, // First tab is active by default
            estimatedCount: this.estimateResultCount(config.entityType, vibeContext)
        }));

        console.log('🎯 Generated dynamic tabs:', 
            dynamicTabs.map(tab => `${tab.displayName} (${tab.priority.toFixed(2)})`).join(', ')
        );

        return dynamicTabs;
    }

    /**
     * Calculate sophisticated relevance score for a tab configuration
     */
    private calculateTabRelevanceScore(
        config: TabConfiguration, 
        vibeContext: VibeContext
    ): { totalScore: number; details: string[] } {
        let score = config.priority / 10; // Normalize base priority to 0-1 scale
        const details: string[] = [`Base: ${score.toFixed(2)}`];

        // 1. Entity Relevance Boost (from AI scoring)
        if (vibeContext.entityRelevance) {
            const entityKey = config.entityType.split(':').pop() || '';
            const entityRelevance = vibeContext.entityRelevance[entityKey] || 0;
            const entityBoost = entityRelevance * 0.5; // Up to 0.5 boost
            score += entityBoost;
            if (entityBoost > 0.1) {
                details.push(`AI Entity: +${entityBoost.toFixed(2)}`);
            }
        }

        // 2. Context-Based Boosts
        if (vibeContext.isIndoor) {
            const indoorBoost = this.getIndoorBoost(config.entityType);
            score += indoorBoost;
            if (indoorBoost > 0) {
                details.push(`Indoor: +${indoorBoost.toFixed(2)}`);
            }
        }

        if (vibeContext.isOutdoor) {
            const outdoorBoost = this.getOutdoorBoost(config.entityType);
            score += outdoorBoost;
            if (outdoorBoost > 0) {
                details.push(`Outdoor: +${outdoorBoost.toFixed(2)}`);
            }
        }

        if (vibeContext.isHybrid) {
            const hybridBoost = this.getHybridBoost(config.entityType);
            score += hybridBoost;
            if (hybridBoost > 0) {
                details.push(`Hybrid: +${hybridBoost.toFixed(2)}`);
            }
        }

        // 3. Time-of-Day Adjustments
        if (vibeContext.timeOfDay) {
            const timeBoost = this.getTimeBoost(config.entityType, vibeContext.timeOfDay);
            score += timeBoost;
            if (Math.abs(timeBoost) > 0.05) {
                details.push(`${vibeContext.timeOfDay}: ${timeBoost > 0 ? '+' : ''}${timeBoost.toFixed(2)}`);
            }
        }

        // 4. Seasonal Adjustments
        if (vibeContext.season) {
            const seasonBoost = this.getSeasonBoost(config.entityType, vibeContext.season);
            score += seasonBoost;
            if (Math.abs(seasonBoost) > 0.05) {
                details.push(`${vibeContext.season}: ${seasonBoost > 0 ? '+' : ''}${seasonBoost.toFixed(2)}`);
            }
        }

        // 5. Confidence-Based Adjustment
        if (vibeContext.confidenceScore) {
            const confidenceMultiplier = 0.5 + (vibeContext.confidenceScore * 0.5); // 0.5-1.0 range
            score *= confidenceMultiplier;
            if (vibeContext.confidenceScore < 0.8) {
                details.push(`Confidence: ×${confidenceMultiplier.toFixed(2)}`);
            }
        }

        return {
            totalScore: Math.max(0, Math.min(2.0, score)), // Clamp to 0-2.0 range
            details
        };
    }

    /**
     * Get indoor context boost for entity type
     */
    private getIndoorBoost(entityType: QlooEntityType): number {
        const indoorBoosts: { [key in QlooEntityType]: number } = {
            'urn:entity:book': 0.4,
            'urn:entity:movie': 0.3,
            'urn:entity:tv_show': 0.3,
            'urn:entity:podcast': 0.3,
            'urn:entity:videogame': 0.2,
            'urn:entity:place': 0.1, // Some indoor places like cafes, museums
            'urn:entity:artist': 0.0, // Neutral
            'urn:entity:destination': -0.1 // Slightly less relevant for indoor vibes
        };
        return indoorBoosts[entityType] || 0;
    }

    /**
     * Get outdoor context boost for entity type
     */
    private getOutdoorBoost(entityType: QlooEntityType): number {
        const outdoorBoosts: { [key in QlooEntityType]: number } = {
            'urn:entity:place': 0.3, // Parks, outdoor dining, attractions
            'urn:entity:destination': 0.3, // Travel destinations
            'urn:entity:artist': 0.2, // Outdoor concerts, festivals
            'urn:entity:movie': -0.1, // Less relevant outdoors
            'urn:entity:tv_show': -0.2, // Not great for outdoor vibes
            'urn:entity:book': -0.1, // Less common outdoors
            'urn:entity:podcast': 0.1, // Can work for walks/hikes
            'urn:entity:videogame': -0.2 // Not outdoor activity
        };
        return outdoorBoosts[entityType] || 0;
    }

    /**
     * Get hybrid context boost for entity type
     */
    private getHybridBoost(entityType: QlooEntityType): number {
        const hybridBoosts: { [key in QlooEntityType]: number } = {
            'urn:entity:place': 0.2, // Venues with both indoor/outdoor spaces
            'urn:entity:artist': 0.15, // Festivals with indoor/outdoor stages
            'urn:entity:destination': 0.1, // Cities with both options
            'urn:entity:movie': 0.05, // Drive-in theaters, outdoor screenings
            'urn:entity:book': 0.05, // Reading in various settings
            'urn:entity:podcast': 0.1, // Flexible listening
            'urn:entity:tv_show': 0.0, // Neutral
            'urn:entity:videogame': 0.0 // Neutral
        };
        return hybridBoosts[entityType] || 0;
    }

    /**
     * Get time-of-day boost for entity type
     */
    private getTimeBoost(
        entityType: QlooEntityType, 
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    ): number {
        const timeBoosts: { [key in QlooEntityType]: { [time: string]: number } } = {
            'urn:entity:place': {
                morning: 0.1, // Breakfast spots, cafes
                afternoon: 0.0,
                evening: 0.2, // Dinner, bars
                night: 0.1 // Late night venues
            },
            'urn:entity:movie': {
                morning: -0.1,
                afternoon: 0.1, // Matinee
                evening: 0.2, // Prime movie time
                night: 0.1 // Late shows
            },
            'urn:entity:tv_show': {
                morning: 0.0,
                afternoon: 0.1,
                evening: 0.2, // Prime time
                night: 0.1 // Binge watching
            },
            'urn:entity:book': {
                morning: 0.1, // Morning reading
                afternoon: 0.0,
                evening: 0.1, // Evening reading
                night: -0.1 // Less common at night
            },
            'urn:entity:podcast': {
                morning: 0.2, // Commute, morning routine
                afternoon: 0.1,
                evening: 0.0,
                night: -0.1
            },
            'urn:entity:artist': {
                morning: -0.1,
                afternoon: 0.0,
                evening: 0.3, // Concert time
                night: 0.2 // Night shows
            },
            'urn:entity:videogame': {
                morning: -0.1,
                afternoon: 0.1,
                evening: 0.2, // Gaming time
                night: 0.1 // Late night gaming
            },
            'urn:entity:destination': {
                morning: 0.1, // Day trips
                afternoon: 0.0,
                evening: 0.0,
                night: -0.1 // Less travel planning at night
            }
        };

        return timeBoosts[entityType]?.[timeOfDay] || 0;
    }

    /**
     * Get seasonal boost for entity type
     */
    private getSeasonBoost(
        entityType: QlooEntityType,
        season: 'spring' | 'summer' | 'fall' | 'winter'
    ): number {
        const seasonBoosts: { [key in QlooEntityType]: { [season: string]: number } } = {
            'urn:entity:place': {
                spring: 0.1, // Outdoor dining returns
                summer: 0.2, // Peak outdoor venue season
                fall: 0.1, // Cozy indoor places
                winter: 0.0
            },
            'urn:entity:destination': {
                spring: 0.2, // Travel season begins
                summer: 0.3, // Peak travel season
                fall: 0.1, // Fall foliage trips
                winter: -0.1 // Less travel
            },
            'urn:entity:artist': {
                spring: 0.1, // Festival season starts
                summer: 0.3, // Peak festival/concert season
                fall: 0.1, // Indoor venue season
                winter: 0.0
            },
            'urn:entity:book': {
                spring: 0.0,
                summer: -0.1, // More outdoor activities
                fall: 0.2, // Cozy reading season
                winter: 0.3 // Peak indoor reading time
            },
            'urn:entity:movie': {
                spring: 0.0,
                summer: -0.1, // Outdoor activities compete
                fall: 0.1, // Indoor entertainment season
                winter: 0.2 // Peak indoor entertainment
            },
            'urn:entity:tv_show': {
                spring: 0.0,
                summer: -0.1,
                fall: 0.1, // New season premieres
                winter: 0.2 // Binge watching season
            },
            'urn:entity:podcast': {
                spring: 0.0,
                summer: 0.0,
                fall: 0.0,
                winter: 0.1 // More indoor listening time
            },
            'urn:entity:videogame': {
                spring: -0.1,
                summer: -0.2, // Outdoor activities compete
                fall: 0.1,
                winter: 0.2 // Indoor gaming season
            }
        };

        return seasonBoosts[entityType]?.[season] || 0;
    }

    /**
     * Estimate result count for entity type based on context
     */
    private estimateResultCount(entityType: QlooEntityType, vibeContext: VibeContext): number {
        // Base estimates per entity type
        const baseEstimates: { [key in QlooEntityType]: number } = {
            'urn:entity:place': 15, // Usually lots of places
            'urn:entity:movie': 8,
            'urn:entity:tv_show': 6,
            'urn:entity:artist': 10,
            'urn:entity:book': 12,
            'urn:entity:podcast': 8,
            'urn:entity:videogame': 6,
            'urn:entity:destination': 5
        };

        let estimate = baseEstimates[entityType];

        // Adjust based on entity relevance
        if (vibeContext.entityRelevance) {
            const entityKey = entityType.split(':').pop() || '';
            const relevance = vibeContext.entityRelevance[entityKey] || 0;
            estimate = Math.round(estimate * (0.5 + relevance * 0.5)); // Scale by relevance
        }

        return Math.max(3, Math.min(20, estimate)); // Clamp to reasonable range
    }

    /**
     * Get recommendations for a specific entity type using Location Insights API
     */
    async getRecommendationsByEntityType(
        entityType: QlooEntityType,
        city: string,
        tags?: string[],
        seeds?: ExtractedSeed[],
        limit: number = 10
    ): Promise<APIResponse<QlooInsight[]>> {
        try {
            // Build URL parameters for Location Insights API
            const params = new URLSearchParams({
                'filter.type': entityType,
                'filter.location.query': city,
                'limit': limit.toString()
            });

            // Add tags if provided
            if (tags && tags.length > 0) {
                tags.forEach(tag => {
                    params.append('filter.tags', tag);
                });
            }

            // Note: signal.interests.query is not a valid parameter
            // We would need entity IDs for signal.interests.entities
            // For now, we'll rely on filter.tags for differentiation

            console.log(`🔍 Qloo API call via proxy for ${entityType}`);

            const response = await this.makeRequest<any>({
                method: 'POST',
                url: '/proxy',
                data: {
                    service: 'qloo',
                    endpoint: `/v2/insights?${params.toString()}`,
                    method: 'GET'
                }
            });

            if (response.success && response.data?.results?.entities) {
                const entities = response.data.results.entities;
                
                const insights: QlooInsight[] = entities.map((entity: any) => ({
                    id: entity.entity_id || entity.id,
                    name: entity.name,
                    description: entity.properties?.description || `${entity.name} in ${city}`,
                    location: entity.properties?.address || city,
                    weight: entity.score || 0.8,
                    category: this.mapEntityTypeToCategory(entityType),
                    metadata: {
                        address: entity.properties?.address,
                        phone: entity.properties?.phone,
                        website: entity.properties?.website,
                        rating: entity.properties?.business_rating || entity.properties?.rating,
                        priceLevel: entity.properties?.price_level,
                        businessHours: entity.properties?.hours
                    }
                }));

                console.log(`✅ Found ${insights.length} ${entityType} recommendations for ${city}`);
                return {
                    data: insights,
                    success: true
                };
            } else {
                console.warn(`⚠️ No results for ${entityType} in ${city}`);
            return {
                    data: [],
                    success: true
            };
            }
        } catch (error) {
            console.error(`❌ Qloo API Error for ${entityType}:`, error);
            return {
                error: {
                    code: 'QLOO_API_ERROR',
                    message: `Failed to get ${entityType} recommendations`,
                    details: error,
                    timestamp: new Date(),
                    service: 'qloo'
                },
                success: false
            };
        }
    }

    /**
     * Get recommendations for all relevant entity types based on vibe context
     */
    async getAllRelevantRecommendations(
        city: string,
        vibeContext: {
            isIndoor?: boolean;
            isOutdoor?: boolean;
            entityRelevance?: { [key: string]: number };
        },
        seeds?: ExtractedSeed[],
        maxTabs: number = 5
    ): Promise<APIResponse<{ [key: string]: QlooInsight[] }>> {
        try {
            // Get dynamic tab configurations
            const tabConfigs = this.getDynamicTabs(vibeContext).slice(0, maxTabs);
            
            console.log(`🎯 Getting recommendations for ${tabConfigs.length} dynamic tabs:`, 
                tabConfigs.map(t => t.displayName));

            // Get recommendations for each tab in parallel
            const recommendationPromises = tabConfigs.map(async (config) => {
                const response = await this.getRecommendationsByEntityType(
                    config.entityType,
                    city,
                    config.tags,
                    seeds,
                    10
                );
                
                return {
                    tabName: config.displayName,
                    entityType: config.entityType,
                    recommendations: response.success ? response.data || [] : []
                };
            });

            const results = await Promise.all(recommendationPromises);

            // Organize results by tab name
            const organizedResults: { [key: string]: QlooInsight[] } = {};
            results.forEach(result => {
                organizedResults[result.tabName] = result.recommendations;
            });

            console.log(`✅ Retrieved recommendations for ${Object.keys(organizedResults).length} tabs`);
            return {
                data: organizedResults,
                success: true
            };
        } catch (error) {
            console.error('❌ Error getting all relevant recommendations:', error);
            return {
                error: {
                    code: 'MULTI_ENTITY_ERROR',
                    message: 'Failed to get recommendations for multiple entity types',
                    details: error,
                    timestamp: new Date(),
                    service: 'qloo'
                },
                success: false
            };
        }
    }

    /**
     * Legacy method for backward compatibility - now uses dynamic entity types
     */
    async getAllCategoryInsights(
        entityIds: string[],
        city: string
    ): Promise<APIResponse<{ [key in QlooCategory]: QlooInsight[] }>> {
        // Map legacy categories to new approach
        const vibeContext = {
            isIndoor: false,
            isOutdoor: false,
            entityRelevance: {
                'place': 1.0,
                'movie': 0.8,
                'artist': 0.8
            }
        };

        const response = await this.getAllRelevantRecommendations(city, vibeContext, undefined, 3);
        
        if (response.success && response.data) {
            // Map new format to legacy format
            const legacyFormat: { [key in QlooCategory]: QlooInsight[] } = {
                food: response.data['Places']?.filter(item => 
                    item.metadata.address?.toLowerCase().includes('restaurant') ||
                    item.name.toLowerCase().includes('restaurant')
                ) || [],
                things_to_do: response.data['Places']?.filter(item => 
                    !item.metadata.address?.toLowerCase().includes('restaurant') &&
                    !item.name.toLowerCase().includes('restaurant')
                ) || [],
                media: [
                    ...(response.data['Movies'] || []),
                    ...(response.data['Music'] || [])
                ]
            };

            return {
                data: legacyFormat,
                success: true
            };
        }

        return response as any;
    }

    /**
     * Map entity type to legacy category
     */
    private mapEntityTypeToCategory(entityType: QlooEntityType): QlooCategory {
        const mapping: { [key in QlooEntityType]: QlooCategory } = {
            'urn:entity:place': 'food', // Will be refined based on tags
            'urn:entity:artist': 'media',
            'urn:entity:book': 'media',
            'urn:entity:brand': 'things_to_do',
            'urn:entity:destination': 'things_to_do',
            'urn:entity:movie': 'media',
            'urn:entity:person': 'media',
            'urn:entity:podcast': 'media',
            'urn:entity:tv_show': 'media',
            'urn:entity:videogame': 'things_to_do'
        };

        return mapping[entityType];
    }

    /**
     * Normalize weights across different categories
     */
    normalizeWeights(insights: QlooInsight[]): NormalizedInsight[] {
        if (insights.length === 0) {
            return [];
        }

        // Find min and max weights
        const weights = insights.map(insight => insight.weight);
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);
        const weightRange = maxWeight - minWeight;

        // Normalize weights to 0-1 scale
        return insights.map(insight => {
            const normalizedWeight = weightRange > 0
                ? (insight.weight - minWeight) / weightRange
                : 0.5;

            // Calculate cross-domain score
            const crossDomainScore = this.calculateCrossDomainScore(insight, insights);

            return {
                ...insight,
                normalizedWeight,
                crossDomainScore,
            };
        });
    }

    /**
     * Calculate cross-domain relevance score
     */
    private calculateCrossDomainScore(insight: QlooInsight, allInsights: QlooInsight[]): number {
        const categoryCount = new Set(allInsights.map(i => i.category)).size;
        const baseScore = insight.weight;
        const diversityBonus = categoryCount > 1 ? 0.1 : 0;
        return Math.min(baseScore + diversityBonus, 1.0);
    }

    /**
     * Legacy methods maintained for backward compatibility
     */
    async searchEntities(seeds: ExtractedSeed[], city: string = 'New York'): Promise<APIResponse<QlooEntityMap>> {
        // This method is deprecated but maintained for compatibility
        console.warn('⚠️ searchEntities is deprecated. Use getAllRelevantRecommendations instead.');
        
        const entityMap: QlooEntityMap = {};
        seeds.forEach((seed, index) => {
            entityMap[seed.text] = {
                entityId: `entity_${index}`,
                confidence: seed.confidence,
                category: 'food' // Default category
            };
        });

        return {
            data: entityMap,
            success: true
        };
    }

    async getInsights(
        entityIds: string[],
        category: QlooCategory,
        city: string
    ): Promise<APIResponse<QlooInsight[]>> {
        // This method is deprecated but maintained for compatibility
        console.warn('⚠️ getInsights is deprecated. Use getRecommendationsByEntityType instead.');
        
        // Map legacy category to entity type
        const entityTypeMap = {
            'food': 'urn:entity:place' as QlooEntityType,
            'things_to_do': 'urn:entity:place' as QlooEntityType,
            'media': 'urn:entity:movie' as QlooEntityType
        };

        const entityType = entityTypeMap[category];
        const tagsMap = {
            'food': ['urn:tag:genre:place:restaurant'],
            'things_to_do': ['urn:tag:category:place:museum'],
            'media': ['urn:tag:genre:movie']
        };

        return this.getRecommendationsByEntityType(entityType, city, tagsMap[category]);
    }

    async getTopRecommendations(
        seeds: ExtractedSeed[],
        city: string,
        limit: number = 15
    ): Promise<APIResponse<NormalizedInsight[]>> {
        // Use new dynamic approach
        const vibeContext = {
            isIndoor: false,
            isOutdoor: false,
            entityRelevance: {}
        };

        const response = await this.getAllRelevantRecommendations(city, vibeContext, seeds, 3);
        
        if (response.success && response.data) {
            const allInsights = Object.values(response.data).flat();
            const normalizedInsights = this.normalizeWeights(allInsights);
            
            return {
                data: normalizedInsights
                    .sort((a, b) => b.normalizedWeight - a.normalizedWeight)
                    .slice(0, limit),
                success: true
            };
        }

        return response as any;
    }
}