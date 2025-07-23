# Qloo API Implementation Guide

## 🎯 **Executive Summary**

VibeTrail integrates with Qloo's **Location Insights API** through **Netlify Functions** to provide culturally intelligent recommendations across multiple domains. Our serverless architecture ensures scalable, secure API integration while maintaining fast response times.

---

## 🏗️ **Architecture Overview**

### **Serverless Integration**
- **Backend**: Netlify Functions handle all Qloo API calls
- **Security**: API keys secured server-side, never exposed to client
- **Endpoints**: RESTful functions at `/.netlify/functions/`
- **Environment**: Automatic production/development detection

### **Function Endpoints**
- **`/taste`** - Main vibe processing (OpenAI + Qloo integration)
- **`/ecosystem-analysis`** - Cultural ecosystem analysis
- **`/health`** - API status and health monitoring

---

## ✅ **Current Implementation**

### **Correct API Integration**

Our implementation uses Qloo's **Location Insights API** correctly:

- **✅ Endpoint**: `GET https://hackathon.api.qloo.com/v2/insights`
- **✅ Method**: GET with URL query parameters
- **✅ Authentication**: `X-Api-Key` header (server-side only)
- **✅ Parameters**: Proper entity types and location filtering

### **Dynamic Tab Differentiation**

Each tab receives different recommendations through category-specific API calls:

#### **Food Tab**
```javascript
const foodParams = new URLSearchParams({
  'filter.type': 'urn:entity:place',
  'filter.location.query': selectedCity,
  'filter.tags': 'urn:tag:genre:place:restaurant',
  'limit': '8'
});

// Add extracted seeds as interests
seeds.forEach(seed => {
  foodParams.append('signal.interests.query', seed.text);
});
```

#### **Activities Tab** 
```javascript
const activityParams = new URLSearchParams({
  'filter.type': 'urn:entity:place',
  'filter.location.query': selectedCity,
  'filter.tags': 'urn:tag:category:place:museum',
  'limit': '8'
});
```

#### **Entertainment Tab**
```javascript
// Movies
const movieParams = new URLSearchParams({
  'filter.type': 'urn:entity:movie',
  'filter.location.query': selectedCity,
  'limit': '5'
});

// TV Shows
const tvParams = new URLSearchParams({
  'filter.type': 'urn:entity:tv_show',
  'filter.location.query': selectedCity,
  'limit': '5'
});

// Music Artists
const musicParams = new URLSearchParams({
  'filter.type': 'urn:entity:artist',
  'filter.location.query': selectedCity,
  'limit': '5'
});
```

#### **Culture Tab**
```javascript
// Books
const bookParams = new URLSearchParams({
  'filter.type': 'urn:entity:book',
  'filter.location.query': selectedCity,
  'limit': '5'
});

// Podcasts
const podcastParams = new URLSearchParams({
  'filter.type': 'urn:entity:podcast',
  'filter.location.query': selectedCity,
  'limit': '5'
});
```

---

## 🔧 **Technical Implementation**

### **Netlify Function Structure**

