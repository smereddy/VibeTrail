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
    const { selectedItems, city, preferences = {} } = JSON.parse(event.body);

    if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing or empty selectedItems array' 
        })
      };
    }

    log.info(`[${requestId}] Planning day for ${selectedItems.length} items in ${city}`);

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
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          dayPlan,
          city,
          totalItems: selectedItems.length,
          estimatedTotalDuration: dayPlan.reduce((sum, slot) => sum + (slot.item.duration || 90), 0)
        }
      })
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    log.error(`[${requestId}] Day planning error after ${duration}ms:`, error);
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