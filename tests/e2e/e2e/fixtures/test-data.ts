// Test data fixtures for e2e tests

export const TEST_CITIES = [
  'Los Angeles',
  'New York',
  'Chicago',
  'San Francisco',
  'Austin',
  'Seattle',
  'Miami',
  'Denver',
  'Portland',
  'Nashville'
];

export const TEST_VIBES = [
  {
    input: 'cozy coffee shop vibes',
    expectedCategories: ['food', 'activity'],
    expectedSeeds: ['coffee', 'cozy', 'cafe'],
    context: 'indoor'
  },
  {
    input: 'outdoor adventure day',
    expectedCategories: ['activity', 'food'],
    expectedSeeds: ['outdoor', 'adventure', 'hiking'],
    context: 'outdoor'
  },
  {
    input: 'jazz and fine dining evening',
    expectedCategories: ['food', 'media', 'activity'],
    expectedSeeds: ['jazz', 'fine dining', 'music'],
    context: 'hybrid'
  },
  {
    input: 'family-friendly weekend activities',
    expectedCategories: ['activity', 'food'],
    expectedSeeds: ['family', 'kids', 'activities'],
    context: 'hybrid'
  },
  {
    input: 'romantic date night',
    expectedCategories: ['food', 'activity', 'media'],
    expectedSeeds: ['romantic', 'date', 'intimate'],
    context: 'hybrid'
  },
  {
    input: 'cultural exploration and art',
    expectedCategories: ['activity', 'media'],
    expectedSeeds: ['art', 'culture', 'museums'],
    context: 'indoor'
  },
  {
    input: 'foodie paradise tour',
    expectedCategories: ['food'],
    expectedSeeds: ['food', 'restaurants', 'culinary'],
    context: 'hybrid'
  },
  {
    input: 'nightlife and live music',
    expectedCategories: ['activity', 'media'],
    expectedSeeds: ['nightlife', 'music', 'bars'],
    context: 'indoor'
  }
];

export const MOCK_SEEDS = [
  {
    text: 'jazz music venues',
    category: 'activity',
    confidence: 0.9,
    searchTerms: ['jazz', 'music', 'venues', 'live music']
  },
  {
    text: 'fine dining restaurants',
    category: 'food',
    confidence: 0.85,
    searchTerms: ['fine dining', 'upscale', 'restaurants', 'gourmet']
  },
  {
    text: 'craft cocktail bars',
    category: 'food',
    confidence: 0.8,
    searchTerms: ['cocktails', 'bars', 'mixology', 'drinks']
  },
  {
    text: 'art galleries',
    category: 'activity',
    confidence: 0.75,
    searchTerms: ['art', 'galleries', 'exhibitions', 'culture']
  }
];

export const MOCK_RECOMMENDATIONS = {
  food: [
    {
      id: 'place-1',
      name: 'The French Laundry',
      description: 'Acclaimed fine dining restaurant with seasonal menu',
      location: 'Napa Valley, CA',
      tasteStrength: 0.95,
      category: 'food',
      image: 'https://example.com/french-laundry.jpg'
    },
    {
      id: 'place-2',
      name: 'Blue Note Jazz Club',
      description: 'Intimate jazz venue with craft cocktails',
      location: 'New York, NY',
      tasteStrength: 0.88,
      category: 'food',
      image: 'https://example.com/blue-note.jpg'
    }
  ],
  movies: [
    {
      id: 'movie-1',
      name: 'La La Land',
      description: 'Musical romantic comedy-drama about jazz and dreams',
      tasteStrength: 0.92,
      category: 'media',
      image: 'https://example.com/lalaland.jpg'
    }
  ],
  books: [
    {
      id: 'book-1',
      name: 'Kitchen Confidential',
      description: 'Anthony Bourdain\'s culinary memoir',
      tasteStrength: 0.87,
      category: 'media',
      image: 'https://example.com/kitchen-confidential.jpg'
    }
  ]
};

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  OPENAI_CHAT: '/api/openai/chat/completions',
  QLOO_INSIGHTS: 'https://hackathon.api.qloo.com/v2/insights'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  API_ERROR: 'API request failed',
  VALIDATION_ERROR: 'Validation failed',
  TIMEOUT_ERROR: 'Request timed out',
  PARSE_ERROR: 'Failed to parse response'
};

export const PERFORMANCE_THRESHOLDS = {
  SEED_EXTRACTION_MAX_TIME: 15000, // 15 seconds
  QLOO_REQUEST_MAX_TIME: 10000,    // 10 seconds
  TOTAL_FLOW_MAX_TIME: 30000,      // 30 seconds
  MIN_SUCCESS_RATE: 0.8            // 80% success rate
};

export const VISUAL_TEST_CONFIG = {
  VIEWPORT_DESKTOP: { width: 1280, height: 720 },
  VIEWPORT_TABLET: { width: 768, height: 1024 },
  VIEWPORT_MOBILE: { width: 375, height: 667 },
  SCREENSHOT_OPTIONS: {
    animations: 'disabled' as const,
    fullPage: true
  }
};

// Helper functions for test data
export function getRandomVibe() {
  return TEST_VIBES[Math.floor(Math.random() * TEST_VIBES.length)];
}

export function getRandomCity() {
  return TEST_CITIES[Math.floor(Math.random() * TEST_CITIES.length)];
}

export function getVibesByContext(context: 'indoor' | 'outdoor' | 'hybrid') {
  return TEST_VIBES.filter(vibe => vibe.context === context);
}

export function createMockOpenAIResponse(seeds = MOCK_SEEDS) {
  return {
    choices: [
      {
        message: {
          content: JSON.stringify(seeds)
        }
      }
    ]
  };
}

export function createMockQlooResponse(entityType: 'place' | 'movie' | 'book' = 'place') {
  const entities = entityType === 'place' ? MOCK_RECOMMENDATIONS.food :
                   entityType === 'movie' ? MOCK_RECOMMENDATIONS.movies :
                   MOCK_RECOMMENDATIONS.books;
                   
  return {
    results: {
      entities: entities
    }
  };
} 