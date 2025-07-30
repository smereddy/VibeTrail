# VibeTrail 🎯

> AI-powered cultural recommendation app that combines OpenAI and Qloo APIs to deliver personalized experiences based on user vibes

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🏆 Qloo LLM Hackathon Submission

**VibeTrail** demonstrates the powerful synergy between **OpenAI GPT-4** and **Qloo's Taste AI** to create personalized cultural recommendation experiences that go beyond what either technology could achieve alone.

### 🎯 What Makes VibeTrail Special

- **Natural Language Vibes**: Input feelings like "La La Land weekend" or "cozy coffee shop vibes"
- **AI Seed Extraction**: OpenAI analyzes vibes and extracts structured taste preferences  
- **Cross-Domain Recommendations**: Qloo provides recommendations across food, activities, movies, TV, music, and books
- **Intelligent Day Planning**: AI creates optimized schedules avoiding conflicts (no back-to-back restaurants)
- **Secure Architecture**: All API keys managed server-side for production readiness

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- OpenAI API Key
- Qloo API Key (hackathon access)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vibetrail.git
cd vibetrail

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env file

# Start development servers
npm run dev:full    # Starts both app (5173) and proxy server (3001)
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Required for AI features
OPENAI_API_KEY=your_openai_api_key_here
QLOO_API_KEY=your_qloo_api_key_here

# Optional configuration
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_OPENAI_MAX_TOKENS=800
VITE_OPENAI_TEMPERATURE=0.3
```

## 🎬 Demo

**Live Demo**: [Add your deployment URL here]
**Demo Video**: [Add your YouTube/Vimeo link here]
**GitHub Repository**: https://github.com/yourusername/vibetrail

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** with TypeScript 5.5.3
- **Tailwind CSS 3.4.1** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Vite** for build tooling

### Backend & APIs
- **Express.js** proxy server
- **OpenAI API** for vibe analysis and day planning
- **Qloo Taste AI** for cultural recommendations
- **Vercel Serverless Functions** for production

### Testing & Quality
- **Playwright** for end-to-end testing
- **Vitest** for unit testing
- **ESLint** for code quality
- **TypeScript** for type safety

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[API Documentation](docs/api/)** - Qloo API integration guides
- **[Development Guide](docs/development/)** - Setup, architecture, and development workflow
- **[Testing Documentation](docs/testing/)** - E2E and unit testing strategies
- **[Deployment Guide](docs/deployment/)** - Production deployment instructions

### Key Documentation Files

- **[Requirements](docs/development/requirements.md)** - Project requirements and specifications
- **[Architecture Design](docs/development/design.md)** - System architecture and design decisions
- **[Security Recommendations](docs/development/SECURITY_RECOMMENDATIONS.md)** - Production security guidelines
- **[Qloo API Guide](docs/api/qloo.md)** - Comprehensive Qloo API documentation
- **[Cultural Ecosystem](docs/api/cultural-ecosystem.md)** - Advanced cultural intelligence features

## 🎯 Core Features

### 1. Vibe Processing
```typescript
// User inputs natural language
"I want a bohemian artist weekend in Brooklyn"

// OpenAI extracts structured seeds
{
  "seeds": [
    { "text": "artistic venues", "category": "activity", "confidence": 0.9 },
    { "text": "indie coffee shops", "category": "food", "confidence": 0.8 },
    { "text": "underground music", "category": "media", "confidence": 0.7 }
  ]
}
```

### 2. Cross-Domain Recommendations
- **Food & Dining**: Restaurants, cafes, bars that match your vibe
- **Activities**: Museums, parks, attractions, cultural venues
- **Movies**: Films that align with your taste profile
- **TV Shows**: Series recommendations based on your preferences
- **Music**: Artists and genres that fit your vibe
- **Books**: Literature that matches your cultural interests

### 3. Intelligent Day Planning
```typescript
// AI creates optimized schedules
{
  "morning": "Coffee shop with artistic atmosphere",
  "afternoon": "Gallery or museum visit", 
  "dinner": "Restaurant with creative cuisine",
  "evening": "Live music venue or cultural event"
}
```

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# API integration tests
npm run test:e2e:enhanced
```

## 🚀 Deployment

### Development
```bash
npm run dev:full    # Start app + proxy server
```

### Production (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `QLOO_API_KEY`
3. Deploy automatically on push to main branch

## 🔒 Security

- **API Key Protection**: All API keys are managed server-side
- **Proxy Architecture**: Frontend never exposes sensitive credentials
- **Input Validation**: All user inputs are sanitized and validated
- **Rate Limiting**: Built-in protection against API abuse

## 🎨 Architecture Highlights

### Single API Endpoint Design
Instead of multiple frontend API calls, VibeTrail uses a unified backend endpoint:

```javascript
POST /api/taste
{
  "vibe": "La La Land weekend",
  "city": "Los Angeles"
}
```

This endpoint:
1. Calls OpenAI to extract taste seeds from the vibe
2. Uses seeds to query Qloo API across multiple categories
3. Processes and filters results
4. Returns comprehensive recommendations in one response

### Intelligent AI Orchestration
- **Seed Extraction**: OpenAI analyzes natural language vibes
- **Cultural Mapping**: Seeds are mapped to Qloo entity types
- **Smart Filtering**: Results are filtered for quality and relevance
- **Day Planning**: OpenAI creates logical, conflict-free schedules

## 🏗️ Development Workflow

### Available Scripts
```bash
npm run dev              # Start Vite dev server
npm run dev:full         # Start both app and proxy server
npm run proxy           # Start API proxy server only
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run test            # Run unit tests
npm run test:e2e        # Run Playwright tests
npm run clean           # Clean build and test files
```

### Git Workflow
- `main` - Production-ready code
- `hackathon-submission-cleanup` - Current cleanup branch
- Feature branches for new development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Qloo** for providing the Taste AI API and hosting this hackathon
- **OpenAI** for the powerful GPT-4 language model
- **Devpost** for the hackathon platform
- The open-source community for the amazing tools and libraries

---

**Built with ❤️ for the Qloo LLM Hackathon**

*Where your vibe becomes your guide* 🎯✨