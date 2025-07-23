/**
 * Environment configuration for VibeTrail 2.0
 * Handles secure API configuration and environment variables
 * Updated for direct API calls and dynamic entity system
 */

// Environment configuration for VibeTrail
export interface EnvironmentConfig {
  app: {
    name: string;
    version: string;
    apiProxyUrl: string;
    environment: 'development' | 'production' | 'test';
  };
  api: {
    openai: {
      model: string;
      maxTokens: number;
      temperature: number;
    };
    qloo: {
      baseUrl: string;
      version: string;
    };
  };
  features: {
    enableAnalytics: boolean;
    enableDebugLogs: boolean;
    enableMockData: boolean;
  };
}

// Determine if we're in production (deployed to Netlify)
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

// Get the base URL for API calls
const getApiBaseUrl = () => {
  // In production (Netlify), use the same domain with /.netlify/functions/
  if (isProduction) {
    return `${window.location.origin}/.netlify/functions`;
  }
  
  // In development, use the environment variable or default to localhost
  return import.meta.env.VITE_API_PROXY_URL || 'http://localhost:3001/api';
};

export const environment: EnvironmentConfig = {
  app: {
    name: 'VibeTrail',
    version: '2.0.0',
    apiProxyUrl: getApiBaseUrl(),
    environment: isProduction ? 'production' : 'development'
  },
  api: {
    openai: {
      model: 'gpt-4o-mini',
      maxTokens: 800,
      temperature: 0.3
    },
    qloo: {
      baseUrl: 'https://hackathon.api.qloo.com',
      version: 'v2'
    }
  },
  features: {
    enableAnalytics: isProduction,
    enableDebugLogs: !isProduction,
    enableMockData: false
  }
};

// Debug logging
if (environment.features.enableDebugLogs) {
  console.log('🔧 Environment Config:', {
    environment: environment.app.environment,
    apiUrl: environment.app.apiProxyUrl,
    isProduction,
    hostname: window.location.hostname
  });
}

/**
 * Get supported cities for VibeTrail 2.0
 */
export function getSupportedCities() {
  return [
    { name: 'New York', code: 'NYC', coordinates: [40.7128, -74.0060] },
    { name: 'Los Angeles', code: 'LAX', coordinates: [34.0522, -118.2437] },
    { name: 'Phoenix', code: 'PHX', coordinates: [33.4484, -112.0740] },
    { name: 'Chicago', code: 'CHI', coordinates: [41.8781, -87.6298] },
    { name: 'Miami', code: 'MIA', coordinates: [25.7617, -80.1918] },
    { name: 'San Francisco', code: 'SFO', coordinates: [37.7749, -122.4194] },
    { name: 'Seattle', code: 'SEA', coordinates: [47.6062, -122.3321] },
    { name: 'Austin', code: 'AUS', coordinates: [30.2672, -97.7431] },
    { name: 'Denver', code: 'DEN', coordinates: [39.7392, -104.9903] },
    { name: 'Boston', code: 'BOS', coordinates: [42.3601, -71.0589] },
    { name: 'Atlanta', code: 'ATL', coordinates: [33.7490, -84.3880] },
    { name: 'Nashville', code: 'BNA', coordinates: [36.1627, -86.7816] },
    { name: 'Portland', code: 'PDX', coordinates: [45.5152, -122.6784] },
    { name: 'San Diego', code: 'SAN', coordinates: [32.7157, -117.1611] },
    { name: 'Las Vegas', code: 'LAS', coordinates: [36.1699, -115.1398] }
  ];
}

/**
 * Get default entity type priorities for different contexts
 */
export function getDefaultEntityPriorities() {
  return {
    indoor: {
      'urn:entity:book': 9,
      'urn:entity:movie': 8,
      'urn:entity:tv_show': 8,
      'urn:entity:podcast': 7,
      'urn:entity:videogame': 6,
      'urn:entity:place': 5,
      'urn:entity:artist': 4,
      'urn:entity:destination': 2
    },
    outdoor: {
      'urn:entity:place': 10,
      'urn:entity:destination': 9,
      'urn:entity:artist': 6,
      'urn:entity:movie': 4,
      'urn:entity:book': 3,
      'urn:entity:tv_show': 3,
      'urn:entity:podcast': 3,
      'urn:entity:videogame': 2
    },
    hybrid: {
      'urn:entity:place': 8,
      'urn:entity:movie': 7,
      'urn:entity:artist': 7,
      'urn:entity:book': 6,
      'urn:entity:destination': 6,
      'urn:entity:tv_show': 5,
      'urn:entity:podcast': 5,
      'urn:entity:videogame': 4
    }
  };
}

/**
 * Validate required environment variables for VibeTrail 2.0
 */
export function validateEnvironment(): void {
  const config = environment;
  
  // Qloo API key is handled server-side by proxy
  console.log('🔒 Qloo API key managed securely by proxy server');
  
  // OpenAI API key is handled server-side by proxy
  console.log('🔒 OpenAI API key managed securely by proxy server');
  
  // Validate proxy URL in production
  if (config.app.environment === 'production' && !config.app.apiProxyUrl) {
    throw new Error('API_PROXY_URL must be configured for production');
  }
  
  // Log configuration for debugging
  console.log('🔧 VibeTrail 2.0 Configuration:', {
    environment: config.app.environment,
    qlooDirectCalls: false, // Qloo is now direct, so this is always false
    dynamicTabs: false, // Dynamic tabs are now handled by Netlify functions
    contextDetection: false, // Context detection is now handled by Netlify functions
    supportedCities: getSupportedCities().length
  });
}