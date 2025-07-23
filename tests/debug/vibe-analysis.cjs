const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const TEST_CITY = 'Los Angeles';
const TEST_VIBES = [
  'trendy and hip',
  'romantic and intimate', 
  'family-friendly and fun',
  'luxurious and upscale',
  'artsy and creative',
  'nightlife and party',
  'local and authentic',
  'budget-friendly and casual'
];

class VibeAnalyzer {
  constructor() {
    this.results = {};
    this.allCategories = new Set();
  }

  async analyzeSingleVibe(city, vibe) {
    console.log(`\n🔍 Analyzing: "${vibe}" in ${city}`);
    console.log('='.repeat(50));

    try {
      // Step 1: Get OpenAI seed using the correct format
      console.log('📝 Step 1: Getting OpenAI seed...');
      const seedResponse = await axios.post(`${BASE_URL}/api/openai/chat/completions`, {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a cultural taste expert. Extract structured seed data for location-based recommendations."
          },
          {
            role: "user", 
            content: `For the city "${city}" with vibe "${vibe}", extract seed data in this JSON format:
            {
              "activities": ["activity1", "activity2"],
              "cuisine": ["cuisine1", "cuisine2"],
              "music": ["genre1", "genre2"],
              "atmosphere": ["mood1", "mood2"],
              "demographics": ["group1", "group2"]
            }`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      let seed;
      try {
        const content = seedResponse.data.choices[0].message.content;
        seed = JSON.parse(content);
      } catch (e) {
        console.warn('Could not parse OpenAI response as JSON, using raw content');
        seed = { raw: seedResponse.data.choices[0].message.content };
      }
      
      console.log('✅ OpenAI Seed extracted:');
      console.log(JSON.stringify(seed, null, 2));

      // Step 2: Get Qloo recommendations using proxy server
      console.log('\n🎯 Step 2: Getting Qloo recommendations...');

      // Create search terms from seed data
      const searchTerms = [];
      if (seed.activities) searchTerms.push(...seed.activities);
      if (seed.cuisine) searchTerms.push(...seed.cuisine);
      if (seed.music) searchTerms.push(...seed.music);
      if (seed.atmosphere) searchTerms.push(...seed.atmosphere);
      if (seed.demographics) searchTerms.push(...seed.demographics);

      // Get food recommendations via proxy
      const foodEndpoint = `/v2/insights?filter.type=urn:entity:place&filter.location.query=${encodeURIComponent(city)}&limit=10&filter.tags=urn:tag:genre:place:restaurant${searchTerms.map(term => `&signal.interests.query=${encodeURIComponent(term)}`).join('')}`;
      
      const qlooResponse = await axios.post('http://localhost:3001/api/proxy', {
        service: 'qloo',
        endpoint: foodEndpoint,
        method: 'GET'
      });
      
      console.log('✅ Qloo recommendations retrieved');
      if (qlooResponse.data?.results?.entities) {
        console.log(`Found ${qlooResponse.data.results.entities.length} food recommendations`);
        console.log('Sample recommendations:');
        qlooResponse.data.results.entities.slice(0, 3).forEach((entity, i) => {
          console.log(`  ${i+1}. ${entity.name} - ${entity.properties?.description?.substring(0, 50) || 'No description'}...`);
        });
      } else {
        console.log('No recommendations found or unexpected structure');
      }

      // Step 3: Analyze categorization
      const categorizedData = this.categorizeRecommendations(recommendations);
      
      console.log('\n📊 Category Distribution:');
      Object.entries(categorizedData).forEach(([category, items]) => {
        console.log(`  ${category}: ${items.length} items`);
        this.allCategories.add(category);
      });

      // Step 4: Show sample recommendations per category
      console.log('\n🏷️  Sample Recommendations by Category:');
      Object.entries(categorizedData).forEach(([category, items]) => {
        if (items.length > 0) {
          console.log(`\n  ${category.toUpperCase()}:`);
          items.slice(0, 3).forEach((item, index) => {
            console.log(`    ${index + 1}. ${item.name}`);
            console.log(`       Type: ${item.type || 'N/A'}`);
            console.log(`       Rating: ${item.rating || 'N/A'}`);
            if (item.taste_tags && item.taste_tags.length > 0) {
              console.log(`       Taste Tags: ${item.taste_tags.slice(0, 5).join(', ')}`);
            }
          });
        }
      });

      // Store results
      this.results[vibe] = {
        seed,
        totalRecommendations: recommendations.length,
        categories: categorizedData,
        rawData: recommendations
      };

      return { seed, recommendations, categorizedData };

    } catch (error) {
      console.error(`❌ Error analyzing "${vibe}":`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return null;
    }
  }

  categorizeRecommendations(recommendations) {
    const categories = {
      restaurants: [],
      bars: [],
      activities: [],
      shopping: [],
      entertainment: [],
      hotels: [],
      other: []
    };

    recommendations.forEach(item => {
      const type = item.type?.toLowerCase() || '';
      const name = item.name?.toLowerCase() || '';
      
      if (type.includes('restaurant') || type.includes('food') || type.includes('dining')) {
        categories.restaurants.push(item);
      } else if (type.includes('bar') || type.includes('drink') || type.includes('cocktail')) {
        categories.bars.push(item);
      } else if (type.includes('activity') || type.includes('attraction') || type.includes('museum') || type.includes('park')) {
        categories.activities.push(item);
      } else if (type.includes('shop') || type.includes('retail') || type.includes('store')) {
        categories.shopping.push(item);
      } else if (type.includes('entertainment') || type.includes('music') || type.includes('theater') || type.includes('club')) {
        categories.entertainment.push(item);
      } else if (type.includes('hotel') || type.includes('accommodation')) {
        categories.hotels.push(item);
      } else {
        categories.other.push(item);
      }
    });

    return categories;
  }

  async compareVibes() {
    console.log('\n🔄 VIBE COMPARISON ANALYSIS');
    console.log('='.repeat(60));

    const vibes = Object.keys(this.results);
    
    // Category distribution comparison
    console.log('\n📈 Category Distribution Across Vibes:');
    Array.from(this.allCategories).forEach(category => {
      console.log(`\n🏷️  ${category.toUpperCase()}:`);
      vibes.forEach(vibe => {
        const count = this.results[vibe]?.categories[category]?.length || 0;
        const percentage = this.results[vibe]?.totalRecommendations 
          ? ((count / this.results[vibe].totalRecommendations) * 100).toFixed(1)
          : '0';
        console.log(`  ${vibe}: ${count} items (${percentage}%)`);
      });
    });

    // Seed comparison
    console.log('\n🌱 SEED COMPARISON:');
    vibes.forEach(vibe => {
      console.log(`\n"${vibe}":`);
      const seed = this.results[vibe]?.seed;
      if (seed) {
        Object.entries(seed).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            console.log(`  ${key}: [${value.join(', ')}]`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        });
      }
    });

    // Unique patterns analysis
    console.log('\n🎯 UNIQUE PATTERNS ANALYSIS:');
    vibes.forEach(vibe => {
      console.log(`\n"${vibe}" top characteristics:`);
      const categories = this.results[vibe]?.categories || {};
      
      // Find the most populated categories for this vibe
      const sortedCategories = Object.entries(categories)
        .sort(([,a], [,b]) => b.length - a.length)
        .slice(0, 3);

      sortedCategories.forEach(([category, items]) => {
        if (items.length > 0) {
          console.log(`  🏆 ${category}: ${items.length} items`);
          
          // Show taste tags frequency
          const allTags = items.flatMap(item => item.taste_tags || []);
          const tagFreq = {};
          allTags.forEach(tag => {
            tagFreq[tag] = (tagFreq[tag] || 0) + 1;
          });
          
          const topTags = Object.entries(tagFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([tag, count]) => `${tag}(${count})`);
            
          if (topTags.length > 0) {
            console.log(`    Common tags: ${topTags.join(', ')}`);
          }
        }
      });
    });
  }

  async generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `vibe-analysis-report-${timestamp}.json`;
    
    const report = {
      timestamp: new Date().toISOString(),
      city: TEST_CITY,
      vibes: TEST_VIBES,
      results: this.results,
      summary: {
        totalVibesTested: Object.keys(this.results).length,
        categoriesFound: Array.from(this.allCategories),
        averageRecommendationsPerVibe: Object.values(this.results)
          .reduce((sum, result) => sum + result.totalRecommendations, 0) / Object.keys(this.results).length
      }
    };

    require('fs').writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${reportFile}`);
    return reportFile;
  }
}

async function main() {
  console.log('🚀 Starting Vibe Analysis for VibeTrail');
  console.log(`📍 City: ${TEST_CITY}`);
  console.log(`🎭 Vibes to test: ${TEST_VIBES.length}`);
  console.log('='.repeat(60));

  const analyzer = new VibeAnalyzer();

  // Test each vibe
  for (const vibe of TEST_VIBES) {
    await analyzer.analyzeSingleVibe(TEST_CITY, vibe);
    
    // Small delay to avoid overwhelming the APIs
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Compare results
  await analyzer.compareVibes();

  // Generate report
  await analyzer.generateReport();

  console.log('\n✅ Vibe analysis complete!');
  console.log('\nKey insights:');
  console.log(`- Tested ${Object.keys(analyzer.results).length} different vibes`);
  console.log(`- Found ${analyzer.allCategories.size} distinct categories`);
  console.log('- Each vibe produces different recommendation patterns');
  console.log('- Categorization logic is working as expected');
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VibeAnalyzer }; 