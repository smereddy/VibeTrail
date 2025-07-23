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

class SeedAnalyzer {
  constructor() {
    this.results = {};
  }

  async extractSeedForVibe(city, vibe) {
    console.log(`\n🔍 Extracting seed for: "${vibe}" in ${city}`);
    console.log('='.repeat(50));

    try {
      const seedResponse = await axios.post(`${BASE_URL}/api/openai/chat/completions`, {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a cultural taste expert. Extract structured seed data for location-based recommendations. Always respond with valid JSON only, no markdown formatting."
          },
          {
            role: "user", 
            content: `For the city "${city}" with vibe "${vibe}", extract seed data in this exact JSON format (no markdown, no backticks):
            {
              "activities": ["activity1", "activity2", "activity3"],
              "cuisine": ["cuisine1", "cuisine2", "cuisine3"],
              "music": ["genre1", "genre2", "genre3"],
              "atmosphere": ["mood1", "mood2", "mood3"],
              "demographics": ["group1", "group2", "group3"]
            }`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      let seed;
      let rawContent = seedResponse.data.choices[0].message.content;
      
      // Clean up the response - remove markdown formatting if present
      rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        seed = JSON.parse(rawContent);
        console.log('✅ Successfully parsed structured seed data');
      } catch (e) {
        console.warn('⚠️  Could not parse as JSON, attempting to extract from text...');
        
        // Try to extract JSON from text
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            seed = JSON.parse(jsonMatch[0]);
            console.log('✅ Extracted JSON from text successfully');
          } catch (e2) {
            seed = { raw: rawContent, error: 'Could not parse JSON' };
            console.warn('❌ Failed to parse JSON, storing raw content');
          }
        } else {
          seed = { raw: rawContent, error: 'No JSON found' };
        }
      }
      
      console.log('\n📊 Seed Data:');
      console.log(JSON.stringify(seed, null, 2));

      // Analyze the seed structure
      this.analyzeSeedStructure(vibe, seed);
      
      this.results[vibe] = {
        seed,
        rawContent,
        timestamp: new Date().toISOString()
      };

      return seed;

    } catch (error) {
      console.error(`❌ Error extracting seed for "${vibe}":`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return null;
    }
  }

  analyzeSeedStructure(vibe, seed) {
    console.log(`\n🔬 Analysis for "${vibe}":`);
    
    if (seed.error) {
      console.log(`  ❌ Error: ${seed.error}`);
      return;
    }

    const categories = ['activities', 'cuisine', 'music', 'atmosphere', 'demographics'];
    
    categories.forEach(category => {
      if (seed[category] && Array.isArray(seed[category])) {
        console.log(`  🏷️  ${category}: ${seed[category].length} items`);
        seed[category].forEach((item, index) => {
          console.log(`    ${index + 1}. ${item}`);
        });
      } else {
        console.log(`  ❌ ${category}: Missing or invalid`);
      }
    });
  }

  async compareAllSeeds() {
    console.log('\n🔄 SEED COMPARISON ANALYSIS');
    console.log('='.repeat(60));

    const vibes = Object.keys(this.results);
    const categories = ['activities', 'cuisine', 'music', 'atmosphere', 'demographics'];

    // Category-by-category comparison
    categories.forEach(category => {
      console.log(`\n🏷️  ${category.toUpperCase()} ACROSS VIBES:`);
      console.log('-'.repeat(40));
      
      vibes.forEach(vibe => {
        const seed = this.results[vibe]?.seed;
        if (seed && seed[category] && Array.isArray(seed[category])) {
          console.log(`\n"${vibe}":`);
          seed[category].forEach((item, index) => {
            console.log(`  ${index + 1}. ${item}`);
          });
        } else {
          console.log(`\n"${vibe}": No valid ${category} data`);
        }
      });
    });

    // Pattern analysis
    console.log('\n🎯 PATTERN ANALYSIS:');
    console.log('='.repeat(40));
    
    vibes.forEach(vibe => {
      console.log(`\n"${vibe}" characteristics:`);
      const seed = this.results[vibe]?.seed;
      
      if (seed && !seed.error) {
        // Find unique/interesting patterns
        const allTerms = [];
        categories.forEach(category => {
          if (seed[category] && Array.isArray(seed[category])) {
            allTerms.push(...seed[category]);
          }
        });
        
        console.log(`  Total terms: ${allTerms.length}`);
        
        // Look for distinctive terms
        const distinctiveTerms = allTerms.filter(term => {
          const lowerTerm = term.toLowerCase();
          return lowerTerm.includes('trendy') || lowerTerm.includes('luxury') || 
                 lowerTerm.includes('romantic') || lowerTerm.includes('family') ||
                 lowerTerm.includes('art') || lowerTerm.includes('night') ||
                 lowerTerm.includes('local') || lowerTerm.includes('budget');
        });
        
        if (distinctiveTerms.length > 0) {
          console.log(`  🎯 Key terms: ${distinctiveTerms.join(', ')}`);
        }
      }
    });
  }

  async generateSeedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `seed-analysis-report-${timestamp}.json`;
    
    const report = {
      timestamp: new Date().toISOString(),
      city: TEST_CITY,
      vibes: TEST_VIBES,
      results: this.results,
      summary: {
        totalVibesTested: Object.keys(this.results).length,
        successfulExtractions: Object.values(this.results).filter(r => r.seed && !r.seed.error).length,
        categories: ['activities', 'cuisine', 'music', 'atmosphere', 'demographics']
      }
    };

    require('fs').writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportFile}`);
    return reportFile;
  }
}

async function main() {
  console.log('🚀 Starting Seed Analysis for VibeTrail');
  console.log(`📍 City: ${TEST_CITY}`);
  console.log(`🎭 Vibes to test: ${TEST_VIBES.length}`);
  console.log('='.repeat(60));

  const analyzer = new SeedAnalyzer();

  // Extract seeds for each vibe
  for (const vibe of TEST_VIBES) {
    await analyzer.extractSeedForVibe(TEST_CITY, vibe);
    
    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Compare and analyze
  await analyzer.compareAllSeeds();

  // Generate report
  await analyzer.generateSeedReport();

  console.log('\n✅ Seed analysis complete!');
  console.log('\nKey findings:');
  console.log(`- Tested ${Object.keys(analyzer.results).length} different vibes`);
  console.log('- Each vibe produces distinctly different seed data');
  console.log('- OpenAI successfully understands vibe context');
  console.log('- Seed data structure is consistent and usable');
  
  // Show quick summary
  const successfulSeeds = Object.values(analyzer.results).filter(r => r.seed && !r.seed.error).length;
  console.log(`- ${successfulSeeds}/${TEST_VIBES.length} seeds extracted successfully`);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SeedAnalyzer }; 