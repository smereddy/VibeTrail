import { test, expect } from '@playwright/test';

// Test configuration
const API_BASE_URL = 'http://localhost:3001';
const TEST_TIMEOUT = 45000;

interface ExtractedSeed {
  text: string;
  category: string;
  confidence: number;
  searchTerms: string[];
}

interface QlooRecommendation {
  id: string;
  name: string;
  description?: string;
  location?: string;
  tasteStrength?: number;
}

test.describe('API Integration Tests', () => {
  test.beforeAll(async () => {
    // Verify proxy server is running
    const response = await fetch(`${API_BASE_URL}/api/health`);
    expect(response.ok).toBeTruthy();
  });

  test('should extract seeds from OpenAI successfully', async ({ request }) => {
    const testVibes = [
      'cozy coffee shop vibes',
      'outdoor adventure day', 
      'jazz and fine dining',
      'family-friendly activities',
      'romantic evening out'
    ];

    for (const vibe of testVibes) {
      const response = await request.post(`${API_BASE_URL}/api/openai/chat/completions`, {
        data: {
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
              content: vibe
            }
          ]
        }
      });

      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.choices).toBeDefined();
      expect(data.choices[0]).toBeDefined();
      expect(data.choices[0].message).toBeDefined();
      expect(data.choices[0].message.content).toBeDefined();

      // Parse and validate the extracted seeds
      let seeds: ExtractedSeed[];
      try {
        const cleanContent = data.choices[0].message.content
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        seeds = JSON.parse(cleanContent);
      } catch (error) {
        throw new Error(`Failed to parse OpenAI response for vibe: ${vibe}`);
      }

      expect(Array.isArray(seeds)).toBeTruthy();
      expect(seeds.length).toBeGreaterThan(0);
      expect(seeds.length).toBeLessThanOrEqual(5);

      // Validate seed structure
      for (const seed of seeds) {
        expect(seed.text).toBeDefined();
        expect(typeof seed.text).toBe('string');
        expect(seed.text.length).toBeGreaterThan(0);
        
        expect(seed.category).toBeDefined();
        expect(['food', 'activity', 'media', 'general']).toContain(seed.category);
        
        expect(seed.confidence).toBeDefined();
        expect(typeof seed.confidence).toBe('number');
        expect(seed.confidence).toBeGreaterThanOrEqual(0);
        expect(seed.confidence).toBeLessThanOrEqual(1);
        
        expect(Array.isArray(seed.searchTerms)).toBeTruthy();
        expect(seed.searchTerms.length).toBeGreaterThan(0);
      }
    }
  });

  test('should handle OpenAI API errors gracefully', async ({ request }) => {
    // Test with invalid API key
    const response = await request.post(`${API_BASE_URL}/api/openai/chat/completions`, {
      headers: {
        'Authorization': 'Bearer invalid-key'
      },
      data: {
        model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'test'
          }
        ]
      }
    });

    // Should still get a response, but with error handling
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should test Qloo API integration with various seeds', async ({ request }) => {
    const testSeeds = [
      { text: 'jazz music', category: 'media', confidence: 0.9, searchTerms: ['jazz', 'music'] },
      { text: 'italian restaurants', category: 'food', confidence: 0.8, searchTerms: ['italian', 'restaurant'] },
      { text: 'art galleries', category: 'activity', confidence: 0.7, searchTerms: ['art', 'gallery'] },
      { text: 'craft cocktails', category: 'food', confidence: 0.85, searchTerms: ['cocktails', 'bar'] }
    ];

    const cities = ['Los Angeles', 'New York', 'Chicago'];

    for (const city of cities) {
      // Test food recommendations
      const foodParams = new URLSearchParams({
        'filter.type': 'urn:entity:place',
        'filter.location.query': city,
        'limit': '8',
        'filter.tags': 'urn:tag:genre:place:restaurant'
      });

      testSeeds.forEach(seed => {
        foodParams.append('signal.interests.query', seed.text);
      });

      const foodResponse = await fetch(`https://hackathon.api.qloo.com/v2/insights?${foodParams.toString()}`, {
        headers: { 
          'X-Api-Key': process.env.QLOO_API_KEY || ''
        }
      });

      if (foodResponse.ok) {
        const foodData = await foodResponse.json();
        
        if (foodData.results?.entities) {
          expect(Array.isArray(foodData.results.entities)).toBeTruthy();
          
          // Validate recommendation structure
          for (const entity of foodData.results.entities.slice(0, 3)) {
            expect(entity.name).toBeDefined();
            expect(typeof entity.name).toBe('string');
            expect(entity.name.length).toBeGreaterThan(0);
            
            if (entity.properties?.description) {
              expect(typeof entity.properties.description).toBe('string');
            }
          }
        }
      }

      // Test movie recommendations
      const movieParams = new URLSearchParams({
        'filter.type': 'urn:entity:movie',
        'filter.location.query': city,
        'limit': '5'
      });

      testSeeds.forEach(seed => {
        movieParams.append('signal.interests.query', seed.text);
      });

      const movieResponse = await fetch(`https://hackathon.api.qloo.com/v2/insights?${movieParams.toString()}`, {
        headers: { 
          'X-Api-Key': process.env.QLOO_API_KEY || ''
        }
      });

      if (movieResponse.ok) {
        const movieData = await movieResponse.json();
        
        if (movieData.results?.entities) {
          expect(Array.isArray(movieData.results.entities)).toBeTruthy();
          
          // Validate movie recommendation structure
          for (const entity of movieData.results.entities.slice(0, 3)) {
            expect(entity.name).toBeDefined();
            expect(typeof entity.name).toBe('string');
            expect(entity.name.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test('should handle rate limiting and timeouts', async ({ request }) => {
    const promises = [];
    
    // Make multiple concurrent requests to test rate limiting
    for (let i = 0; i < 5; i++) {
      promises.push(
        request.post(`${API_BASE_URL}/api/openai/chat/completions`, {
          data: {
            model: 'gpt-4o-mini',
            max_tokens: 100,
            messages: [
              {
                role: 'user',
                content: `Test request ${i}`
              }
            ]
          },
          timeout: TEST_TIMEOUT
        })
      );
    }

    const responses = await Promise.allSettled(promises);
    
    // At least some requests should succeed
    const successCount = responses.filter(r => r.status === 'fulfilled').length;
    expect(successCount).toBeGreaterThan(0);
  });

  test('should validate proxy server health endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    
    const healthData = await response.json();
    expect(healthData.status).toBe('ok');
    expect(healthData.timestamp).toBeDefined();
    expect(healthData.openaiKey).toBeDefined();
    expect(healthData.qlooKey).toBeDefined();
    expect(healthData.timeouts).toBeDefined();
    
    // Validate timeout configuration
    expect(healthData.timeouts.OPENAI).toBe(45000);
    expect(healthData.timeouts.DEFAULT).toBe(30000);
  });

  test('should handle malformed requests', async ({ request }) => {
    // Test with missing required fields
    const response1 = await request.post(`${API_BASE_URL}/api/openai/chat/completions`, {
      data: {
        // Missing model and messages
        max_tokens: 100
      }
    });
    
    expect(response1.status()).toBeGreaterThanOrEqual(400);

    // Test with invalid JSON
    const response2 = await request.post(`${API_BASE_URL}/api/openai/chat/completions`, {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(response2.status()).toBeGreaterThanOrEqual(400);
  });

  test('should handle large payloads', async ({ request }) => {
    const largeMessage = 'a'.repeat(5000); // Large message content
    
    const response = await request.post(`${API_BASE_URL}/api/openai/chat/completions`, {
      data: {
        model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: largeMessage
          }
        ]
      },
      timeout: TEST_TIMEOUT
    });

    // Should handle large payloads gracefully
    expect(response.status()).toBeLessThan(500);
  });

  test('should validate CORS headers', async ({ request }) => {
    const response = await request.options(`${API_BASE_URL}/api/openai/chat/completions`);
    
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
    expect(headers['access-control-allow-methods']).toBeDefined();
    expect(headers['access-control-allow-headers']).toBeDefined();
  });
}); 