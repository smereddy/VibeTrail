# Qloo API Implementation Guide

## 🎯 **Executive Summary**

Our VibeTrail app needs to implement Qloo's **Location Insights** API to get different recommendations for each tab (Food, Activities, Media). The current implementation is fundamentally wrong and needs to be completely rebuilt.

---

## 🔍 **Current Problem**

**Issue**: All tabs show identical data because we're making the same API call for all categories.

**Root Cause**: Using wrong API structure:
- ❌ **Wrong Endpoint**: `POST /search` (doesn't exist)
- ❌ **Wrong Method**: POST with JSON body
- ❌ **Wrong Parameters**: Custom categories like `"food"`, `"activity"`
- ❌ **Wrong URL**: Using proxy server instead of direct Qloo API

---

## ✅ **Correct Solution: Location Insights API**

### **API Specification**
- **Endpoint**: `GET https://hackathon.api.qloo.com/v2/insights`
- **Method**: GET with URL query parameters
- **Authentication**: `X-Api-Key` header
- **Use Case**: Location Insights (perfect for city-based recommendations)

### **Required Parameters**
- `filter.type=urn:entity:place` (always required)
- `filter.location.query={city}` (Phoenix, New York, etc.)
- `filter.tags={category-specific-tags}` (different for each tab)

---

## 🏗️ **Implementation Strategy**

### **Tab Differentiation via Tags**

Each tab uses different `filter.tags` to get different results:

#### **Food Tab**
```javascript
GET /v2/insights?filter.type=urn:entity:place&filter.location.query=Phoenix&filter.tags=urn:tag:genre:place:restaurant
```

#### **Activities Tab** 
```javascript
GET /v2/insights?filter.type=urn:entity:place&filter.location.query=Phoenix&filter.tags=urn:tag:category:place:museum
```

#### **Media Tab**
```javascript
GET /v2/insights?filter.type=urn:entity:place&filter.location.query=Phoenix&filter.tags=urn:tag:category:place:music_venue
```

### **Available Entity Types**
- `urn:entity:place` - Restaurants, venues, locations (primary for our app)
- `urn:entity:artist` - Musicians, bands, performers
- `urn:entity:movie` - Films, movies
- `urn:entity:tv_show` - TV shows, series
- `urn:entity:book` - Books, literature
- `urn:entity:brand` - Companies, brands
- `urn:entity:destination` - Travel destinations
- `urn:entity:person` - People, celebrities
- `urn:entity:podcast` - Podcasts, audio content
- `urn:entity:videogame` - Video games

---

## 🔧 **Technical Implementation**

### **Step 1: Update Base URL and Method**
```javascript
// ❌ CURRENT (Wrong)
POST localhost:3001/api/qloo/search

// ✅ CORRECT (New)
GET https://hackathon.api.qloo.com/v2/insights
```

### **Step 2: Fix Authentication**
```javascript
// ✅ CORRECT Header
headers: {
  'X-Api-Key': process.env.QLOO_API_KEY
}
```

### **Step 3: Implement Category-Specific Requests**
```javascript
// Food recommendations
const foodParams = new URLSearchParams({
  'filter.type': 'urn:entity:place',
  'filter.location.query': selectedCity,
  'filter.tags': 'urn:tag:genre:place:restaurant'
});

// Activity recommendations  
const activityParams = new URLSearchParams({
  'filter.type': 'urn:entity:place',
  'filter.location.query': selectedCity,
  'filter.tags': 'urn:tag:category:place:museum'
});

// Media recommendations
const mediaParams = new URLSearchParams({
  'filter.type': 'urn:entity:place', 
  'filter.location.query': selectedCity,
  'filter.tags': 'urn:tag:category:place:music_venue'
});
```

### **Step 4: Expected Response Format**
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
          "hours": {...},
          "keywords": [...],
          "specialty_dishes": [...]
        }
      }
    ]
  }
}
```

---

## 📋 **Files to Update**

### **1. QlooService.ts**
- Change base URL to `https://hackathon.api.qloo.com`
- Update methods to use GET with query parameters
- Implement category-specific tag filtering
- Remove old `/search` endpoint logic

### **2. AppContext.tsx**
- Update to call different Qloo endpoints for each category
- Remove entity mapping step (not needed)
- Implement direct Location Insights calls

### **3. proxy-server.cjs** 
- Remove Qloo proxy logic (call API directly)
- Keep only OpenAI proxy functionality

---

## 🎯 **Expected Results**

After implementation:
- **Food Tab**: Real restaurants, bars, cafes in selected city
- **Activities Tab**: Real museums, attractions, venues in selected city  
- **Media Tab**: Real music venues, theaters, cultural sites in selected city
- **Different Data**: Each tab shows genuinely different results
- **Location-Specific**: All results are relevant to the selected city

---

## 🚨 **Critical Success Factors**

1. **Use GET method** with URL parameters (not POST with JSON)
2. **Use hackathon API URL** (`https://hackathon.api.qloo.com`)
3. **Different filter.tags** for each category (this creates differentiation)
4. **Same filter.location.query** for all categories (city consistency)
5. **Always include filter.type=urn:entity:place** (required parameter)

---

## 📚 **Reference Links**

- [Qloo API Deep Dive](https://docs.qloo.com/reference/insights-api-deep-dive)
- [Parameter Overview](https://docs.qloo.com/reference/parameter-overview)
- [Ways to Use API](https://docs.qloo.com/reference/use-cases)
- [Entity Type Guide](https://docs.qloo.com/reference/entity-type-parameter-guide)

This implementation will finally solve the "same data in all tabs" problem by using the Qloo API as it was designed to be used.