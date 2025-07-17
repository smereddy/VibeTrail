# TasteTrails - Qloo Global Hackathon Prototype

Transform any vibe into a day you can actually do.

## 🎯 Project Overview

TasteTrails is a hackathon prototype built for the **Qloo Global Hackathon** that demonstrates the synergy between Large Language Models and Qloo's Taste AI. It transforms simple user vibes or preferences into actionable, culturally coherent day plans spanning food, activities, and media.

### The Challenge
Create something that neither an LLM nor Qloo's API could accomplish alone - showcasing cross-domain cultural intelligence paired with natural language understanding.

### The Solution
A privacy-first web application that:
- Interprets user vibes using LLM processing
- Generates cross-domain recommendations via Qloo's Taste AI
- Creates schedulable day plans with AI explanations
- Exports actionable calendar events

## 🚀 Key Features

### Core Functionality
- **Vibe Input**: Natural language processing of user moods and preferences
- **Cross-Domain Recommendations**: Food, activities, and media suggestions
- **Taste Relationship Graph**: Visual representation of cultural connections
- **AI Day Planning**: Automated scheduling with explanations
- **Calendar Export**: Downloadable .ics files for real-world use

### Advanced Features
- **Weekend Planning**: Multi-day itinerary support
- **Creator Insights**: Marketing intelligence for content creators
- **Privacy-First Design**: No personal data collection
- **Responsive Design**: Works across all devices

## 🏗️ Technology Stack

### Current (Prototype)
- React 18 + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- D3.js for graph visualization
- React Router for navigation
- Mock data simulation

### Production (Future)
- Qloo Taste AI API integration
- OpenAI GPT-4 / Claude integration
- Real-time event data feeds
- Booking system integrations
- Mobile app development

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd tastetrails

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Flow (Under 3 Minutes)
1. Enter vibe: "La La Land weekend" in Los Angeles
2. Browse cross-domain recommendations
3. View taste relationship graph
4. Build day plan with drag-and-drop
5. Export to calendar

## 🎨 Design Philosophy

### Privacy-First
- No personal data collection
- No user accounts required
- Local browser processing
- Taste signals only

### Cross-Domain Intelligence
- Food recommendations linked to musical preferences
- Activity suggestions based on film tastes
- Media curation aligned with location vibes
- Cultural coherence across categories

### User Experience
- Minimal friction input
- Visual feedback systems
- Accessible design patterns
- Mobile-responsive layouts

## 🔧 Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── context/            # Global state management
├── data/               # Mock data and type definitions
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

### State Management
- React Context for global state
- Local state for UI interactions
- Mock data simulation for API calls
- Persistent user selections

## 🌟 Key Differentiators

### LLM + Qloo Synergy
- **LLM**: Interprets user vibes and generates explanations
- **Qloo**: Provides cross-domain taste relationships
- **Combined**: Creates culturally coherent, actionable plans

### Cross-Domain Connections
- Jazz music → Art Deco restaurants
- Romantic films → Stargazing activities
- Desert landscapes → Ambient music
- Family activities → Educational media

## 📊 Demo Script

### 1. Introduction (30 seconds)
"TasteTrails transforms any vibe into a day you can actually do by combining LLM understanding with Qloo's cross-domain taste intelligence."

### 2. Input Demo (30 seconds)
- Show vibe input: "La La Land weekend"
- Select Los Angeles
- Demonstrate quick-start options

### 3. Results Exploration (60 seconds)
- Browse food, activities, and media tabs
- Show taste strength indicators
- Explain cross-domain connections
- Display taste relationship graph

### 4. Plan Building (45 seconds)
- Select items across categories
- Use auto-arrange AI feature
- Show scheduling explanations
- Export to calendar

### 5. Future Vision (15 seconds)
- Weekend planning capabilities
- Creator insights for marketing
- Real-world API integration

## 🔒 Privacy & Security

### Data Handling
- No personal information collected
- No user tracking or analytics
- Local browser storage only
- Taste signals are anonymous

### Compliance
- GDPR-friendly design
- No cookies required
- Transparent data usage
- User control over all data

## 📱 Responsive Design

### Breakpoints
- Mobile: <768px
- Tablet: 768px-1024px
- Desktop: >1024px

### Optimizations
- Touch-friendly interactions
- Readable typography scales
- Efficient image loading
- Accessible color contrasts

## 🎬 Video Demo Guidelines

### Technical Requirements
- Under 3 minutes total
- Clear audio narration
- Smooth screen recording
- Functional demonstration

### Content Structure
1. Problem statement (15 seconds)
2. Solution overview (30 seconds)
3. Live demonstration (2 minutes)
4. Technical innovation (30 seconds)
5. Future potential (15 seconds)

### Best Practices
- Script the demo for timing
- Practice transitions
- Show actual functionality
- Highlight LLM + Qloo synergy

## 🛠️ Development Notes

### Mock Data Structure
- Two cities: Los Angeles and Phoenix
- 6+ recommendations per city
- Cross-domain relationships mapped
- Realistic taste strength scores

### API Integration Points
```typescript
// Where Qloo API will integrate
const getRecommendations = async (seeds: string[], city: string) => {
  // Replace with actual Qloo API call
  return mockRecommendations;
};

// Where LLM API will integrate
const interpretVibe = async (vibe: string) => {
  // Replace with OpenAI/Claude API call
  return mockSeeds;
};
```

### Performance Considerations
- Lazy loading for images
- Memoized expensive calculations
- Efficient re-renders
- Minimal bundle size

## 🌍 Deployment

### Build Command
```bash
npm run build
```

### Deployment Options
- Netlify (recommended)
- Vercel
- GitHub Pages
- Custom hosting

### Environment Variables
None required for prototype version.

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation

## 📋 Hackathon Submission

### Required Deliverables
- [x] Working app URL
- [x] Public GitHub repository
- [x] Demo video under 3 minutes
- [x] Technical documentation

### Submission Checklist
- [ ] Record demo video
- [ ] Upload to public hosting
- [ ] Prepare Devpost submission
- [ ] Test all functionality

## 🔮 Future Roadmap

### Phase 1: Live API Integration
- Qloo Taste AI API
- OpenAI GPT-4 integration
- Real-time data feeds
- Enhanced recommendations

### Phase 2: Enhanced Features
- Multi-day planning
- Group coordination
- Weather integration
- Booking systems

### Phase 3: Platform Expansion
- Mobile applications
- API for third parties
- Enterprise solutions
- Global city coverage

## 📞 Support

### Technical Issues
- Check the GitHub Issues
- Review documentation
- Test with fresh browser

### Demo Questions
- Review the demo script
- Practice with mock data
- Time your presentation

---

**Built with ❤️ for the Qloo Global Hackathon**

*Showcasing the power of LLM + Qloo Taste AI synergy*

## 🎥 Demo Video Reminders

- **Duration**: Must be under 3 minutes
- **Content**: Show full user flow from vibe input to calendar export
- **Focus**: Highlight LLM + Qloo synergy clearly
- **Quality**: Clear audio, smooth recording, functional demonstration
- **Script**: Practice timing to stay within limit

Remember: Devpost emphasizes concise, story-driven videos that clearly demonstrate problem, solution, and technical innovation!