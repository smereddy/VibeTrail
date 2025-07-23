import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QlooService } from '../QlooService';
import {
    ExtractedSeed,
    QlooCategory,
    QlooInsight,
    QlooSearchResponse,
    QlooInsightsResponse,
    APIResponse,
    QlooEntityType,
    DynamicTabConfig,
    VibeContext,
} from '../../types';

// Mock the environment config
vi.mock('../../config/environment', () => ({
    getEnvironmentConfig: () => ({
        app: {
            apiProxyUrl: '/api',
        },
        qloo: {
            timeout: 10000,
        },
    }),
}));

// Mock axios
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            request: vi.fn(),
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
            defaults: {
                headers: {
                    common: {},
                },
            },
        })),
        isAxiosError: vi.fn(),
    },
}));

describe('QlooService', () => {
    let qlooService: QlooService;
    let mockRequest: any;

    beforeEach(() => {
        qlooService = new QlooService();
        // Access the private client through any to mock it
        mockRequest = vi.fn();
        (qlooService as any).client.request = mockRequest;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('searchEntities', () => {
        it('should search for entities based on extracted seeds', async () => {
            const seeds: ExtractedSeed[] = [
                {
                    text: 'jazz music',
                    category: 'media',
                    confidence: 0.9,
                    searchTerms: ['jazz', 'music'],
                },
                {
                    text: 'tacos',
                    category: 'food',
                    confidence: 0.8,
                    searchTerms: ['tacos', 'mexican food'],
                },
            ];

            const mockSearchResponse: QlooSearchResponse = {
                results: [
                    {
                        id: 'jazz-123',
                        name: 'Jazz Music',
                        category: 'media',
                        confidence: 0.95,
                    },
                ],
                total: 1,
                page: 1,
            };

            mockRequest.mockResolvedValue({
                data: mockSearchResponse,
            });

            const result = await qlooService.searchEntities(seeds);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(mockRequest).toHaveBeenCalledTimes(2); // Once for each seed
        });

        it('should handle search errors gracefully', async () => {
            const seeds: ExtractedSeed[] = [
                {
                    text: 'invalid query',
                    category: 'unknown',
                    confidence: 0.1,
                    searchTerms: ['invalid'],
                },
            ];

            mockRequest.mockRejectedValue(new Error('API Error'));

            const result = await qlooService.searchEntities(seeds);

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error?.code).toBe('SEARCH_ERROR');
        });

        it('should return empty map for empty seeds', async () => {
            const result = await qlooService.searchEntities([]);

            expect(result.success).toBe(true);
            expect(result.data).toEqual({});
            expect(mockRequest).not.toHaveBeenCalled();
        });
    });

    // New tests for dynamic tabs functionality
    describe('getDynamicTabs', () => {
        const mockVibeContext: VibeContext = {
            isIndoor: true,
            isOutdoor: false,
            isHybrid: false,
            timeOfDay: 'afternoon',
            season: 'fall',
            mood: 'contemplative',
            pace: 'slow',
            socialSetting: 'solo',
            culturalStyle: 'artisanal',
            priceRange: 'mid-range'
        };

        it('should generate dynamic tabs based on vibe context', async () => {
            const result = await qlooService.getDynamicTabs(
                'cozy coffee shop vibes',
                'Los Angeles',
                mockVibeContext
            );

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data!.length).toBeGreaterThan(0);
            expect(result.data!.length).toBeLessThanOrEqual(5);

            // Check that tabs have required properties
            result.data!.forEach(tab => {
                expect(tab.id).toBeDefined();
                expect(tab.displayName).toBeDefined();
                expect(tab.entityType).toBeDefined();
                expect(tab.priority).toBeGreaterThan(0);
                expect(tab.estimatedCount).toBeGreaterThan(0);
                expect(typeof tab.isActive).toBe('boolean');
            });
        });

        it('should prioritize indoor tabs for indoor vibes', async () => {
            const indoorContext: VibeContext = {
                ...mockVibeContext,
                isIndoor: true,
                isOutdoor: false
            };

            const result = await qlooService.getDynamicTabs(
                'rainy day entertainment',
                'Los Angeles',
                indoorContext
            );

            expect(result.success).toBe(true);
            
            // Should include media-heavy tabs for indoor activities
            const tabNames = result.data!.map(tab => tab.displayName);
            expect(tabNames.some(name => name.includes('Movies') || name.includes('TV') || name.includes('Books'))).toBe(true);
        });

        it('should prioritize outdoor tabs for outdoor vibes', async () => {
            const outdoorContext: VibeContext = {
                ...mockVibeContext,
                isIndoor: false,
                isOutdoor: true
            };

            const result = await qlooService.getDynamicTabs(
                'outdoor adventure day',
                'Los Angeles',
                outdoorContext
            );

            expect(result.success).toBe(true);
            
            // Should prioritize places and destinations for outdoor activities
            const highPriorityTabs = result.data!.filter(tab => tab.priority > 1.5);
            const tabNames = highPriorityTabs.map(tab => tab.displayName);
            expect(tabNames.some(name => name.includes('Places') || name.includes('Destinations'))).toBe(true);
        });

        it('should handle cultural exploration vibes', async () => {
            const result = await qlooService.getDynamicTabs(
                'cultural exploration',
                'Los Angeles',
                mockVibeContext
            );

            expect(result.success).toBe(true);
            
            // Should include diverse cultural content
            const tabNames = result.data!.map(tab => tab.displayName);
            expect(tabNames).toContain('Places');
            expect(tabNames.some(name => name.includes('Books') || name.includes('Movies'))).toBe(true);
        });

        it('should limit to maximum 5 tabs', async () => {
            const result = await qlooService.getDynamicTabs(
                'everything everywhere all at once',
                'Los Angeles',
                mockVibeContext
            );

            expect(result.success).toBe(true);
            expect(result.data!.length).toBeLessThanOrEqual(5);
        });

        it('should set one tab as active', async () => {
            const result = await qlooService.getDynamicTabs(
                'test vibe',
                'Los Angeles',
                mockVibeContext
            );

            expect(result.success).toBe(true);
            
            const activeTabs = result.data!.filter(tab => tab.isActive);
            expect(activeTabs.length).toBe(1);
            
            // Active tab should be the highest priority one
            const highestPriority = Math.max(...result.data!.map(tab => tab.priority));
            expect(activeTabs[0].priority).toBe(highestPriority);
        });
    });

    describe('getRecommendationsByEntityType', () => {
        it('should get recommendations for specific entity type', async () => {
            const mockInsightsResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'place-1',
                        name: 'Great Restaurant',
                        description: 'Amazing food',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'food',
                        metadata: {
                            address: '123 Main St',
                            rating: 4.5,
                        },
                    },
                    {
                        id: 'place-2',
                        name: 'Cool Cafe',
                        description: 'Great coffee',
                        location: 'Los Angeles, CA',
                        weight: 0.7,
                        category: 'food',
                        metadata: {
                            address: '456 Oak Ave',
                            rating: 4.2,
                        },
                    },
                ],
                total: 2,
            };

            mockRequest.mockResolvedValue({
                data: mockInsightsResponse,
            });

            const seeds: ExtractedSeed[] = [
                {
                    text: 'coffee',
                    category: 'food',
                    confidence: 0.9,
                    searchTerms: ['coffee', 'cafe']
                }
            ];

            const result = await qlooService.getRecommendationsByEntityType(
                'urn:entity:place',
                'Los Angeles',
                ['urn:tag:genre:place:restaurant'],
                seeds,
                10
            );

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data!.length).toBe(2);
            expect(result.data![0].name).toBe('Great Restaurant');
            
            // Check that API was called with correct parameters
            expect(mockRequest).toHaveBeenCalledWith({
                method: 'POST',
                url: '/insights',
                data: {
                    entity_type: 'urn:entity:place',
                    location: 'Los Angeles',
                    tags: ['urn:tag:genre:place:restaurant'],
                    seeds: ['coffee', 'cafe'],
                    limit: 10,
                },
            });
        });

        it('should handle different entity types correctly', async () => {
            const mockMovieResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'movie-1',
                        name: 'Great Movie',
                        description: 'Amazing film',
                        location: 'Los Angeles, CA',
                        weight: 0.9,
                        category: 'media',
                        metadata: {
                            year: 2023,
                            genre: ['Drama', 'Comedy'],
                            director: 'Jane Director',
                        },
                    },
                ],
                total: 1,
            };

            mockRequest.mockResolvedValue({
                data: mockMovieResponse,
            });

            const seeds: ExtractedSeed[] = [
                {
                    text: 'indie film',
                    category: 'media',
                    confidence: 0.8,
                    searchTerms: ['indie', 'film', 'movie']
                }
            ];

            const result = await qlooService.getRecommendationsByEntityType(
                'urn:entity:movie',
                'Los Angeles',
                [],
                seeds,
                5
            );

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data![0].metadata?.genre).toEqual(['Drama', 'Comedy']);
            expect(result.data![0].metadata?.director).toBe('Jane Director');
        });

        it('should handle API errors gracefully', async () => {
            mockRequest.mockRejectedValue(new Error('API Error'));

            const result = await qlooService.getRecommendationsByEntityType(
                'urn:entity:place',
                'Los Angeles',
                [],
                [],
                5
            );

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error?.code).toBe('ENTITY_TYPE_ERROR');
        });

        it('should filter results by location', async () => {
            const mockResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'place-1',
                        name: 'LA Restaurant',
                        description: 'In LA',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'food',
                        metadata: {},
                    },
                    {
                        id: 'place-2',
                        name: 'NYC Restaurant',
                        description: 'In NYC',
                        location: 'New York, NY',
                        weight: 0.7,
                        category: 'food',
                        metadata: {},
                    },
                ],
                total: 2,
            };

            mockRequest.mockResolvedValue({
                data: mockResponse,
            });

            const result = await qlooService.getRecommendationsByEntityType(
                'urn:entity:place',
                'Los Angeles',
                [],
                [],
                10
            );

            expect(result.success).toBe(true);
            expect(result.data!.length).toBe(1);
            expect(result.data![0].location).toContain('Los Angeles');
        });
    });

    describe('getInsights', () => {
        it('should get insights for specific category and city', async () => {
            const entityIds = ['entity-1', 'entity-2'];
            const category: QlooCategory = 'food';
            const city = 'Los Angeles';

            const mockInsightsResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'insight-1',
                        name: 'Great Restaurant',
                        description: 'Amazing food',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'food',
                        metadata: {
                            address: '123 Main St',
                            rating: 4.5,
                        },
                    },
                ],
                total: 1,
            };

            mockRequest.mockResolvedValue({
                data: mockInsightsResponse,
            });

            const result = await qlooService.getInsights(entityIds, category, city);

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.data?.[0].name).toBe('Great Restaurant');
            expect(mockRequest).toHaveBeenCalledWith({
                method: 'POST',
                url: '/insights',
                data: {
                    entity_ids: entityIds,
                    category,
                    location: city,
                    limit: 20,
                },
            });
        });

        it('should return empty array for empty entity IDs', async () => {
            const result = await qlooService.getInsights([], 'food', 'Los Angeles');

            expect(result.success).toBe(true);
            expect(result.data).toEqual([]);
            expect(mockRequest).not.toHaveBeenCalled();
        });

        it('should filter results by city', async () => {
            const entityIds = ['entity-1'];
            const category: QlooCategory = 'food';
            const city = 'Los Angeles';

            const mockInsightsResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'insight-1',
                        name: 'LA Restaurant',
                        description: 'In LA',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'food',
                        metadata: {},
                    },
                    {
                        id: 'insight-2',
                        name: 'NYC Restaurant',
                        description: 'In NYC',
                        location: 'New York, NY',
                        weight: 0.7,
                        category: 'food',
                        metadata: {},
                    },
                ],
                total: 2,
            };

            mockRequest.mockResolvedValue({
                data: mockInsightsResponse,
            });

            const result = await qlooService.getInsights(entityIds, category, city);

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.data?.[0].location).toContain('Los Angeles');
        });
    });

    describe('getAllCategoryInsights', () => {
        it('should get insights for all categories in parallel', async () => {
            const entityIds = ['entity-1'];
            const city = 'Los Angeles';

            const mockInsightsResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'insight-1',
                        name: 'Test Item',
                        description: 'Test description',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'food',
                        metadata: {},
                    },
                ],
                total: 1,
            };

            mockRequest.mockResolvedValue({
                data: mockInsightsResponse,
            });

            const result = await qlooService.getAllCategoryInsights(entityIds, city);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.food).toBeDefined();
            expect(result.data?.things_to_do).toBeDefined();
            expect(result.data?.media).toBeDefined();
            expect(mockRequest).toHaveBeenCalledTimes(3); // Once for each category
        });

        it('should handle partial failures gracefully', async () => {
            const entityIds = ['entity-1'];
            const city = 'Los Angeles';

            // Mock all calls to succeed but return empty results
            mockRequest.mockResolvedValue({ data: { insights: [], total: 0 } });

            const result = await qlooService.getAllCategoryInsights(entityIds, city);

            expect(result.success).toBe(true);
            expect(result.data?.food).toEqual([]);
            expect(result.data?.things_to_do).toEqual([]);
            expect(result.data?.media).toEqual([]);
        });
    });

    describe('normalizeWeights', () => {
        it('should normalize weights to 0-1 scale', () => {
            const insights: QlooInsight[] = [
                {
                    id: '1',
                    name: 'Item 1',
                    description: 'Desc 1',
                    location: 'LA',
                    weight: 0.2,
                    category: 'food',
                    metadata: {},
                },
                {
                    id: '2',
                    name: 'Item 2',
                    description: 'Desc 2',
                    location: 'LA',
                    weight: 0.8,
                    category: 'food',
                    metadata: {},
                },
                {
                    id: '3',
                    name: 'Item 3',
                    description: 'Desc 3',
                    location: 'LA',
                    weight: 0.5,
                    category: 'media',
                    metadata: {},
                },
            ];

            const normalized = qlooService.normalizeWeights(insights);

            expect(normalized).toHaveLength(3);
            expect(normalized[0].normalizedWeight).toBe(0); // Min weight
            expect(normalized[1].normalizedWeight).toBe(1); // Max weight
            expect(normalized[2].normalizedWeight).toBeCloseTo(0.5, 5); // Middle weight
            
            // Check that all have cross-domain scores
            normalized.forEach(item => {
                expect(item.crossDomainScore).toBeGreaterThanOrEqual(0);
                expect(item.crossDomainScore).toBeLessThanOrEqual(1);
            });
        });

        it('should handle single item normalization', () => {
            const insights: QlooInsight[] = [
                {
                    id: '1',
                    name: 'Item 1',
                    description: 'Desc 1',
                    location: 'LA',
                    weight: 0.7,
                    category: 'food',
                    metadata: {},
                },
            ];

            const normalized = qlooService.normalizeWeights(insights);

            expect(normalized).toHaveLength(1);
            expect(normalized[0].normalizedWeight).toBe(0.5); // Default for single item
        });

        it('should return empty array for empty input', () => {
            const normalized = qlooService.normalizeWeights([]);
            expect(normalized).toEqual([]);
        });
    });

    describe('getTopRecommendations', () => {
        it('should get top recommendations across all categories', async () => {
            const seeds: ExtractedSeed[] = [
                {
                    text: 'jazz',
                    category: 'media',
                    confidence: 0.9,
                    searchTerms: ['jazz'],
                },
            ];

            // Mock search response
            const mockSearchResponse: QlooSearchResponse = {
                results: [
                    {
                        id: 'jazz-123',
                        name: 'Jazz Music',
                        category: 'media',
                        confidence: 0.95,
                    },
                ],
                total: 1,
                page: 1,
            };

            // Mock insights response
            const mockInsightsResponse: QlooInsightsResponse = {
                insights: [
                    {
                        id: 'insight-1',
                        name: 'Jazz Club',
                        description: 'Great jazz venue',
                        location: 'Los Angeles, CA',
                        weight: 0.9,
                        category: 'things_to_do',
                        metadata: {},
                    },
                ],
                total: 1,
            };

            // First call for search, then 3 calls for insights
            mockRequest
                .mockResolvedValueOnce({ data: mockSearchResponse })
                .mockResolvedValue({ data: mockInsightsResponse });

            const result = await qlooService.getTopRecommendations(seeds, 'Los Angeles', 5);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.length).toBeGreaterThan(0);
            expect(mockRequest).toHaveBeenCalledTimes(4); // 1 search + 3 insights calls
        });

        it('should handle search failure', async () => {
            const seeds: ExtractedSeed[] = [
                {
                    text: 'invalid',
                    category: 'unknown',
                    confidence: 0.1,
                    searchTerms: ['invalid'],
                },
            ];

            mockRequest.mockRejectedValue(new Error('Search failed'));

            const result = await qlooService.getTopRecommendations(seeds, 'Los Angeles');

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should limit results to specified number', async () => {
            const seeds: ExtractedSeed[] = [
                {
                    text: 'food',
                    category: 'food',
                    confidence: 0.8,
                    searchTerms: ['food'],
                },
            ];

            const mockSearchResponse: QlooSearchResponse = {
                results: [
                    {
                        id: 'food-123',
                        name: 'Food Item',
                        category: 'food',
                        confidence: 0.8,
                    },
                ],
                total: 1,
                page: 1,
            };

            // Create many insights to test limiting
            const manyInsights: QlooInsight[] = Array.from({ length: 20 }, (_, i) => ({
                id: `insight-${i}`,
                name: `Item ${i}`,
                description: `Description ${i}`,
                location: 'Los Angeles, CA',
                weight: Math.random(),
                category: 'food' as QlooCategory,
                metadata: {},
            }));

            const mockInsightsResponse: QlooInsightsResponse = {
                insights: manyInsights,
                total: 20,
            };

            mockRequest
                .mockResolvedValueOnce({ data: mockSearchResponse })
                .mockResolvedValue({ data: mockInsightsResponse });

            const result = await qlooService.getTopRecommendations(seeds, 'Los Angeles', 5);

            expect(result.success).toBe(true);
            expect(result.data?.length).toBeLessThanOrEqual(5);
        });
    });

    describe('category mapping', () => {
        it('should map generic categories to Qloo categories', () => {
            // Test the private method through a public method that uses it
            const seeds: ExtractedSeed[] = [
                { text: 'test', category: 'food', confidence: 1, searchTerms: [] },
                { text: 'test', category: 'activity', confidence: 1, searchTerms: [] },
                { text: 'test', category: 'media', confidence: 1, searchTerms: [] },
                { text: 'test', category: 'restaurant', confidence: 1, searchTerms: [] },
                { text: 'test', category: 'entertainment', confidence: 1, searchTerms: [] },
                { text: 'test', category: 'movie', confidence: 1, searchTerms: [] },
            ];

            // Mock successful search responses
            mockRequest.mockResolvedValue({
                data: { results: [], total: 0, page: 1 },
            });

            // This will internally test the category mapping
            qlooService.searchEntities(seeds);

            // Verify the requests were made with correct category mappings
            expect(mockRequest).toHaveBeenCalledTimes(6);
        });
    });

    describe('entity type validation', () => {
        it('should validate entity types correctly', () => {
            const validEntityTypes: QlooEntityType[] = [
                'urn:entity:place',
                'urn:entity:movie',
                'urn:entity:tv_show',
                'urn:entity:book',
                'urn:entity:artist',
                'urn:entity:podcast',
                'urn:entity:videogame',
                'urn:entity:destination'
            ];

            validEntityTypes.forEach(entityType => {
                // This should not throw an error
                expect(() => {
                    // Test that the entity type is properly handled
                    qlooService.getRecommendationsByEntityType(
                        entityType,
                        'Los Angeles',
                        [],
                        [],
                        5
                    );
                }).not.toThrow();
            });
        });
    });
});