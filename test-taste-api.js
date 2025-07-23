// Test script for the Netlify Functions /taste endpoint
const axios = require('axios');

// Environment detection
const getApiBaseUrl = () => {
  // Check if we're testing against a deployed Netlify site
  const netlifyUrl = process.env.NETLIFY_SITE_URL;
  if (netlifyUrl) {
    return `${netlifyUrl}/.netlify/functions`;
  }
  
  // Check if we're testing against local Netlify dev
  const isNetlifyDev = process.env.NETLIFY_DEV === 'true';
  if (isNetlifyDev) {
    return 'http://localhost:8888/.netlify/functions';
  }
  
  // Default to local development server
  return 'http://localhost:3001/api';
};

const testTasteAPI = async () => {
  const apiBaseUrl = getApiBaseUrl();
  
  console.log('🧪 Testing Netlify Functions /taste endpoint...');
  console.log(`🌐 API Base URL: ${apiBaseUrl}`);
  console.log('');

  // Health check first
  try {
    console.log('🏥 Checking API health...');
    const healthResponse = await axios.get(`${apiBaseUrl}/health`, {
      timeout: 10000
    });
    
    if (healthResponse.data.status === 'ok') {
      console.log('✅ API is healthy');
      console.log(`   OpenAI Key: ${healthResponse.data.openaiKey ? '✅ Configured' : '❌ Missing'}`);
      console.log(`   Qloo Key: ${healthResponse.data.qlooKey ? '✅ Configured' : '❌ Missing'}`);
    }
  } catch (error) {
    console.log('⚠️ Health check failed, continuing with tests...');
  }

  const testCases = [
    {
      vibe: 'cozy coffee shop vibes with indie music',
      city: 'Los Angeles'
    },
    {
      vibe: 'romantic dinner date with cultural experiences',
      city: 'New York'
    },
    {
      vibe: 'outdoor adventure day with local food',
      city: 'Austin'
    },
    {
      vibe: 'artsy weekend exploring galleries and bookstores',
      city: 'San Francisco'
    }
  ];

  let successCount = 0;
  let totalTime = 0;

  for (const [index, testCase] of testCases.entries()) {
    console.log(`\n🎯 Test ${index + 1}/4: "${testCase.vibe}" in ${testCase.city}`);
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${apiBaseUrl}/taste`, testCase, {
        timeout: 45000, // Increased timeout for AI processing
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseTime = Date.now() - startTime;
      totalTime += responseTime;

      if (!response.data) {
        console.error('❌ No response data received');
        continue;
      }

      if (response.data.success) {
        const { seeds, recommendations } = response.data.data;
        
        // Count total recommendations across all categories
        const totalRecs = Object.values(recommendations || {}).reduce((sum, arr) => {
          return sum + (Array.isArray(arr) ? arr.length : 0);
        }, 0);
        
        console.log(`✅ Success! (${responseTime}ms)`);
        console.log(`   Seeds extracted: ${seeds?.length || 0}`);
        console.log(`   Total recommendations: ${totalRecs}`);
        
        // Detailed breakdown
        const breakdown = {
          food: recommendations?.food?.length || 0,
          activities: recommendations?.activities?.length || 0,
          movies: recommendations?.movies?.length || 0,
          tv_shows: recommendations?.tv_shows?.length || 0,
          music: recommendations?.music?.length || 0,
          books: recommendations?.books?.length || 0
        };
        
        console.log('   Category breakdown:', breakdown);
        
        // Show sample recommendations from each category
        if (recommendations?.food?.length > 0) {
          console.log(`   Sample food: ${recommendations.food[0].name}`);
        }
        if (recommendations?.activities?.length > 0) {
          console.log(`   Sample activity: ${recommendations.activities[0].name}`);
        }
        if (recommendations?.movies?.length > 0) {
          console.log(`   Sample movie: ${recommendations.movies[0].name}`);
        }
        
        // Validate seeds structure
        if (seeds && Array.isArray(seeds)) {
          seeds.forEach((seed, seedIndex) => {
            if (!seed.text || !seed.category || typeof seed.confidence !== 'number') {
              console.warn(`   ⚠️ Seed ${seedIndex + 1} has invalid structure`);
            }
          });
        }
        
        // Validate recommendations structure
        Object.entries(recommendations || {}).forEach(([category, items]) => {
          if (Array.isArray(items) && items.length > 0) {
            const sampleItem = items[0];
            if (!sampleItem.name || !sampleItem.category) {
              console.warn(`   ⚠️ ${category} recommendations have invalid structure`);
            }
          }
        });
        
        successCount++;
        
      } else {
        console.error('❌ API returned success: false');
        if (response.data.error) {
          console.error(`   Error: ${response.data.error.message || response.data.error}`);
          if (response.data.error.code) {
            console.error(`   Code: ${response.data.error.code}`);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Request failed');
      
      if (error.response) {
        console.error(`   HTTP ${error.response.status}: ${error.response.statusText}`);
        if (error.response.data) {
          console.error(`   Details: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      } else if (error.request) {
        console.error(`   Network error: ${error.message}`);
        if (error.code === 'ECONNREFUSED') {
          console.error('   💡 Is the server running?');
        } else if (error.code === 'ETIMEDOUT') {
          console.error('   💡 Request timed out - API might be slow');
        }
      } else {
        console.error(`   Error: ${error.message}`);
      }
    }
  }

  // Summary
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`✅ Successful tests: ${successCount}/${testCases.length}`);
  console.log(`⏱️ Average response time: ${Math.round(totalTime / testCases.length)}ms`);
  console.log(`🌐 API Base URL: ${apiBaseUrl}`);
  
  if (successCount === testCases.length) {
    console.log('🎉 All tests passed! Netlify Functions are working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
    
    // Troubleshooting tips
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - For local testing: Start dev server with `npm run dev`');
    console.log('   - For Netlify dev: Start with `netlify dev`');
    console.log('   - For production: Set NETLIFY_SITE_URL environment variable');
    console.log('   - Check environment variables: OPENAI_API_KEY, QLOO_API_KEY');
    console.log('   - Verify API keys are valid and have sufficient credits');
  }
  
  return successCount === testCases.length;
};

// Additional test for edge cases
const testEdgeCases = async () => {
  const apiBaseUrl = getApiBaseUrl();
  
  console.log('\n🧪 Testing edge cases...');
  
  const edgeCases = [
    {
      name: 'Empty vibe',
      data: { vibe: '', city: 'Los Angeles' }
    },
    {
      name: 'Very long vibe',
      data: { 
        vibe: 'a'.repeat(1000) + ' coffee shop experience with music and food',
        city: 'New York'
      }
    },
    {
      name: 'Unsupported city',
      data: { vibe: 'cozy vibes', city: 'Unknown City' }
    },
    {
      name: 'Missing city',
      data: { vibe: 'cozy vibes' }
    }
  ];
  
  for (const testCase of edgeCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    
    try {
      const response = await axios.post(`${apiBaseUrl}/taste`, testCase.data, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data.success) {
        console.log('✅ Handled gracefully');
      } else {
        console.log('⚠️ Returned error as expected');
      }
      
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        console.log('✅ Properly rejected with error status');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
  }
};

// Run the tests
if (require.main === module) {
  testTasteAPI()
    .then(success => {
      if (success) {
        return testEdgeCases();
      }
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = { testTasteAPI, testEdgeCases }; 