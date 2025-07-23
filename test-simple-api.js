import axios from 'axios';

// Simple API health check for hackathon
async function testAPIHealth() {
  console.log('🧪 Testing API Health...');
  
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://your-netlify-site.netlify.app/.netlify/functions'
    : 'http://localhost:3001/api';
    
  console.log(`🌐 Testing: ${baseURL}`);
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${baseURL}/health`, {
      timeout: 10000,
      validateStatus: () => true // Accept any status code
    });
    
    if (healthResponse.status === 200) {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log(`⚠️ Health check returned ${healthResponse.status}`);
      return false;
    }
    
  } catch (error) {
    console.log('❌ API Health check failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure to run: npm run proxy (for local dev)');
    }
    
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPIHealth()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testAPIHealth }; 