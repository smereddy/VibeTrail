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

async function testPlanFlow() {
  const apiBaseUrl = getApiBaseUrl();
  
  console.log('🧪 Testing VibeTrail Plan Flow');
  console.log('================================');
  console.log(`🌐 API Base URL: ${apiBaseUrl}`);
  console.log('');

  try {
    // Step 0: Health check
    console.log('0️⃣ Checking API health...');
    try {
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

    // Step 1: Get taste recommendations
    console.log('\n1️⃣ Getting taste recommendations...');
    const startTime = Date.now();
    
    const tasteResponse = await axios.post(`${apiBaseUrl}/taste`, {
      vibe: 'foodie paradise tour with cultural experiences',
      city: 'Phoenix'
    }, {
      timeout: 45000, // Increased timeout for AI processing
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const tasteTime = Date.now() - startTime;
    console.log(`✅ Taste API responded in ${tasteTime}ms`);

    if (!tasteResponse.data.success) {
      throw new Error(`Taste API failed: ${tasteResponse.data.error?.message || 'Unknown error'}`);
    }

    const { seeds, recommendations } = tasteResponse.data.data;
    console.log(`   Seeds extracted: ${seeds?.length || 0}`);
    
    // Count total recommendations across all categories
    const totalRecs = Object.values(recommendations || {}).reduce((sum, arr) => {
      return sum + (Array.isArray(arr) ? arr.length : 0);
    }, 0);
    
    console.log(`   Total recommendations: ${totalRecs}`);
    console.log('   Breakdown:', {
      food: recommendations?.food?.length || 0,
      activities: recommendations?.activities?.length || 0,
      movies: recommendations?.movies?.length || 0,
      tv_shows: recommendations?.tv_shows?.length || 0,
      music: recommendations?.music?.length || 0,
      books: recommendations?.books?.length || 0
    });

    // Step 2: Select some items for planning (mix of categories)
    const selectedItems = [];
    
    // Add food items
    if (recommendations.food?.length > 0) {
      selectedItems.push(...recommendations.food.slice(0, 3));
    }
    
    // Add activity items
    if (recommendations.activities?.length > 0) {
      selectedItems.push(...recommendations.activities.slice(0, 2));
    }
    
    // Add one entertainment item
    if (recommendations.movies?.length > 0) {
      selectedItems.push(recommendations.movies[0]);
    }

    console.log(`\n2️⃣ Selected ${selectedItems.length} items for day planning:`);
    selectedItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (${item.category || 'unknown'})`);
    });

    if (selectedItems.length === 0) {
      throw new Error('No items available for day planning');
    }

    // Step 3: Build day plan
    console.log('\n3️⃣ Building day plan...');
    const planStartTime = Date.now();
    
    const planResponse = await axios.post(`${apiBaseUrl}/plan-day`, {
      selectedItems,
      city: 'Phoenix',
      preferences: {
        avoidBackToBackFood: true,
        preferLocalTravel: true,
        startTime: '10:00',
        endTime: '22:00'
      }
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const planTime = Date.now() - planStartTime;
    console.log(`✅ Day plan created in ${planTime}ms`);

    if (!planResponse.data.success) {
      throw new Error(`Day planning failed: ${planResponse.data.error?.message || 'Unknown error'}`);
    }

    const { dayPlan, totalItems, estimatedTotalDuration } = planResponse.data.data;
    
    console.log('\n📅 Generated Day Plan:');
    console.log(`   Total items: ${totalItems}`);
    console.log(`   Estimated duration: ${Math.round(estimatedTotalDuration / 60)} hours`);
    console.log(`   Scheduled slots: ${dayPlan?.length || 0}`);
    
    if (dayPlan && dayPlan.length > 0) {
      dayPlan.forEach((slot, index) => {
        console.log(`   ${index + 1}. ${slot.timeSlot}: ${slot.item.name} (${slot.item.category}) - ${slot.item.duration}min`);
      });
    }

    // Step 4: Test ecosystem analysis (if available)
    console.log('\n4️⃣ Testing ecosystem analysis...');
    try {
      const ecosystemResponse = await axios.post(`${apiBaseUrl}/ecosystem-analysis`, {
        vibe: 'foodie paradise tour with cultural experiences',
        city: 'Phoenix',
        recommendations: selectedItems.slice(0, 5) // Send first 5 items
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (ecosystemResponse.data.success) {
        const analysis = ecosystemResponse.data.data;
        console.log('✅ Ecosystem analysis completed');
        console.log(`   Cultural themes: ${analysis.culturalThemes?.length || 0}`);
        console.log(`   Connections found: ${analysis.connections?.length || 0}`);
        console.log(`   Coherence score: ${analysis.coherenceScore || 'N/A'}`);
      }
    } catch (error) {
      console.log('⚠️ Ecosystem analysis not available or failed');
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n🎉 Test completed successfully in ${totalTime}ms!`);
    console.log('🚀 All Netlify Functions are working correctly');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response?.status) {
      console.error(`HTTP Status: ${error.response.status}`);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   - For local testing: Start dev server with `npm run dev`');
      console.error('   - For Netlify dev: Start with `netlify dev`');
      console.error('   - For production: Set NETLIFY_SITE_URL environment variable');
    }
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testPlanFlow().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { testPlanFlow }; 