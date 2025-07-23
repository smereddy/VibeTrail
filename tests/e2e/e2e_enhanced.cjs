const fs = require('fs');
const path = require('path');

// Enhanced configuration and utilities
const CONFIG = {
  API_BASE_URL: 'http://localhost:3001',
  QLOO_BASE_URL: 'https://hackathon.api.qloo.com',
  TIMEOUT: 45000,
  MAX_RETRIES: 3,
  DELAY_BETWEEN_TESTS: 1000
};

// Test data
const TEST_VIBES = [
  'cozy coffee shop vibes',
  'outdoor adventure day', 
  'jazz and fine dining evening',
  'family-friendly weekend activities',
  'romantic date night',
  'cultural exploration and art',
  'foodie paradise tour',
  'nightlife and live music'
];

const TEST_CITIES = [
  'Los Angeles',
  'New York',
  'Chicago',
  'San Francisco',
  'Austin'
];

// Enhanced logging utility
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`\n[INFO] ${timestamp} - ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  },
  
  success: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`\n✅ [SUCCESS] ${timestamp} - ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  },
  
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`\n❌ [ERROR] ${timestamp} - ${message}`);
    if (error) {
      console.error(error);
    }
  },
  
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`\n⚠️ [WARN] ${timestamp} - ${message}`);
    if (data) {
      console.warn(JSON.stringify(data, null, 2));
    }
  }
};

// Load environment variables
function loadEnvironment() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      throw new Error('.env file not found');
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const openaiKey = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1];
    const qlooKey = envContent.match(/QLOO_API_KEY=(.+)/)?.[1];
    
    if (!openaiKey || !qlooKey) {
      throw new Error('Missing required API keys in .env file');
    }
    
    return { openaiKey, qlooKey };
  } catch (error) {
    logger.error('Failed to load environment variables', error);
    process.exit(1);
  }
}

