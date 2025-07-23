import { QlooService, QlooEntityType } from './QlooService';
import { OpenAIService } from './OpenAIService';
import { 
  ExtractedSeed, 
  VibeContext, 
  APIResponse,
  QlooInsight 
} from '../types';

/**
 * Cultural Ecosystem Interfaces
 */
export interface CulturalConnection {
  fromEntity: QlooInsight;
  toEntity: QlooInsight;
  connectionStrength: number;
  connectionReason: string;
  sharedThemes: string[];
  psychologicalInsight?: string;
}

export interface CulturalEcosystem {
  coreVibe: string;
  primarySeeds: ExtractedSeed[];
  entities: {
    [entityType: string]: QlooInsight[];
  };
  connections: CulturalConnection[];
  culturalThemes: CulturalTheme[];
  ecosystemScore: number;
  insights: CulturalInsight[];
  ecosystemNarrative?: string;
}

export interface CulturalTheme {
  theme: string;
  strength: number;
  entityTypes: QlooEntityType[];
  examples: string[];
  description: string;
  psychologicalMeaning?: string;
}

export interface CulturalInsight {
  type: 'pattern' | 'trend' | 'connection' | 'recommendation' | 'psychological';
  title: string;
  description: string;
  confidence: number;
  supportingEntities: string[];
  actionableAdvice?: string;
}

/**
 * Cross-Domain Cultural Recommendation Engine
 * 
 * This service discovers and maps cultural connections across all entity types,
 * creating rich ecosystems of related experiences, places, media, and activities.
 */
export class CulturalEcosystemService {
  private qlooService: QlooService;
  private openaiService: OpenAIService;

  constructor() {
    this.qlooService = new QlooService();
    this.openaiService = new OpenAIService();
  }

  /**
   * Build a comprehensive cultural ecosystem from a vibe
   * This is the main entry point for cross-domain recommendations
   */
  async buildCulturalEcosystem(
    vibe: string,
    city: string,
    vibeContext: VibeContext,
    seeds: ExtractedSeed[]
  ): Promise<APIResponse<CulturalEcosystem>> {
    try {
      console.log('🌍 Building cultural ecosystem for:', vibe, 'in', city);
      console.log('🌍 Seeds provided:', seeds.length);
      console.log('🌍 Vibe context:', vibeContext);

      // Step 1: Get recommendations from all relevant entity types
      const entityRecommendations = await this.getMultiEntityRecommendations(
        city, 
        vibeContext, 
        seeds
      );

      console.log('🌍 Entity recommendations result:', entityRecommendations.success, entityRecommendations.data ? Object.keys(entityRecommendations.data) : 'no data');

      if (!entityRecommendations.success || !entityRecommendations.data) {
        console.warn('⚠️ No entity recommendations, creating minimal ecosystem');
        // Create a minimal ecosystem even if we have no API data
        const minimalEcosystem: CulturalEcosystem = {
          coreVibe: vibe,
          primarySeeds: seeds,
          entities: {},
          connections: [],
          culturalThemes: [],
          ecosystemScore: 0,
          insights: [{
            type: 'recommendation',
            title: 'Limited Data Available',
            description: 'We couldn\'t gather enough cultural data to build a full ecosystem. This might be due to API limitations or limited data for your vibe.',
            confidence: 0.5,
            supportingEntities: []
          }]
        };
        
        return {
          data: minimalEcosystem,
          success: true
        };
      }

      // Step 2: Discover cross-domain connections
      const connections = await this.discoverCulturalConnections(
        entityRecommendations.data,
        seeds
      );

      // Step 3: Extract cultural themes
      const culturalThemes = await this.extractCulturalThemes(
        entityRecommendations.data,
        connections,
        vibe
      );

      // Step 4: Generate AI-powered cultural insights
      const insights = await this.generateCulturalInsights(
        vibe,
        entityRecommendations.data,
        connections,
        culturalThemes
      );

      // Step 5: Calculate ecosystem coherence score
      const ecosystemScore = this.calculateEcosystemScore(
        connections,
        culturalThemes,
        entityRecommendations.data
      );

      const ecosystem: CulturalEcosystem = {
        coreVibe: vibe,
        primarySeeds: seeds,
        entities: entityRecommendations.data,
        connections,
        culturalThemes,
        ecosystemScore,
        insights
      };

      console.log('✅ Cultural ecosystem built:', {
        entityTypes: Object.keys(ecosystem.entities).length,
        connections: connections.length,
        themes: culturalThemes.length,
        score: ecosystemScore
      });

      return {
        data: ecosystem,
        success: true
      };

    } catch (error) {
      console.error('❌ Error building cultural ecosystem:', error);
      return {
        error: {
          code: 'ECOSYSTEM_BUILD_ERROR',
          message: 'Failed to build cultural ecosystem',
          details: error,
          timestamp: new Date(),
          service: 'cultural-ecosystem'
        },
        success: false
      };
    }
  }

