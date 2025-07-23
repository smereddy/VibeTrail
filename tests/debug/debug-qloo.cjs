const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const qlooKey = envContent.match(/QLOO_API_KEY=(.+)/)?.[1];

async function debugQlooCall(seeds, city, vibe) {
  console.log(`\n🔍 Debug: Testing "${vibe}" in ${city}`);
  console.log('Seeds:', seeds.map(s => s.text));
  
  // Test food recommendations with detailed logging using proxy
  const endpoint = `/v2/insights?filter.type=urn:entity:place&filter.location.query=${encodeURIComponent(city)}&limit=8&filter.tags=urn:tag:genre:place:restaurant${seeds.map(s => `&signal.interests.query=${encodeURIComponent(s.text)}`).join('')}`;
  
  console.log('Proxy endpoint:', endpoint);
  console.log('Seeds being sent:', seeds.map(s => s.text));
  
  try {
    const response = await fetch('http://localhost:3001/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'qloo',
        endpoint: endpoint,
        method: 'GET'
      })
    });
    
    console.log('Response Status:', response.status);
    const data = await response.json();
    
    if (data.results?.entities) {
      console.log(`Found ${data.results.entities.length} results`);
      console.log('First 3 results:');
      data.results.entities.slice(0, 3).forEach((entity, i) => {
        console.log(`  ${i+1}. ${entity.name} - ${entity.properties?.description?.substring(0, 80) || 'No description'}...`);
      });
    } else {
      console.log('No results found or unexpected structure');
      console.log('Response structure:', JSON.stringify(data, null, 2));
    }
    
    return data.results?.entities || [];
    
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

async function runDebugTests() {
  console.log('🔍 Debugging Qloo API calls to understand why results are identical\n');
  
  const testCases = [
    {
      vibe: 'indian food',
      city: 'Los Angeles',
      seeds: [
        { text: 'spicy curry dishes', category: 'food' },
        { text: 'vegetarian Indian cuisine', category: 'food' },
        { text: 'traditional Indian restaurants', category: 'food' }
      ]
    },
    {
      vibe: 'italian food',
      city: 'Los Angeles', 
      seeds: [
        { text: 'authentic Italian pasta', category: 'food' },
        { text: 'wood-fired pizza', category: 'food' },
        { text: 'Italian wine bars', category: 'food' }
      ]
    },
    {
      vibe: 'coffee shops',
      city: 'Los Angeles',
      seeds: [
        { text: 'artisan coffee shops', category: 'food' },
        { text: 'cozy cafe atmosphere', category: 'activity' },
        { text: 'specialty coffee roasters', category: 'food' }
      ]
    }
  ];
  
  for (const testCase of testCases) {
    await debugQlooCall(testCase.seeds, testCase.city, testCase.vibe);
    console.log('\n' + '='.repeat(80));
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test the same seeds with different cities
  console.log('\n🌍 Testing same seeds with different cities:');
  const coffeeSeed = [{ text: 'artisan coffee shops', category: 'food' }];
  
  for (const city of ['Los Angeles', 'New York', 'Chicago']) {
    await debugQlooCall(coffeeSeed, city, 'coffee shops');
    console.log('\n' + '-'.repeat(40));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

runDebugTests().catch(console.error); 