const axios = require('axios');

// Enhanced logging utility
const log = {
  info: (message, data = null) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error = null) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  warn: (message, data = null) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Request timeout configuration
const TIMEOUTS = {
  OPENAI: 45000, // 45 seconds for OpenAI (can be slow)
  DEFAULT: 30000 // 30 seconds default
};

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const { vibe, city } = JSON.parse(event.body);

    if (!vibe || !city) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: vibe and city' 
        })
      };
    }

    log.info(`[${requestId}] Processing taste request: "${vibe}" in ${city}`);

    // Step 1: Extract seeds from vibe using OpenAI
    log.info(`[${requestId}] Calling OpenAI to extract seeds...`);
    
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: false, error: 'OpenAI API key not configured' })
      };
    }

    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a taste preference analyzer that extracts specific, actionable seeds from user input for recommendation systems.

Extract 3-5 taste seeds from the user's vibe description. Each seed should be:
- Specific and actionable (not abstract concepts)
- Suitable for searching recommendation APIs
- Focused on concrete experiences, places, or activities

Return a JSON array with this exact structure:
[
    {
        "text": "specific seed phrase",
        "category": "food|activity|media|general",
        "confidence": 0.0-1.0,
        "searchTerms": ["term1", "term2", "term3"]
    }
]

Focus on extracting seeds that would lead to different, personalized recommendations.`
        },
        {
          role: 'user',
          content: `Extract seeds from this vibe: "${vibe}"`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: TIMEOUTS.OPENAI
    });

    let seeds = [];
    try {
      const content = openaiResponse.data.choices[0].message.content;
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      seeds = JSON.parse(cleanContent);
      log.info(`[${requestId}] Extracted seeds:`, seeds.map(s => s.text));
    } catch (e) {
      log.error(`[${requestId}] Failed to parse OpenAI response:`, e);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Failed to parse seed extraction response' 
        })
      };
    }

    // Step 2: Get recommendations from Qloo using the extracted seeds
    log.info(`[${requestId}] Getting recommendations from Qloo...`);
    
    if (!process.env.QLOO_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: false, error: 'Qloo API key not configured' })
      };
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
    const callQlooAPI = async (entityType, tags = [], limit = 8) => {
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

      try {
        const response = await axios.get(`https://hackathon.api.qloo.com/v2/insights?${params.toString()}`, {
          headers: { 'X-Api-Key': process.env.QLOO_API_KEY },
          timeout: TIMEOUTS.DEFAULT
        });

        return response.data.results?.entities || [];
      } catch (error) {
        log.warn(`[${requestId}] Qloo API call failed for ${entityType}:`, error.response?.status);
        return [];
      }
    };

    try {
      // Get food recommendations in parallel
      const [foodResults, activityResults, movieResults, tvResults, musicResults, bookResults] = await Promise.all([
        callQlooAPI('urn:entity:place', ['urn:tag:genre:place:restaurant', 'urn:tag:genre:place:cafe'], 12),
        callQlooAPI('urn:entity:place', ['urn:tag:category:place:museum', 'urn:tag:category:place:attraction', 'urn:tag:category:place:park'], 8),
        callQlooAPI('urn:entity:movie', [], 6),
        callQlooAPI('urn:entity:tv_show', [], 6),
        callQlooAPI('urn:entity:artist', [], 6),
        callQlooAPI('urn:entity:book', [], 6)
      ]);

      // Filter food results
      recommendations.food = foodResults.filter(item => {
        const name = item.name?.toLowerCase() || '';
        const isRetailStore = name.includes('walmart') || name.includes('target') || 
                             name.includes('supercenter') || name.includes('grocery');
        const isGasStation = name.includes('shell') || name.includes('bp') || 
                           name.includes('gas') || name.includes('fuel');
        return !isRetailStore && !isGasStation;
      }).slice(0, 8);

      recommendations.activities = activityResults;
      recommendations.movies = movieResults;
      recommendations.tv_shows = tvResults;
      recommendations.music = musicResults;
      recommendations.books = bookResults;

    } catch (error) {
      log.error(`[${requestId}] Error fetching Qloo recommendations:`, error);
      // Continue with empty recommendations rather than failing
    }

    // Log results summary
    const totalRecommendations = Object.values(recommendations).reduce((sum, arr) => sum + arr.length, 0);
    const duration = Date.now() - startTime;
    
    log.info(`[${requestId}] Retrieved recommendations in ${duration}ms:`, {
      total: totalRecommendations,
      food: recommendations.food.length,
      activities: recommendations.activities.length,
      movies: recommendations.movies.length,
      tv_shows: recommendations.tv_shows.length,
      music: recommendations.music.length,
      books: recommendations.books.length
    });

    // Return complete response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          seeds,
          recommendations,
          city,
          vibe
        }
      })
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    log.error(`[${requestId}] Taste API error after ${duration}ms:`, error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      })
    };
  }
}; 