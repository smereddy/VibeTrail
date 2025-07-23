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

  try {
    log.info('🤖 Ecosystem analysis request received');
    
    const { vibe, city, entities, connections, themes, culturalInsights } = JSON.parse(event.body);

    if (!vibe || !city || !entities) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: vibe, city, and entities'
        })
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        })
      };
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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          aiConnections: aiAnalysis.aiConnections || [],
          aiThemes: aiAnalysis.aiThemes || [],
          aiInsights: aiAnalysis.aiInsights || [],
          ecosystemNarrative: aiAnalysis.ecosystemNarrative || ''
        }
      })
    };

  } catch (error) {
    log.error('❌ Ecosystem analysis error:', error);
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