```javascript
// netlify/functions/taste.js
exports.handler = async (event, context) => {
  const { vibe, city } = JSON.parse(event.body);
  
  try {
    // Step 1: Extract seeds with OpenAI
    const seedsResponse = await extractSeeds(vibe);
    
    // Step 2: Get recommendations from Qloo for each category
    const recommendations = await Promise.all([
      getQlooRecommendations('food', city, seedsResponse.seeds),
      getQlooRecommendations('activities', city, seedsResponse.seeds),
      getQlooRecommendations('movies', city, seedsResponse.seeds),
      getQlooRecommendations('tv_shows', city, seedsResponse.seeds),
      getQlooRecommendations('music', city, seedsResponse.seeds),
      getQlooRecommendations('books', city, seedsResponse.seeds)
    ]);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          seeds: seedsResponse.seeds,
          recommendations: formatRecommendations(recommendations)
        }
      })
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### **Environment Detection**

The client automatically detects the correct endpoints:

```javascript
// src/config/environment.ts
export const getEnvironmentConfig = () => {
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname !== 'localhost' && 
     window.location.hostname !== '127.0.0.1');

  return {
    app: {
      apiProxyUrl: isProduction 
        ? `${window.location.origin}/.netlify/functions`
        : 'http://localhost:3001/api'
    }
  };
};
```

---

## 📊 **Available Entity Types**

### **Primary Entity Types**
- `urn:entity:place` - Restaurants, venues, locations (primary for location-based recommendations)
- `urn:entity:movie` - Films, movies
- `urn:entity:tv_show` - TV shows, series
- `urn:entity:artist` - Musicians, bands, performers
- `urn:entity:book` - Books, literature
- `urn:entity:podcast` - Podcasts, audio content
- `urn:entity:videogame` - Video games
- `urn:entity:destination` - Travel destinations

### **Place Tags for Differentiation**
- `urn:tag:genre:place:restaurant` - Restaurants and dining
- `urn:tag:category:place:museum` - Museums and cultural sites
- `urn:tag:category:place:music_venue` - Concert halls, music venues
- `urn:tag:category:place:bar` - Bars and nightlife
- `urn:tag:category:place:cafe` - Coffee shops and cafes
- `urn:tag:category:place:park` - Parks and outdoor spaces

---

## 🎯 **Expected Response Format**

### **Successful Response**
```javascript
{
  "success": true,
  "results": {
    "entities": [
      {
        "name": "Restaurant Name",
        "entity_id": "ABC123",
        "type": "urn:entity",
        "subtype": "urn:entity:place",
        "properties": {
          "description": "Restaurant description",
          "address": "123 Main St Phoenix, AZ",
          "website": "https://restaurant.com",
          "phone": "+1234567890",
          "business_rating": 4.5,
          "hours": {
            "monday": "11:00-22:00",
            "tuesday": "11:00-22:00"
          },
          "keywords": ["italian", "fine dining", "romantic"],
          "specialty_dishes": ["pasta", "wine"]
        }
      }
    ]
  }
}
```

### **Error Response**
```javascript
{
  "success": false,
  "error": {
    "code": "QLOO_API_ERROR",
    "message": "Failed to fetch recommendations from Qloo API",
    "details": "Rate limit exceeded"
  }
}
```

---

## 🚀 **Performance Optimizations**

### **Parallel API Calls**
All category requests are made in parallel for optimal performance:

```javascript
const recommendations = await Promise.all([
  getQlooRecommendations('food', city, seeds),
  getQlooRecommendations('activities', city, seeds),
  getQlooRecommendations('movies', city, seeds),
  getQlooRecommendations('tv_shows', city, seeds),
  getQlooRecommendations('music', city, seeds),
  getQlooRecommendations('books', city, seeds)
]);
```

### **Caching Strategy**
- **Function-level caching**: Results cached within function execution
- **Client-side caching**: Recommendations cached in React context
- **CDN caching**: Static assets served via Netlify Edge

### **Error Handling**
- **Graceful degradation**: Partial results returned if some categories fail
- **Retry logic**: Automatic retry for transient failures
- **Fallback data**: Mock data when APIs are unavailable

---

## 🔒 **Security Measures**

### **API Key Protection**
- **Server-side only**: API keys never exposed to client
- **Environment variables**: Secure key storage via Netlify
- **Request validation**: Input sanitization and validation

### **CORS Configuration**
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

---

## 🧪 **Testing Strategy**

### **Function Testing**
```bash
# Test Netlify Functions locally
npm run dev:functions

# Test specific endpoints
curl -X POST http://localhost:8888/.netlify/functions/taste \
  -H "Content-Type: application/json" \
  -d '{"vibe": "cozy coffee shop", "city": "Los Angeles"}'
```

### **Integration Testing**
- **E2E tests**: Full user journey testing
- **API integration**: Direct Qloo API testing
- **Error scenarios**: Rate limiting and failure handling

---

## 📚 **Reference Links**

- [Qloo API Deep Dive](https://docs.qloo.com/reference/insights-api-deep-dive)
- [Parameter Overview](https://docs.qloo.com/reference/parameter-overview)
- [Entity Type Guide](https://docs.qloo.com/reference/entity-type-parameter-guide)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

---

## ✅ **Success Metrics**

### **API Performance**
- **Response Time**: <2 seconds for all recommendation requests
- **Success Rate**: >95% for all Qloo API calls
- **Differentiation**: Each tab shows genuinely different results
- **Location Accuracy**: All results relevant to selected city

### **User Experience**
- **Tab Relevance**: Each category provides contextually appropriate recommendations
- **Data Quality**: Rich metadata for all recommendations
- **Error Handling**: Graceful degradation when APIs fail
- **Performance**: Sub-3-second total page load times

This implementation ensures VibeTrail provides truly differentiated, location-specific cultural recommendations while maintaining excellent performance and security through our serverless architecture.