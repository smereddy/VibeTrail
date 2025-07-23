import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Search, Star, MapPin, Clock, Globe, Music, Film, Book, Gamepad2, Podcast, Camera, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

// Qloo Entity Types and their capabilities
const QLOO_ENTITY_TYPES = [
  {
    type: 'urn:entity:place',
    name: 'Places',
    icon: <Utensils className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-600 border-orange-200',
    description: 'Restaurants, venues, attractions, physical locations',
    dataFields: [
      'Name & Description',
      'Address & Location',
      'Business Hours',
      'Phone & Website',
      'Business Rating (1-5)',
      'Price Level (1-4)',
      'Categories & Tags',
      'Specialty Dishes',
      'Keywords & Reviews',
      'Geocode Data',
      'Neighborhood Info'
    ],
    sampleData: {
      name: "Catch NYC",
      description: "Sleek, tri-level space known for celebrity sightings, creative seafood-focused food, and a rooftop.",
      address: "21 9th Ave New York, NY 10014",
      rating: 4.2,
      priceLevel: 3,
      categories: ["Seafood", "Fine Dining", "Rooftop"],
      specialtyDishes: ["Hellfire Roll", "Lobster Mac & Cheese", "Sweet Potato Gnocchi"],
      keywords: ["sushi", "brunch", "celebrity sightings", "rooftop dining"]
    }
  },
  {
    type: 'urn:entity:movie',
    name: 'Movies',
    icon: <Film className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    description: 'Films, cinema experiences, movie recommendations',
    dataFields: [
      'Title & Plot',
      'Release Year',
      'Genre & Categories',
      'Director & Cast',
      'Runtime Duration',
      'IMDB Rating',
      'Box Office Data',
      'Awards & Recognition',
      'Similar Movies',
      'Streaming Availability',
      'Critical Reviews'
    ],
    sampleData: {
      name: "The Grand Budapest Hotel",
      year: 2014,
      genres: ["Comedy", "Drama", "Adventure"],
      director: "Wes Anderson",
      runtime: "99 minutes",
      imdbRating: 8.1,
      plot: "A legendary concierge and his protégé at a famous European hotel get framed for murder."
    }
  },
  {
    type: 'urn:entity:artist',
    name: 'Music Artists',
    icon: <Music className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    description: 'Musicians, bands, live music venues',
    dataFields: [
      'Artist Name & Bio',
      'Music Genres',
      'Popular Songs',
      'Album Discography',
      'Concert Venues',
      'Spotify/Apple Music Links',
      'Tour Dates',
      'Similar Artists',
      'Music Videos',
      'Collaborations',
      'Awards & Charts'
    ],
    sampleData: {
      name: "Billie Eilish",
      genres: ["Pop", "Alternative", "Electropop"],
      topSongs: ["Bad Guy", "Therefore I Am", "Happier Than Ever"],
      albumCount: 3,
      awards: ["5 Grammy Awards", "2 American Music Awards"]
    }
  },
  {
    type: 'urn:entity:book',
    name: 'Books',
    icon: <Book className="w-6 h-6" />,
    color: 'bg-green-100 text-green-600 border-green-200',
    description: 'Books, literature, reading recommendations',
    dataFields: [
      'Title & Synopsis',
      'Author & Publisher',
      'Publication Year',
      'Genre & Categories',
      'Page Count',
      'ISBN & Format',
      'Goodreads Rating',
      'Awards & Recognition',
      'Similar Books',
      'Reader Reviews',
      'Book Club Picks'
    ],
    sampleData: {
      name: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      year: 2017,
      genres: ["Historical Fiction", "Romance", "LGBTQ+"],
      pages: 400,
      goodreadsRating: 4.2,
      synopsis: "A reclusive Hollywood icon reveals her secrets to a young journalist."
    }
  },
  {
    type: 'urn:entity:tv_show',
    name: 'TV Shows',
    icon: <Camera className="w-6 h-6" />,
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    description: 'TV series, streaming content, episodic entertainment',
    dataFields: [
      'Show Title & Plot',
      'Seasons & Episodes',
      'Genre & Network',
      'Cast & Creators',
      'Air Dates',
      'IMDB/Rotten Tomatoes',
      'Streaming Platforms',
      'Awards & Nominations',
      'Similar Shows',
      'Episode Guides',
      'Fan Ratings'
    ],
    sampleData: {
      name: "Stranger Things",
      seasons: 4,
      episodes: 42,
      genres: ["Sci-Fi", "Horror", "Drama"],
      network: "Netflix",
      imdbRating: 8.7,
      plot: "Kids in a small town uncover supernatural mysteries and government conspiracies."
    }
  },
  {
    type: 'urn:entity:podcast',
    name: 'Podcasts',
    icon: <Podcast className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-600 border-pink-200',
    description: 'Audio content, podcasts, audio experiences',
    dataFields: [
      'Podcast Name & Description',
      'Host Information',
      'Episode Count',
      'Categories & Tags',
      'Episode Duration',
      'Release Schedule',
      'Listener Ratings',
      'Platform Availability',
      'Popular Episodes',
      'Guest Appearances',
      'Transcript Availability'
    ],
    sampleData: {
      name: "The Daily",
      host: "Michael Barbaro",
      episodes: 1500,
      category: "News & Politics",
      avgDuration: "25 minutes",
      rating: 4.5,
      description: "The biggest stories of our time, told by the best journalists in the world."
    }
  },
  {
    type: 'urn:entity:videogame',
    name: 'Video Games',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: 'bg-red-100 text-red-600 border-red-200',
    description: 'Games, interactive entertainment, gaming experiences',
    dataFields: [
      'Game Title & Description',
      'Platform Availability',
      'Developer & Publisher',
      'Release Date',
      'Genre & Tags',
      'Metacritic Score',
      'Player Ratings',
      'Multiplayer Support',
      'DLC & Expansions',
      'System Requirements',
      'Age Rating (ESRB)'
    ],
    sampleData: {
      name: "The Legend of Zelda: Breath of the Wild",
      platforms: ["Nintendo Switch", "Wii U"],
      developer: "Nintendo",
      releaseDate: "2017-03-03",
      genres: ["Action", "Adventure", "RPG"],
      metacriticScore: 97,
      description: "Open-world adventure game set in the kingdom of Hyrule."
    }
  },
  {
    type: 'urn:entity:destination',
    name: 'Destinations',
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-teal-100 text-teal-600 border-teal-200',
    description: 'Travel destinations, neighborhoods, places to visit',
    dataFields: [
      'Destination Name',
      'Country & Region',
      'Best Time to Visit',
      'Popular Attractions',
      'Travel Tips & Guides',
      'Climate Information',
      'Local Culture',
      'Transportation Options',
      'Accommodation Types',
      'Food & Dining',
      'Safety & Health Info'
    ],
    sampleData: {
      name: "Santorini, Greece",
      country: "Greece",
      bestTime: "April to November",
      attractions: ["Oia Sunset", "Red Beach", "Ancient Thera"],
      culture: "Greek island culture with Cycladic architecture",
      climate: "Mediterranean with dry summers"
    }
  }
];

