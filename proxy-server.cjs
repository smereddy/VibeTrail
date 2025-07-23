const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

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

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthData = { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    openaiKey: !!process.env.OPENAI_API_KEY,
    qlooKey: !!process.env.QLOO_API_KEY,
    note: 'Qloo API calls are now direct (no proxy)',
    timeouts: TIMEOUTS
  };
  
  log.info('Health check requested', healthData);
  res.json(healthData);
});

// OpenAI proxy endpoint
app.post('/api/openai/chat/completions', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    // Use gpt-4o-mini as default model if not specified
    const requestBody = {
      ...req.body,
      model: req.body.model || 'gpt-4o-mini'
    };
    
    log.info(`OpenAI API call started [${requestId}]`, {
      model: requestBody.model,
      messageCount: requestBody.messages?.length,
      maxTokens: requestBody.max_tokens,
      temperature: requestBody.temperature
    });
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUTS.OPENAI
    });
    
    const duration = Date.now() - startTime;
    log.info(`OpenAI API call successful [${requestId}]`, {
      duration: `${duration}ms`,
      tokensUsed: response.data.usage?.total_tokens,
      finishReason: response.data.choices?.[0]?.finish_reason
    });
    
    res.json(response.data);
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error.code === 'ECONNABORTED') {
      log.error(`OpenAI API timeout [${requestId}]`, { duration: `${duration}ms`, timeout: TIMEOUTS.OPENAI });
      res.status(408).json({
        error: 'OpenAI API request timeout',
        details: `Request timed out after ${TIMEOUTS.OPENAI}ms`
      });
    } else {
      log.error(`OpenAI API error [${requestId}]`, {
        duration: `${duration}ms`,
        status: error.response?.status,
        error: error.response?.data || error.message
      });
      
      res.status(error.response?.status || 500).json({
        error: 'OpenAI API request failed',
        details: error.response?.data || error.message
      });
    }
  }
});

