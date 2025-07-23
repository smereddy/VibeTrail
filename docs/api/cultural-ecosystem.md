# Cultural Ecosystem API Documentation

This document describes the new Cultural Ecosystem API endpoints that power VibeTrail's cross-domain cultural intelligence features.

## Overview

The Cultural Ecosystem API enables the discovery and analysis of cultural connections across multiple domains. It combines Qloo's cross-domain API with advanced AI analysis to create rich, interconnected cultural ecosystems from simple vibe descriptions.

### Key Features

- **Cross-Domain Analysis**: Connect 8 different entity types (places, movies, TV shows, music, books, podcasts, games, destinations)
- **AI-Enhanced Intelligence**: Sophisticated cultural anthropology insights
- **Network Visualization**: Interactive cultural connection graphs
- **Ecosystem Scoring**: Quantitative cultural coherence analysis

---

## Endpoints

### 1. Taste Processing with Cultural Intelligence

**Endpoint**: `POST /api/taste`

Enhanced version of the original taste endpoint that now includes cultural ecosystem building.

#### Request Body
```json
{
  "vibe": "cozy coffee shop vibes",
  "city": "Los Angeles"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "vibe": "cozy coffee shop vibes",
    "city": "Los Angeles",
    "seeds": [
      {
        "text": "cozy coffee shop",
        "category": "food",
        "confidence": 0.9,
        "searchTerms": ["cozy", "coffee", "artisan"]
      }
    ],
    "vibeContext": {
      "isIndoor": true,
      "isOutdoor": false,
      "isHybrid": false,
      "timeOfDay": "afternoon",
      "season": "fall",
      "mood": "contemplative",
      "pace": "slow",
      "socialSetting": "solo",
      "culturalStyle": "artisanal",
      "priceRange": "mid-range"
    },
    "culturalInsights": {
      "culturalProfile": "You seek contemplative spaces that encourage mindful experiences...",
      "primaryThemes": ["artisanal", "contemplative", "community"],
      "personalityTraits": ["thoughtful", "quality-focused", "authentic"],
      "recommendations": ["Explore independent bookstore cafes", "Seek out local roasters"]
    },
    "recommendations": [
      {
        "id": "place-1",
        "name": "Artisan Coffee House",
        "description": "Cozy neighborhood coffee shop with local art",
        "category": "food",
        "location": "Los Angeles, CA",
        "tasteStrength": 0.9,
        "rating": 4.5,
        "whyItFits": "Perfect match for your contemplative coffee vibe"
      }
    ],
    "dynamicTabs": [
      {
        "id": "places-tab",
        "displayName": "Places",
        "entityType": "urn:entity:place",
        "priority": 2.0,
        "estimatedCount": 15,
        "isActive": true,
        "icon": "🏪"
      }
    ]
  }
}
```

#### Enhanced Features
- **Cultural Context Analysis**: AI-generated vibe context for better recommendations
- **Dynamic Tab Generation**: Context-aware tabs based on vibe analysis
- **Cultural Insights**: Initial AI analysis of cultural preferences
- **Ecosystem Preparation**: Data structured for cultural ecosystem building

---

### 2. AI Cultural Ecosystem Analysis

**Endpoint**: `POST /api/ecosystem-analysis`

Performs deep AI-powered analysis of cultural ecosystems using cultural anthropology expertise.

#### Request Body
```json
{
  "vibe": "cozy coffee shop vibes",
  "city": "Los Angeles",
  "entities": {
    "places": [
      {
        "id": "place-1",
        "name": "Artisan Coffee House",
        "description": "Cozy neighborhood coffee shop",
        "category": "food"
      }
    ],
    "books": [
      {
        "id": "book-1", 
        "name": "The Art of Coffee",
        "description": "Contemplative journey through coffee culture",
        "category": "media"
      }
    ]
  },
  "connections": [
    {
      "fromEntity": { "id": "place-1", "name": "Artisan Coffee House" },
      "toEntity": { "id": "book-1", "name": "The Art of Coffee" },
      "connectionStrength": 0.8,
      "connectionReason": "Both celebrate coffee culture",
      "sharedThemes": ["coffee", "contemplative", "artisanal"]
    }
  ],
  "themes": [
    {
      "theme": "artisanal appreciation",
      "strength": 0.85,
      "examples": ["Artisan Coffee House", "The Art of Coffee"]
    }
  ],
  "culturalInsights": {
    "culturalProfile": "Initial cultural analysis...",
    "primaryThemes": ["artisanal", "contemplative"],
    "personalityTraits": ["thoughtful", "quality-focused"]
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "aiConnections": [
      {
        "fromEntity": "Artisan Coffee House",
        "toEntity": "The Art of Coffee",
        "connectionStrength": 0.85,
        "connectionReason": "Both embody the philosophy of slow living and mindful consumption",
        "sharedThemes": ["contemplative", "artisanal", "mindfulness"],
        "psychologicalInsight": "This connection reveals someone who values process over product, finding meaning in the ritual and craft behind experiences"
      }
    ],
    "aiThemes": [
      {
        "theme": "Contemplative Spaces",
        "strength": 0.9,
        "description": "Preference for environments that encourage reflection and mindfulness, moving away from fast-paced consumption",
        "psychologicalMeaning": "Values depth over speed, quality over quantity, suggesting a personality that finds fulfillment in present-moment awareness",
        "entityTypes": ["places", "books"],
        "examples": ["Artisan Coffee House", "The Art of Coffee"]
      }
    ],
    "aiInsights": [
      {
        "type": "psychological",
        "title": "Mindful Experience Curator",
        "description": "Your preferences reveal someone who approaches cultural consumption as a form of meditation, seeking experiences that nourish both mind and soul.",
        "confidence": 0.92,
        "supportingEntities": ["Artisan Coffee House", "The Art of Coffee"],
        "actionableAdvice": "Seek out more third spaces that combine multiple interests - like bookstore cafés, gallery libraries, or artisan workshops that offer classes."
      }
    ],
    "ecosystemNarrative": "Your cultural ecosystem centers around the art of slow living - spaces and experiences that invite contemplation, foster genuine connections, and celebrate craftsmanship. This reveals someone who finds meaning in depth rather than breadth, preferring authentic experiences that nourish both mind and soul. Your taste suggests a curator of mindful moments, someone who understands that the most profound cultural experiences happen when we slow down enough to truly engage."
  }
}
```

