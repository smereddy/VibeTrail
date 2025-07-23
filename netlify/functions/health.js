exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const healthData = { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    openaiKey: !!process.env.OPENAI_API_KEY,
    qlooKey: !!process.env.QLOO_API_KEY,
    deployment: 'netlify-functions',
    functions: [
      'taste',
      'plan-day', 
      'ecosystem-analysis',
      'health'
    ]
  };
  
  console.log('Health check requested', healthData);
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(healthData)
  };
}; 