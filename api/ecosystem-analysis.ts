import type { VercelRequest, VercelResponse } from '@vercel/node';

// API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface EcosystemAnalysisRequest {
  vibe: string;
  city: string;
  entities: { [entityType: string]: any[] };
  connections: any[];
  themes: any[];
  culturalInsights?: any;
}

interface EcosystemAnalysisResponse {
  success: boolean;
  data?: {
    aiConnections: any[];
    aiThemes: any[];
    aiInsights: any[];
    ecosystemNarrative: string;
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
    const { vibe, city, entities, connections, themes, culturalInsights }: EcosystemAnalysisRequest = req.body;

    if (!vibe || !city || !entities) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: vibe, city, and entities' 
      });
      return;
    }

    console.log(`🤖 AI Ecosystem Analysis: "${vibe}" in ${city}`);

    if (!OPENAI_API_KEY) {
      res.status(500).json({ success: false, error: 'OpenAI API key not configured' });
      return;
    }

    // Prepare comprehensive data for AI analysis
    const entitySummary = Object.keys(entities).map(entityType => ({
      type: entityType,
      count: entities[entityType].length,
      topItems: entities[entityType].slice(0, 5).map((e: any) => ({
        name: e.name,
        description: e.description?.substring(0, 100) || '',
        category: e.category
      }))
    }));

    const connectionSummary = connections.slice(0, 10).map((conn: any) => ({
      from: { name: conn.fromEntity?.name || 'Unknown', type: conn.fromEntity?.category || 'unknown' },
      to: { name: conn.toEntity?.name || 'Unknown', type: conn.toEntity?.category || 'unknown' },
      reason: conn.connectionReason,
      strength: Math.round((conn.connectionStrength || 0) * 100),
      themes: conn.sharedThemes || []
    }));

    const prompt = `You are a world-class cultural anthropologist analyzing a person's cultural ecosystem. Provide deep, sophisticated analysis of their taste profile.

PERSON'S VIBE: "${vibe}" in ${city}

CULTURAL DOMAINS (${Object.keys(entities).length} types, ${Object.values(entities).reduce((sum: number, arr: any[]) => sum + arr.length, 0)} total items):
${entitySummary.map(e => `
${e.type.toUpperCase()} (${e.count} items):
${e.topItems.map(item => `• ${item.name}: ${item.description}`).join('\n')}
`).join('\n')}

EXISTING CONNECTIONS (${connections.length} found):
${connectionSummary.map(c => `• ${c.from.name} (${c.from.type}) ↔ ${c.to.name} (${c.to.type}): ${c.reason} [${c.strength}% strength]`).join('\n')}

EXISTING THEMES:
${themes.map((t: any) => `• ${t.theme}: ${Math.round((t.strength || 0) * 100)}% strength`).join('\n')}

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

    console.log('🤖 Calling OpenAI for ecosystem analysis...');
    console.log('🤖 Prompt length:', prompt.length, 'characters');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
    
    try {
      const content = openaiData.choices[0].message.content;
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiAnalysis = JSON.parse(cleanContent);
      
      console.log('✅ AI ecosystem analysis complete:', {
        aiConnections: aiAnalysis.aiConnections?.length || 0,
        aiThemes: aiAnalysis.aiThemes?.length || 0,
        aiInsights: aiAnalysis.aiInsights?.length || 0,
        hasNarrative: !!aiAnalysis.ecosystemNarrative
      });

      const response: EcosystemAnalysisResponse = {
        success: true,
        data: {
          aiConnections: aiAnalysis.aiConnections || [],
          aiThemes: aiAnalysis.aiThemes || [],
          aiInsights: aiAnalysis.aiInsights || [],
          ecosystemNarrative: aiAnalysis.ecosystemNarrative || ''
        }
      };

      res.status(200).json(response);

    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to parse AI ecosystem analysis response' 
      });
    }

  } catch (error) {
    console.error('❌ Ecosystem analysis API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
} 