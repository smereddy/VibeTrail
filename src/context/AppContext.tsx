import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  TasteItem, 
  CityData, 
  TimeSlot, 
  ExtractedSeed, 
  QlooInsight,
  NormalizedInsight,
  ItemExplanation,
  ScheduledPlan,
  AppContextType,
  VibeContext,
  DynamicTabConfig,
  DynamicRecommendationsResponse
} from '../types';
import { cities } from '../data/mockData';
import { QlooService } from '../services/QlooService';
import { CulturalEcosystemService, CulturalEcosystem } from '../services/CulturalEcosystemService';
import { environment } from '../config/environment';

// Helper functions for context detection
const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getCurrentSeason = (): 'spring' | 'summer' | 'fall' | 'winter' => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

// AppContextType is now imported from types

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Existing state
  const [currentCity, setCurrentCity] = useState<CityData>(cities[0]); // Default to LA
  const [selectedItems, setSelectedItems] = useState<TasteItem[]>([]);
  const [vibeInput, setVibeInput] = useState<string>('');
  const [dayPlan, setDayPlan] = useState<TimeSlot[]>([
    { id: 'morning', name: 'Morning', time: '9:00 AM' },
    { id: 'lunch', name: 'Lunch', time: '12:00 PM' },
    { id: 'afternoon', name: 'Afternoon', time: '2:00 PM' },
    { id: 'dinner', name: 'Dinner', time: '6:00 PM' },
    { id: 'evening', name: 'Evening', time: '8:00 PM' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for live API integration
  const [extractedSeeds, setExtractedSeeds] = useState<ExtractedSeed[]>([]);
  const [tasteItems, setTasteItems] = useState<TasteItem[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recommendationWeights, setRecommendationWeights] = useState<Map<string, number>>(new Map());
  
  // Add state to track if day plan is being built
  const [isDayPlanBuilding, setIsDayPlanBuilding] = useState(false);
  const [currentPlanRequestId, setCurrentPlanRequestId] = useState<string | null>(null);
  
  // NEW: Dynamic tab system state
  const [vibeContext, setVibeContext] = useState<VibeContext>({});
  const [activeTabs, setActiveTabs] = useState<DynamicTabConfig[]>([]);
  const [dynamicRecommendations, setDynamicRecommendations] = useState<DynamicRecommendationsResponse | null>(null);
  
  // NEW: Cultural ecosystem state
  const [culturalEcosystem, setCulturalEcosystem] = useState<CulturalEcosystem | null>(null);
  const [isEcosystemLoading, setIsEcosystemLoading] = useState(false);
  
  // Initialize services
  const qlooService = new QlooService();
  const culturalEcosystemService = new CulturalEcosystemService();

  /**
   * Generate VibeContext from vibe input using simple heuristics
   * This replaces the need for OpenAI context detection for now
   */
  const generateVibeContext = (vibe: string, seeds: ExtractedSeed[]): VibeContext => {
    const lowerVibe = vibe.toLowerCase();
    
    // Context detection keywords
    const indoorKeywords = ['cozy', 'indoor', 'cafe', 'museum', 'theater', 'bookstore', 'library', 'gallery', 'restaurant', 'bar', 'club'];
    const outdoorKeywords = ['outdoor', 'park', 'beach', 'hiking', 'garden', 'festival', 'market', 'rooftop', 'patio', 'adventure'];
    const hybridKeywords = ['explore', 'discover', 'day out', 'mixed', 'variety', 'different', 'diverse'];
    
    const indoorScore = indoorKeywords.reduce((score, keyword) => 
      score + (lowerVibe.includes(keyword) ? 1 : 0), 0);
    const outdoorScore = outdoorKeywords.reduce((score, keyword) => 
      score + (lowerVibe.includes(keyword) ? 1 : 0), 0);
    const hybridScore = hybridKeywords.reduce((score, keyword) => 
      score + (lowerVibe.includes(keyword) ? 1 : 0), 0);
    
    // Determine context based on scores
    const isIndoor = indoorScore > outdoorScore && indoorScore > 0;
    const isOutdoor = outdoorScore > indoorScore && outdoorScore > 0;
    const isHybrid = hybridScore > 0 || (indoorScore > 0 && outdoorScore > 0);
    
    // Generate entity relevance based on seeds
    const entityRelevance: { [key: string]: number } = {};
    seeds.forEach(seed => {
      const category = seed.category.toLowerCase();
      if (category.includes('food') || category.includes('restaurant')) {
        entityRelevance['place'] = Math.max(entityRelevance['place'] || 0, seed.confidence);
      }
      if (category.includes('music') || category.includes('artist')) {
        entityRelevance['artist'] = Math.max(entityRelevance['artist'] || 0, seed.confidence);
      }
      if (category.includes('movie') || category.includes('film')) {
        entityRelevance['movie'] = Math.max(entityRelevance['movie'] || 0, seed.confidence);
      }
      if (category.includes('book')) {
        entityRelevance['book'] = Math.max(entityRelevance['book'] || 0, seed.confidence);
      }
      if (category.includes('activity') || category.includes('entertainment')) {
        entityRelevance['destination'] = Math.max(entityRelevance['destination'] || 0, seed.confidence);
      }
    });
    
    // Default relevance for places (always relevant for location-based app)
    if (!entityRelevance['place']) {
      entityRelevance['place'] = 0.8;
    }
    
    const context: VibeContext = {
      isIndoor,
      isOutdoor,
      isHybrid: isHybrid && !isIndoor && !isOutdoor,
      timeOfDay: getCurrentTimeOfDay(),
      season: getCurrentSeason(),
      entityRelevance,
      confidenceScore: seeds.length > 0 ? seeds.reduce((sum, s) => sum + s.confidence, 0) / seeds.length : 0.7
    };
    
    console.log('🎯 Generated VibeContext:', {
      indoor: context.isIndoor,
      outdoor: context.isOutdoor,
      hybrid: context.isHybrid,
      timeOfDay: context.timeOfDay,
      season: context.season,
      entityTypes: Object.keys(context.entityRelevance || {}),
      confidence: context.confidenceScore
    });
    
    return context;
  };

  /**
   * Create mock recommendations when Qloo API fails
   */
  const createMockRecommendations = (seeds: ExtractedSeed[], city: string): TasteItem[] => {
    const mockItems: TasteItem[] = [];
    
    // Create distinct food recommendations
    const foodPlaces = [
      'Desert Bloom Restaurant', 'Sunset Terrace', 'Cactus Kitchen', 'Mesa Grill', 'Phoenix Fire Steakhouse'
    ];
    
    // Create distinct activity recommendations  
    const activities = [
      'Desert Botanical Garden', 'Papago Park', 'Camelback Mountain', 'Musical Instrument Museum', 'Heard Museum'
    ];
    
    // Create distinct media recommendations
    const mediaVenues = [
      'Phoenix Theatre', 'Mesa Arts Center', 'Orpheum Theatre', 'Symphony Hall', 'Herberger Theater'
    ];
    
    // Generate food items
    foodPlaces.forEach((place, index) => {
      mockItems.push({
        id: `food_${index}`,
        name: place,
        description: `Popular ${city} restaurant known for its unique atmosphere and cuisine`,
        location: `${city} Area`,
        tasteStrength: 0.8 - (index * 0.1),
        normalizedWeight: 0.8 - (index * 0.1),
        image: '',
        whyItFits: `Great dining spot that matches your vibe preferences`,
        category: 'food',
        qlooId: `mock_food_${index}`,
        seedReferences: seeds.map(s => s.text),
        estimatedDuration: 90,
      });
    });
    
    // Generate activity items
    activities.forEach((activity, index) => {
      mockItems.push({
        id: `activity_${index}`,
        name: activity,
        description: `Must-visit ${city} attraction offering unique experiences`,
        location: `${city} Area`,
        tasteStrength: 0.8 - (index * 0.1),
        normalizedWeight: 0.8 - (index * 0.1),
        image: '',
        whyItFits: `Perfect activity that aligns with your interests`,
        category: 'activity',
        qlooId: `mock_activity_${index}`,
        seedReferences: seeds.map(s => s.text),
        estimatedDuration: 120,
      });
    });
    
    // Generate media items
    mediaVenues.forEach((venue, index) => {
      mockItems.push({
        id: `media_${index}`,
        name: venue,
        description: `Cultural venue in ${city} featuring music, arts, and entertainment`,
        location: `${city} Area`,
        tasteStrength: 0.8 - (index * 0.1),
        normalizedWeight: 0.8 - (index * 0.1),
        image: '',
        whyItFits: `Cultural experience that complements your taste profile`,
        category: 'media',
        qlooId: `mock_media_${index}`,
        seedReferences: seeds.map(s => s.text),
        estimatedDuration: 90,
      });
    });
    
    return mockItems;
  };

  /**
   * Update city data with recommendations
   */
  const updateCityWithRecommendations = (recommendations: TasteItem[], seeds: ExtractedSeed[], cityName: string) => {
    // Find the correct city from the cities array or create a new one
    const targetCity = cities.find(c => c.name === cityName) || currentCity;
    
    const updatedCity: CityData = {
      ...targetCity,
      name: cityName, // Ensure the correct city name is set
      recommendations: recommendations,
      seeds: seeds.map((seed, index) => ({
        id: `seed_${index}`,
        text: seed.text,
        category: seed.category,
        confidence: seed.confidence
      }))
    };
    
    console.log('🏙️ Updating city data for:', cityName);
    setCurrentCity(updatedCity);
  };

  /**
   * Process vibe input with dynamic tab generation
   * Enhanced to generate VibeContext and dynamic tabs
   */
  const processVibeInput = async (vibe: string, city: string): Promise<void> => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      // Clear previously selected items when processing a new vibe
      setSelectedItems([]);
      
      console.log(`🎯 Processing vibe: "${vibe}" in ${city}`);
      
      // Single API call to our taste endpoint (now via Netlify Functions)
      const response = await fetch(`${environment.app.apiProxyUrl}/taste`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vibe,
          city
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

      const { seeds, recommendations, vibeContext: aiVibeContext, culturalInsights } = data.data;
      console.log('✅ Received taste response:', {
        seeds: seeds.length,
        totalRecommendations: Object.values(recommendations).reduce((sum: number, arr: any) => sum + arr.length, 0),
        breakdown: {
          food: recommendations.food.length,
          activities: recommendations.activities.length,
          movies: recommendations.movies.length,
          tv_shows: recommendations.tv_shows.length,
          music: recommendations.music.length,
          books: recommendations.books.length
        }
      });

      console.log('🔍 Raw API response data:', {
        seeds: seeds,
        food: recommendations.food,
        activities: recommendations.activities,
        movies: recommendations.movies,
        tv_shows: recommendations.tv_shows,
        music: recommendations.music,
        books: recommendations.books
      });

      // Set extracted seeds
      setExtractedSeeds(seeds);

      // NEW: Use AI-generated VibeContext or fallback to heuristic generation
      try {
        const generatedVibeContext = aiVibeContext || generateVibeContext(vibe, seeds);
        setVibeContext(generatedVibeContext);
        
        console.log('🎯 Using vibe context:', {
          source: aiVibeContext ? 'AI-generated' : 'heuristic fallback',
          context: generatedVibeContext
        });
        
        // Generate dynamic tabs using QlooService
        const dynamicTabs = qlooService.getDynamicTabs(generatedVibeContext);
        
        if (dynamicTabs && dynamicTabs.length > 0) {
          setActiveTabs(dynamicTabs);
          console.log('🎯 Generated dynamic tabs:', dynamicTabs.map(tab => 
            `${tab.displayName} (priority: ${tab.priority.toFixed(2)})`
          ));
        } else {
          console.warn('⚠️ No dynamic tabs generated, Results page will use static fallback');
          setActiveTabs([]);
        }

        // NEW: Build cultural ecosystem - will be called after tasteItems are set
        setIsEcosystemLoading(true);

      } catch (error) {
        console.error('❌ Error generating dynamic tabs:', error);
        setActiveTabs([]); // Clear tabs to trigger fallback
        setIsEcosystemLoading(false);
        // Don't throw - let the Results page handle fallback gracefully
      }

      // Convert API response to TasteItems
      const allInsights: any[] = [];

      // Add food recommendations
      recommendations.food.forEach((item: any) => {
        allInsights.push({
          ...item,
          category: 'food',
          tabName: 'Food'
        });
      });

      // Add activity recommendations
      recommendations.activities.forEach((item: any) => {
        allInsights.push({
          ...item,
          category: 'activity',
          tabName: 'Activities'
        });
      });

      // Add movie recommendations
      recommendations.movies.forEach((item: any) => {
        allInsights.push({
          ...item,
          category: 'movie',
          tabName: 'Movies'
        });
      });

      // Add TV show recommendations
      recommendations.tv_shows.forEach((item: any) => {
        allInsights.push({
          ...item,
          category: 'tv_show',
          tabName: 'TV Shows'
        });
      });

      // Add music recommendations
      recommendations.music.forEach((item: any) => {
        allInsights.push({
          ...item,
          category: 'artist',
          tabName: 'Music'
        });
      });

      // Add book recommendations
      recommendations.books.forEach((item: any) => {
        allInsights.push({
          ...item,
          category: 'book',
          tabName: 'Books'
        });
      });

      // Add podcast recommendations (if available)
      if (recommendations.podcasts) {
        recommendations.podcasts.forEach((item: any) => {
          allInsights.push({
            ...item,
            category: 'podcast',
            tabName: 'Podcasts'
          });
        });
      }

      // Add videogame recommendations (if available)
      if (recommendations.games || recommendations.videogames) {
        const games = recommendations.games || recommendations.videogames || [];
        games.forEach((item: any) => {
          allInsights.push({
            ...item,
            category: 'videogame',
            tabName: 'Games'
          });
        });
      }

      // Add destination recommendations (if available)
      if (recommendations.destinations) {
        recommendations.destinations.forEach((item: any) => {
          allInsights.push({
            ...item,
            category: 'destination',
            tabName: 'Destinations'
          });
        });
      }

      // If no insights from API, use mock data
      if (allInsights.length === 0) {
        console.log('⚠️ No API insights found, using mock data');
        const mockItems = createMockRecommendations(seeds, city);
        updateCityWithRecommendations(mockItems, seeds, city);
        setTasteItems(mockItems);
        return;
      }

      // Convert API insights to TasteItems
      const tasteItems: TasteItem[] = allInsights.map((insight: any, index: number) => {
        const realAddress = insight.properties?.address || `${city} Area`;
        const realDescription = insight.properties?.description || insight.name || 'A great recommendation based on your vibe';
        
        return {
          id: insight.entity_id || insight.id || `item_${index}`,
          name: insight.name || 'Unnamed Recommendation',
          description: realDescription,
          location: realAddress,
          tasteStrength: insight.score || 0.8,
          normalizedWeight: insight.score || 0.8,
          image: insight.properties?.image || '',
          whyItFits: `Great match for your vibe - ${seeds.slice(0, 2).map((s: any) => s.text).join(' and ')}`,
          category: insight.category as 'food' | 'activity' | 'media' | 'movie' | 'tv_show' | 'artist' | 'book' | 'podcast' | 'videogame' | 'destination',
          qlooId: insight.entity_id || insight.id,
          seedReferences: seeds.slice(0, 3).map((s: any) => s.text),
          estimatedDuration: insight.category === 'food' ? 90 : insight.category === 'activity' ? 120 : 60,
          businessHours: insight.properties?.hours,
          priceRange: insight.properties?.price_level ? '$'.repeat(Math.min(insight.properties.price_level, 4)) : undefined,
          rating: insight.properties?.business_rating || insight.properties?.rating,
          phone: insight.properties?.phone,
          website: insight.properties?.website,
          neighborhood: insight.properties?.neighborhood,
          
          // Dynamic properties
          tabName: insight.tabName,
          entityType: insight.entityType,
          relevanceScore: insight.score
        };
      });

      console.log('✅ Generated TasteItems:', tasteItems.length);
      console.log('📊 Categories breakdown:', {
        food: tasteItems.filter(item => item.category === 'food').length,
        activity: tasteItems.filter(item => item.category === 'activity').length,
        movie: tasteItems.filter(item => item.category === 'movie').length,
        tv_show: tasteItems.filter(item => item.category === 'tv_show').length,
        artist: tasteItems.filter(item => item.category === 'artist').length,
        book: tasteItems.filter(item => item.category === 'book').length,
        podcast: tasteItems.filter(item => item.category === 'podcast').length
      });

      console.log('🔍 Setting tasteItems in state:', tasteItems.slice(0, 5).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category
      })));

      console.log('🔍 About to update city with:', {
        cityName: city,
        recommendationsCount: tasteItems.length,
        seedsCount: seeds.length
      });

      // Update recommendation weights map
      const weightsMap = new Map<string, number>();
      tasteItems.forEach(item => {
        weightsMap.set(item.id, item.normalizedWeight);
      });
      setRecommendationWeights(weightsMap);

      // Update current city data with live recommendations
      updateCityWithRecommendations(tasteItems, seeds, city);
      setTasteItems(tasteItems);

      // Build cultural ecosystem from the taste items we just created
      console.log('🌍 About to build cultural ecosystem with:', {
        vibe,
        city,
        tasteItemsCount: tasteItems.length,
        seedsCount: seeds.length,
        vibeContext: vibeContext,
        hasCulturalInsights: !!culturalInsights
      });
      
      const currentVibeContext = vibeContext || generateVibeContext(vibe, seeds);
      culturalEcosystemService.buildCulturalEcosystemFromTasteItems(
        vibe,
        city,
        currentVibeContext,
        seeds,
        tasteItems,
        culturalInsights
        ).then(ecosystemResponse => {
          if (ecosystemResponse.success && ecosystemResponse.data) {
            setCulturalEcosystem(ecosystemResponse.data);
            console.log('🌍 Cultural ecosystem built successfully from taste items');
          } else {
            console.warn('⚠️ Failed to build cultural ecosystem:', ecosystemResponse.error);
            setCulturalEcosystem(null);
          }
        }).catch(error => {
          console.error('❌ Error building cultural ecosystem:', error);
          setCulturalEcosystem(null);
        }).finally(() => {
          setIsEcosystemLoading(false);
        });
      
    } catch (error) {
      console.error('Error processing vibe input:', error);
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Build a day plan using OpenAI for intelligent scheduling
   */
  const buildDayPlan = useCallback(async (selectedItems: TasteItem[]): Promise<void> => {
    // Create a unique request ID
    const requestId = Math.random().toString(36).substring(2, 15);
    
    // Prevent multiple simultaneous calls
    if (isDayPlanBuilding) {
      console.log('🚫 Day plan already being built, skipping duplicate call');
      return;
    }

    try {
      setIsDayPlanBuilding(true);
      setCurrentPlanRequestId(requestId);
      setIsLoading(true);
      setApiError(null);
      
      // Clear existing plan to show loading state
      setDayPlan([]);
      
      console.log(`🗓️ [${requestId}] Building day plan for ${selectedItems.length} items in ${currentCity.name}`);
      
      // Call our day planning API endpoint (now via Netlify Functions)
      const response = await fetch(`${environment.app.apiProxyUrl}/plan-day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems,
          city: currentCity.name,
          preferences: {
            // Add user preferences here in the future
            avoidBackToBackFood: true,
            preferLocalTravel: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Day planning failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Day planning was not successful');
      }

      const { dayPlan, totalItems, estimatedTotalDuration } = data.data;
      
      console.log(`✅ [${requestId}] Received day plan:`, {
        scheduledItems: dayPlan.length,
        totalItems,
        estimatedDuration: `${Math.round(estimatedTotalDuration / 60)} hours`
      });

      // Convert API response to our TimeSlot format
      const timeSlots = dayPlan.map((slot: any, index: number) => ({
        id: slot.period || `slot_${index}`,
        name: slot.period.charAt(0).toUpperCase() + slot.period.slice(1).replace('_', ' '),
        time: slot.timeSlot,
        item: selectedItems.find(item => item.name === slot.item.name) || null,
        reasoning: slot.item.reasoning,
        duration: slot.item.duration
      }));

      console.log(`🗓️ [${requestId}] Generated time slots:`, timeSlots.map(slot => ({
        time: slot.time,
        name: slot.item?.name,
        category: slot.item?.category,
        reasoning: slot.reasoning
      })));

      setDayPlan(timeSlots);
      
    } catch (error) {
      console.error('Error building day plan:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to build day plan');
      
      // Fallback: Create a simple sequential plan
      const fallbackTimeSlots = selectedItems.map((item, index) => {
        const times = ['9:00 AM', '11:30 AM', '2:00 PM', '5:00 PM', '7:30 PM'];
        const names = ['Morning', 'Late Morning', 'Afternoon', 'Evening', 'Night'];
        
        return {
          id: `fallback_${index}`,
          name: names[index] || 'Evening',
          time: times[index] || `${9 + index * 2}:00 AM`,
          item,
          reasoning: 'Simple sequential scheduling (OpenAI planning failed)',
          duration: item.estimatedDuration || 90
        };
      });
      
      setDayPlan(fallbackTimeSlots);
    } finally {
      setIsLoading(false);
      setIsDayPlanBuilding(false);
      setCurrentPlanRequestId(null);
    }
  }, [currentCity.name, isDayPlanBuilding]);

  /**
   * Export calendar (placeholder for now)
   */
  const exportCalendar = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      // This will be implemented in task 10
      console.log('Calendar export functionality will be implemented in task 10');
      
    } catch (error) {
      console.error('Error exporting calendar:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to export calendar');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a surprise plan using AI and cultural ecosystem analysis
   * This creates an AI-curated selection of items based on the user's cultural profile
   */
  const generateSurprisePlan = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      console.log('🎲 Generating surprise plan using cultural ecosystem analysis...');
      
      // Ensure we have recommendations to work with
      if (tasteItems.length === 0) {
        throw new Error('No recommendations available. Please process a vibe first.');
      }
      
      // Use cultural ecosystem for intelligent selection if available
      let surpriseItems: TasteItem[] = [];
      
      if (culturalEcosystem && culturalEcosystem.connections.length > 0) {
        console.log('🌍 Using cultural ecosystem for surprise selection');
        
        // Get entities that have strong connections (high cultural relevance)
        const connectedEntityIds = new Set<string>();
        culturalEcosystem.connections
          .filter(conn => conn.connectionStrength > 0.6)
          .forEach(conn => {
            connectedEntityIds.add(conn.fromEntity.id);
            connectedEntityIds.add(conn.toEntity.id);
          });
        
        // Find taste items that correspond to highly connected entities
        const highlyConnectedItems = tasteItems.filter(item => 
          connectedEntityIds.has(item.id) || connectedEntityIds.has(item.qlooId)
        );
        
        console.log(`🔗 Found ${highlyConnectedItems.length} highly connected items`);
        
        // If we have enough connected items, use them
        if (highlyConnectedItems.length >= 3) {
          // Select diverse categories from connected items
          const categorizedItems = highlyConnectedItems.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {} as Record<string, TasteItem[]>);
          
          // Select one item from each category, prioritizing variety
          const categories = Object.keys(categorizedItems);
          for (let i = 0; i < Math.min(5, categories.length); i++) {
            const category = categories[i];
            const categoryItems = categorizedItems[category]
              .sort((a, b) => b.tasteStrength - a.tasteStrength);
            surpriseItems.push(categoryItems[0]);
          }
          
          console.log(`🎯 Selected ${surpriseItems.length} items from cultural ecosystem`);
        }
      }
      
      // Fallback: Use AI-powered selection based on taste strengths and diversity
      if (surpriseItems.length < 3) {
        console.log('🤖 Using AI-powered diversity selection');
        
        // Group items by category and select the best from each
        const categorizedItems = tasteItems.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {} as Record<string, TasteItem[]>);
        
        // Select top items from each category for diversity
        const categories = Object.keys(categorizedItems);
        const selectedFromCategories: TasteItem[] = [];
        
        categories.forEach(category => {
          const categoryItems = categorizedItems[category]
            .sort((a, b) => b.tasteStrength - a.tasteStrength);
          
          if (categoryItems.length > 0) {
            selectedFromCategories.push(categoryItems[0]);
          }
        });
        
        // Sort by taste strength and take top 5
        surpriseItems = selectedFromCategories
          .sort((a, b) => b.tasteStrength - a.tasteStrength)
          .slice(0, 5);
      }
      
      // Ensure we have at least 3 items
      if (surpriseItems.length < 3) {
        // Add highest-rated items to reach minimum
        const remainingItems = tasteItems
          .filter(item => !surpriseItems.some(selected => selected.id === item.id))
          .sort((a, b) => b.tasteStrength - a.tasteStrength);
        
        while (surpriseItems.length < 3 && remainingItems.length > 0) {
          surpriseItems.push(remainingItems.shift()!);
        }
      }
      
      console.log(`✨ Generated surprise plan with ${surpriseItems.length} items:`, 
        surpriseItems.map(item => ({
          name: item.name,
          category: item.category,
          strength: item.tasteStrength
        }))
      );
      
      // Set the selected items (this will trigger plan building)
      setSelectedItems(surpriseItems);
      
      // Build the day plan automatically
      await buildDayPlan(surpriseItems);
      
      console.log('🎉 Surprise plan generated successfully!');
      
    } catch (error) {
      console.error('Error generating surprise plan:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate surprise plan');
    } finally {
      setIsLoading(false);
    }
  };


  // NEW: Dynamic system methods
  const refreshRecommendations = async (contextOverride?: Partial<VibeContext>): Promise<void> => {
    if (!vibeInput) return;
    
    const updatedContext = { ...vibeContext, ...contextOverride };
    setVibeContext(updatedContext);
    
    const dynamicTabs = qlooService.getDynamicTabs(updatedContext);
    setActiveTabs(dynamicTabs);
    
    console.log('🔄 Refreshed recommendations with updated context');
  };

  const updateTabPriorities = (priorities: { [tabName: string]: number }): void => {
    const updatedTabs = activeTabs.map(tab => ({
      ...tab,
      priority: priorities[tab.displayName] || tab.priority
    })).sort((a, b) => b.priority - a.priority);
    
    setActiveTabs(updatedTabs);
    console.log('📊 Updated tab priorities');
  };

  const getRecommendationsByTab = (tabName: string): TasteItem[] => {
    // Map tab name to category for existing recommendations
    const categoryMap: { [key: string]: string[] } = {
      'Places': ['food', 'activity'],
      'Movies': ['movie'],
      'TV Shows': ['tv_show'],
      'Music': ['artist'],
      'Books': ['book'],
      'Podcasts': ['podcast'],
      'Games': ['videogame'],
      'Destinations': ['destination', 'activity'] // Destinations can include activities
    };
    
    const categories = categoryMap[tabName] || [];
    const items = tasteItems.filter(item => categories.includes(item.category));
    
    console.log(`🎯 Getting recommendations for tab "${tabName}":`, {
      categories,
      foundItems: items.length,
      totalItems: tasteItems.length
    });
    
    return items;
  };

  return (
    <AppContext.Provider value={{
      // Existing properties
      currentCity,
      setCurrentCity,
      selectedItems,
      setSelectedItems,
      vibeInput,
      setVibeInput,
      dayPlan,
      setDayPlan,
      isLoading,
      setIsLoading,
      
      // New properties for live integration
      extractedSeeds,
      setExtractedSeeds,
      tasteItems,
      setTasteItems,
      apiError,
      setApiError,
      recommendationWeights,
      setRecommendationWeights,
      
      // NEW: Dynamic system properties
      vibeContext,
      setVibeContext,
      activeTabs,
      setActiveTabs,
      dynamicRecommendations,
      setDynamicRecommendations,
      
      // NEW: Cultural ecosystem properties
      culturalEcosystem,
      setCulturalEcosystem,
      isEcosystemLoading,
      
      // Enhanced methods
      processVibeInput,
      buildDayPlan,
      exportCalendar,
      generateSurprisePlan,
      
      // NEW: Dynamic system methods
      refreshRecommendations,
      updateTabPriorities,
      getRecommendationsByTab
    }}>
      {children}
    </AppContext.Provider>
  );
};