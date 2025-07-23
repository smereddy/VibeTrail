const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const openaiKey = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1];
const qlooKey = envContent.match(/QLOO_API_KEY=(.+)/)?.[1];

const testVibes = [
  'indian food',
  'crying day', 
  'sleepy day',
  'family day'
];

async function extractSeedsFromOpenAI(vibe) {
  const response = await fetch('http://localhost:3001/api/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
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
    })
  });
  
  const data = await response.json();
  if (data.choices?.[0]?.message?.content) {
    try {
      const cleanContent = data.choices[0].message.content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleanContent);
    } catch (e) {
      console.log('Failed to parse OpenAI response for', vibe);
      return [];
    }
  }
  return [];
}

async function testQlooWithSeeds(seeds, city = 'Omaha') {
  const results = {};
  
  // Test food recommendations using proxy
  try {
    const foodResponse = await fetch('http://localhost:3001/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'qloo',
        endpoint: `/v2/insights?filter.type=urn:entity:place&filter.location.query=${encodeURIComponent(city)}&limit=8&filter.tags=urn:tag:genre:place:restaurant&filter.tags=urn:tag:genre:place:cafe${seeds.map(s => `&signal.interests.query=${encodeURIComponent(s.text)}`).join('')}`,
        method: 'GET'
      })
    });
    const foodData = await foodResponse.json();
    results.food = foodData.results?.entities?.slice(0, 5).map(e => ({
      name: e.name,
      description: (e.properties?.description || '').substring(0, 60) + '...'
    })) || [];
  } catch (e) {
    console.error('Food API error:', e.message);
    results.food = [];
  }
  
  // Test movie recommendations using proxy
  try {
    const movieResponse = await fetch('http://localhost:3001/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'qloo',
        endpoint: `/v2/insights?filter.type=urn:entity:movie&filter.location.query=${encodeURIComponent(city)}&limit=5${seeds.map(s => `&signal.interests.query=${encodeURIComponent(s.text)}`).join('')}`,
        method: 'GET'
      })
    });
    const movieData = await movieResponse.json();
    results.movies = movieData.results?.entities?.slice(0, 5).map(e => ({
      name: e.name,
      description: (e.properties?.description || e.description || '').substring(0, 60) + '...'
    })) || [];
  } catch (e) {
    console.error('Movie API error:', e.message);
    results.movies = [];
  }
  
  return results;
}

async function runE2ETest() {
  console.log('🧪 Running End-to-End Vibe Testing\n');
  
  for (const vibe of testVibes) {
    console.log(`\n🎯 Testing: "${vibe}"`);
    console.log('=' + '='.repeat(50));
    
    // Step 1: Extract seeds from OpenAI
    console.log('🤖 Step 1: OpenAI Seed Extraction...');
    const seeds = await extractSeedsFromOpenAI(vibe);
    
    if (seeds.length > 0) {
      console.log(`   ✅ Extracted ${seeds.length} seeds:`);
      seeds.forEach((seed, i) => {
        console.log(`      ${i+1}. ${seed.text} (${seed.category}, ${Math.round(seed.confidence * 100)}%)`);
      });
    } else {
      console.log('   ❌ No seeds extracted');
      continue;
    }
    
    // Step 2: Test Qloo with extracted seeds
    console.log('\n🔍 Step 2: Qloo API Recommendations...');
    const recommendations = await testQlooWithSeeds(seeds);
    
    if (recommendations.food?.length > 0) {
      console.log(`   🍽️ Food (${recommendations.food.length} results):`);
      recommendations.food.forEach((item, i) => {
        console.log(`      ${i+1}. ${item.name} - ${item.description}`);
      });
    } else {
      console.log('   🍽️ Food: No results');
    }
    
    if (recommendations.movies?.length > 0) {
      console.log(`   🎬 Movies (${recommendations.movies.length} results):`);
      recommendations.movies.forEach((item, i) => {
        console.log(`      ${i+1}. ${item.name} - ${item.description}`);
      });
    } else {
      console.log('   🎬 Movies: No results');
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 E2E Testing Complete!');
}

runE2ETest().catch(console.error);
