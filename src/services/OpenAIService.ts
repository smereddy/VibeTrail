import { BaseAPIService } from './BaseAPIService';
import { getEnvironmentConfig } from '../config/environment';
import {
  ExtractedSeed,
  ItemExplanation,
  ScheduledPlan,
  TasteItem,
  OpenAIRequest,
  OpenAIResponse,
  APIResponse,
  VibeContext,
  ProcessedVibe,
  ContextDetectionResult,
  EntityRelevanceScoring,
  QlooEntityType,
} from '../types';

/**
 * Enhanced OpenAI service for VibeTrail 2.0
 * Handles context-aware vibe processing, entity relevance scoring, and intelligent scheduling
 */
export class OpenAIService extends BaseAPIService {
  private config: ReturnType<typeof getEnvironmentConfig>;

  constructor() {
    const config = getEnvironmentConfig();
    
    // Use proxy server for API calls (secure API key management)
    const apiUrl = config?.app?.apiProxyUrl || 'http://localhost:3001/api';
    
    super(`${apiUrl}/openai`, 30000);
    this.config = config;
    
    console.log('OpenAI Service: Using proxy at', `${apiUrl}/openai`);
  }

  protected getServiceName(): 'openai' {
    return 'openai';
  }

  /**
   * Process vibe input with context detection and entity relevance scoring
   * This is the main entry point for VibeTrail 2.0 vibe processing
   */
  async processVibeWithContext(vibe: string): Promise<APIResponse<ProcessedVibe>> {
    const startTime = Date.now();
    
    try {
      // Step 1: Extract seeds and detect context in parallel
      const [seedsResponse, contextResponse] = await Promise.all([
        this.extractSeeds(vibe),
        this.detectVibeContext(vibe)
      ]);

      if (!seedsResponse.success || !contextResponse.success) {
        return {
          error: seedsResponse.error || contextResponse.error,
          success: false
        };
      }

      // Step 2: Score entity relevance based on vibe and context
      const entityRelevanceResponse = await this.scoreEntityRelevance(
        vibe, 
        contextResponse.data!,
        seedsResponse.data!
      );

      if (!entityRelevanceResponse.success) {
        return {
          error: entityRelevanceResponse.error,
          success: false
        };
      }

      // Step 3: Build comprehensive vibe context
      const vibeContext: VibeContext = {
        isIndoor: contextResponse.data!.isIndoor,
        isOutdoor: contextResponse.data!.isOutdoor,
        isHybrid: contextResponse.data!.isHybrid,
        timeOfDay: this.detectTimeContext(vibe),
        season: this.detectSeasonalContext(vibe),
        entityRelevance: entityRelevanceResponse.data!.reduce((acc, scoring) => {
          const entityKey = scoring.entityType.split(':').pop() || '';
          acc[entityKey] = scoring.relevanceScore;
          return acc;
        }, {} as { [key: string]: number }),
        confidenceScore: contextResponse.data!.confidence
      };

      const processingTime = Date.now() - startTime;

      const processedVibe: ProcessedVibe = {
        originalInput: vibe,
        extractedSeeds: seedsResponse.data!,
        context: vibeContext,
        suggestedTabs: [], // Will be populated by QlooService
        processingTime,
        confidence: Math.min(
          contextResponse.data!.confidence,
          seedsResponse.data!.reduce((sum, seed) => sum + seed.confidence, 0) / seedsResponse.data!.length
        )
      };

      console.log('🧠 Processed vibe with context:', {
        indoor: vibeContext.isIndoor,
        outdoor: vibeContext.isOutdoor,
        hybrid: vibeContext.isHybrid,
        entityCount: Object.keys(vibeContext.entityRelevance || {}).length,
        processingTime: `${processingTime}ms`
      });

      return {
        data: processedVibe,
        success: true
      };
    } catch (error) {
      return {
        error: {
          code: 'VIBE_PROCESSING_ERROR',
          message: 'Failed to process vibe with context',
          details: error,
          timestamp: new Date(),
          service: 'openai'
        },
        success: false
      };
    }
  }

