import type { VercelRequest, VercelResponse } from '@vercel/node';

// API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QLOO_API_KEY = process.env.QLOO_API_KEY;
const QLOO_BASE_URL = process.env.QLOO_BASE_URL || 'https://hackathon.api.qloo.com';

interface TasteRequest {
  vibe: string;
  city: string;
}

interface ExtractedSeed {
  text: string;
  category: string;
  confidence: number;
  searchTerms: string[];
}

interface VibeContext {
  timeOfDay?: string;
  season?: string;
  isIndoor: boolean;
  isOutdoor: boolean;
  isHybrid: boolean;
  socialSize?: string;
  mood?: string;
  pace?: string;
  culturalStyle?: string;
  priceRange?: string;
}

interface TasteResponse {
  success: boolean;
  data?: {
    seeds: ExtractedSeed[];
    vibeContext: VibeContext;
    culturalInsights: {
      primaryThemes: string[];
      personalityTraits: string[];
      culturalProfile: string;
      recommendations: string[];
    };
    recommendations: {
      food: any[];
      activities: any[];
      movies: any[];
      tv_shows: any[];
      music: any[];
      books: any[];
    };
    city: string;
    vibe: string;
  };
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { vibe, city }: TasteRequest = req.body;

    if (!vibe || !city) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: vibe and city' 
      });
      return;
    }

    console.log(`🎯 Processing taste request: "${vibe}" in ${city}`);

    // Step 1: Extract seeds from vibe using OpenAI
    console.log('🤖 Calling OpenAI to extract seeds...');
    
    if (!OPENAI_API_KEY) {
      res.status(500).json({ success: false, error: 'OpenAI API key not configured' });
      return;
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 800,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are an advanced cultural taste analyzer that extracts seeds, context, and insights from user vibes for personalized recommendations.

Analyze the user's vibe and return comprehensive cultural intelligence in this EXACT JSON structure:

{
  "seeds": [
    {
      "text": "specific seed phrase",
      "category": "food|activity|media|general",
      "confidence": 0.0-1.0,
      "searchTerms": ["term1", "term2", "term3"]
    }
  ],
  "vibeContext": {
    "timeOfDay": "morning|afternoon|evening|night|null",
    "season": "spring|summer|fall|winter|null",
    "isIndoor": boolean,
    "isOutdoor": boolean,
    "isHybrid": boolean,
    "socialSize": "intimate|group|null",
    "mood": "relaxed|energetic|romantic|adventurous|cozy|sophisticated|null",
    "pace": "slow|moderate|fast|null",
    "culturalStyle": "mainstream|indie|artisanal|luxury|casual|eclectic|null",
    "priceRange": "budget|moderate|upscale|luxury|null"
  },
  "culturalInsights": {
    "primaryThemes": ["theme1", "theme2", "theme3"],
    "personalityTraits": ["trait1", "trait2"],
    "culturalProfile": "2-3 sentence personality description",
    "recommendations": ["actionable suggestion 1", "actionable suggestion 2"]
  }
}

SEEDS: Extract 3-5 specific, actionable seeds suitable for recommendation APIs.
CONTEXT: Analyze environmental, temporal, and social preferences.
INSIGHTS: Provide deep cultural analysis and personality insights.

Be precise and conservative - use null when uncertain.`
          },
          {
            role: 'user',
            content: `Analyze this vibe: "${vibe}" for ${city}`
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('❌ OpenAI API error:', error);
      res.status(500).json({ 
        success: false, 
        error: `OpenAI API error: ${error.error?.message || 'Unknown error'}` 
      });
      return;
    }

    const openaiData = await openaiResponse.json();
    let seeds: ExtractedSeed[] = [];
    let vibeContext: VibeContext;
    let culturalInsights: any;

    try {
      const content = openaiData.choices[0].message.content;
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiAnalysis = JSON.parse(cleanContent);
      
      seeds = aiAnalysis.seeds || [];
      vibeContext = aiAnalysis.vibeContext || {
        isIndoor: false,
        isOutdoor: false,
        isHybrid: false
      };
      culturalInsights = aiAnalysis.culturalInsights || {
        primaryThemes: [],
        personalityTraits: [],
        culturalProfile: '',
        recommendations: []
      };
      
      console.log('✅ AI Analysis complete:', {
        seeds: seeds.length,
        context: Object.keys(vibeContext).length,
        themes: culturalInsights.primaryThemes?.length || 0
      });
    } catch (e) {
      console.error('❌ Failed to parse OpenAI response:', e);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to parse AI analysis response' 
      });
      return;
    }

    // Step 2: Get recommendations from Qloo using the extracted seeds
    console.log('🔍 Getting recommendations from Qloo...');
    
    if (!QLOO_API_KEY) {
      res.status(500).json({ success: false, error: 'Qloo API key not configured' });
      return;
    }

    const recommendations = {
      food: [],
      activities: [],
      movies: [],
      tv_shows: [],
      music: [],
      books: []
    };

    // Helper function to make Qloo API calls
    const callQlooAPI = async (entityType: string, tags: string[] = [], limit: number = 8) => {
      const params = new URLSearchParams({
        'filter.type': entityType,
        'filter.location.query': city,
        'limit': limit.toString()
      });

      // Add tags if provided
      tags.forEach(tag => {
        params.append('filter.tags', tag);
      });

      // Add seed terms as interest signals
      seeds.forEach(seed => {
        seed.searchTerms.forEach(term => {
          params.append('signal.interests.query', term);
        });
      });

      const response = await fetch(`${QLOO_BASE_URL}/v2/insights?${params.toString()}`, {
        headers: { 'X-Api-Key': QLOO_API_KEY }
      });

      if (response.ok) {
        const data = await response.json();
        return data.results?.entities || [];
      } else {
        console.warn(`⚠️ Qloo API call failed for ${entityType}:`, response.status);
        return [];
      }
    };

    try {
      // Get food recommendations
      console.log('🍽️ Fetching food recommendations...');
      const foodResults = await callQlooAPI(
        'urn:entity:place',
        ['urn:tag:genre:place:restaurant', 'urn:tag:genre:place:cafe'],
        12
      );
      
      // Filter out non-food places
      recommendations.food = foodResults.filter((item: any) => {
        const name = item.name?.toLowerCase() || '';
        const isRetailStore = name.includes('walmart') || name.includes('target') || 
                             name.includes('supercenter') || name.includes('grocery');
        const isGasStation = name.includes('shell') || name.includes('bp') || 
                           name.includes('gas') || name.includes('fuel');
        return !isRetailStore && !isGasStation;
      }).slice(0, 8);

      // Get activity recommendations
      console.log('🏛️ Fetching activity recommendations...');
      recommendations.activities = await callQlooAPI(
        'urn:entity:place',
        ['urn:tag:category:place:museum', 'urn:tag:category:place:attraction', 'urn:tag:category:place:park'],
        8
      );

      // Get movie recommendations
      console.log('🎬 Fetching movie recommendations...');
      recommendations.movies = await callQlooAPI('urn:entity:movie', [], 6);

      // Get TV show recommendations
      console.log('📺 Fetching TV show recommendations...');
      recommendations.tv_shows = await callQlooAPI('urn:entity:tv_show', [], 6);

      // Get music recommendations
      console.log('🎵 Fetching music recommendations...');
      recommendations.music = await callQlooAPI('urn:entity:artist', [], 6);

      // Get book recommendations
      console.log('📚 Fetching book recommendations...');
      recommendations.books = await callQlooAPI('urn:entity:book', [], 6);

    } catch (error) {
      console.error('❌ Error fetching Qloo recommendations:', error);
      // Continue with empty recommendations rather than failing
    }

    // Log results summary
    const totalRecommendations = Object.values(recommendations).reduce((sum, arr) => sum + arr.length, 0);
    console.log('✅ Retrieved recommendations:', {
      total: totalRecommendations,
      food: recommendations.food.length,
      activities: recommendations.activities.length,
      movies: recommendations.movies.length,
      tv_shows: recommendations.tv_shows.length,
      music: recommendations.music.length,
      books: recommendations.books.length
    });

    // Return complete response with enriched AI data
    const response: TasteResponse = {
      success: true,
      data: {
        seeds,
        vibeContext,
        culturalInsights,
        recommendations,
        city,
        vibe
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Taste API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
} 