# 🔒 Security Recommendations for VibeTrail Production

## 🚨 Current Security Issues

### Critical Problems
1. **Qloo API Key Exposed**: `VITE_QLOO_API_KEY` is visible in browser dev tools
2. **Client-Side Environment Variables**: All `VITE_*` variables are bundled into frontend
3. **Direct API Calls**: Frontend makes direct calls to Qloo API with exposed keys

## ✅ Recommended Production Architecture

### Option 1: Use Existing Vercel API Proxy (Recommended)

#### Frontend Changes Required:
```typescript
// src/services/QlooService.ts - Update to use proxy
export class QlooService extends BaseAPIService {
    constructor() {
        const config = getEnvironmentConfig();
        
        // Use Vercel API proxy instead of direct calls
        super(config.app.apiProxyUrl || '/api', config.qloo.timeout);
        this.config = config;
    }

    async getRecommendationsByEntityType(...) {
        // Change from direct API call to proxy call
        const response = await this.makeRequest<any>({
            method: 'POST',
            url: '/proxy', // Use Vercel proxy
            data: {
                service: 'qloo',
                endpoint: `/v2/insights?${params.toString()}`,
                method: 'GET'
            }
        });
    }
}
```

#### Environment Variables Update:
```bash
# Remove from frontend (.env)
# VITE_QLOO_API_KEY=xxx  # ❌ Remove this

# Add to Vercel dashboard (server-side only)
OPENAI_API_KEY=your_openai_key     # ✅ Server-side only
QLOO_API_KEY=your_qloo_key         # ✅ Server-side only
QLOO_BASE_URL=https://hackathon.api.qloo.com
```

### Option 2: Enhanced Proxy Server

#### Create dedicated API routes:
```typescript
// api/openai.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
}

// api/qloo.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { endpoint, params } = req.body;
    
    const response = await fetch(`https://hackathon.api.qloo.com${endpoint}?${params}`, {
        headers: {
            'X-Api-Key': process.env.QLOO_API_KEY,
        },
    });

    const data = await response.json();
    res.status(response.status).json(data);
}
```

## 🔧 Implementation Steps

### Step 1: Update Frontend Services
1. Remove all `VITE_*_API_KEY` references
2. Update QlooService to use proxy
3. Ensure OpenAI service continues using proxy

### Step 2: Update Environment Configuration
```typescript
// src/config/environment.ts
export function getEnvironmentConfig(): EnvironmentConfig {
    return {
        openai: {
            // Remove API key from frontend config
            model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
            useProxy: true, // Always use proxy
        },
        qloo: {
            // Remove API key from frontend config
            baseUrl: '/api', // Use proxy endpoint
            useDirectCalls: false, // Force proxy usage
        },
        app: {
            apiProxyUrl: '/api', // Use Vercel API routes
        },
    };
}
```

### Step 3: Update Deployment Configuration
```bash
# Vercel Environment Variables (Dashboard)
OPENAI_API_KEY=your_actual_openai_key
QLOO_API_KEY=your_actual_qloo_key
QLOO_BASE_URL=https://hackathon.api.qloo.com

# Remove from .env (frontend)
# VITE_OPENAI_API_KEY  # ❌ Delete
# VITE_QLOO_API_KEY    # ❌ Delete
```

## 🛡️ Security Best Practices

### API Key Management
- ✅ **Server-side only**: API keys only in Vercel environment variables
- ✅ **No frontend exposure**: No `VITE_*` API key variables
- ✅ **Proxy all external APIs**: Never direct calls from frontend
- ✅ **Rate limiting**: Implement on proxy endpoints
- ✅ **Request validation**: Validate all proxy requests

### Additional Security Measures
```typescript
// Add request validation
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Request size limits
    if (JSON.stringify(req.body).length > 10000) {
        return res.status(413).json({ error: 'Request too large' });
    }
    
    // Input validation
    if (!isValidRequest(req.body)) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    
    // Continue with API call...
}
```

## 🚀 Migration Checklist

### Pre-Production
- [ ] Remove all `VITE_*_API_KEY` from frontend
- [ ] Update QlooService to use proxy
- [ ] Test proxy endpoints locally
- [ ] Verify no API keys in browser dev tools

### Production Deployment
- [ ] Set API keys in Vercel dashboard (server-side)
- [ ] Deploy updated frontend code
- [ ] Test all API functionality
- [ ] Monitor for any exposed credentials

### Post-Deployment
- [ ] Security audit of deployed app
- [ ] Verify no API keys in browser network tab
- [ ] Test rate limiting and error handling
- [ ] Monitor API usage and costs

## 🎯 Expected Benefits

### Security
- ✅ **Zero API key exposure** in frontend
- ✅ **Server-side key management** only
- ✅ **Request validation** and rate limiting
- ✅ **Audit trail** of all API calls

### Performance
- ✅ **Reduced bundle size** (no API keys in frontend)
- ✅ **Better caching** opportunities
- ✅ **Request optimization** at proxy level

### Maintainability
- ✅ **Centralized API management**
- ✅ **Easier key rotation**
- ✅ **Better error handling**
- ✅ **Simplified deployment**

---

**Priority**: 🔴 **Critical** - Must be implemented before production deployment 