  /**
   * Build cultural ecosystem from existing TasteItems (fallback method)
   * This avoids additional API calls and uses data already loaded
   */
  async buildCulturalEcosystemFromTasteItems(
    vibe: string,
    city: string,
    vibeContext: VibeContext,
    seeds: ExtractedSeed[],
    tasteItems: any[],
    culturalInsights?: any
  ): Promise<APIResponse<CulturalEcosystem>> {
    try {
      console.log('🌍 Building cultural ecosystem from existing taste items:', tasteItems.length);
      console.log('🌍 Sample taste items:', tasteItems.slice(0, 3).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category
      })));

      // Group taste items by category to create entities
      const entities: { [entityType: string]: QlooInsight[] } = {};
      
      tasteItems.forEach(item => {
        // Convert TasteItem to QlooInsight format
        const insight: QlooInsight = {
          id: item.id,
          name: item.name,
          description: item.description,
          location: item.location,
          weight: item.tasteStrength,
          category: item.category === 'artist' ? 'media' : 
                   item.category === 'movie' || item.category === 'tv_show' || item.category === 'book' || item.category === 'podcast' ? 'media' :
                   item.category === 'activity' ? 'things_to_do' : 'food',
          metadata: {
            address: item.location,
            phone: item.phone,
            website: item.website,
            rating: item.rating,
            priceLevel: item.priceRange?.length,
            businessHours: item.businessHours
          }
        };

        // Group by entity type for ecosystem
        const entityType = this.mapCategoryToEntityType(item.category);
        if (!entities[entityType]) {
          entities[entityType] = [];
        }
        entities[entityType].push(insight);
      });

      console.log('🎯 Grouped entities:', Object.keys(entities).map(key => `${key}: ${entities[key].length}`));

      // If we have enough entities, build connections and themes
      const entityTypeCount = Object.keys(entities).length;
      console.log('🎯 Entity type count:', entityTypeCount, 'Required: 2+');
      
      if (entityTypeCount >= 2) {
        console.log('✅ Sufficient entities for full AI analysis, proceeding...');
        // Step 2: Discover cross-domain connections
        const connections = await this.discoverCulturalConnections(entities, seeds);

        // Step 3: Extract cultural themes
        const culturalThemes = await this.extractCulturalThemes(entities, connections, vibe);

        // Step 4: Perform AI-powered deep ecosystem analysis
        console.log('🤖 Starting AI ecosystem analysis...', {
          vibe,
          city,
          entitiesCount: Object.keys(entities).length,
          connectionsCount: connections.length,
          themesCount: culturalThemes.length
        });
        
        const aiAnalysis = await this.performAIEcosystemAnalysis(
          vibe, 
          city, 
          entities, 
          connections, 
          culturalThemes, 
          culturalInsights
        );
        
        console.log('🤖 AI analysis result:', {
          aiConnections: aiAnalysis.aiConnections.length,
          aiThemes: aiAnalysis.aiThemes.length,
          aiInsights: aiAnalysis.aiInsights.length,
          hasNarrative: !!aiAnalysis.ecosystemNarrative,
          narrativePreview: aiAnalysis.ecosystemNarrative?.substring(0, 100) + '...'
        });

        // Step 5: Merge AI analysis with algorithmic results
        const enhancedConnections = [...connections, ...aiAnalysis.aiConnections];
        const enhancedThemes = [...culturalThemes, ...aiAnalysis.aiThemes];
        
        // Step 6: Use AI insights from initial call + deep analysis
        const baseInsights = culturalInsights 
          ? this.processCulturalInsights(culturalInsights, entities, connections, culturalThemes)
          : await this.generateCulturalInsights(vibe, entities, connections, culturalThemes);
        
        const allInsights = [...baseInsights, ...aiAnalysis.aiInsights];

        // Step 7: Calculate ecosystem coherence score with enhanced data
        const ecosystemScore = this.calculateEcosystemScore(enhancedConnections, enhancedThemes, entities);

        const ecosystem: CulturalEcosystem = {
          coreVibe: vibe,
          primarySeeds: seeds,
          entities,
          connections: enhancedConnections,
          culturalThemes: enhancedThemes,
          ecosystemScore,
          insights: allInsights,
          ecosystemNarrative: aiAnalysis.ecosystemNarrative
        };

        console.log('✅ Cultural ecosystem built from taste items:', {
          entityTypes: Object.keys(ecosystem.entities).length,
          connections: connections.length,
          themes: culturalThemes.length,
          score: ecosystemScore
        });

        return {
          data: ecosystem,
          success: true
        };
      } else {
        console.log('⚠️ Insufficient entities for full analysis, creating minimal ecosystem');
        // Create minimal ecosystem
        const minimalEcosystem: CulturalEcosystem = {
          coreVibe: vibe,
          primarySeeds: seeds,
          entities,
          connections: [],
          culturalThemes: [],
          ecosystemScore: 0.3,
          insights: [{
            type: 'recommendation',
            title: 'Simple Cultural Profile',
            description: `Your ${vibe} vibe in ${city} shows preferences across ${Object.keys(entities).length} cultural domains. Try different vibes to discover more connections!`,
            confidence: 0.7,
            supportingEntities: Object.keys(entities)
          }]
        };

        return {
          data: minimalEcosystem,
          success: true
        };
      }

    } catch (error) {
      console.error('❌ Error building cultural ecosystem from taste items:', error);
      return {
        error: {
          code: 'ECOSYSTEM_BUILD_ERROR',
          message: 'Failed to build cultural ecosystem from existing data',
          details: error,
          timestamp: new Date(),
          service: 'cultural-ecosystem'
        },
        success: false
      };
    }
  }

  /**
   * Get recommendations from multiple entity types simultaneously
   */
  private async getMultiEntityRecommendations(
    city: string,
    vibeContext: VibeContext,
    seeds: ExtractedSeed[]
  ): Promise<APIResponse<{ [entityType: string]: QlooInsight[] }>> {
    
    // Define all entity types we want to explore
    const entityConfigs = [
      {
        type: 'urn:entity:place' as QlooEntityType,
        tags: ['urn:tag:genre:place:restaurant', 'urn:tag:category:place:venue'],
        name: 'places'
      },
      {
        type: 'urn:entity:artist' as QlooEntityType,
        tags: ['urn:tag:genre:music'],
        name: 'music'
      },
      {
        type: 'urn:entity:movie' as QlooEntityType,
        tags: [],
        name: 'movies'
      },
      {
        type: 'urn:entity:book' as QlooEntityType,
        tags: ['urn:tag:genre:book'],
        name: 'books'
      },
      {
        type: 'urn:entity:tv_show' as QlooEntityType,
        tags: [],
        name: 'tv_shows'
      },
      {
        type: 'urn:entity:destination' as QlooEntityType,
        tags: [],
        name: 'destinations'
      },
      {
        type: 'urn:entity:podcast' as QlooEntityType,
        tags: [],
        name: 'podcasts'
      },
      {
        type: 'urn:entity:brand' as QlooEntityType,
        tags: [],
        name: 'brands'
      }
    ];

    try {
      console.log('🎯 Attempting to get recommendations for entity types:', entityConfigs.map(c => c.name));
      
      // Get recommendations from all entity types in parallel
      const recommendationPromises = entityConfigs.map(async (config) => {
        console.log(`🔍 Calling Qloo API for ${config.name} (${config.type})`);
        const response = await this.qlooService.getRecommendationsByEntityType(
          config.type,
          city,
          config.tags,
          seeds,
          8 // Get more items for richer ecosystem
        );
        
        console.log(`📊 ${config.name} response:`, response.success, response.data ? response.data.length : 0, 'items');
        
        return {
          name: config.name,
          type: config.type,
          recommendations: response.success ? response.data || [] : []
        };
      });

      const results = await Promise.all(recommendationPromises);

      // Organize results by entity type
      const organizedResults: { [entityType: string]: QlooInsight[] } = {};
      results.forEach(result => {
        if (result.recommendations.length > 0) {
          organizedResults[result.name] = result.recommendations;
        }
      });

      console.log('🎯 Multi-entity recommendations:', 
        Object.keys(organizedResults).map(key => 
          `${key}: ${organizedResults[key].length}`
        ).join(', ')
      );

      return {
        data: organizedResults,
        success: true
      };

    } catch (error) {
      return {
        error: {
          code: 'MULTI_ENTITY_ERROR',
          message: 'Failed to get multi-entity recommendations',
          details: error,
          timestamp: new Date(),
          service: 'cultural-ecosystem'
        },
        success: false
      };
    }
  }

  /**
   * Discover connections between entities across different domains
   */
  private async discoverCulturalConnections(
    entities: { [entityType: string]: QlooInsight[] },
    seeds: ExtractedSeed[]
  ): Promise<CulturalConnection[]> {
    const connections: CulturalConnection[] = [];
    const entityTypes = Object.keys(entities);

    // Create connections between different entity types
    for (let i = 0; i < entityTypes.length; i++) {
      for (let j = i + 1; j < entityTypes.length; j++) {
        const type1 = entityTypes[i];
        const type2 = entityTypes[j];
        
        const entities1 = entities[type1];
        const entities2 = entities[type2];

        // Find connections between entities of different types
        for (const entity1 of entities1.slice(0, 3)) { // Limit for performance
          for (const entity2 of entities2.slice(0, 3)) {
            const connection = this.calculateEntityConnection(entity1, entity2, seeds);
            
            if (connection.connectionStrength > 0.3) { // Lower threshold for more connections
              connections.push(connection);
            }
          }
        }
      }
    }

    // Sort by connection strength
    connections.sort((a, b) => b.connectionStrength - a.connectionStrength);

    console.log(`🔗 Discovered ${connections.length} strong cultural connections`);
    return connections.slice(0, 20); // Return top 20 connections
  }

  /**
   * Calculate connection strength between two entities
   */
  private calculateEntityConnection(
    entity1: QlooInsight,
    entity2: QlooInsight,
    seeds: ExtractedSeed[]
  ): CulturalConnection {
    let connectionStrength = 0;
    const sharedThemes: string[] = [];
    let connectionReason = '';

    // Check for shared themes in descriptions
    const desc1 = (entity1.description || '').toLowerCase();
    const desc2 = (entity2.description || '').toLowerCase();

    // Look for thematic overlaps - expanded for outdoor/adventure content
    const culturalKeywords = [
      'artisanal', 'indie', 'local', 'authentic', 'creative', 'intimate',
      'vintage', 'craft', 'organic', 'sustainable', 'community', 'underground',
      'experimental', 'traditional', 'modern', 'eclectic', 'bohemian',
      // Adventure/outdoor keywords
      'outdoor', 'adventure', 'nature', 'hiking', 'exploration', 'wilderness',
      'scenic', 'dramatic', 'epic', 'journey', 'quest', 'survival', 'action',
      'thriller', 'suspense', 'mystery', 'dark', 'intense', 'gritty',
      // Emotional/thematic keywords
      'family', 'friendship', 'love', 'betrayal', 'redemption', 'coming-of-age',
      'dystopian', 'fantasy', 'sci-fi', 'historical', 'biographical', 'documentary'
    ];

    for (const keyword of culturalKeywords) {
      if (desc1.includes(keyword) && desc2.includes(keyword)) {
        sharedThemes.push(keyword);
        connectionStrength += 0.15;
      }
    }

    // Check for seed overlap
    const seedTexts = seeds.map(s => s.text.toLowerCase());
    for (const seedText of seedTexts) {
      if (desc1.includes(seedText) && desc2.includes(seedText)) {
        connectionStrength += 0.2;
        sharedThemes.push(seedText);
      }
    }

    // Check for genre/category connections
    const genreConnections = [
      ['action', 'adventure', 'thriller'],
      ['drama', 'mystery', 'suspense'],
      ['comedy', 'family', 'romantic'],
      ['fantasy', 'sci-fi', 'supernatural'],
      ['documentary', 'biographical', 'historical']
    ];

    for (const genreGroup of genreConnections) {
      const desc1HasGenre = genreGroup.some(genre => desc1.includes(genre));
      const desc2HasGenre = genreGroup.some(genre => desc2.includes(genre));
      
      if (desc1HasGenre && desc2HasGenre) {
        connectionStrength += 0.25;
        sharedThemes.push(`${genreGroup[0]} genre`);
        connectionReason = `Both share ${genreGroup[0]} genre elements`;
      }
    }

    // Name-based connections (for franchises, series, etc.)
    const name1 = entity1.name.toLowerCase();
    const name2 = entity2.name.toLowerCase();
    
    // Check for shared words in names (indicating possible thematic connections)
    const name1Words = name1.split(' ').filter(word => word.length > 3);
    const name2Words = name2.split(' ').filter(word => word.length > 3);
    
    for (const word1 of name1Words) {
      for (const word2 of name2Words) {
        if (word1 === word2) {
          connectionStrength += 0.15;
          sharedThemes.push(`"${word1}" theme`);
          if (!connectionReason) {
            connectionReason = `Both feature "${word1}" elements`;
          }
        }
      }
    }

    // Location-based connections (for places)
    if (entity1.location && entity2.location) {
      const loc1 = entity1.location.toLowerCase();
      const loc2 = entity2.location.toLowerCase();
      
      // Check for neighborhood overlap
      const neighborhoods = ['downtown', 'uptown', 'arts district', 'old town', 'creative district'];
      for (const neighborhood of neighborhoods) {
        if (loc1.includes(neighborhood) && loc2.includes(neighborhood)) {
          connectionStrength += 0.1;
          sharedThemes.push(`${neighborhood} area`);
        }
      }
    }

    // Add base connection for any entities in the same ecosystem
    if (connectionStrength === 0) {
      connectionStrength = 0.35; // Base connection for being in same cultural ecosystem
      connectionReason = `Both reflect your ${seeds[0]?.text || 'adventure'} preferences`;
      sharedThemes.push('taste alignment');
    } else if (sharedThemes.length > 0) {
      connectionReason = `Connected through ${sharedThemes.slice(0, 2).join(' and ')} elements`;
    } else {
      connectionReason = 'Cultural affinity based on taste profile';
    }

    return {
      fromEntity: entity1,
      toEntity: entity2,
      connectionStrength: Math.min(connectionStrength, 1.0),
      connectionReason,
      sharedThemes: [...new Set(sharedThemes)] // Remove duplicates
    };
  }

  /**
   * Extract overarching cultural themes from the ecosystem
   */
  private async extractCulturalThemes(
    entities: { [entityType: string]: QlooInsight[] },
    connections: CulturalConnection[],
    vibe: string
  ): Promise<CulturalTheme[]> {
    
    // Analyze all shared themes from connections
    const themeFrequency: { [theme: string]: number } = {};
    const themeEntityTypes: { [theme: string]: Set<string> } = {};
    const themeExamples: { [theme: string]: string[] } = {};

    for (const connection of connections) {
      for (const theme of connection.sharedThemes) {
        themeFrequency[theme] = (themeFrequency[theme] || 0) + connection.connectionStrength;
        
        if (!themeEntityTypes[theme]) {
          themeEntityTypes[theme] = new Set();
        }
        
        // Determine entity types (simplified)
        const entity1Type = this.getEntityTypeFromInsight(connection.fromEntity);
        const entity2Type = this.getEntityTypeFromInsight(connection.toEntity);
        
        themeEntityTypes[theme].add(entity1Type);
        themeEntityTypes[theme].add(entity2Type);
        
        if (!themeExamples[theme]) {
          themeExamples[theme] = [];
        }
        themeExamples[theme].push(connection.fromEntity.name, connection.toEntity.name);
      }
    }

    // If we have no themes from connections, extract themes from entity names/descriptions
    if (Object.keys(themeFrequency).length === 0) {
      // Extract themes from the vibe and entity types
      const entityTypeThemes = Object.keys(entities).map(entityType => ({
        theme: `${entityType} preferences`,
        strength: 0.6,
        entityTypes: [entityType] as QlooEntityType[],
        examples: entities[entityType].slice(0, 3).map(e => e.name),
        description: `Your taste in ${entityType} reflects your ${vibe} vibe`
      }));

      return entityTypeThemes.slice(0, 5);
    }

    // Convert to CulturalTheme objects
    const themes: CulturalTheme[] = Object.keys(themeFrequency)
      .filter(theme => themeFrequency[theme] > 0.2) // Lower threshold for themes
      .map(theme => ({
        theme,
        strength: Math.min(themeFrequency[theme], 1.0),
        entityTypes: Array.from(themeEntityTypes[theme]) as QlooEntityType[],
        examples: [...new Set(themeExamples[theme])].slice(0, 4),
        description: this.generateThemeDescription(theme, vibe)
      }))
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 8); // Top 8 themes

    console.log('🎨 Extracted cultural themes:', themes.map(t => `${t.theme} (${t.strength.toFixed(2)})`));
    return themes;
  }

  /**
   * Generate AI-powered cultural insights using OpenAI
   */
  private async generateAIInsights(
    vibe: string,
    entities: { [entityType: string]: QlooInsight[] },
    connections: CulturalConnection[],
    themes: CulturalTheme[]
  ): Promise<CulturalInsight[]> {
    
    // Prepare data summary for AI analysis
    const entitySummary = Object.keys(entities).map(entityType => ({
      type: entityType,
      count: entities[entityType].length,
      examples: entities[entityType].slice(0, 3).map(e => e.name)
    }));

    const connectionSummary = connections.slice(0, 5).map(conn => ({
      from: conn.fromEntity.name,
      to: conn.toEntity.name,
      reason: conn.connectionReason,
      strength: Math.round(conn.connectionStrength * 100)
    }));

    const themeSummary = themes.slice(0, 5).map(theme => ({
      theme: theme.theme,
      strength: Math.round(theme.strength * 100),
      examples: theme.examples.slice(0, 2)
    }));

    const prompt = `Analyze this person's cultural ecosystem based on their "${vibe}" preferences:

CULTURAL DOMAINS:
${entitySummary.map(e => `• ${e.type}: ${e.count} items (${e.examples.join(', ')})`).join('\n')}

CULTURAL CONNECTIONS:
${connectionSummary.map(c => `• ${c.from} ↔ ${c.to}: ${c.reason} (${c.strength}% strength)`).join('\n')}

THEMES DETECTED:
${themeSummary.map(t => `• ${t.theme}: ${t.strength}% strength (${t.examples.join(', ')})`).join('\n')}

Generate 2-3 sophisticated cultural insights about this person's taste profile. Each insight should:
1. Reveal deeper patterns or psychological preferences
2. Make unexpected connections between different cultural domains
3. Provide actionable recommendations for cultural discovery

Format as JSON array with this structure:
[
  {
    "type": "pattern|connection|recommendation",
    "title": "Insight Title",
    "description": "Detailed insight description (2-3 sentences)",
    "confidence": 0.7-0.95,
    "supportingEntities": ["entity1", "entity2"]
  }
]

Focus on psychological insights, cultural patterns, and sophisticated analysis that goes beyond surface-level observations.`;

    try {
      const response = await this.openaiService.generateResponse(prompt, {
        maxTokens: 800,
        temperature: 0.7
      });

      // Parse AI response
      const aiInsights = JSON.parse(response);
      
      // Validate and return insights
      return aiInsights.filter((insight: any) => 
        insight.title && insight.description && insight.type && insight.confidence
      ).map((insight: any) => ({
        type: insight.type as 'pattern' | 'connection' | 'recommendation',
        title: insight.title,
        description: insight.description,
        confidence: Math.min(Math.max(insight.confidence, 0.5), 0.95),
        supportingEntities: insight.supportingEntities || []
      }));

    } catch (error) {
      console.error('❌ AI insights generation failed:', error);
      return []; // Return empty array on failure
    }
  }

  /**
   * Generate AI-powered cultural insights using OpenAI
   */
  private async generateCulturalInsights(
    vibe: string,
    entities: { [entityType: string]: QlooInsight[] },
    connections: CulturalConnection[],
    themes: CulturalTheme[]
  ): Promise<CulturalInsight[]> {
    
    const insights: CulturalInsight[] = [];

    // Always provide entity diversity insight first
    const entityCount = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
    const entityTypeCount = Object.keys(entities).length;
    
    insights.push({
      type: 'pattern',
      title: 'Cultural Diversity Profile',
      description: `Your ${vibe} taste spans ${entityTypeCount} cultural domains with ${entityCount} total recommendations, showing ${entityTypeCount >= 4 ? 'broad' : 'focused'} cultural interests.`,
      confidence: 0.8,
      supportingEntities: Object.keys(entities)
    });

    // Generate AI-powered insights
    try {
      const aiInsights = await this.generateAIInsights(vibe, entities, connections, themes);
      insights.push(...aiInsights);
    } catch (error) {
      console.warn('⚠️ AI insights generation failed, using fallback insights:', error);
      // Fallback to existing logic if AI fails
    }

    // Pattern insights
    if (themes.length > 0) {
      const dominantTheme = themes[0];
      insights.push({
        type: 'pattern',
        title: `${dominantTheme.theme} Pattern`,
        description: `Your cultural ecosystem shows strong ${dominantTheme.theme} preferences, appearing across ${dominantTheme.entityTypes.length} different cultural domains.`,
        confidence: dominantTheme.strength,
        supportingEntities: dominantTheme.examples
      });
    }

    // Connection insights
    if (connections.length > 0) {
      const strongestConnection = connections[0];
      insights.push({
        type: 'connection',
        title: 'Cultural Bridge Discovery',
        description: `${strongestConnection.fromEntity.name} and ${strongestConnection.toEntity.name} connect through: ${strongestConnection.connectionReason}`,
        confidence: strongestConnection.connectionStrength,
        supportingEntities: [strongestConnection.fromEntity.name, strongestConnection.toEntity.name]
      });
    } else {
      // Provide insight even without connections
      const entityTypes = Object.keys(entities);
      if (entityTypes.length >= 2) {
        insights.push({
          type: 'connection',
          title: 'Emerging Cultural Connections',
          description: `Your ${vibe} preferences create potential bridges between ${entityTypes.slice(0, 2).join(' and ')}, suggesting opportunities for cross-cultural discovery.`,
          confidence: 0.6,
          supportingEntities: entityTypes
        });
      }
    }

    // Ecosystem coherence insight
    const connectionDensity = connections.length / Math.max(entityCount, 1);
    
    insights.push({
      type: 'recommendation',
      title: connectionDensity > 0.3 ? 'Highly Coherent Cultural Ecosystem' : 'Diverse Cultural Exploration',
      description: connectionDensity > 0.3 
        ? 'Your recommendations form a tightly connected cultural network - perfect for deep exploration of a specific aesthetic.'
        : 'Your recommendations span diverse cultural territories - great for broad cultural discovery.',
      confidence: Math.min(connectionDensity * 2, 1.0),
      supportingEntities: Object.keys(entities)
    });

    console.log('💡 Generated cultural insights:', insights.length);
    return insights;
  }

  /**
   * Process cultural insights from the initial AI analysis
   */
  private processCulturalInsights(
    culturalInsights: any,
    entities: { [entityType: string]: QlooInsight[] },
    connections: CulturalConnection[],
    themes: CulturalTheme[]
  ): CulturalInsight[] {
    const insights: CulturalInsight[] = [];

    // Always provide entity diversity insight first
    const entityCount = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
    const entityTypeCount = Object.keys(entities).length;
    
    insights.push({
      type: 'pattern',
      title: 'Cultural Diversity Profile',
      description: `Your taste spans ${entityTypeCount} cultural domains with ${entityCount} total recommendations, showing ${entityTypeCount >= 4 ? 'broad' : 'focused'} cultural interests.`,
      confidence: 0.8,
      supportingEntities: Object.keys(entities)
    });

    // Use AI-generated cultural profile as main insight
    if (culturalInsights.culturalProfile) {
      insights.push({
        type: 'pattern',
        title: 'Cultural Personality Analysis',
        description: culturalInsights.culturalProfile,
        confidence: 0.9,
        supportingEntities: culturalInsights.primaryThemes || []
      });
    }

    // Convert AI recommendations into actionable insights
    if (culturalInsights.recommendations && culturalInsights.recommendations.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Personalized Discovery Suggestions',
        description: culturalInsights.recommendations.slice(0, 2).join(' '),
        confidence: 0.85,
        supportingEntities: culturalInsights.personalityTraits || []
      });
    }

    // Add connection insights if available
    if (connections.length > 0) {
      const strongestConnection = connections[0];
      insights.push({
        type: 'connection',
        title: 'Cultural Bridge Discovery',
        description: `${strongestConnection.fromEntity.name} and ${strongestConnection.toEntity.name} connect through: ${strongestConnection.connectionReason}`,
        confidence: strongestConnection.connectionStrength,
        supportingEntities: [strongestConnection.fromEntity.name, strongestConnection.toEntity.name]
      });
    }

    return insights;
  }

  /**
   * Calculate overall ecosystem coherence score
   */
  private calculateEcosystemScore(
    connections: CulturalConnection[],
    themes: CulturalTheme[],
    entities: { [entityType: string]: QlooInsight[] }
  ): number {
    const entityCount = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
    
    if (entityCount === 0) return 0;

    // Connection density (0-0.4) - more generous scoring
    const maxPossibleConnections = entityCount * (entityCount - 1) / 2;
    const connectionDensity = Math.min((connections.length + 1) / Math.max(maxPossibleConnections / 4, 1), 1.0) * 0.4;
    
    // Theme strength (0-0.3) - ensure minimum score
    const avgThemeStrength = themes.length > 0 
      ? themes.reduce((sum, theme) => sum + theme.strength, 0) / themes.length * 0.3
      : 0.15; // Base theme score
    
    // Entity diversity (0-0.3) - reward having multiple entity types
    const entityDiversity = Math.min(Object.keys(entities).length / 5, 1.0) * 0.3;

    const score = connectionDensity + avgThemeStrength + entityDiversity;
    
    console.log('📊 Ecosystem score breakdown:', {
      connectionDensity: connectionDensity.toFixed(2),
      avgThemeStrength: avgThemeStrength.toFixed(2),
      entityDiversity: entityDiversity.toFixed(2),
      total: score.toFixed(2)
    });

    return Math.min(score, 1.0);
  }

  /**
   * AI-Powered Deep Ecosystem Analysis
   * Provides sophisticated cultural intelligence beyond algorithmic analysis
   */
  private async performAIEcosystemAnalysis(
    vibe: string,
    city: string,
    entities: { [entityType: string]: QlooInsight[] },
    connections: CulturalConnection[],
    themes: CulturalTheme[],
    culturalInsights?: any
  ): Promise<{
    aiConnections: CulturalConnection[];
    aiThemes: CulturalTheme[];
    aiInsights: CulturalInsight[];
    ecosystemNarrative: string;
  }> {
    
    // Prepare comprehensive data for AI analysis
    const entitySummary = Object.keys(entities).map(entityType => ({
      type: entityType,
      count: entities[entityType].length,
      topItems: entities[entityType].slice(0, 5).map(e => ({
        name: e.name,
        description: e.description?.substring(0, 100) || '',
        category: e.category
      }))
    }));

    const connectionSummary = connections.slice(0, 10).map(conn => ({
      from: { name: conn.fromEntity.name, type: this.getEntityTypeFromInsight(conn.fromEntity) },
      to: { name: conn.toEntity.name, type: this.getEntityTypeFromInsight(conn.toEntity) },
      reason: conn.connectionReason,
      strength: Math.round(conn.connectionStrength * 100),
      themes: conn.sharedThemes
    }));

    const prompt = `You are a world-class cultural anthropologist analyzing a person's cultural ecosystem. Provide deep, sophisticated analysis of their taste profile.

PERSON'S VIBE: "${vibe}" in ${city}

CULTURAL DOMAINS (${Object.keys(entities).length} types, ${Object.values(entities).reduce((sum, arr) => sum + arr.length, 0)} total items):
${entitySummary.map(e => `
${e.type.toUpperCase()} (${e.count} items):
${e.topItems.map(item => `• ${item.name}: ${item.description}`).join('\n')}
`).join('\n')}

EXISTING CONNECTIONS (${connections.length} found):
${connectionSummary.map(c => `• ${c.from.name} (${c.from.type}) ↔ ${c.to.name} (${c.to.type}): ${c.reason} [${c.strength}% strength]`).join('\n')}

EXISTING THEMES:
${themes.map(t => `• ${t.theme}: ${Math.round(t.strength * 100)}% strength`).join('\n')}

INITIAL AI INSIGHTS:
${culturalInsights ? `
• Cultural Profile: ${culturalInsights.culturalProfile}
• Primary Themes: ${culturalInsights.primaryThemes?.join(', ')}
• Personality Traits: ${culturalInsights.personalityTraits?.join(', ')}
` : 'None provided'}

TASK: Provide sophisticated cultural analysis in this EXACT JSON format:

{
  "aiConnections": [
    {
      "fromEntity": "entity name",
      "toEntity": "entity name", 
      "connectionStrength": 0.7-0.95,
      "connectionReason": "Deep psychological/cultural reason (1-2 sentences)",
      "sharedThemes": ["sophisticated theme 1", "sophisticated theme 2"],
      "psychologicalInsight": "Why this connection reveals deeper personality traits"
    }
  ],
  "aiThemes": [
    {
      "theme": "Sophisticated theme name",
      "strength": 0.7-0.95,
      "description": "Deep analysis of this cultural theme (2-3 sentences)",
      "psychologicalMeaning": "What this reveals about personality/values",
      "entityTypes": ["relevant", "entity", "types"],
      "examples": ["specific examples from their choices"]
    }
  ],
  "aiInsights": [
    {
      "type": "pattern|connection|recommendation|psychological",
      "title": "Sophisticated Insight Title",
      "description": "Deep cultural/psychological analysis (2-3 sentences)",
      "confidence": 0.8-0.95,
      "supportingEntities": ["relevant entities"],
      "actionableAdvice": "Specific recommendation based on this insight"
    }
  ],
  "ecosystemNarrative": "A compelling 3-4 sentence narrative that tells the story of this person's cultural identity, connecting their choices to deeper psychological patterns and cultural values. This should read like sophisticated cultural criticism."
}

FOCUS ON:
1. Unexpected psychological connections between different cultural domains
2. Deep cultural patterns that reveal personality, values, and worldview
3. Sophisticated themes that go beyond surface-level categorization
4. Actionable insights for cultural discovery and personal growth
5. A compelling narrative that ties everything together

Be intellectually rigorous but accessible. Avoid clichés. Provide genuine insights that feel personalized and revelatory.`;

    try {
      console.log('🤖 Calling AI ecosystem analysis API...');
      
      const response = await fetch('http://localhost:3001/api/ecosystem-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vibe,
          city,
          entities,
          connections,
          themes,
          culturalInsights
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request was not successful');
      }

      console.log('🤖 AI ecosystem analysis API response received');
      const aiAnalysis = data.data;
      
      // Process AI connections
      const aiConnections: CulturalConnection[] = (aiAnalysis.aiConnections || []).map((conn: any) => {
        // Find actual entities from our data
        const fromEntity = this.findEntityByName(conn.fromEntity, entities);
        const toEntity = this.findEntityByName(conn.toEntity, entities);
        
        if (fromEntity && toEntity) {
          return {
            fromEntity,
            toEntity,
            connectionStrength: Math.min(Math.max(conn.connectionStrength, 0.7), 0.95),
            connectionReason: conn.connectionReason || 'AI-discovered cultural affinity',
            sharedThemes: conn.sharedThemes || [],
            psychologicalInsight: conn.psychologicalInsight
          };
        }
        return null;
      }).filter(Boolean);

      // Process AI themes
      const aiThemes: CulturalTheme[] = (aiAnalysis.aiThemes || []).map((theme: any) => ({
        theme: theme.theme,
        strength: Math.min(Math.max(theme.strength, 0.7), 0.95),
        description: theme.description,
        psychologicalMeaning: theme.psychologicalMeaning,
        entityTypes: theme.entityTypes || [],
        examples: theme.examples || []
      }));

      // Process AI insights
      const aiInsights: CulturalInsight[] = (aiAnalysis.aiInsights || []).map((insight: any) => ({
        type: insight.type as 'pattern' | 'connection' | 'recommendation' | 'psychological',
        title: insight.title,
        description: insight.description,
        confidence: Math.min(Math.max(insight.confidence, 0.8), 0.95),
        supportingEntities: insight.supportingEntities || [],
        actionableAdvice: insight.actionableAdvice
      }));

      console.log('✅ AI ecosystem analysis complete:', {
        aiConnections: aiConnections.length,
        aiThemes: aiThemes.length,
        aiInsights: aiInsights.length,
        hasNarrative: !!aiAnalysis.ecosystemNarrative
      });

      return {
        aiConnections,
        aiThemes,
        aiInsights,
        ecosystemNarrative: aiAnalysis.ecosystemNarrative || ''
      };

    } catch (error) {
      console.error('❌ AI ecosystem analysis failed:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        promptLength: prompt.length
      });
      return {
        aiConnections: [],
        aiThemes: [],
        aiInsights: [],
        ecosystemNarrative: ''
      };
    }
  }

  /**
   * Helper method to find entity by name in the entities collection
   */
  private findEntityByName(name: string, entities: { [entityType: string]: QlooInsight[] }): QlooInsight | null {
    for (const entityType of Object.keys(entities)) {
      const found = entities[entityType].find(entity => 
        entity.name.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(entity.name.toLowerCase())
      );
      if (found) return found;
    }
    return null;
  }

  /**
   * Helper methods
   */
  private getEntityTypeFromInsight(entity: QlooInsight): string {
    // Simplified entity type detection based on category
    const category = entity.category;
    if (category === 'food') return 'places';
    if (category === 'things_to_do') return 'places';
    return category || 'unknown';
  }

  private generateThemeDescription(theme: string, vibe: string): string {
    const descriptions: { [key: string]: string } = {
      'artisanal': 'Handcrafted, authentic experiences that value quality over quantity',
      'indie': 'Independent, creative expressions outside mainstream culture',
      'local': 'Community-rooted experiences that celebrate place and tradition',
      'authentic': 'Genuine, unfiltered cultural expressions',
      'creative': 'Innovative, artistic approaches to culture and experience',
      'intimate': 'Personal, close-knit cultural experiences',
      'vintage': 'Nostalgic, time-honored cultural elements',
      'sustainable': 'Environmentally and socially conscious cultural choices',
      'community': 'Shared, collective cultural experiences'
    };

    return descriptions[theme] || `Cultural theme reflecting ${theme} values in ${vibe}`;
  }

  /**
   * Map TasteItem category to entity type for ecosystem
   */
  private mapCategoryToEntityType(category: string): string {
    const mapping: { [key: string]: string } = {
      'food': 'places',
      'activity': 'places',
      'movie': 'movies',
      'tv_show': 'tv_shows',
      'artist': 'music',
      'book': 'books',
      'podcast': 'podcasts',
      'videogame': 'games',
      'destination': 'destinations',
      'media': 'media'
    };
    return mapping[category] || 'other';
  }
} 