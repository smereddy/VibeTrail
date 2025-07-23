import { CityData, WeekendEvent, CreatorInsight } from '../types';

export const cities: CityData[] = [
  {
    name: 'Los Angeles',
    code: 'LA',
    seeds: [
      { id: 'jazz', text: 'Jazz', category: 'Music', confidence: 0.95 },
      { id: 'romantic', text: 'Romantic', category: 'Mood', confidence: 0.88 },
      { id: 'vintage', text: 'Vintage Cinema', category: 'Film', confidence: 0.92 },
      { id: 'artdeco', text: 'Art Deco', category: 'Style', confidence: 0.85 }
    ],
    recommendations: [
      {
        id: 'lighthouse-cafe',
        name: 'Lighthouse Cafe',
        description: 'Iconic jazz club where La La Land was filmed',
        location: 'Hermosa Beach, CA',
        tasteStrength: 0.96,
        image: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Live jazz club vibe aligns perfectly with your La La Land seed',
        category: 'activity',
        subcategory: 'music'
      },
      {
        id: 'griffith-observatory',
        name: 'Griffith Observatory',
        description: 'Romantic stargazing with city views',
        location: 'Griffith Park, Los Angeles',
        tasteStrength: 0.91,
        image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Romantic atmosphere matches your vintage cinema preferences',
        category: 'activity',
        subcategory: 'sightseeing'
      },
      {
        id: 'republique',
        name: 'Republique',
        description: 'French bistro in stunning Art Deco setting',
        location: 'Mid-City, Los Angeles',
        tasteStrength: 0.89,
        image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Art Deco architecture complements your vintage aesthetic',
        category: 'food',
        subcategory: 'fine-dining'
      },
      {
        id: 'new-beverly-cinema',
        name: 'New Beverly Cinema',
        description: 'Classic film theater showing vintage movies',
        location: 'Beverly Hills, CA',
        tasteStrength: 0.94,
        image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Vintage cinema experience matches your romantic film preferences',
        category: 'activity',
        subcategory: 'entertainment'
      },
      {
        id: 'ella-fitzgerald-playlist',
        name: 'Ella Fitzgerald Essentials',
        description: 'Jazz standards playlist perfect for romantic evenings',
        location: 'Spotify/Apple Music',
        tasteStrength: 0.93,
        image: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Classic jazz vocals enhance your romantic La La Land vibe',
        category: 'media',
        subcategory: 'music'
      },
      {
        id: 'casablanca-film',
        name: 'Casablanca (1942)',
        description: 'Classic romantic film with jazz soundtrack',
        location: 'Streaming/Cinema',
        tasteStrength: 0.87,
        image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Romantic vintage cinema with jazz elements matches your taste profile',
        category: 'media',
        subcategory: 'film'
      }
    ],
    relationships: [
      { source: 'jazz', target: 'lighthouse-cafe', strength: 0.96, reason: 'Direct musical connection' },
      { source: 'romantic', target: 'griffith-observatory', strength: 0.91, reason: 'Romantic atmosphere' },
      { source: 'vintage', target: 'new-beverly-cinema', strength: 0.94, reason: 'Classic film venue' },
      { source: 'artdeco', target: 'republique', strength: 0.89, reason: 'Architectural style match' },
      { source: 'jazz', target: 'ella-fitzgerald-playlist', strength: 0.93, reason: 'Musical genre alignment' },
      { source: 'romantic', target: 'casablanca-film', strength: 0.87, reason: 'Romantic film classic' }
    ]
  },
  {
    name: 'Phoenix',
    code: 'PHX',
    seeds: [
      { id: 'desert', text: 'Desert Sunset', category: 'Nature', confidence: 0.92 },
      { id: 'tacos', text: 'Authentic Tacos', category: 'Food', confidence: 0.89 },
      { id: 'science', text: 'Science Learning', category: 'Education', confidence: 0.85 },
      { id: 'family', text: 'Family Fun', category: 'Activity', confidence: 0.88 }
    ],
    recommendations: [
      {
        id: 'south-mountain',
        name: 'South Mountain Park',
        description: 'Desert hiking trails with stunning sunset views',
        location: 'South Phoenix, AZ',
        tasteStrength: 0.94,
        image: 'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Perfect desert sunset location matching your natural vibe',
        category: 'activity',
        subcategory: 'outdoor'
      },
      {
        id: 'science-center',
        name: 'Arizona Science Center',
        description: 'Interactive exhibits perfect for family learning',
        location: 'Downtown Phoenix, AZ',
        tasteStrength: 0.87,
        image: 'https://images.pexels.com/photos/8474893/pexels-photo-8474893.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Science learning experiences align with your educational interests',
        category: 'activity',
        subcategory: 'education'
      },
      {
        id: 'barrio-cafe',
        name: 'Barrio Cafe',
        description: 'Authentic Mexican cuisine with creative flair',
        location: 'Central Phoenix, AZ',
        tasteStrength: 0.91,
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Authentic taco experience matches your Mexican food preferences',
        category: 'food',
        subcategory: 'mexican'
      },
      {
        id: 'musical-instrument-museum',
        name: 'Musical Instrument Museum',
        description: 'World-class music exhibits for all ages',
        location: 'North Phoenix, AZ',
        tasteStrength: 0.83,
        image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Family-friendly cultural experience with educational value',
        category: 'activity',
        subcategory: 'culture'
      },
      {
        id: 'desert-botanical-garden',
        name: 'Desert Botanical Garden',
        description: 'Beautiful desert landscapes and sunset views',
        location: 'Papago Park, Phoenix',
        tasteStrength: 0.89,
        image: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Desert beauty complements your sunset and nature preferences',
        category: 'activity',
        subcategory: 'nature'
      },
      {
        id: 'desert-sounds-playlist',
        name: 'Desert Sounds Playlist',
        description: 'Ambient music inspired by Southwest landscapes',
        location: 'Spotify/Apple Music',
        tasteStrength: 0.86,
        image: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=400',
        whyItFits: 'Desert ambient music matches your natural landscape preferences',
        category: 'media',
        subcategory: 'music'
      }
    ],
    relationships: [
      { source: 'desert', target: 'south-mountain', strength: 0.94, reason: 'Desert landscape connection' },
      { source: 'science', target: 'science-center', strength: 0.87, reason: 'Educational content match' },
      { source: 'tacos', target: 'barrio-cafe', strength: 0.91, reason: 'Authentic Mexican cuisine' },
      { source: 'family', target: 'musical-instrument-museum', strength: 0.83, reason: 'Family-friendly culture' },
      { source: 'desert', target: 'desert-botanical-garden', strength: 0.89, reason: 'Desert environment' },
      { source: 'desert', target: 'desert-sounds-playlist', strength: 0.86, reason: 'Desert atmosphere music' }
    ]
  },
  {
    name: 'New York',
    code: 'NYC',
    seeds: [
      { id: 'jazz', text: 'Jazz', category: 'Music', confidence: 0.95 },
      { id: 'broadway', text: 'Broadway Shows', category: 'Entertainment', confidence: 0.92 },
      { id: 'artgallery', text: 'Art Galleries', category: 'Culture', confidence: 0.89 },
      { id: 'rooftop', text: 'Rooftop Views', category: 'Experience', confidence: 0.87 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Denver',
    code: 'DEN',
    seeds: [
      { id: 'mountains', text: 'Mountain Views', category: 'Nature', confidence: 0.94 },
      { id: 'craft-beer', text: 'Craft Beer', category: 'Food', confidence: 0.91 },
      { id: 'hiking', text: 'Outdoor Hiking', category: 'Activity', confidence: 0.88 },
      { id: 'local-music', text: 'Local Music Scene', category: 'Music', confidence: 0.85 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Seattle',
    code: 'SEA',
    seeds: [
      { id: 'coffee', text: 'Coffee Culture', category: 'Food', confidence: 0.93 },
      { id: 'grunge', text: 'Grunge Music', category: 'Music', confidence: 0.90 },
      { id: 'waterfront', text: 'Waterfront Views', category: 'Nature', confidence: 0.87 },
      { id: 'tech-culture', text: 'Tech Culture', category: 'Culture', confidence: 0.84 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Dallas',
    code: 'DAL',
    seeds: [
      { id: 'bbq', text: 'BBQ Culture', category: 'Food', confidence: 0.92 },
      { id: 'country-music', text: 'Country Music', category: 'Music', confidence: 0.89 },
      { id: 'cowboy-culture', text: 'Cowboy Heritage', category: 'Culture', confidence: 0.86 },
      { id: 'sports', text: 'Sports Scene', category: 'Activity', confidence: 0.88 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Omaha',
    code: 'OMA',
    seeds: [
      { id: 'steakhouse', text: 'Steakhouse Dining', category: 'Food', confidence: 0.90 },
      { id: 'zoo', text: 'World-Class Zoo', category: 'Activity', confidence: 0.87 },
      { id: 'riverfront', text: 'Missouri River', category: 'Nature', confidence: 0.84 },
      { id: 'jazz-heritage', text: 'Jazz Heritage', category: 'Music', confidence: 0.82 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Chicago',
    code: 'CHI',
    seeds: [
      { id: 'deep-dish', text: 'Deep Dish Pizza', category: 'Food', confidence: 0.94 },
      { id: 'blues', text: 'Blues Music', category: 'Music', confidence: 0.91 },
      { id: 'architecture', text: 'Architecture Tours', category: 'Culture', confidence: 0.88 },
      { id: 'lakefront', text: 'Lake Michigan', category: 'Nature', confidence: 0.85 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Miami',
    code: 'MIA',
    seeds: [
      { id: 'art-deco', text: 'Art Deco District', category: 'Culture', confidence: 0.92 },
      { id: 'latin-music', text: 'Latin Music', category: 'Music', confidence: 0.90 },
      { id: 'beach-culture', text: 'Beach Lifestyle', category: 'Activity', confidence: 0.89 },
      { id: 'cuban-food', text: 'Cuban Cuisine', category: 'Food', confidence: 0.87 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Austin',
    code: 'AUS',
    seeds: [
      { id: 'live-music', text: 'Live Music Capital', category: 'Music', confidence: 0.95 },
      { id: 'food-trucks', text: 'Food Truck Scene', category: 'Food', confidence: 0.88 },
      { id: 'keep-austin-weird', text: 'Weird Culture', category: 'Culture', confidence: 0.86 },
      { id: 'outdoor-festivals', text: 'Music Festivals', category: 'Activity', confidence: 0.91 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'San Francisco',
    code: 'SF',
    seeds: [
      { id: 'golden-gate', text: 'Golden Gate Bridge', category: 'Nature', confidence: 0.93 },
      { id: 'tech-scene', text: 'Tech Innovation', category: 'Culture', confidence: 0.90 },
      { id: 'sourdough', text: 'Sourdough Bread', category: 'Food', confidence: 0.87 },
      { id: 'cable-cars', text: 'Historic Cable Cars', category: 'Activity', confidence: 0.85 }
    ],
    recommendations: [],
    relationships: []
  },
  {
    name: 'Nashville',
    code: 'NSH',
    seeds: [
      { id: 'country-music', text: 'Country Music Capital', category: 'Music', confidence: 0.96 },
      { id: 'honky-tonk', text: 'Honky Tonk Bars', category: 'Activity', confidence: 0.92 },
      { id: 'southern-food', text: 'Southern Cuisine', category: 'Food', confidence: 0.89 },
      { id: 'music-city', text: 'Music City Culture', category: 'Culture', confidence: 0.94 }
    ],
    recommendations: [],
    relationships: []
  }
];

export const weekendEvents: { [key: string]: WeekendEvent[] } = {
  LA: [
    {
      id: 'friday-jazz',
      name: 'Friday Jazz Night at Blue Note',
      date: '2024-02-16',
      time: '8:00 PM',
      location: 'Blue Note Los Angeles',
      category: 'music',
      pairedRecommendation: cities[0].recommendations.find(r => r.id === 'republique')
    },
    {
      id: 'saturday-film',
      name: 'Classic Film Festival',
      date: '2024-02-17',
      time: '2:00 PM',
      location: 'Egyptian Theatre',
      category: 'film',
      pairedRecommendation: cities[0].recommendations.find(r => r.id === 'lighthouse-cafe')
    },
    {
      id: 'sunday-observatory',
      name: 'Stargazing Event',
      date: '2024-02-18',
      time: '7:00 PM',
      location: 'Griffith Observatory',
      category: 'science',
      pairedRecommendation: cities[0].recommendations.find(r => r.id === 'republique')
    }
  ],
  PHX: [
    {
      id: 'friday-market',
      name: 'Desert Night Market',
      date: '2024-02-16',
      time: '6:00 PM',
      location: 'Heritage Square',
      category: 'food',
      pairedRecommendation: cities[1].recommendations.find(r => r.id === 'science-center')
    },
    {
      id: 'saturday-hike',
      name: 'Family Desert Hike',
      date: '2024-02-17',
      time: '9:00 AM',
      location: 'Papago Park',
      category: 'outdoor',
      pairedRecommendation: cities[1].recommendations.find(r => r.id === 'barrio-cafe')
    },
    {
      id: 'sunday-science',
      name: 'Science Sunday Workshop',
      date: '2024-02-18',
      time: '1:00 PM',
      location: 'Arizona Science Center',
      category: 'education',
      pairedRecommendation: cities[1].recommendations.find(r => r.id === 'desert-botanical-garden')
    }
  ]
};

export const creatorInsights: { [key: string]: CreatorInsight } = {
  LA: {
    topCuisines: ['French Bistro', 'Jazz Club Dining', 'Vintage American'],
    topGenres: ['Jazz Standards', 'Classic Film Scores', 'Romantic Ballads'],
    styleAdjectives: ['Romantic', 'Vintage', 'Sophisticated', 'Timeless'],
    partnershipIdeas: [
      'Partner with retro jazz lounge for Friday kickoff',
      'Collaborate with vintage cinema for themed nights',
      'Art Deco restaurant partnerships for romantic dining',
      'Classic film streaming service content curation'
    ],
    copyHooks: [
      'Create your own La La Land story in the city of dreams',
      'Where jazz meets romance in the heart of Hollywood',
      'Vintage glamour meets modern LA sophistication'
    ]
  },
  PHX: {
    topCuisines: ['Authentic Mexican', 'Desert-inspired', 'Family-friendly'],
    topGenres: ['Desert Ambient', 'Southwest Folk', 'Educational Content'],
    styleAdjectives: ['Natural', 'Authentic', 'Family-oriented', 'Educational'],
    partnershipIdeas: [
      'Desert sunset tour company partnerships',
      'Mexican restaurant family meal packages',
      'Science museum educational partnerships',
      'Outdoor gear brand collaborations'
    ],
    copyHooks: [
      'Discover the authentic flavors of the Southwest',
      'Where desert beauty meets family adventure',
      'Follow the trail to authentic Phoenix experiences'
    ]
  }
};