// Taste API endpoint - handles complete vibe processing
app.post('/api/taste', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const { vibe, city } = req.body;

    if (!vibe || !city) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: vibe and city' 
      });
    }

    log.info(`[${requestId}] Processing taste request: "${vibe}" in ${city}`);

    // Step 1: Extract seeds from vibe using OpenAI
    log.info(`[${requestId}] Calling OpenAI to extract seeds...`);
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'OpenAI API key not configured' });
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
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to parse seed extraction response' 
      });
    }

    // Step 2: Get recommendations from Qloo using the extracted seeds
    log.info(`[${requestId}] Getting recommendations from Qloo...`);
    
    if (!process.env.QLOO_API_KEY) {
      return res.status(500).json({ success: false, error: 'Qloo API key not configured' });
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
    res.json({
      success: true,
      data: {
        seeds,
        recommendations,
        city,
        vibe
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    log.error(`[${requestId}] Taste API error after ${duration}ms:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Day Planning API endpoint - uses OpenAI for intelligent scheduling
app.post('/api/plan-day', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const { selectedItems, city, preferences = {} } = req.body;

    if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing or empty selectedItems array' 
      });
    }

    log.info(`[${requestId}] Planning day for ${selectedItems.length} items in ${city}`);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'OpenAI API key not configured' });
    }

    // Prepare items data for OpenAI
    const itemsData = selectedItems.map(item => ({
      name: item.name,
      category: item.category,
      description: item.description,
      location: item.location,
      estimatedDuration: item.estimatedDuration || (item.category === 'food' ? 90 : item.category === 'activity' ? 120 : 60),
      priceRange: item.priceRange,
      businessHours: item.businessHours,
      neighborhood: item.neighborhood
    }));

    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      max_tokens: 1200,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are an expert day planner who creates optimal daily itineraries. Your goal is to create a logical, enjoyable sequence of activities that flows naturally.

SCHEDULING PRINCIPLES:
1. NEVER schedule food items back-to-back (no breakfast→lunch or lunch→dinner without activities between)
2. Consider natural timing: breakfast (8-10am), lunch (12-2pm), dinner (6-8pm)
3. Group activities by location/neighborhood when possible to minimize travel
4. Account for estimated duration and business hours
5. Create natural transitions (e.g., museum→coffee→dinner)
6. Leave buffer time between activities (15-30 minutes)

RESPONSE FORMAT - Return a JSON array with this exact structure:
[
  {
    "timeSlot": "9:00 AM",
    "period": "morning",
    "item": {
      "name": "item name",
      "category": "food|activity|movie|tv_show|artist|book",
      "duration": 90,
      "reasoning": "Why this item fits this time slot"
    }
  }
]

TIME PERIODS: morning (8-11am), late_morning (11am-1pm), afternoon (1-5pm), evening (5-8pm), night (8pm+)`
        },
        {
          role: 'user',
          content: `Plan a day in ${city} using these selected items:

${itemsData.map((item, i) => `${i+1}. ${item.name} (${item.category})
   - Description: ${item.description}
   - Duration: ~${item.estimatedDuration} minutes
   - Location: ${item.location}
   ${item.businessHours ? `- Hours: ${JSON.stringify(item.businessHours)}` : ''}
   ${item.priceRange ? `- Price: ${item.priceRange}` : ''}
`).join('\n')}

User preferences: ${JSON.stringify(preferences)}

Create an optimal day plan that flows naturally, avoids food-after-food scheduling, and considers timing and location logistics.`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: TIMEOUTS.OPENAI
    });

    let dayPlan = [];
    try {
      const content = openaiResponse.data.choices[0].message.content;
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      dayPlan = JSON.parse(cleanContent);
      log.info(`[${requestId}] Generated day plan with ${dayPlan.length} scheduled items`);
    } catch (e) {
      log.error(`[${requestId}] Failed to parse OpenAI day plan response:`, e);
      
      // Fallback: Create a simple sequential plan
      dayPlan = selectedItems.map((item, index) => {
        const startTimes = ['9:00 AM', '11:30 AM', '2:00 PM', '5:00 PM', '7:30 PM'];
        const periods = ['morning', 'late_morning', 'afternoon', 'evening', 'night'];
        
        return {
          timeSlot: startTimes[index] || `${9 + index * 2}:00 AM`,
          period: periods[index] || 'evening',
          item: {
            name: item.name,
            category: item.category,
            duration: item.estimatedDuration || 90,
            reasoning: `Scheduled item ${index + 1}`
          }
        };
      });
    }

    const duration = Date.now() - startTime;
    log.info(`[${requestId}] Day planning completed in ${duration}ms`);

    // Return complete response
    res.json({
      success: true,
      data: {
        dayPlan,
        city,
        totalItems: selectedItems.length,
        estimatedTotalDuration: dayPlan.reduce((sum, slot) => sum + (slot.item.duration || 90), 0)
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    log.error(`[${requestId}] Day planning error after ${duration}ms:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Deprecated Qloo endpoints - return informative messages
app.all('/api/qloo/search', (req, res) => {
  log.warn('Deprecated Qloo proxy endpoint called', {
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  res.status(410).json({
    error: 'Qloo proxy endpoints are deprecated',
    message: 'VibeTrail 2.0 now uses direct Qloo API calls. Update your frontend to use the new QlooService implementation.',
    migration: {
      oldApproach: 'POST /api/qloo/search via proxy',
      newApproach: 'GET https://hackathon.api.qloo.com/v2/insights direct calls',
      documentation: 'See qloo.md for implementation details'
    },
    timestamp: new Date().toISOString()
  });
});

app.all('/api/qloo/insights', (req, res) => {
  log.warn('Deprecated Qloo proxy endpoint called', {
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  res.status(410).json({
    error: 'Qloo proxy endpoints are deprecated',
    message: 'VibeTrail 2.0 now uses direct Qloo API calls.',
    timestamp: new Date().toISOString()
  });
});

// Ecosystem Analysis endpoint - AI-powered cultural analysis
app.post('/api/ecosystem-analysis', async (req, res) => {
  try {
    log.info('🤖 Ecosystem analysis request received');
    
    const { vibe, city, entities, connections, themes, culturalInsights } = req.body;

    if (!vibe || !city || !entities) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: vibe, city, and entities'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    // Prepare data for AI analysis
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
      from: { name: conn.fromEntity?.name || 'Unknown', type: conn.fromEntity?.category || 'unknown' },
      to: { name: conn.toEntity?.name || 'Unknown', type: conn.toEntity?.category || 'unknown' },
      reason: conn.connectionReason,
      strength: Math.round((conn.connectionStrength || 0) * 100),
      themes: conn.sharedThemes || []
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
${themes.map(t => `• ${t.theme}: ${Math.round((t.strength || 0) * 100)}% strength`).join('\n')}

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
      "connectionStrength": 0.7,
      "connectionReason": "Deep psychological/cultural reason",
      "sharedThemes": ["theme1", "theme2"],
      "psychologicalInsight": "Why this connection reveals deeper personality traits"
    }
  ],
  "aiThemes": [
    {
      "theme": "Sophisticated theme name",
      "strength": 0.8,
      "description": "Deep analysis of this cultural theme",
      "psychologicalMeaning": "What this reveals about personality/values",
      "entityTypes": ["relevant", "entity", "types"],
      "examples": ["specific examples from their choices"]
    }
  ],
  "aiInsights": [
    {
      "type": "psychological",
      "title": "Sophisticated Insight Title",
      "description": "Deep cultural/psychological analysis",
      "confidence": 0.9,
      "supportingEntities": ["relevant entities"],
      "actionableAdvice": "Specific recommendation based on this insight"
    }
  ],
  "ecosystemNarrative": "A compelling 3-4 sentence narrative that tells the story of this person's cultural identity, connecting their choices to deeper psychological patterns and cultural values."
}

Focus on psychological insights, cultural patterns, and sophisticated analysis. Be intellectually rigorous but accessible.`;

    log.info('🤖 Calling OpenAI for ecosystem analysis');

    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a world-class cultural anthropologist. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUTS.OPENAI
    });

    const content = openaiResponse.data.choices[0].message.content;
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiAnalysis = JSON.parse(cleanContent);

    log.info('✅ AI ecosystem analysis complete', {
      aiConnections: aiAnalysis.aiConnections?.length || 0,
      aiThemes: aiAnalysis.aiThemes?.length || 0,
      aiInsights: aiAnalysis.aiInsights?.length || 0,
      hasNarrative: !!aiAnalysis.ecosystemNarrative
    });

    res.json({
      success: true,
      data: {
        aiConnections: aiAnalysis.aiConnections || [],
        aiThemes: aiAnalysis.aiThemes || [],
        aiInsights: aiAnalysis.aiInsights || [],
        ecosystemNarrative: aiAnalysis.ecosystemNarrative || ''
      }
    });

  } catch (error) {
    log.error('❌ Ecosystem analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 VibeTrail 2.0 API Proxy Server running on http://localhost:${PORT}`);
  console.log(`🎯 Taste endpoint: http://localhost:${PORT}/api/taste`);
  console.log(`🤖 Ecosystem analysis endpoint: http://localhost:${PORT}/api/ecosystem-analysis`);
  console.log(`🗓️ Day planning endpoint: http://localhost:${PORT}/api/plan-day`);
  console.log(`📡 OpenAI endpoint: http://localhost:${PORT}/api/openai/chat/completions`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Qloo API Key: ${process.env.QLOO_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Features: Vibe processing + AI Cultural Ecosystem + Smart day planning`);
});