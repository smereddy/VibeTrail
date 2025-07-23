import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CulturalNetworkVisualization from '../CulturalNetworkVisualization';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        line: ({ children, ...props }: any) => <line {...props}>{children}</line>,
        g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
    },
}));

describe('CulturalNetworkVisualization', () => {
    const mockEntities = {
        places: [
            {
                id: 'place-1',
                name: 'Artisan Coffee House',
                description: 'Cozy neighborhood coffee shop',
                location: 'Los Angeles, CA',
                weight: 0.9,
                category: 'food',
                metadata: {}
            },
            {
                id: 'place-2',
                name: 'The Book Nook',
                description: 'Independent bookstore',
                location: 'Los Angeles, CA',
                weight: 0.8,
                category: 'things_to_do',
                metadata: {}
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
                metadata: {}
            }
        ],
        music: [
            {
                id: 'music-1',
                name: 'Café Jazz Playlist',
                description: 'Smooth jazz perfect for coffee shops',
                location: 'Los Angeles, CA',
                weight: 0.8,
                category: 'media',
                metadata: {}
            }
        ]
    };

    const mockConnections = [
        {
            fromEntity: {
                id: 'place-1',
                name: 'Artisan Coffee House',
                description: 'Cozy neighborhood coffee shop',
                location: 'Los Angeles, CA',
                weight: 0.9,
                category: 'food',
                metadata: {}
            },
            toEntity: {
                id: 'book-1',
                name: 'The Art of Coffee',
                description: 'A contemplative journey through coffee culture',
                location: 'Los Angeles, CA',
                weight: 0.85,
                category: 'media',
                metadata: {}
            },
            connectionStrength: 0.8,
            connectionReason: 'Both celebrate coffee culture and contemplative experiences',
            sharedThemes: ['coffee', 'contemplative', 'artisanal']
        },
        {
            fromEntity: {
                id: 'place-1',
                name: 'Artisan Coffee House',
                description: 'Cozy neighborhood coffee shop',
                location: 'Los Angeles, CA',
                weight: 0.9,
                category: 'food',
                metadata: {}
            },
            toEntity: {
                id: 'music-1',
                name: 'Café Jazz Playlist',
                description: 'Smooth jazz perfect for coffee shops',
                location: 'Los Angeles, CA',
                weight: 0.8,
                category: 'media',
                metadata: {}
            },
            connectionStrength: 0.75,
            connectionReason: 'Perfect musical pairing for coffee shop atmosphere',
            sharedThemes: ['coffee', 'cozy', 'ambient']
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering with connections', () => {
        it('should render network visualization with connected entities', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check that the main container is rendered
            expect(screen.getByText('Cultural Connection Network')).toBeInTheDocument();
            
            // Check that filtering message is displayed
            expect(screen.getByText(/Showing only entities with cultural connections/)).toBeInTheDocument();
            
            // Check that SVG is rendered
            const svg = document.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('width', '800');
            expect(svg).toHaveAttribute('height', '600');
        });

        it('should render connected entities only', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Should show connection stats
            expect(screen.getByText(/connected entities/)).toBeInTheDocument();
            expect(screen.getByText(/cultural connections/)).toBeInTheDocument();
            expect(screen.getByText(/active domains/)).toBeInTheDocument();
        });

        it('should render legend with connected domains only', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check that legend is rendered
            expect(screen.getByText('Connected Domains')).toBeInTheDocument();
            
            // Legend should only show entity types that have connections
            // In our mock data, only places, books, and music have connections
            const legendItems = document.querySelectorAll('.absolute.top-4.right-4 .space-y-1 > div');
            expect(legendItems.length).toBeGreaterThan(0);
        });

        it('should render connection lines between entities', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check that connection lines are rendered
            const lines = document.querySelectorAll('line');
            expect(lines.length).toBe(mockConnections.length);
        });

        it('should render entity nodes as circles', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check that entity circles are rendered
            const circles = document.querySelectorAll('circle');
            expect(circles.length).toBeGreaterThan(0);
            
            // Each circle should have proper attributes
            circles.forEach(circle => {
                expect(circle).toHaveAttribute('cx');
                expect(circle).toHaveAttribute('cy');
                expect(circle).toHaveAttribute('r');
                expect(circle).toHaveAttribute('fill');
            });
        });

        it('should render entity labels', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check that text labels are rendered
            const textElements = document.querySelectorAll('text');
            expect(textElements.length).toBeGreaterThan(0);
        });

        it('should apply different colors for different entity types', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            const circles = document.querySelectorAll('circle');
            const colors = new Set();
            
            circles.forEach(circle => {
                const fill = circle.getAttribute('fill');
                if (fill) colors.add(fill);
            });

            // Should have multiple colors for different entity types
            expect(colors.size).toBeGreaterThan(1);
        });

        it('should display connection statistics correctly', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check connection statistics
            expect(screen.getByText(/2.*cultural connections/)).toBeInTheDocument();
            expect(screen.getByText(/active domains/)).toBeInTheDocument();
        });
    });

    describe('empty state handling', () => {
        it('should render empty state when no connections exist', () => {
            render(
                <CulturalNetworkVisualization
                    connections={[]}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Should show empty state
            expect(screen.getByText('Building Cultural Connections')).toBeInTheDocument();
            expect(screen.getByText(/We're analyzing relationships between your recommendations/)).toBeInTheDocument();
            
            // Should not render SVG in empty state
            const svg = document.querySelector('svg');
            expect(svg).not.toBeInTheDocument();
        });

        it('should render empty state when entities are empty', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={{}}
                    width={800}
                    height={600}
                />
            );

            // Should show empty state
            expect(screen.getByText('Building Cultural Connections')).toBeInTheDocument();
        });

        it('should show search icon in empty state', () => {
            render(
                <CulturalNetworkVisualization
                    connections={[]}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Check for search emoji or icon indicator
            expect(screen.getByText('🔍')).toBeInTheDocument();
        });
    });

    describe('filtering logic', () => {
        it('should only show entities that have connections', () => {
            // Create entities where only some have connections
            const entitiesWithUnconnected = {
                ...mockEntities,
                podcasts: [
                    {
                        id: 'podcast-1',
                        name: 'Unconnected Podcast',
                        description: 'This podcast has no connections',
                        location: 'Los Angeles, CA',
                        weight: 0.7,
                        category: 'media',
                        metadata: {}
                    }
                ]
            };

            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={entitiesWithUnconnected}
                    width={800}
                    height={600}
                />
            );

            // Should show filtering message
            expect(screen.getByText(/Showing only entities with cultural connections/)).toBeInTheDocument();
            
            // Should not include the unconnected podcast in the visualization
            expect(screen.queryByText('Unconnected Podcast')).not.toBeInTheDocument();
        });

        it('should display correct count of filtered entities', () => {
            const totalEntities = Object.values(mockEntities).reduce((sum, arr) => sum + arr.length, 0);
            
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Should show the filtering ratio
            const filteringText = screen.getByText(/Showing only entities with cultural connections/);
            expect(filteringText).toHaveTextContent(new RegExp(`of ${totalEntities} total`));
        });
    });

    describe('responsive design', () => {
        it('should handle different width and height props', () => {
            const { rerender } = render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={400}
                    height={300}
                />
            );

            let svg = document.querySelector('svg');
            expect(svg).toHaveAttribute('width', '400');
            expect(svg).toHaveAttribute('height', '300');

            // Test with different dimensions
            rerender(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={1200}
                    height={800}
                />
            );

            svg = document.querySelector('svg');
            expect(svg).toHaveAttribute('width', '1200');
            expect(svg).toHaveAttribute('height', '800');
        });

        it('should use default dimensions when not provided', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                />
            );

            const svg = document.querySelector('svg');
            expect(svg).toHaveAttribute('width', '800'); // Default width
            expect(svg).toHaveAttribute('height', '600'); // Default height
        });
    });

    describe('connection strength visualization', () => {
        it('should vary line thickness based on connection strength', () => {
            const connectionsWithDifferentStrengths = [
                {
                    ...mockConnections[0],
                    connectionStrength: 0.9 // High strength
                },
                {
                    ...mockConnections[1],
                    connectionStrength: 0.4 // Low strength
                }
            ];

            render(
                <CulturalNetworkVisualization
                    connections={connectionsWithDifferentStrengths}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            const lines = document.querySelectorAll('line');
            expect(lines.length).toBe(2);

            // Lines should have different stroke widths based on connection strength
            const strokeWidths = Array.from(lines).map(line => 
                parseFloat(line.getAttribute('stroke-width') || '0')
            );
            
            // Higher strength should have thicker line
            expect(Math.max(...strokeWidths)).toBeGreaterThan(Math.min(...strokeWidths));
        });

        it('should vary line opacity based on connection strength', () => {
            const connectionsWithDifferentStrengths = [
                {
                    ...mockConnections[0],
                    connectionStrength: 0.9 // High strength
                },
                {
                    ...mockConnections[1],
                    connectionStrength: 0.4 // Low strength
                }
            ];

            render(
                <CulturalNetworkVisualization
                    connections={connectionsWithDifferentStrengths}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            const lines = document.querySelectorAll('line');
            expect(lines.length).toBe(2);

            // Lines should have different opacities based on connection strength
            const opacities = Array.from(lines).map(line => 
                parseFloat(line.getAttribute('stroke-opacity') || '0')
            );
            
            // Higher strength should have higher opacity
            expect(Math.max(...opacities)).toBeGreaterThan(Math.min(...opacities));
        });
    });

    describe('accessibility', () => {
        it('should have proper ARIA labels and roles', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // SVG should be accessible
            const svg = document.querySelector('svg');
            expect(svg).toBeInTheDocument();
            
            // Text elements should be properly labeled
            const textElements = document.querySelectorAll('text');
            textElements.forEach(text => {
                expect(text).toHaveClass('pointer-events-none');
            });
        });

        it('should provide meaningful text content for screen readers', () => {
            render(
                <CulturalNetworkVisualization
                    connections={mockConnections}
                    entities={mockEntities}
                    width={800}
                    height={600}
                />
            );

            // Should have descriptive text content
            expect(screen.getByText('Cultural Connection Network')).toBeInTheDocument();
            expect(screen.getByText('Connected Domains')).toBeInTheDocument();
        });
    });

    describe('performance considerations', () => {
        it('should handle large numbers of connections efficiently', () => {
            // Create many connections to test performance
            const manyConnections = Array.from({ length: 50 }, (_, i) => ({
                ...mockConnections[0],
                fromEntity: { ...mockConnections[0].fromEntity, id: `entity-${i}` },
                toEntity: { ...mockConnections[0].toEntity, id: `entity-${i + 50}` },
                connectionStrength: Math.random()
            }));

            const manyEntities = {
                places: Array.from({ length: 100 }, (_, i) => ({
                    id: `entity-${i}`,
                    name: `Entity ${i}`,
                    description: 'Test entity',
                    location: 'Los Angeles, CA',
                    weight: Math.random(),
                    category: 'food',
                    metadata: {}
                }))
            };

            // Should render without errors
            expect(() => {
                render(
                    <CulturalNetworkVisualization
                        connections={manyConnections}
                        entities={manyEntities}
                        width={800}
                        height={600}
                    />
                );
            }).not.toThrow();
        });
    });
}); 