#### AI Analysis Features
- **Deep Psychological Connections**: AI discovers non-obvious cultural relationships
- **Sophisticated Themes**: Cultural anthropology-level theme analysis
- **Actionable Insights**: Personalized recommendations for cultural discovery
- **Cultural Narrative**: Compelling story about the user's cultural identity

---

### 3. Day Planning with Cultural Intelligence

**Endpoint**: `POST /api/plan-day`

Enhanced day planning that incorporates cultural ecosystem insights.

#### Request Body
```json
{
  "selectedItems": [
    {
      "id": "place-1",
      "name": "Artisan Coffee House",
      "category": "food",
      "location": "Los Angeles, CA",
      "tasteStrength": 0.9
    },
    {
      "id": "book-1",
      "name": "The Art of Coffee", 
      "category": "media",
      "tasteStrength": 0.85
    }
  ],
  "date": "2024-01-15",
  "preferences": {
    "startTime": "09:00",
    "pace": "slow",
    "culturalStyle": "artisanal"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "schedule": [
      {
        "time": "09:00",
        "item": {
          "id": "place-1",
          "name": "Artisan Coffee House",
          "category": "food"
        },
        "duration": 90,
        "aiReasoning": "Perfect morning start that aligns with your contemplative vibe. The artisanal coffee setting provides the ideal atmosphere for mindful consumption and potential reading.",
        "culturalConnection": "This choice reflects your appreciation for craftsmanship and creates the perfect environment for your literary interests.",
        "suggestedActivity": "Bring 'The Art of Coffee' to read while enjoying your morning brew"
      }
    ],
    "culturalCoherence": 0.87,
    "dayTheme": "Contemplative Cultural Immersion",
    "aiSummary": "Your day is designed around slow, mindful experiences that honor both your taste for artisanal culture and your contemplative nature."
  }
}
```

---

## Data Structures

### Cultural Ecosystem
```typescript
interface CulturalEcosystem {
  coreVibe: string;
  primarySeeds: ExtractedSeed[];
  entities: {
    [entityType: string]: QlooInsight[];
  };
  connections: CulturalConnection[];
  culturalThemes: CulturalTheme[];
  ecosystemScore: number;
  insights: CulturalInsight[];
  ecosystemNarrative?: string;
}
```

### Cultural Connection
```typescript
interface CulturalConnection {
  fromEntity: QlooInsight;
  toEntity: QlooInsight;
  connectionStrength: number;
  connectionReason: string;
  sharedThemes: string[];
  psychologicalInsight?: string;
}
```

### Cultural Theme
```typescript
interface CulturalTheme {
  theme: string;
  strength: number;
  description: string;
  psychologicalMeaning?: string;
  entityTypes: QlooEntityType[];
  examples: string[];
}
```

### Cultural Insight
```typescript
interface CulturalInsight {
  type: 'pattern' | 'connection' | 'recommendation' | 'psychological';
  title: string;
  description: string;
  confidence: number;
  supportingEntities: string[];
  actionableAdvice?: string;
}
```

### Vibe Context
```typescript
interface VibeContext {
  isIndoor: boolean;
  isOutdoor: boolean;
  isHybrid: boolean;
  timeOfDay?: string;
  season?: string;
  mood?: string;
  pace?: string;
  socialSetting?: string;
  culturalStyle?: string;
  priceRange?: string;
}
```

