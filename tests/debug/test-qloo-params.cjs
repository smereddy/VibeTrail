const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const qlooKey = envContent.match(/QLOO_API_KEY=(.+)/)?.[1];

async function testDifferentParamFormats() {
  console.log('🧪 Testing different parameter formats for Qloo API\n');
  
  const testCases = [
    {
      name: 'Basic place search in Los Angeles',
      params: {
        'filter.type': 'urn:entity:place',
        'filter.location.query': 'Los Angeles',
        'limit': '5'
      }
    },
    {
      name: 'Restaurant search with tags',
      params: {
        'filter.type': 'urn:entity:place',
        'filter.location.query': 'Los Angeles',
        'filter.tags': 'urn:tag:genre:place:restaurant',
        'limit': '5'
      }
    },
    {
      name: 'Movie search',
      params: {
        'filter.type': 'urn:entity:movie',
        'filter.location.query': 'Los Angeles',
        'limit': '5'
      }
    },
    {
      name: 'TV show search',
      params: {
        'filter.type': 'urn:entity:tv_show',
        'filter.location.query': 'Los Angeles',
        'limit': '5'
      }
    },
    {
      name: 'Artist search',
      params: {
        'filter.type': 'urn:entity:artist',
        'filter.location.query': 'Los Angeles',
        'limit': '5'
      }
    },
    {
      name: 'Book search',
      params: {
        'filter.type': 'urn:entity:book',
        'filter.location.query': 'Los Angeles',
        'limit': '5'
      }
    },
    {
      name: 'Restaurant with interest signals',
      params: {
        'filter.type': 'urn:entity:place',
        'filter.location.query': 'Los Angeles',
        'filter.tags': 'urn:tag:genre:place:restaurant',
        'signal.interests.query': 'italian food',
        'limit': '5'
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    
    const params = new URLSearchParams(testCase.params);
    const endpoint = `/v2/insights?${params.toString()}`;
    
    console.log('Parameters:', Object.fromEntries(params.entries()));
    
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
      
      const data = await response.json();
      
      if (data.results?.entities && data.results.entities.length > 0) {
        console.log(`✅ Found ${data.results.entities.length} results`);
        console.log('Top 3 results:');
        data.results.entities.slice(0, 3).forEach((entity, i) => {
          console.log(`  ${i+1}. ${entity.name}`);
        });
      } else {
        console.log('❌ No results or unexpected structure');
        if (data.error) {
          console.log('Error:', data.error);
        }
      }
      
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
    
    console.log('-'.repeat(60));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testDifferentParamFormats().catch(console.error); 