// Enhanced API request utility with retry logic
async function makeRequest(url, options, retries = CONFIG.MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      
      logger.warn(`Request attempt ${attempt} failed, retrying...`, {
        url: url.substring(0, 100),
        error: error.message
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Validate seed structure
function validateSeed(seed, vibeContext) {
  const errors = [];
  
  if (!seed.text || typeof seed.text !== 'string' || seed.text.length === 0) {
    errors.push('Invalid or missing text field');
  }
  
  if (!['food', 'activity', 'media', 'general'].includes(seed.category)) {
    errors.push(`Invalid category: ${seed.category}`);
  }
  
  if (typeof seed.confidence !== 'number' || seed.confidence < 0 || seed.confidence > 1) {
    errors.push(`Invalid confidence: ${seed.confidence}`);
  }
  
  if (!Array.isArray(seed.searchTerms) || seed.searchTerms.length === 0) {
    errors.push('Invalid or empty searchTerms array');
  }
  
  if (errors.length > 0) {
    throw new Error(`Seed validation failed for vibe "${vibeContext}": ${errors.join(', ')}`);
  }
  
  return true;
}

// Enhanced OpenAI seed extraction with validation
async function extractSeedsFromOpenAI(vibe, apiKey) {
  logger.info(`Extracting seeds for vibe: "${vibe}"`);
  
  const requestData = {
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
  };
  
  try {
    const data = await makeRequest(`${CONFIG.API_BASE_URL}/api/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    });
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid OpenAI response structure');
    }
    
    // Parse and clean the response
    const cleanContent = data.choices[0].message.content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const seeds = JSON.parse(cleanContent);
    
    if (!Array.isArray(seeds)) {
      throw new Error('Seeds response is not an array');
    }
    
    if (seeds.length === 0) {
      throw new Error('No seeds extracted');
    }
    
    if (seeds.length > 5) {
      logger.warn(`Too many seeds extracted (${seeds.length}), expected 3-5`);
    }
    
    // Validate each seed
    seeds.forEach(seed => validateSeed(seed, vibe));
    
    logger.success(`Successfully extracted ${seeds.length} seeds`, {
      seeds: seeds.map(s => ({ text: s.text, category: s.category, confidence: s.confidence }))
    });
    
    return seeds;
    
  } catch (error) {
    logger.error(`Failed to extract seeds for vibe: "${vibe}"`, error);
    return null;
  }
}

// Enhanced Qloo API testing with comprehensive validation
async function testQlooWithSeeds(seeds, city, apiKey) {
  logger.info(`Testing Qloo recommendations for city: ${city}`);
  
  const results = {
    city,
    seedsUsed: seeds.length,
    categories: {},
    totalRecommendations: 0,
    errors: []
  };
  
  // Test different entity types
  const entityTypes = [
    {
      name: 'food',
      type: 'urn:entity:place',
      tags: ['urn:tag:genre:place:restaurant', 'urn:tag:genre:place:cafe'],
      limit: 8
    },
    {
      name: 'movies',
      type: 'urn:entity:movie',
      tags: [],
      limit: 5
    },
    {
      name: 'books',
      type: 'urn:entity:book',
      tags: [],
      limit: 5
    },
    {
      name: 'music',
      type: 'urn:entity:artist',
      tags: [],
      limit: 5
    }
  ];
  
  for (const entityConfig of entityTypes) {
    try {
      const params = new URLSearchParams({
        'filter.type': entityConfig.type,
        'filter.location.query': city,
        'limit': entityConfig.limit.toString()
      });
      
      // Add tags if specified
      entityConfig.tags.forEach(tag => {
        params.append('filter.tags', tag);
      });
      
      // Add seed queries
      seeds.forEach(seed => {
        params.append('signal.interests.query', seed.text);
      });
      
      const response = await makeRequest(`${CONFIG.QLOO_BASE_URL}/v2/insights?${params.toString()}`, {
        headers: { 'X-Api-Key': apiKey }
      });
      
      const recommendations = response.results?.entities || [];
      
      if (recommendations.length > 0) {
        results.categories[entityConfig.name] = {
          count: recommendations.length,
          samples: recommendations.slice(0, 3).map(entity => ({
            name: entity.name,
            description: (entity.properties?.description || entity.description || '').substring(0, 100),
            id: entity.id
          }))
        };
        
        results.totalRecommendations += recommendations.length;
        
        logger.success(`${entityConfig.name}: ${recommendations.length} recommendations found`);
      } else {
        results.categories[entityConfig.name] = { count: 0, samples: [] };
        logger.warn(`${entityConfig.name}: No recommendations found`);
      }
      
    } catch (error) {
      const errorMsg = `Failed to get ${entityConfig.name} recommendations: ${error.message}`;
      results.errors.push(errorMsg);
      logger.error(errorMsg);
      results.categories[entityConfig.name] = { count: 0, samples: [], error: error.message };
    }
  }
  
  return results;
}

// Performance metrics tracking
class PerformanceTracker {
  constructor() {
    this.metrics = {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      totalTime: 0,
      averageTimePerTest: 0,
      seedExtractionTimes: [],
      qlooRequestTimes: [],
      errors: []
    };
  }
  
  startTest() {
    return Date.now();
  }
  
  endTest(startTime, success, testName) {
    const duration = Date.now() - startTime;
    this.metrics.totalTests++;
    this.metrics.totalTime += duration;
    
    if (success) {
      this.metrics.successfulTests++;
    } else {
      this.metrics.failedTests++;
      this.metrics.errors.push({ testName, duration });
    }
    
    this.metrics.averageTimePerTest = this.metrics.totalTime / this.metrics.totalTests;
  }
  
  addSeedExtractionTime(time) {
    this.metrics.seedExtractionTimes.push(time);
  }
  
  addQlooRequestTime(time) {
    this.metrics.qlooRequestTimes.push(time);
  }
  
  getReport() {
    const seedAvg = this.metrics.seedExtractionTimes.length > 0 
      ? this.metrics.seedExtractionTimes.reduce((a, b) => a + b, 0) / this.metrics.seedExtractionTimes.length 
      : 0;
      
    const qlooAvg = this.metrics.qlooRequestTimes.length > 0
      ? this.metrics.qlooRequestTimes.reduce((a, b) => a + b, 0) / this.metrics.qlooRequestTimes.length
      : 0;
    
    return {
      ...this.metrics,
      averageSeedExtractionTime: Math.round(seedAvg),
      averageQlooRequestTime: Math.round(qlooAvg),
      successRate: ((this.metrics.successfulTests / this.metrics.totalTests) * 100).toFixed(1)
    };
  }
}

// Main test execution
async function runEnhancedE2ETest() {
  logger.info('🚀 Starting Enhanced End-to-End Vibe Testing');
  
  const { openaiKey, qlooKey } = loadEnvironment();
  const performanceTracker = new PerformanceTracker();
  const testResults = [];
  
  // Test health endpoint first
  try {
    logger.info('Testing proxy server health...');
    const healthData = await makeRequest(`${CONFIG.API_BASE_URL}/api/health`, {});
    logger.success('Proxy server is healthy', {
      openaiKey: healthData.openaiKey,
      qlooKey: healthData.qlooKey,
      timeouts: healthData.timeouts
    });
  } catch (error) {
    logger.error('Proxy server health check failed', error);
    process.exit(1);
  }
  
  // Test different cities with different vibes
  for (let i = 0; i < Math.min(TEST_VIBES.length, TEST_CITIES.length); i++) {
    const vibe = TEST_VIBES[i];
    const city = TEST_CITIES[i % TEST_CITIES.length];
    const testStartTime = performanceTracker.startTest();
    
    logger.info(`\n${'='.repeat(80)}`);
    logger.info(`🎯 Test ${i + 1}/${Math.min(TEST_VIBES.length, TEST_CITIES.length)}: "${vibe}" in ${city}`);
    logger.info(`${'='.repeat(80)}`);
    
    try {
      // Step 1: Extract seeds from OpenAI
      const seedStartTime = Date.now();
      const seeds = await extractSeedsFromOpenAI(vibe, openaiKey);
      const seedEndTime = Date.now();
      
      if (!seeds) {
        throw new Error('Failed to extract seeds');
      }
      
      performanceTracker.addSeedExtractionTime(seedEndTime - seedStartTime);
      
      // Step 2: Test Qloo with extracted seeds
      const qlooStartTime = Date.now();
      const recommendations = await testQlooWithSeeds(seeds, city, qlooKey);
      const qlooEndTime = Date.now();
      
      performanceTracker.addQlooRequestTime(qlooEndTime - qlooStartTime);
      
      // Compile test result
      const testResult = {
        vibe,
        city,
        success: true,
        seedsExtracted: seeds.length,
        totalRecommendations: recommendations.totalRecommendations,
        categories: Object.keys(recommendations.categories).length,
        errors: recommendations.errors,
        duration: Date.now() - testStartTime
      };
      
      testResults.push(testResult);
      performanceTracker.endTest(testStartTime, true, `${vibe} - ${city}`);
      
      logger.success(`Test completed successfully`, {
        seeds: seeds.length,
        recommendations: recommendations.totalRecommendations,
        categories: Object.keys(recommendations.categories),
        duration: `${testResult.duration}ms`
      });
      
    } catch (error) {
      const testResult = {
        vibe,
        city,
        success: false,
        error: error.message,
        duration: Date.now() - testStartTime
      };
      
      testResults.push(testResult);
      performanceTracker.endTest(testStartTime, false, `${vibe} - ${city}`);
      
      logger.error(`Test failed`, error);
    }
    
    // Delay between tests to avoid rate limiting
    if (i < Math.min(TEST_VIBES.length, TEST_CITIES.length) - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_TESTS));
    }
  }
  
  // Generate comprehensive report
  const performanceReport = performanceTracker.getReport();
  
  logger.info('\n' + '='.repeat(80));
  logger.info('📊 COMPREHENSIVE TEST REPORT');
  logger.info('='.repeat(80));
  
  logger.success('Performance Metrics', {
    totalTests: performanceReport.totalTests,
    successfulTests: performanceReport.successfulTests,
    failedTests: performanceReport.failedTests,
    successRate: `${performanceReport.successRate}%`,
    totalTime: `${performanceReport.totalTime}ms`,
    averageTimePerTest: `${performanceReport.averageTimePerTest}ms`,
    averageSeedExtractionTime: `${performanceReport.averageSeedExtractionTime}ms`,
    averageQlooRequestTime: `${performanceReport.averageQlooRequestTime}ms`
  });
  
  logger.info('\nDetailed Test Results:');
  testResults.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} Test ${index + 1}: "${result.vibe}" in ${result.city}`);
    
    if (result.success) {
      console.log(`     Seeds: ${result.seedsExtracted}, Recommendations: ${result.totalRecommendations}, Duration: ${result.duration}ms`);
      if (result.errors && result.errors.length > 0) {
        console.log(`     Warnings: ${result.errors.join(', ')}`);
      }
    } else {
      console.log(`     Error: ${result.error}, Duration: ${result.duration}ms`);
    }
  });
  
  // Save detailed report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    configuration: CONFIG,
    performance: performanceReport,
    testResults,
    environment: {
      nodeVersion: process.version,
      platform: process.platform
    }
  };
  
  const reportPath = path.join(__dirname, `e2e-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  logger.success(`Detailed report saved to: ${reportPath}`);
  
  logger.info('\n🎉 Enhanced E2E Testing Complete!');
  
  // Exit with appropriate code
  process.exit(performanceReport.failedTests > 0 ? 1 : 0);
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the tests
runEnhancedE2ETest().catch(error => {
  logger.error('Test execution failed', error);
  process.exit(1);
}); 