  /**
   * Detect indoor/outdoor/hybrid context from vibe input
   */
  async detectVibeContext(vibe: string): Promise<APIResponse<ContextDetectionResult>> {
    const request: OpenAIRequest = {
      model: this.config.openai.model,
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent context detection
      messages: [
        {
          role: 'system',
          content: `You are a context detection assistant that analyzes user vibes to determine indoor/outdoor preferences.

          Analyze the vibe and return JSON with this exact structure:
          {
            "isIndoor": boolean,
            "isOutdoor": boolean, 
            "isHybrid": boolean,
            "confidence": 0.0-1.0,
            "indicators": ["specific words/phrases that indicate context"],
            "timeContext": "morning|afternoon|evening|night|unspecified",
            "seasonalContext": "spring|summer|fall|winter|unspecified"
          }

          Context Detection Rules:
          - isIndoor: true for cozy, intimate, reading, movies, cafes, museums, galleries
          - isOutdoor: true for hiking, parks, festivals, beaches, outdoor dining, adventures
          - isHybrid: true when both indoor and outdoor elements are present
          - confidence: how certain you are about the context (higher is better)
          - indicators: specific words that led to your decision
          
          Examples:
          - "cozy rainy day" → indoor: true, outdoor: false, hybrid: false
          - "beach adventure" → indoor: false, outdoor: true, hybrid: false  
          - "festival with food trucks" → indoor: false, outdoor: false, hybrid: true`
        },
        {
          role: 'user',
          content: `Analyze this vibe for context: "${vibe}"`
        }
      ]
    };

    const response = await this.makeRequest<OpenAIResponse>({
      method: 'POST',
      url: '/chat/completions',
      data: request,
    });

    if (!response.success || !response.data) {
      return {
        error: response.error,
        success: false,
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }

      const contextResult = JSON.parse(jsonContent) as ContextDetectionResult;
      
      console.log('🎯 Detected context:', {
        indoor: contextResult.isIndoor,
        outdoor: contextResult.isOutdoor,
        hybrid: contextResult.isHybrid,
        confidence: contextResult.confidence,
        indicators: contextResult.indicators
      });

      return {
        data: contextResult,
        success: true,
      };
    } catch (error) {
      // Fallback to basic keyword detection if AI parsing fails
      console.warn('⚠️ AI context detection failed, using fallback logic');
      return this.fallbackContextDetection(vibe);
    }
  }

