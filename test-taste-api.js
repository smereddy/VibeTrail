// Simple test script for the new /api/taste endpoint
const testTasteAPI = async () => {
  console.log('🧪 Testing /api/taste endpoint...\n');

  const testCases = [
    {
      vibe: 'cozy coffee shop vibes',
      city: 'Los Angeles'
    },
    {
      vibe: 'romantic dinner date',
      city: 'New York'
    },
    {
      vibe: 'outdoor adventure day',
      city: 'Austin'
    }
  ];

  for (const testCase of testCases) {
    console.log(`🎯 Testing: "${testCase.vibe}" in ${testCase.city}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/taste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase)
      });

      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      
      if (data.success) {
        const { seeds, recommendations } = data.data;
        const totalRecs = Object.values(recommendations).reduce((sum, arr) => sum + arr.length, 0);
        
        console.log('✅ Success!');
        console.log(`   Seeds: ${seeds.length}`);
        console.log(`   Total recommendations: ${totalRecs}`);
        console.log('   Breakdown:', {
          food: recommendations.food.length,
          activities: recommendations.activities.length,
          movies: recommendations.movies.length,
          tv_shows: recommendations.tv_shows.length,
          music: recommendations.music.length,
          books: recommendations.books.length
        });
        
        // Show sample recommendations
        if (recommendations.food.length > 0) {
          console.log(`   Sample food: ${recommendations.food[0].name}`);
        }
        if (recommendations.activities.length > 0) {
          console.log(`   Sample activity: ${recommendations.activities[0].name}`);
        }
      } else {
        console.error('❌ API Error:', data.error);
      }
      
    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
    
    console.log(''); // Empty line between tests
  }
};

// Run the test
testTasteAPI().catch(console.error); 