const axios = require('axios');

async function testPlanFlow() {
  console.log('🧪 Testing VibeTrail Plan Flow');
  console.log('================================');

  try {
    // Step 1: Get taste recommendations
    console.log('\n1️⃣ Getting taste recommendations...');
    const tasteResponse = await axios.post('http://localhost:3001/api/taste', {
      vibe: 'foodie paradise tour',
      city: 'Phoenix'
    });

    if (!tasteResponse.data.success) {
      throw new Error('Taste API failed');
    }

    const { recommendations } = tasteResponse.data.data;
    console.log(`✅ Got ${recommendations.length} recommendations`);

    // Step 2: Select some items for planning (first 5 food and activity items)
    const selectedItems = recommendations
      .filter(item => ['food', 'activity'].includes(item.category))
      .slice(0, 8);

    console.log(`\n2️⃣ Selected ${selectedItems.length} items for day planning:`);
    selectedItems.forEach(item => {
      console.log(`   - ${item.name} (${item.category})`);
    });

    // Step 3: Build day plan
    console.log('\n3️⃣ Building day plan...');
    const startTime = Date.now();
    
    const planResponse = await axios.post('http://localhost:3001/api/plan-day', {
      selectedItems,
      city: 'Phoenix',
      preferences: {
        avoidBackToBackFood: true,
        preferLocalTravel: true
      }
    });

    const endTime = Date.now();
    console.log(`✅ Day plan created in ${endTime - startTime}ms`);

    if (!planResponse.data.success) {
      throw new Error('Day planning failed');
    }

    const { dayPlan, totalItems, estimatedTotalDuration } = planResponse.data.data;
    
    console.log('\n📅 Generated Day Plan:');
    console.log(`   Total items: ${totalItems}`);
    console.log(`   Estimated duration: ${Math.round(estimatedTotalDuration / 60)} hours`);
    console.log(`   Scheduled slots: ${dayPlan.length}`);
    
    dayPlan.forEach(slot => {
      console.log(`   ${slot.timeSlot}: ${slot.item.name} (${slot.item.category}) - ${slot.item.duration}min`);
    });

    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response?.data) {
      console.error('API Error:', error.response.data);
    }
  }
}

// Run the test
testPlanFlow(); 