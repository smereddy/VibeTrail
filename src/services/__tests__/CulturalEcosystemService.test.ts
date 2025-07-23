import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CulturalEcosystemService } from '../CulturalEcosystemService';
import { QlooService } from '../QlooService';
import { OpenAIService } from '../OpenAIService';
import {
    ExtractedSeed,
    VibeContext,
    QlooInsight,
    APIResponse,
} from '../../types';

// Mock the services
vi.mock('../QlooService');
vi.mock('../OpenAIService');

// Mock fetch for ecosystem analysis API
global.fetch = vi.fn();

describe('CulturalEcosystemService', () => {
    let culturalEcosystemService: CulturalEcosystemService;
    let mockQlooService: vi.Mocked<QlooService>;
    let mockOpenAIService: vi.Mocked<OpenAIService>;

    const mockSeeds: ExtractedSeed[] = [
        {
            text: 'cozy coffee shop',
            category: 'food',
            confidence: 0.9,
            searchTerms: ['coffee', 'cozy', 'artisan']
        },
        {
            text: 'indie bookstore',
            category: 'activity',
            confidence: 0.8,
            searchTerms: ['books', 'indie', 'reading']
        }
    ];

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

    const mockEntities = {
        places: [
            {
                id: 'place-1',
                name: 'Artisan Coffee House',
                description: 'Cozy neighborhood coffee shop with local art',
                location: 'Los Angeles, CA',
                weight: 0.9,
                category: 'food',
                metadata: { address: '123 Main St', rating: 4.5 }
            },
            {
                id: 'place-2', 
                name: 'The Book Nook',
                description: 'Independent bookstore with reading corners',
                location: 'Los Angeles, CA',
                weight: 0.8,
                category: 'things_to_do',
                metadata: { address: '456 Oak Ave', rating: 4.7 }
            }
        ],
        books: [
            {
                id: 'book-1',
                name: 'The Art of Coffee',
                description: 'A contemplative journey through coffee culture',
                location: 'Los Angeles, CA',
                weight: 0.85,
                category: 'media',
                metadata: { author: 'Jane Smith', pages: 280 }
            }
        ],
        music: [
            {
                id: 'music-1',
                name: 'Café Jazz Playlist',
                description: 'Smooth jazz perfect for coffee shop ambiance',
                location: 'Los Angeles, CA',
                weight: 0.8,
                category: 'media',
                metadata: { artist: 'Various Artists', genre: 'Jazz' }
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Create mocked instances
        mockQlooService = {
            getRecommendationsByEntityType: vi.fn(),
        } as any;
        
        mockOpenAIService = {
            generateResponse: vi.fn(),
        } as any;

        culturalEcosystemService = new CulturalEcosystemService();
        
        // Replace the services with mocks
        (culturalEcosystemService as any).qlooService = mockQlooService;
        (culturalEcosystemService as any).openaiService = mockOpenAIService;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('buildCulturalEcosystem', () => {
        it('should build a complete cultural ecosystem from vibe and seeds', async () => {
            // Mock successful API responses for all entity types
            mockQlooService.getRecommendationsByEntityType.mockImplementation(async (entityType) => {
                const entityKey = entityType.split(':').pop();
                return {
                    success: true,
                    data: mockEntities[entityKey as keyof typeof mockEntities] || []
                };
            });

            // Mock AI ecosystem analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'A contemplative cultural ecosystem centered around artisanal experiences.'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'cozy coffee shop vibes',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.coreVibe).toBe('cozy coffee shop vibes');
            expect(result.data?.primarySeeds).toEqual(mockSeeds);
            expect(result.data?.entities).toBeDefined();
            expect(result.data?.connections).toBeDefined();
            expect(result.data?.culturalThemes).toBeDefined();
            expect(result.data?.insights).toBeDefined();
            expect(result.data?.ecosystemScore).toBeGreaterThanOrEqual(0);
        });

        it('should handle API failures gracefully', async () => {
            // Mock API failure
            mockQlooService.getRecommendationsByEntityType.mockResolvedValue({
                success: false,
                error: {
                    code: 'API_ERROR',
                    message: 'Failed to get recommendations',
                    timestamp: new Date(),
                    service: 'qloo'
                }
            });

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'test vibe',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true); // Should still succeed with minimal ecosystem
            expect(result.data?.insights).toBeDefined();
            expect(result.data?.insights[0].title).toContain('Limited Data Available');
        });

        it('should calculate ecosystem coherence score correctly', async () => {
            // Mock successful responses with good data
            mockQlooService.getRecommendationsByEntityType.mockImplementation(async (entityType) => {
                const entityKey = entityType.split(':').pop();
                return {
                    success: true,
                    data: mockEntities[entityKey as keyof typeof mockEntities] || []
                };
            });

            // Mock AI analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'Test narrative'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'cozy coffee shop vibes',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            expect(result.data?.ecosystemScore).toBeGreaterThan(0);
            expect(result.data?.ecosystemScore).toBeLessThanOrEqual(1);
        });
    });

    describe('buildCulturalEcosystemFromTasteItems', () => {
        const mockTasteItems = [
            {
                id: 'taste-1',
                name: 'Blue Bottle Coffee',
                description: 'Artisanal coffee roastery',
                category: 'food',
                location: 'Los Angeles, CA',
                tasteStrength: 0.9,
                rating: 4.5
            },
            {
                id: 'taste-2',
                name: 'The Last Bookstore',
                description: 'Massive independent bookstore',
                category: 'activity',
                location: 'Los Angeles, CA',
                tasteStrength: 0.8,
                rating: 4.7
            },
            {
                id: 'taste-3',
                name: 'Norah Jones',
                description: 'Jazz and folk singer',
                category: 'artist',
                location: 'Los Angeles, CA',
                tasteStrength: 0.85,
                rating: 4.6
            }
        ];

        it('should build ecosystem from existing taste items', async () => {
            // Mock AI ecosystem analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [
                            {
                                fromEntity: 'Blue Bottle Coffee',
                                toEntity: 'Norah Jones',
                                connectionStrength: 0.8,
                                connectionReason: 'Both embody artisanal, contemplative experiences',
                                sharedThemes: ['artisanal', 'contemplative'],
                                psychologicalInsight: 'Reflects appreciation for craftsmanship and mindful experiences'
                            }
                        ],
                        aiThemes: [
                            {
                                theme: 'Artisanal Appreciation',
                                strength: 0.85,
                                description: 'Strong preference for handcrafted, authentic experiences',
                                psychologicalMeaning: 'Values quality and authenticity over mass production',
                                entityTypes: ['food', 'media'],
                                examples: ['Blue Bottle Coffee', 'Norah Jones']
                            }
                        ],
                        aiInsights: [
                            {
                                type: 'psychological',
                                title: 'Contemplative Curator',
                                description: 'Your choices reflect a thoughtful approach to cultural consumption',
                                confidence: 0.9,
                                supportingEntities: ['Blue Bottle Coffee', 'The Last Bookstore'],
                                actionableAdvice: 'Explore more artisanal experiences in your city'
                            }
                        ],
                        ecosystemNarrative: 'Your cultural ecosystem reveals a contemplative curator who values authentic, artisanal experiences across domains.'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystemFromTasteItems(
                'artisanal experiences',
                'Los Angeles',
                mockVibeContext,
                mockSeeds,
                mockTasteItems
            );

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.entities).toBeDefined();
            expect(result.data?.connections.length).toBeGreaterThan(0);
            expect(result.data?.culturalThemes.length).toBeGreaterThan(0);
            expect(result.data?.insights.length).toBeGreaterThan(0);
            expect(result.data?.ecosystemNarrative).toContain('contemplative curator');
        });

        it('should handle insufficient entities gracefully', async () => {
            const singleItem = [mockTasteItems[0]]; // Only one item

            const result = await culturalEcosystemService.buildCulturalEcosystemFromTasteItems(
                'test vibe',
                'Los Angeles',
                mockVibeContext,
                mockSeeds,
                singleItem
            );

            expect(result.success).toBe(true);
            expect(result.data?.insights).toBeDefined();
            expect(result.data?.insights[0].title).toContain('Limited Data');
        });

        it('should map taste item categories to entity types correctly', async () => {
            const diverseItems = [
                { ...mockTasteItems[0], category: 'food' },
                { ...mockTasteItems[1], category: 'activity' },
                { ...mockTasteItems[2], category: 'artist' },
                { id: 'taste-4', name: 'Inception', category: 'movie', tasteStrength: 0.8, location: 'Los Angeles, CA' },
                { id: 'taste-5', name: 'Breaking Bad', category: 'tv_show', tasteStrength: 0.9, location: 'Los Angeles, CA' }
            ];

            // Mock AI analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'Diverse cultural interests'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystemFromTasteItems(
                'diverse interests',
                'Los Angeles',
                mockVibeContext,
                mockSeeds,
                diverseItems
            );

            expect(result.success).toBe(true);
            expect(result.data?.entities).toBeDefined();
            
            // Check that different entity types were created
            const entityTypes = Object.keys(result.data?.entities || {});
            expect(entityTypes.length).toBeGreaterThan(2);
        });
    });

    describe('AI ecosystem analysis', () => {
        it('should handle AI analysis API errors gracefully', async () => {
            // Mock successful Qloo responses
            mockQlooService.getRecommendationsByEntityType.mockImplementation(async () => ({
                success: true,
                data: mockEntities.places
            }));

            // Mock AI API failure
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Internal server error' })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'test vibe',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            // Should still succeed with algorithmic analysis only
            expect(result.success).toBe(true);
            expect(result.data?.insights).toBeDefined();
        });

        it('should process AI analysis response correctly', async () => {
            // Mock Qloo responses
            mockQlooService.getRecommendationsByEntityType.mockImplementation(async () => ({
                success: true,
                data: mockEntities.places
            }));

            // Mock comprehensive AI response
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [
                            {
                                fromEntity: 'Artisan Coffee House',
                                toEntity: 'The Book Nook',
                                connectionStrength: 0.85,
                                connectionReason: 'Both create contemplative spaces for slow living',
                                sharedThemes: ['contemplative', 'artisanal', 'community'],
                                psychologicalInsight: 'Reflects desire for authentic, mindful experiences'
                            }
                        ],
                        aiThemes: [
                            {
                                theme: 'Contemplative Spaces',
                                strength: 0.9,
                                description: 'Preference for environments that encourage reflection and mindfulness',
                                psychologicalMeaning: 'Values depth over speed, quality over quantity',
                                entityTypes: ['places', 'books'],
                                examples: ['Artisan Coffee House', 'The Book Nook']
                            }
                        ],
                        aiInsights: [
                            {
                                type: 'psychological',
                                title: 'Mindful Experience Seeker',
                                description: 'Your preferences reveal someone who values depth, authenticity, and contemplative experiences over fast-paced entertainment.',
                                confidence: 0.92,
                                supportingEntities: ['Artisan Coffee House', 'The Book Nook'],
                                actionableAdvice: 'Seek out more third spaces that combine multiple interests - like bookstore cafés or gallery libraries.'
                            }
                        ],
                        ecosystemNarrative: 'Your cultural ecosystem centers around the art of slow living - spaces and experiences that invite contemplation, foster genuine connections, and celebrate craftsmanship. This reveals someone who finds meaning in depth rather than breadth, preferring authentic experiences that nourish both mind and soul.'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'contemplative spaces',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            expect(result.data?.connections.length).toBeGreaterThan(0);
            expect(result.data?.culturalThemes.length).toBeGreaterThan(0);
            expect(result.data?.insights.length).toBeGreaterThan(0);
            expect(result.data?.ecosystemNarrative).toContain('slow living');
            
            // Check AI-enhanced connections
            const aiConnection = result.data?.connections.find(c => 
                c.connectionReason.includes('contemplative spaces')
            );
            expect(aiConnection).toBeDefined();
            expect(aiConnection?.psychologicalInsight).toBeDefined();
        });
    });

    describe('connection discovery algorithm', () => {
        it('should discover connections between related entities', async () => {
            const testEntities = {
                places: [
                    {
                        id: 'coffee-1',
                        name: 'Artisan Coffee',
                        description: 'Cozy neighborhood coffee shop with local art and indie music',
                        location: 'Los Angeles, CA',
                        weight: 0.9,
                        category: 'food',
                        metadata: {}
                    }
                ],
                music: [
                    {
                        id: 'music-1',
                        name: 'Indie Folk Playlist',
                        description: 'Cozy acoustic music perfect for coffee shops',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'media',
                        metadata: {}
                    }
                ]
            };

            // Mock Qloo service to return our test entities
            mockQlooService.getRecommendationsByEntityType.mockImplementation(async (entityType) => {
                const entityKey = entityType.split(':').pop();
                return {
                    success: true,
                    data: testEntities[entityKey as keyof typeof testEntities] || []
                };
            });

            // Mock AI analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'Test narrative'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'cozy coffee shop vibes',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            expect(result.data?.connections.length).toBeGreaterThan(0);
            
            // Should find connection based on shared themes like "cozy"
            const connection = result.data?.connections[0];
            expect(connection?.sharedThemes.length).toBeGreaterThan(0);
            expect(connection?.connectionStrength).toBeGreaterThan(0.3);
        });

        it('should handle entities with no clear connections', async () => {
            const unrelatedEntities = {
                places: [
                    {
                        id: 'place-1',
                        name: 'Generic Restaurant',
                        description: 'A restaurant',
                        location: 'Los Angeles, CA',
                        weight: 0.5,
                        category: 'food',
                        metadata: {}
                    }
                ],
                books: [
                    {
                        id: 'book-1',
                        name: 'Technical Manual',
                        description: 'Technical documentation',
                        location: 'Los Angeles, CA',
                        weight: 0.4,
                        category: 'media',
                        metadata: {}
                    }
                ]
            };

            mockQlooService.getRecommendationsByEntityType.mockImplementation(async (entityType) => {
                const entityKey = entityType.split(':').pop();
                return {
                    success: true,
                    data: unrelatedEntities[entityKey as keyof typeof unrelatedEntities] || []
                };
            });

            // Mock AI analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'Test narrative'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'test vibe',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            // Should still create base connections even for unrelated entities
            expect(result.data?.connections.length).toBeGreaterThanOrEqual(1);
            
            // Base connection should have minimum strength
            const connection = result.data?.connections[0];
            expect(connection?.connectionStrength).toBeGreaterThanOrEqual(0.35);
        });
    });

    describe('theme extraction', () => {
        it('should extract cultural themes from connections', async () => {
            const thematicEntities = {
                places: [
                    {
                        id: 'place-1',
                        name: 'Artisan Bakery',
                        description: 'Traditional handcrafted breads and pastries',
                        location: 'Los Angeles, CA',
                        weight: 0.9,
                        category: 'food',
                        metadata: {}
                    }
                ],
                books: [
                    {
                        id: 'book-1',
                        name: 'The Art of Bread Making',
                        description: 'Traditional techniques for artisan baking',
                        location: 'Los Angeles, CA',
                        weight: 0.8,
                        category: 'media',
                        metadata: {}
                    }
                ]
            };

            mockQlooService.getRecommendationsByEntityType.mockImplementation(async (entityType) => {
                const entityKey = entityType.split(':').pop();
                return {
                    success: true,
                    data: thematicEntities[entityKey as keyof typeof thematicEntities] || []
                };
            });

            // Mock AI analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'Test narrative'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'artisan crafts',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            expect(result.data?.culturalThemes.length).toBeGreaterThan(0);
            
            // Should extract "artisan" and "traditional" themes
            const themes = result.data?.culturalThemes.map(t => t.theme) || [];
            expect(themes.some(theme => theme.includes('artisan') || theme.includes('traditional'))).toBe(true);
        });

        it('should generate fallback themes when no connections exist', async () => {
            const singleEntityType = {
                places: [
                    {
                        id: 'place-1',
                        name: 'Restaurant',
                        description: 'A place to eat',
                        location: 'Los Angeles, CA',
                        weight: 0.5,
                        category: 'food',
                        metadata: {}
                    }
                ]
            };

            mockQlooService.getRecommendationsByEntityType.mockImplementation(async (entityType) => {
                const entityKey = entityType.split(':').pop();
                return {
                    success: true,
                    data: singleEntityType[entityKey as keyof typeof singleEntityType] || []
                };
            });

            // Mock AI analysis
            const mockFetch = fetch as vi.MockedFunction<typeof fetch>;
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        aiConnections: [],
                        aiThemes: [],
                        aiInsights: [],
                        ecosystemNarrative: 'Test narrative'
                    }
                })
            } as Response);

            const result = await culturalEcosystemService.buildCulturalEcosystem(
                'food preferences',
                'Los Angeles',
                mockVibeContext,
                mockSeeds
            );

            expect(result.success).toBe(true);
            expect(result.data?.culturalThemes.length).toBeGreaterThan(0);
            
            // Should have fallback theme based on entity type
            const themes = result.data?.culturalThemes.map(t => t.theme) || [];
            expect(themes.some(theme => theme.includes('places'))).toBe(true);
        });
    });
}); 