// Dynamic Tab Configurations based on vibe context
const DYNAMIC_TAB_EXAMPLES = [
  {
    vibe: "cozy coffee shop vibes",
    suggestedTabs: [
      { name: "Places", priority: 10, reason: "Coffee shops, cafes, bookstores" },
      { name: "Books", priority: 8, reason: "Reading material for cozy atmosphere" },
      { name: "Music", priority: 7, reason: "Ambient playlist recommendations" },
      { name: "Podcasts", priority: 6, reason: "Audio content for background listening" }
    ]
  },
  {
    vibe: "outdoor adventure day",
    suggestedTabs: [
      { name: "Places", priority: 10, reason: "Parks, trails, outdoor venues" },
      { name: "Destinations", priority: 9, reason: "Adventure destinations nearby" },
      { name: "Music", priority: 5, reason: "Energetic outdoor playlists" }
    ]
  },
  {
    vibe: "cultural exploration",
    suggestedTabs: [
      { name: "Places", priority: 9, reason: "Museums, galleries, cultural sites" },
      { name: "Books", priority: 8, reason: "Cultural literature and guides" },
      { name: "Movies", priority: 7, reason: "Films about local culture" },
      { name: "Destinations", priority: 6, reason: "Cultural neighborhoods" }
    ]
  },
  {
    vibe: "rainy day entertainment",
    suggestedTabs: [
      { name: "Movies", priority: 10, reason: "Perfect for indoor viewing" },
      { name: "TV Shows", priority: 9, reason: "Binge-watching opportunities" },
      { name: "Books", priority: 8, reason: "Cozy reading time" },
      { name: "Games", priority: 7, reason: "Interactive indoor entertainment" },
      { name: "Podcasts", priority: 6, reason: "Audio entertainment" }
    ]
  }
];