### Dynamic Tab Configuration
```typescript
interface DynamicTabConfig {
  id: string;
  displayName: string;
  entityType: QlooEntityType;
  priority: number;
  estimatedCount: number;
  isActive: boolean;
  icon?: string;
}
```

---

## Entity Types

The Cultural Ecosystem API supports 8 Qloo entity types:

| Entity Type | URN | Description | Example |
|-------------|-----|-------------|---------|
| Places | `urn:entity:place` | Restaurants, cafes, venues | Coffee shops, bookstores |
| Movies | `urn:entity:movie` | Films and cinema | Indie films, documentaries |
| TV Shows | `urn:entity:tv_show` | Television content | Series, documentaries |
| Music | `urn:entity:artist` | Artists and music | Jazz artists, indie bands |
| Books | `urn:entity:book` | Literature and books | Coffee culture books |
| Podcasts | `urn:entity:podcast` | Audio content | Cultural podcasts |
| Games | `urn:entity:videogame` | Video games | Indie games, narratives |
| Destinations | `urn:entity:destination` | Travel destinations | Cultural neighborhoods |

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ECOSYSTEM_BUILD_ERROR",
    "message": "Failed to build cultural ecosystem",
    "details": "Specific error details",
    "timestamp": "2024-01-15T10:30:00Z",
    "service": "cultural-ecosystem"
  }
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `ECOSYSTEM_BUILD_ERROR` | Failed to build cultural ecosystem | Check API keys and input data |
| `AI_ANALYSIS_ERROR` | AI analysis failed | Retry with simpler input |
| `CONNECTION_DISCOVERY_ERROR` | Failed to discover connections | Verify entity data quality |
| `THEME_EXTRACTION_ERROR` | Theme extraction failed | Check entity descriptions |
| `INVALID_VIBE_CONTEXT` | Invalid vibe context provided | Verify vibe context structure |

---

## Rate Limits

- **Taste Processing**: 100 requests/hour per IP
- **Ecosystem Analysis**: 50 requests/hour per IP (AI-intensive)
- **Day Planning**: 200 requests/hour per IP

---

## Best Practices

### Optimization
1. **Batch Processing**: Group related ecosystem analyses together
2. **Caching**: Cache ecosystem results for similar vibes
3. **Fallback Handling**: Always provide graceful degradation
4. **Error Recovery**: Implement retry logic for AI analysis

### Data Quality
1. **Rich Descriptions**: Provide detailed entity descriptions for better connections
2. **Diverse Entities**: Include multiple entity types for richer ecosystems
3. **Context Clarity**: Use specific, descriptive vibe inputs
4. **Location Specificity**: Provide accurate city information

### Performance
1. **Parallel Processing**: Leverage concurrent API calls
2. **Smart Filtering**: Filter entities before connection analysis
3. **Progressive Loading**: Load ecosystem data incrementally
4. **Connection Limits**: Limit connections to top 20 for performance

---

## Examples

### Coffee Culture Ecosystem
```bash
curl -X POST http://localhost:3001/api/taste \
  -H "Content-Type: application/json" \
  -d '{
    "vibe": "cozy coffee shop vibes with indie music and good books",
    "city": "Los Angeles"
  }'
```

### Outdoor Adventure Ecosystem
```bash
curl -X POST http://localhost:3001/api/taste \
  -H "Content-Type: application/json" \
  -d '{
    "vibe": "outdoor adventure day with hiking and nature documentaries",
    "city": "Denver"
  }'
```

### Cultural Exploration Ecosystem
```bash
curl -X POST http://localhost:3001/api/taste \
  -H "Content-Type: application/json" \
  -d '{
    "vibe": "cultural exploration with museums, art films, and local cuisine",
    "city": "New York"
  }'
```

---

## Integration Guide

### Frontend Integration
```typescript
// Build cultural ecosystem
const buildEcosystem = async (vibe: string, city: string) => {
  const response = await fetch('/api/taste', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vibe, city })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Use data.recommendations for main results
    // Use data.dynamicTabs for tab configuration
    // Use data.culturalInsights for initial analysis
    
    // Build full ecosystem from taste items
    const ecosystem = await culturalEcosystemService
      .buildCulturalEcosystemFromTasteItems(
        vibe, city, data.vibeContext, 
        data.seeds, data.recommendations, 
        data.culturalInsights
      );
  }
};
```

### Service Integration
```typescript
// Use the CulturalEcosystemService
import { CulturalEcosystemService } from './services/CulturalEcosystemService';

const ecosystemService = new CulturalEcosystemService();

// Build ecosystem from vibe
const ecosystem = await ecosystemService.buildCulturalEcosystem(
  vibe, city, vibeContext, seeds
);

// Or build from existing taste items
const ecosystem = await ecosystemService.buildCulturalEcosystemFromTasteItems(
  vibe, city, vibeContext, seeds, tasteItems, culturalInsights
);
```

---

This Cultural Ecosystem API represents a breakthrough in cultural intelligence, enabling applications to understand and visualize the deep connections that define personal taste and cultural identity. 