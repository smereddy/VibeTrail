# VibeTrail 🎯

> AI-powered cultural intelligence platform that transforms your vibes into interconnected cultural ecosystems

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Qloo Hackathon](https://img.shields.io/badge/Qloo%20LLM-Hackathon%20Submission-gold.svg)](HACKATHON.md)

## 🌟 Overview

VibeTrail is a groundbreaking **Cultural Intelligence Platform** that combines **OpenAI GPT-4** and **Qloo's Cross-Domain API** to create rich, interconnected cultural ecosystems from simple vibe descriptions. Our platform doesn't just recommend individual items—it reveals the hidden cultural connections that define your taste and identity.

**🏆 Qloo LLM Hackathon Submission**: [Read our full hackathon documentation](HACKATHON.md)

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

# Start development servers
npm run dev:full
```

Visit `http://localhost:5173` to explore your cultural ecosystem!

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
- **[Hackathon Submission](HACKATHON.md)** - Complete hackathon documentation and technical details
- **[Development Guide](docs/development/requirements.md)** - Technical requirements and architecture
- **[Design System](docs/development/design.md)** - UI/UX guidelines and component design
- **[API Integration](docs/api/qloo.md)** - Qloo API integration details

### Testing Documentation
- **[E2E Testing Guide](docs/testing/E2E_TESTING.md)** - Comprehensive testing documentation
- **[Development Tasks](docs/development/tasks.md)** - Current development status and tasks

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run dev:full         # Start both app and proxy server
npm run proxy           # Start API proxy server only

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run Playwright e2e tests
npm run test:e2e:enhanced # Run comprehensive API tests
npm run test:debug      # Run API debugging tests
npm run test:all        # Run all tests

# Maintenance
npm run lint            # Run ESLint
npm run clean           # Clean test reports and build files
npm run clean:all       # Clean everything including node_modules
```

### Project Structure

```
vibetrail/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── CulturalNetworkVisualization.tsx  # Network graph
│   │   ├── RecommendationGrid.tsx            # Dynamic tabs
│   │   └── AdvancedVibeInput.tsx             # AI vibe processing
│   ├── pages/             # Page components
│   │   ├── CulturalEcosystem.tsx             # Main ecosystem page
│   │   └── Results.tsx                       # Dynamic recommendations
│   ├── services/          # API services
│   │   ├── CulturalEcosystemService.ts       # Core ecosystem engine
│   │   ├── QlooService.ts                    # Qloo API integration
│   │   └── OpenAIService.ts                  # AI integration
│   ├── context/           # React context
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── tests/                 # Testing suite
│   ├── e2e/              # End-to-end tests
│   ├── unit/             # Unit tests
│   ├── debug/            # Debug scripts
│   └── reports/          # Test reports
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── development/      # Development guides
│   └── testing/          # Testing documentation
├── api/                   # Vercel API routes
├── proxy-server.cjs       # Development proxy server
└── HACKATHON.md          # Hackathon submission documentation
```

## 🔧 Technology Stack

### Frontend
- **React 18.3.1** - UI framework with advanced state management
- **TypeScript 5.5.3** - Type safety for complex cultural data structures
- **Vite 5.4.2** - Build tool optimized for fast development
- **Tailwind CSS 3.4.1** - Styling framework with custom cultural themes
- **Framer Motion 12.23.6** - Smooth animations for network visualizations
- **React Router 7.7.0** - Client-side routing for ecosystem navigation

### Backend & APIs
- **Express 5.1.0** - Proxy server with advanced AI endpoints
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

### API Tests
- **Enhanced E2E**: Comprehensive cultural ecosystem testing
- **Multi-Entity Processing**: Parallel API call validation
- **Cultural Intelligence**: AI prompt and response validation
- **Connection Algorithms**: Cultural relationship discovery testing

Run tests with:
```bash
npm run test:all          # All tests including cultural ecosystem
npm run test:e2e          # Playwright browser tests
npm run test:e2e:enhanced # Cultural ecosystem API tests
npm run test:debug        # Cultural intelligence debugging
```

## 🏆 Hackathon Achievement

**Qloo LLM Hackathon Submission**: VibeTrail represents a breakthrough in cultural intelligence, showcasing:

- **Maximum Qloo Integration**: 8 entity types with parallel processing
- **Advanced AI Usage**: Cultural anthropology-level analysis
- **Novel Visualization**: Interactive cultural network graphs
- **Real-World Application**: Scalable cultural intelligence platform

[Read our complete hackathon documentation →](HACKATHON.md)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
# Ensure proxy server is configured for cultural ecosystem APIs
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
- **React Team** for the foundation of our cultural platform
- **Vercel** for seamless deployment of cultural experiences
- **The Cultural Intelligence Community** for inspiring cross-domain thinking

---

**Built with ❤️ and Cultural Intelligence by the VibeTrail Team**

*Transforming vibes into cultural ecosystems, one connection at a time.*