const QlooAPIExplorer: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState(QLOO_ENTITY_TYPES[0]);
  const [selectedVibe, setSelectedVibe] = useState(DYNAMIC_TAB_EXAMPLES[0]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link to="/create-plan" className="btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Create Plan
            </Link>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Database className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h1 className="heading-lg">Qloo API Explorer</h1>
                <p className="text-sm text-neutral-600">Discover what data we can display in VibeTrail</p>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Types Overview */}
        <div className="mb-16">
          <h2 className="heading-md text-center mb-8">Available Content Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {QLOO_ENTITY_TYPES.map((entity, index) => (
              <motion.button
                key={entity.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedEntity(entity)}
                className={`card p-6 text-left transition-all duration-200 ${
                  selectedEntity.type === entity.type 
                    ? 'ring-2 ring-primary-500 shadow-medium' 
                    : 'hover:shadow-medium hover:-translate-y-1'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center mb-4 ${entity.color}`}>
                  {entity.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{entity.name}</h3>
                <p className="text-sm text-neutral-600">{entity.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Entity Details */}
        <div className="mb-16">
          <div className="card p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center ${selectedEntity.color}`}>
                {selectedEntity.icon}
              </div>
              <div>
                <h2 className="heading-sm">{selectedEntity.name} Data Structure</h2>
                <p className="text-neutral-600">{selectedEntity.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Available Data Fields */}
              <div>
                <h3 className="font-semibold text-neutral-800 mb-4">Available Data Fields</h3>
                <div className="space-y-2">
                  {selectedEntity.dataFields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-neutral-700">{field}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <h3 className="font-semibold text-neutral-800 mb-4">Sample Data Structure</h3>
                <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{JSON.stringify(selectedEntity.sampleData, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab System */}
        <div className="mb-16">
          <h2 className="heading-md text-center mb-8">Dynamic Tab System</h2>
          <p className="text-center text-neutral-600 mb-8 max-w-3xl mx-auto">
            Based on the user's vibe, we intelligently prioritize different content types to create a personalized experience.
          </p>

          {/* Vibe Examples */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {DYNAMIC_TAB_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => setSelectedVibe(example)}
                className={`card p-4 text-left transition-all duration-200 ${
                  selectedVibe.vibe === example.vibe 
                    ? 'ring-2 ring-primary-500 bg-primary-50' 
                    : 'hover:shadow-medium'
                }`}
              >
                <h4 className="font-semibold text-neutral-900 mb-2">"{example.vibe}"</h4>
                <p className="text-xs text-neutral-600">{example.suggestedTabs.length} suggested tabs</p>
              </button>
            ))}
          </div>

          {/* Selected Vibe Tab Priority */}
          <div className="card p-8">
            <h3 className="heading-sm mb-6">Tab Priority for: "{selectedVibe.vibe}"</h3>
            <div className="space-y-4">
              {selectedVibe.suggestedTabs.map((tab, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{tab.name}</h4>
                      <p className="text-sm text-neutral-600">{tab.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">#{tab.priority}</div>
                    <div className="text-xs text-neutral-500">Priority Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Capabilities Summary */}
        <div className="mb-16">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <h2 className="heading-sm mb-6 text-primary-900">What We Can Build</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">🎯 Smart Recommendations</h4>
                <p className="text-sm text-primary-700">Context-aware suggestions across 8 content types</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">📊 Rich Metadata</h4>
                <p className="text-sm text-primary-700">Ratings, reviews, hours, pricing, and detailed info</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">🗺️ Location-Based</h4>
                <p className="text-sm text-primary-700">City-specific results with addresses and directions</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">🎨 Dynamic Interface</h4>
                <p className="text-sm text-primary-700">Tabs that adapt based on user's vibe and context</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">⭐ Quality Scoring</h4>
                <p className="text-sm text-primary-700">Relevance scores and match strength indicators</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">🔗 Cross-Platform</h4>
                <p className="text-sm text-primary-700">Links to streaming, booking, and external platforms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Ideas */}
        <div className="card p-8">
          <h2 className="heading-sm mb-6">Implementation Ideas for VibeTrail</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h4 className="font-semibold text-neutral-900 mb-2">🎭 Vibe-Driven Tabs</h4>
              <p className="text-neutral-600 mb-2">
                Instead of static "Food, Activities, Media" tabs, create dynamic tabs like:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Cozy Spots</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Adventure Reads</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Mood Movies</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Chill Tunes</span>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="font-semibold text-neutral-900 mb-2">📱 Rich Content Cards</h4>
              <p className="text-neutral-600">
                Display comprehensive info: ratings, hours, prices, specialty items, similar recommendations, and direct booking/streaming links.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h4 className="font-semibold text-neutral-900 mb-2">🗓️ Smart Scheduling</h4>
              <p className="text-neutral-600">
                Use business hours, duration estimates, and location data to create realistic day plans that flow naturally.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="font-semibold text-neutral-900 mb-2">🎯 Personalization</h4>
              <p className="text-neutral-600">
                Learn from user selections to improve future recommendations and customize the interface to their preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QlooAPIExplorer; 