  /**
   * Score relevance of different entity types based on vibe content
   */
  async scoreEntityRelevance(
    vibe: string,
    context: ContextDetectionResult,
    seeds: ExtractedSeed[]
  ): Promise<APIResponse<EntityRelevanceScoring[]>> {
    const entityTypes: QlooEntityType[] = [
      'urn:entity:place',
      'urn:entity:movie',
      'urn:entity:tv_show', 
      'urn:entity:artist',
      'urn:entity:book',
      'urn:entity:podcast',
      'urn:entity:videogame',
      'urn:entity:destination'
    ];

    const request: OpenAIRequest = {
      model: this.config.openai.model,
      max_tokens: 800,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are an entity relevance scorer that determines how relevant different content types are to a user's vibe.

          Score each entity type from 0.0 to 1.0 based on how well it matches the vibe.
          Return JSON array with this structure:
          {
            "entityType": "urn:entity:place",
            "relevanceScore": 0.0-1.0,
            "reasoning": ["why this entity type is relevant"],
            "boostFactors": ["specific factors that increase relevance"]
          }

          Entity Types to Score:
          - urn:entity:place: Restaurants, venues, attractions, physical locations
          - urn:entity:movie: Films, cinema experiences
          - urn:entity:tv_show: TV shows, series, streaming content
          - urn:entity:artist: Musicians, bands, live music
          - urn:entity:book: Books, literature, reading material
          - urn:entity:podcast: Audio content, podcasts, audio experiences
          - urn:entity:videogame: Games, interactive entertainment
          - urn:entity:destination: Travel destinations, neighborhoods

          Context Considerations:
          - Indoor vibes: boost books, movies, tv_shows, podcasts, videogames
          - Outdoor vibes: boost places, destinations, artists (concerts)
          - Cultural vibes: boost books, movies, artists, destinations
          - Active vibes: boost places, destinations, videogames`
        },
        {
          role: 'user',
          content: `Score entity relevance for this vibe: "${vibe}"
          
          Context: ${context.isIndoor ? 'Indoor' : ''}${context.isOutdoor ? 'Outdoor' : ''}${context.isHybrid ? 'Hybrid' : ''}
          Seeds: ${seeds.map(s => s.text).join(', ')}
          Indicators: ${context.indicators.join(', ')}`
        }
      ]
    };

    const response = await this.makeRequest<OpenAIResponse>({
      method: 'POST',
      url: '/chat/completions',
      data: request,
    });

    if (!response.success || !response.data) {
      return {
        error: response.error,
        success: false,
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }

      const scorings = JSON.parse(jsonContent) as EntityRelevanceScoring[];
      
      console.log('📊 Entity relevance scores:', 
        scorings.map(s => `${s.entityType.split(':').pop()}: ${s.relevanceScore.toFixed(2)}`).join(', ')
      );

      return {
        data: scorings,
        success: true,
      };
    } catch (error) {
      // Fallback to rule-based scoring
      console.warn('⚠️ AI entity scoring failed, using fallback logic');
      return this.fallbackEntityScoring(context, seeds);
    }
  }

  /**
   * Enhanced seed extraction with context awareness
   */
  async extractSeeds(vibe: string): Promise<APIResponse<ExtractedSeed[]>> {
    const request: OpenAIRequest = {
      model: this.config.openai.model,
      max_tokens: this.config.openai.maxTokens,
      temperature: this.config.openai.temperature,
      messages: [
        {
          role: 'system',
          content: `You are a taste intelligence assistant that extracts structured seeds from user vibes for VibeTrail 2.0.
          
          Extract 3-7 concrete seeds that can be used to search across multiple cultural domains.
          Return a JSON array of seeds with this structure:
          {
            "text": "specific searchable term",
            "category": "food|activity|media|general",
            "confidence": 0.0-1.0,
            "searchTerms": ["alternative", "search", "terms"]
          }
          
          Enhanced Extraction Rules:
          - Focus on specific, searchable entities rather than abstract concepts
          - Include cultural keywords (genres, styles, moods, aesthetics)
          - Consider seasonal, time-based, and contextual elements
          - Extract both explicit mentions and implied preferences
          - Prioritize seeds that work across multiple domains
          
          Examples:
          - "La La Land weekend" → ["jazz music", "romantic restaurants", "vintage aesthetics", "Los Angeles vibes"]
          - "cozy rainy day" → ["indie coffee shops", "comfort reads", "atmospheric movies", "warm beverages"]
          - "summer festival vibes" → ["live music", "food trucks", "outdoor venues", "craft beer"]`,
        },
        {
          role: 'user',
          content: `Extract seeds from this vibe: "${vibe}"`,
        },
      ],
    };

    const response = await this.makeRequest<OpenAIResponse>({
      method: 'POST',
      url: '/chat/completions',
      data: request,
    });

    if (!response.success || !response.data) {
      console.error('OpenAI API Error:', response.error);
      return {
        error: response.error,
        success: false,
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }

      console.log('🔍 Parsing JSON content:', jsonContent);
      const seeds = JSON.parse(jsonContent) as ExtractedSeed[];
      console.log('✅ Parsed seeds:', seeds);
      
      return {
        data: seeds,
        success: true,
      };
    } catch (error) {
      return {
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse OpenAI response',
          details: error,
          timestamp: new Date(),
          service: 'openai',
        },
        success: false,
      };
    }
  }

  /**
   * Detect time context from vibe
   */
  private detectTimeContext(vibe: string): 'morning' | 'afternoon' | 'evening' | 'night' | undefined {
    const lowerVibe = vibe.toLowerCase();
    
    if (lowerVibe.includes('morning') || lowerVibe.includes('breakfast') || lowerVibe.includes('sunrise')) {
      return 'morning';
    }
    if (lowerVibe.includes('afternoon') || lowerVibe.includes('lunch') || lowerVibe.includes('noon')) {
      return 'afternoon';
    }
    if (lowerVibe.includes('evening') || lowerVibe.includes('dinner') || lowerVibe.includes('sunset')) {
      return 'evening';
    }
    if (lowerVibe.includes('night') || lowerVibe.includes('late') || lowerVibe.includes('after dark')) {
      return 'night';
    }
    
    return undefined;
  }

  /**
   * Detect seasonal context from vibe
   */
  private detectSeasonalContext(vibe: string): 'spring' | 'summer' | 'fall' | 'winter' | undefined {
    const lowerVibe = vibe.toLowerCase();
    
    if (lowerVibe.includes('spring') || lowerVibe.includes('bloom') || lowerVibe.includes('fresh')) {
      return 'spring';
    }
    if (lowerVibe.includes('summer') || lowerVibe.includes('beach') || lowerVibe.includes('hot') || lowerVibe.includes('festival')) {
      return 'summer';
    }
    if (lowerVibe.includes('fall') || lowerVibe.includes('autumn') || lowerVibe.includes('cozy') || lowerVibe.includes('harvest')) {
      return 'fall';
    }
    if (lowerVibe.includes('winter') || lowerVibe.includes('cold') || lowerVibe.includes('holiday') || lowerVibe.includes('snow')) {
      return 'winter';
    }
    
    return undefined;
  }

  /**
   * Fallback context detection using keyword analysis
   */
  private fallbackContextDetection(vibe: string): APIResponse<ContextDetectionResult> {
    const lowerVibe = vibe.toLowerCase();
    
    const indoorKeywords = ['cozy', 'indoor', 'cafe', 'restaurant', 'museum', 'gallery', 'movie', 'book', 'read', 'study'];
    const outdoorKeywords = ['outdoor', 'park', 'hike', 'beach', 'festival', 'adventure', 'nature', 'garden', 'rooftop'];
    
    const indoorCount = indoorKeywords.filter(keyword => lowerVibe.includes(keyword)).length;
    const outdoorCount = outdoorKeywords.filter(keyword => lowerVibe.includes(keyword)).length;
    
    const isIndoor = indoorCount > outdoorCount;
    const isOutdoor = outdoorCount > indoorCount;
    const isHybrid = indoorCount > 0 && outdoorCount > 0;
    
    const confidence = Math.max(indoorCount, outdoorCount) / Math.max(indoorKeywords.length, outdoorKeywords.length);
    
    return {
      data: {
        isIndoor,
        isOutdoor,
        isHybrid,
        confidence,
        indicators: [
          ...indoorKeywords.filter(k => lowerVibe.includes(k)),
          ...outdoorKeywords.filter(k => lowerVibe.includes(k))
        ]
      },
      success: true
    };
  }

  /**
   * Fallback entity scoring using rule-based logic
   */
  private fallbackEntityScoring(
    context: ContextDetectionResult,
    seeds: ExtractedSeed[]
  ): APIResponse<EntityRelevanceScoring[]> {
    const baseScores: { [key in QlooEntityType]: number } = {
      'urn:entity:place': 0.8, // Always relevant
      'urn:entity:movie': 0.6,
      'urn:entity:tv_show': 0.5,
      'urn:entity:artist': 0.6,
      'urn:entity:book': 0.4,
      'urn:entity:podcast': 0.4,
      'urn:entity:videogame': 0.3,
      'urn:entity:destination': 0.5
    };

    const scorings: EntityRelevanceScoring[] = Object.entries(baseScores).map(([entityType, baseScore]) => {
      let adjustedScore = baseScore;
      const boostFactors: string[] = [];

      // Context-based adjustments
      if (context.isIndoor) {
        if (['urn:entity:book', 'urn:entity:movie', 'urn:entity:tv_show', 'urn:entity:podcast', 'urn:entity:videogame'].includes(entityType as QlooEntityType)) {
          adjustedScore += 0.3;
          boostFactors.push('indoor context');
        }
      }

      if (context.isOutdoor) {
        if (['urn:entity:place', 'urn:entity:destination', 'urn:entity:artist'].includes(entityType as QlooEntityType)) {
          adjustedScore += 0.2;
          boostFactors.push('outdoor context');
        }
      }

      // Seed-based adjustments
      const relevantSeeds = seeds.filter(seed => {
        const seedText = seed.text.toLowerCase();
        if (entityType === 'urn:entity:place') return seed.category === 'food' || seed.category === 'activity';
        if (entityType === 'urn:entity:movie' || entityType === 'urn:entity:tv_show') return seed.category === 'media' || seedText.includes('movie') || seedText.includes('show');
        if (entityType === 'urn:entity:artist') return seed.category === 'media' || seedText.includes('music') || seedText.includes('concert');
        if (entityType === 'urn:entity:book') return seedText.includes('book') || seedText.includes('read') || seedText.includes('literature');
        return false;
      });

      if (relevantSeeds.length > 0) {
        adjustedScore += relevantSeeds.length * 0.1;
        boostFactors.push(`${relevantSeeds.length} relevant seeds`);
      }

      return {
        entityType: entityType as QlooEntityType,
        relevanceScore: Math.min(adjustedScore, 1.0),
        reasoning: [`Base relevance for ${entityType.split(':').pop()}`],
        boostFactors
      };
    });

    return {
      data: scorings,
      success: true
    };
  }

  /**
   * Generate explanations for recommendation items (enhanced for context)
   */
  async generateExplanations(
    items: TasteItem[],
    seeds: ExtractedSeed[],
    context?: VibeContext
  ): Promise<APIResponse<ItemExplanation[]>> {
    const seedTexts = seeds.map(s => s.text).join(', ');
    const contextInfo = context ? 
      `Context: ${context.isIndoor ? 'Indoor' : ''}${context.isOutdoor ? 'Outdoor' : ''}${context.isHybrid ? 'Hybrid' : ''} vibes` :
      '';

    const request: OpenAIRequest = {
      model: this.config.openai.model,
      max_tokens: this.config.openai.maxTokens,
      temperature: this.config.openai.temperature,
      messages: [
        {
          role: 'system',
          content: `You are a taste intelligence assistant that explains why recommendations fit user preferences.
          For each item, write a concise one-line explanation connecting it to the user's original seeds and context.
          Return a JSON array with this structure:
          {
            "itemId": "item_id",
            "explanation": "Brief explanation of why this fits",
            "seedReferences": ["seed1", "seed2"]
          }
          
          Keep explanations under 100 characters and focus on the connection to user preferences and context.
          Consider the indoor/outdoor context when explaining relevance.`,
        },
        {
          role: 'user',
          content: `User seeds: ${seedTexts}
          ${contextInfo}
          
          Items to explain:
          ${items.map(item => `ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Description: ${item.description}`).join('\n')}`,
        },
      ],
    };

    const response = await this.makeRequest<OpenAIResponse>({
      method: 'POST',
      url: '/chat/completions',
      data: request,
    });

    if (!response.success || !response.data) {
      return {
        error: response.error,
        success: false,
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const explanations = JSON.parse(content) as ItemExplanation[];
      return {
        data: explanations,
        success: true,
      };
    } catch (error) {
      return {
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse OpenAI explanations response',
          details: error,
          timestamp: new Date(),
          service: 'openai',
        },
        success: false,
      };
    }
  }

  /**
   * Schedule selected items into a day plan (enhanced for context)
   */
  async scheduleDayPlan(
    selectedItems: TasteItem[],
    city: string,
    context?: VibeContext
  ): Promise<APIResponse<ScheduledPlan>> {
    const contextInfo = context ? 
      `Context: ${context.isIndoor ? 'Indoor' : ''}${context.isOutdoor ? 'Outdoor' : ''}${context.isHybrid ? 'Hybrid' : ''} preferences, ${context.timeOfDay || 'flexible'} timing, ${context.season || 'any season'}` :
      '';

    const request: OpenAIRequest = {
      model: this.config.openai.model,
      max_tokens: this.config.openai.maxTokens,
      temperature: this.config.openai.temperature,
      messages: [
        {
          role: 'system',
          content: `You are a day planning assistant that schedules activities into a realistic timeline.
          Create a logical schedule considering:
          - Meal times (breakfast 8-10am, lunch 12-2pm, dinner 6-8pm)
          - Business hours for activities
          - Travel time between locations
          - Natural flow of activities
          - Indoor/outdoor context and weather considerations
          - Seasonal appropriateness
          
          Return JSON with this structure:
          {
            "timeSlots": [
              {
                "id": "slot_id",
                "name": "Time Period",
                "time": "9:00 AM - 11:00 AM",
                "item": { /* TasteItem object */ },
                "explanation": "Why this timing works"
              }
            ],
            "travelConsiderations": ["Travel tip 1", "Travel tip 2"],
            "alternativeOptions": ["Alternative suggestion 1"]
          }`,
        },
        {
          role: 'user',
          content: `Schedule these items for a day in ${city}:
          ${contextInfo}
          
          ${selectedItems.map(item =>
            `Name: ${item.name}
            Category: ${item.category}
            Location: ${item.location}
            Duration: ${item.estimatedDuration || 'Unknown'}
            Business Hours: ${item.businessHours ? `${item.businessHours.open}-${item.businessHours.close}` : 'Unknown'}`
          ).join('\n\n')}`,
        },
      ],
    };

    const response = await this.makeRequest<OpenAIResponse>({
      method: 'POST',
      url: '/chat/completions',
      data: request,
    });

    if (!response.success || !response.data) {
      return {
        error: response.error,
        success: false,
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const plan = JSON.parse(content) as ScheduledPlan;
      return {
        data: plan,
        success: true,
      };
    } catch (error) {
      return {
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse OpenAI scheduling response',
          details: error,
          timestamp: new Date(),
          service: 'openai',
        },
        success: false,
      };
    }
  }
}