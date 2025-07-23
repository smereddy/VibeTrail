# VibeTrail 🎯

> AI-powered cultural intelligence platform that transforms your vibes into interconnected cultural ecosystems

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Netlify](https://img.shields.io/badge/deploy-Netlify-00C7B7.svg)](https://netlify.com)

## 🌟 Overview

VibeTrail is a groundbreaking **Cultural Intelligence Platform** that combines **OpenAI GPT-4** and **Qloo's Cross-Domain API** to create rich, interconnected cultural ecosystems from simple vibe descriptions. Our platform doesn't just recommend individual items—it reveals the hidden cultural connections that define your taste and identity.

### ✨ Revolutionary Features

#### 🧠 **Cultural Ecosystem Discovery**
- **Cross-Domain Intelligence**: Discover connections between food, music, movies, books, destinations, and more
- **AI-Powered Analysis**: Sophisticated cultural anthropology insights about your taste profile
- **Interactive Network Visualization**: See your cultural connections in real-time network graphs
- **Psychological Profiling**: Understand the deeper patterns behind your cultural preferences

#### 🎯 **Dynamic Vibe Processing**
- **AI Seed Extraction**: OpenAI extracts meaningful cultural seeds from natural language
- **Context-Aware Tabs**: Dynamic tab generation based on indoor/outdoor, time, and seasonal context
- **Smart Recommendations**: Qloo API provides 8 entity types across cultural domains
- **Ecosystem Scoring**: Quantitative analysis of cultural coherence and diversity

#### 🌐 **Advanced Visualization**
- **Cultural Network Graph**: Interactive SVG visualization of entity relationships
- **Connection Strength Mapping**: Visual representation of cultural affinity strength
- **Domain Clustering**: Organized display of different cultural entity types
- **Real-time Filtering**: Focus on connected entities for cleaner insights

#### 🤖 **AI-Enhanced Intelligence**
- **Cultural Narrative Generation**: Compelling stories about your cultural identity
- **Actionable Insights**: Personalized recommendations for cultural discovery
- **Psychological Analysis**: Deep understanding of personality through cultural choices
- **Theme Extraction**: Identification of unifying cultural themes across domains

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- OpenAI API Key
- Qloo API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/vibetrail.git
cd vibetrail

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

Visit `http://localhost:5174` to explore your cultural ecosystem!

## 🏗️ Architecture

### Serverless Backend
VibeTrail uses **Netlify Functions** for a scalable, serverless backend:

- **`/taste`** - Main vibe processing endpoint (OpenAI + Qloo integration)
- **`/plan-day`** - AI-powered day planning with OpenAI
- **`/ecosystem-analysis`** - Cultural ecosystem analysis
- **`/health`** - Health check and API status

### Smart Environment Detection
The app automatically detects production vs development environments:
- **Production**: Uses `/.netlify/functions/` endpoints
- **Development**: Uses `http://localhost:3001/api/` endpoints
- **No manual configuration required**

## 🎭 Cultural Ecosystem Features

### 🔍 **Ecosystem Analysis**
Transform any vibe into a comprehensive cultural ecosystem:

```
"cozy coffee shop vibes" →
├── 🏪 Places: Artisan cafes, independent bookstores
├── 🎵 Music: Indie folk, ambient jazz playlists  
├── 📚 Books: Contemplative literature, coffee culture
├── 🎬 Movies: Slow cinema, character-driven dramas
└── 🌐 Connections: 23 cultural relationships discovered
```

### 📊 **Network Visualization**
- **Interactive Graph**: Explore connections between cultural entities
- **Strength Indicators**: Visual representation of relationship intensity
- **Domain Filtering**: Focus on specific cultural areas
- **Connection Details**: Understand why entities are related

### 🧭 **Cultural Intelligence**
- **Ecosystem Coherence**: Measure how well your preferences align
- **Cultural Themes**: Identify overarching patterns in your taste
- **Psychological Insights**: Understand your cultural personality
- **Discovery Recommendations**: Find new experiences that fit your profile

## 📚 Documentation

### Core Documentation
- **[Development Guide](docs/development/requirements.md)** - Technical requirements and architecture
- **[Design System](docs/development/design.md)** - UI/UX guidelines and component design
- **[API Integration](docs/api/qloo.md)** - Qloo API integration details
- **[Deployment Guide](docs/deployment/netlify.md)** - Netlify deployment instructions

### Testing Documentation
- **[E2E Testing Guide](docs/testing/E2E_TESTING.md)** - Comprehensive testing documentation
- **[Development Tasks](docs/development/tasks.md)** - Current development status and tasks

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server (auto-detects port)
npm run dev:functions    # Start Netlify Functions locally (for testing)

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run Playwright e2e tests
npm run test:functions  # Test Netlify Functions locally
npm run test:all        # Run all tests

# Maintenance
npm run lint            # Run ESLint
npm run clean           # Clean test reports and build files
```

### Project Structure

```
vibetrail/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── RecommendationGrid.tsx            # Dynamic tabs
│   │   ├── AdvancedVibeInput.tsx             # AI vibe processing
│   │   └── TasteGraph.tsx                    # Network visualization
│   ├── pages/             # Page components
│   │   ├── Home.tsx                          # Landing page
│   │   ├── Results.tsx                       # Dynamic recommendations
│   │   └── About.tsx                         # How it works page
│   ├── services/          # API services
│   │   ├── QlooService.ts                    # Qloo API integration
│   │   └── OpenAIService.ts                  # AI integration
│   ├── context/           # React context
│   ├── types/             # TypeScript types
│   └── config/            # Environment configuration
├── netlify/               # Netlify Functions
│   └── functions/         # Serverless functions
│       ├── taste.js       # Main vibe processing
│       ├── plan-day.js    # Day planning
│       ├── ecosystem-analysis.js # Cultural analysis
│       └── health.js      # Health check
├── tests/                 # Testing suite
│   ├── e2e/              # End-to-end tests
│   ├── unit/             # Unit tests
│   └── reports/          # Test reports
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── development/      # Development guides
│   ├── deployment/       # Deployment guides
│   └── testing/          # Testing documentation
├── netlify.toml          # Netlify configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Technology Stack

### Frontend
- **React 18.3.1** - UI framework with advanced state management
- **TypeScript 5.5.3** - Type safety for complex cultural data structures
- **Vite 5.4.2** - Build tool optimized for fast development
- **Tailwind CSS 3.4.1** - Styling framework with custom cultural themes
- **React Router 7.7.0** - Client-side routing for ecosystem navigation

### Backend & APIs
- **Netlify Functions** - Serverless functions for scalable backend
- **OpenAI API 5.10.2** - GPT-4 for cultural intelligence and analysis
- **Qloo Taste AI** - Cross-domain cultural recommendations (8 entity types)
- **Axios 1.10.0** - HTTP client with intelligent retry logic

### Cultural Intelligence Engine
- **Cross-Domain Analysis** - Connection discovery across 8 entity types
- **AI-Powered Insights** - Cultural anthropology-level analysis
- **Network Visualization** - SVG-based interactive cultural graphs
- **Ecosystem Scoring** - Quantitative cultural coherence metrics

### Testing & Quality
- **Playwright 1.54.1** - E2E testing including cultural ecosystem flows
- **Vitest 3.2.4** - Unit testing for cultural algorithms
- **ESLint 9.9.1** - Code quality with cultural data validation
- **TypeScript ESLint 8.3.0** - Type safety for complex cultural interfaces

## 🌍 Supported Cities

VibeTrail's cultural intelligence works across major cultural hubs:

- **Los Angeles** - Entertainment and food culture
- **New York** - Arts, theater, and diverse neighborhoods  
- **Chicago** - Architecture, music, and deep-dish culture
- **San Francisco** - Tech culture and innovative dining
- **Austin** - Music scene and creative communities
- **Seattle** - Coffee culture and indie music
- **Miami** - International flavors and nightlife
- **Denver** - Outdoor culture and craft brewing
- **Portland** - Artisanal everything and food trucks
- **Nashville** - Music heritage and Southern culture

## 🧪 Testing

VibeTrail includes comprehensive testing for cultural intelligence:

### Cultural Ecosystem Tests
- **Connection Discovery**: Validate cultural relationship algorithms
- **AI Analysis**: Test cultural anthropology insights
- **Network Visualization**: Component testing for interactive graphs
- **Ecosystem Scoring**: Validate coherence calculations

### E2E Tests
- **Cultural Journey**: Complete flow from vibe to ecosystem
- **Cross-Domain Integration**: Test all 8 Qloo entity types
- **AI Enhancement**: Validate OpenAI cultural analysis
- **Performance**: Network visualization and large dataset handling

### Function Tests
- **Serverless Functions**: Test Netlify Functions locally and in production
- **API Integration**: Validate OpenAI and Qloo API integration
- **Error Handling**: Test graceful degradation and error responses
- **Performance**: Load testing and timeout handling

Run tests with:
```bash
npm run test:all          # All tests including cultural ecosystem
npm run test:e2e          # Playwright browser tests
npm run test:functions    # Netlify Functions testing
```

## 🚀 Deployment

### Netlify (Recommended)

VibeTrail is optimized for Netlify deployment with automatic serverless functions:

1. **Connect Repository**
   ```bash
   # Connect your GitHub repository to Netlify
   # Netlify will auto-detect the configuration from netlify.toml
   ```

2. **Set Environment Variables**
   In your Netlify dashboard, add:
   ```
   OPENAI_API_KEY=your_openai_api_key
   QLOO_API_KEY=your_qloo_api_key
   ```

3. **Deploy**
   ```bash
   # Automatic deployment on git push
   # Or manual deployment:
   npm run build
   netlify deploy --prod
   ```

### Environment Configuration
The app automatically detects the environment:
- **Production**: Uses Netlify Functions at `/.netlify/functions/`
- **Development**: Uses local server at `http://localhost:3001/api/`
- **No manual configuration required**

### Custom Deployment
For other platforms:
```bash
npm run build
# Deploy dist/ folder to your hosting provider
# Ensure serverless functions are configured for API endpoints
```

## 🤝 Contributing

We welcome contributions to enhance cultural intelligence:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/cultural-enhancement`
3. Commit changes: `git commit -m 'Add cultural feature'`
4. Push to branch: `git push origin feature/cultural-enhancement`
5. Open a Pull Request

### Contribution Areas
- **Cultural Algorithms**: Improve connection discovery
- **AI Prompts**: Enhance cultural analysis
- **Visualization**: Expand network graph features
- **Entity Types**: Add new cultural domains
- **Testing**: Expand cultural intelligence tests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Qloo** for providing revolutionary cross-domain cultural intelligence
- **OpenAI** for enabling sophisticated cultural analysis with GPT-4
- **Netlify** for seamless serverless deployment and functions
- **React Team** for the foundation of our cultural platform
- **The Cultural Intelligence Community** for inspiring cross-domain thinking

---

**Built with ❤️ and Cultural Intelligence by the VibeTrail Team**

*Transforming vibes into cultural ecosystems, one connection at a time.*