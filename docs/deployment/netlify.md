# Netlify Deployment Guide

## 🚀 **Overview**

VibeTrail is optimized for deployment on **Netlify** with automatic serverless functions, CDN distribution, and seamless CI/CD integration. This guide covers everything from initial setup to production deployment and troubleshooting.

---

## 🏗️ **Architecture**

### **Deployment Components**
- **Frontend**: React app built with Vite, served via Netlify CDN
- **Backend**: Netlify Functions (serverless Node.js functions)
- **APIs**: OpenAI and Qloo integrations through secure serverless functions
- **Environment**: Automatic production/development detection

### **Function Endpoints**
- **`/.netlify/functions/taste`** - Main vibe processing (OpenAI + Qloo)
- **`/.netlify/functions/plan-day`** - AI-powered day planning
- **`/.netlify/functions/ecosystem-analysis`** - Cultural ecosystem analysis
- **`/.netlify/functions/health`** - Health check and API status

---

## 🚀 **Quick Deployment**

### **1. Repository Setup**
```bash
# Ensure your repository is pushed to GitHub
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main

# Create and push production branch (if not already done)
git checkout -b production
git push -u origin production
```

### **2. Connect to Netlify**
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"New site from Git"**
3. Choose **GitHub** and select your repository
4. **Important**: Set branch to deploy as **`production`** (not `main`)
5. Netlify will auto-detect the configuration from `netlify.toml`

### **3. Environment Variables**
In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
OPENAI_API_KEY=your_openai_api_key_here
QLOO_API_KEY=your_qloo_api_key_here
```

### **4. Deploy**
- **Automatic**: Push to `production` branch triggers automatic deployment
- **Manual**: Click **"Deploy site"** in Netlify dashboard
- **Branching Strategy**: See [Branching Strategy Guide](branching-strategy.md) for full workflow

---

## ⚙️ **Configuration Files**

### **netlify.toml**
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/.netlify/functions/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"

[dev]
  command = "npm run dev"
  port = 5174
  targetPort = 5174
  framework = "#custom"
```

### **Function Dependencies**
```json
// netlify/functions/package.json
{
  "dependencies": {
    "axios": "^1.10.0"
  }
}
```

---

## 🔧 **Local Development**

### **Standard Development**
```bash
# Start Vite dev server (auto-detects port)
npm run dev

# App runs on http://localhost:5174
# API calls automatically route to development endpoints
```

### **Test Functions Locally**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development with functions
netlify dev

# Functions available at http://localhost:8888/.netlify/functions/
```

### **Manual Function Testing**
```bash
# Test taste endpoint
curl -X POST http://localhost:8888/.netlify/functions/taste \
  -H "Content-Type: application/json" \
  -d '{"vibe": "cozy coffee shop", "city": "Los Angeles"}'

# Test health endpoint
curl http://localhost:8888/.netlify/functions/health
```

---

## 🌍 **Environment Detection**

The app automatically detects the environment and uses appropriate endpoints:

### **Production Detection**
```javascript
// src/config/environment.ts
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && 
   window.location.hostname !== '127.0.0.1');

// Production: https://your-site.netlify.app/.netlify/functions/
// Development: http://localhost:3001/api/
```

### **No Manual Configuration Required**
- ✅ **Production**: Automatically uses Netlify Functions
- ✅ **Development**: Automatically uses local development server
- ✅ **Staging**: Works with Netlify branch deployments

---

## 🔒 **Security Configuration**

### **Environment Variables**
Set these in **Netlify Dashboard > Site settings > Environment variables**:

```
OPENAI_API_KEY=sk-your-openai-key
QLOO_API_KEY=your-qloo-api-key
NODE_ENV=production
```

### **API Key Protection**
- ✅ **Server-side only**: API keys never exposed to client
- ✅ **Environment variables**: Secure storage via Netlify
- ✅ **Function isolation**: Each function has isolated environment
- ✅ **HTTPS only**: All communications encrypted

### **CORS Configuration**
```javascript
// Automatic CORS headers in netlify.toml
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🚀 **CI/CD Pipeline**

### **Automatic Deployments**
- **Trigger**: Push to `production` branch
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/`
- **Functions**: Automatically deployed from `netlify/functions/`
- **Development**: `main` branch for active development (not deployed)

### **Branch Deployments**
- **Feature branches**: Automatic preview deployments
- **Pull requests**: Deploy previews with unique URLs
- **Testing**: Full function testing in preview environments

### **Build Process**
```bash
# Netlify automatically runs when production branch is updated:
1. npm install
2. npm run build
3. Deploy functions from netlify/functions/
4. Publish dist/ to CDN
5. Configure redirects and headers
```

---

## 📊 **Monitoring & Analytics**

### **Netlify Analytics**
- **Page views**: Track user engagement
- **Function invocations**: Monitor API usage
- **Performance**: Page load times and Core Web Vitals
- **Errors**: Function errors and build failures

### **Function Logs**
```bash
# View function logs
netlify logs:functions

# Real-time function monitoring
netlify logs:functions --live
```

### **Health Monitoring**
Access health endpoint to monitor API status:
```
https://your-site.netlify.app/.netlify/functions/health
```

Response includes:
- API key status (without exposing keys)
- Function response times
- System health indicators

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Functions Not Working**
```bash
# Check function logs
netlify logs:functions

# Test functions locally
netlify dev

# Verify environment variables
netlify env:list
```

#### **Build Failures**
```bash
# Check build logs in Netlify dashboard
# Common fixes:
1. Ensure Node.js version 18+ in netlify.toml
2. Check package.json dependencies
3. Verify build command: npm run build
```

#### **API Key Issues**
1. **Verify environment variables** in Netlify dashboard
2. **Check variable names**: `OPENAI_API_KEY`, `QLOO_API_KEY`
3. **No quotes** around values in Netlify dashboard
4. **Redeploy** after adding environment variables

#### **CORS Errors**
- Ensure `netlify.toml` includes CORS headers
- Check function responses include CORS headers
- Verify redirect rules are correct

### **Performance Issues**

#### **Cold Start Optimization**
```javascript
// Functions are optimized for fast cold starts
// Keep dependencies minimal in netlify/functions/package.json
```

#### **Function Timeouts**
```javascript
// Default timeout: 10 seconds
// For longer operations, implement:
1. Async processing
2. Response streaming
3. Background jobs
```

### **Environment-Specific Issues**

#### **Development vs Production**
```javascript
// Check environment detection
console.log('Environment:', process.env.NODE_ENV);
console.log('Hostname:', window.location.hostname);
```

#### **Local Function Testing**
```bash
# If netlify dev doesn't work:
1. Install latest Netlify CLI: npm install -g netlify-cli@latest
2. Login: netlify login
3. Link site: netlify link
4. Start dev: netlify dev
```

---

## 🔄 **Deployment Strategies**

### **Production Deployment**
```bash
# Automatic (recommended) - Deploy via production branch
git checkout main
git pull origin main
git checkout production
git merge main
git push origin production  # Triggers automatic deployment

# Manual deployment
netlify deploy --prod --dir=dist
```

### **Staging Deployment**
```bash
# Create staging branch
git checkout -b staging
git push origin staging

# Netlify creates automatic branch deployment
```

### **Rollback Strategy**
```bash
# Rollback to previous deployment
netlify rollback

# Or redeploy specific commit
git checkout <previous-commit>
git push origin main --force
```

---

## 📈 **Performance Optimization**

### **Build Optimization**
```javascript
// vite.config.ts optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### **Function Optimization**
```javascript
// Keep functions lightweight
// Minimize dependencies
// Use async/await for better performance
// Implement proper error handling
```

### **CDN Optimization**
- **Static assets**: Automatically optimized by Netlify
- **Image optimization**: Consider Netlify Image CDN
- **Caching**: Automatic with proper cache headers

---

## 🎯 **Success Checklist**

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] `netlify.toml` properly configured
- [ ] Functions tested locally
- [ ] Build process verified
- [ ] API keys secured

### **Post-Deployment**
- [ ] Site accessible at production URL
- [ ] Functions responding correctly
- [ ] Health endpoint returns success
- [ ] API integrations working
- [ ] Performance metrics acceptable

### **Monitoring Setup**
- [ ] Netlify Analytics enabled
- [ ] Function logs monitored
- [ ] Error tracking configured
- [ ] Performance monitoring active

---

## 📚 **Additional Resources**

- [Branching Strategy Guide](branching-strategy.md) - Complete workflow documentation
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Netlify CLI Commands](https://cli.netlify.com/)
- [Netlify Analytics](https://docs.netlify.com/monitor-sites/analytics/)

---

## 🎉 **Success!**

Your VibeTrail app is now deployed on Netlify with:
- ✅ **Serverless functions** for secure API integration
- ✅ **Automatic deployments** from GitHub
- ✅ **Global CDN** for optimal performance
- ✅ **Environment detection** for seamless development
- ✅ **Secure API key management**

Visit your deployed site and start exploring cultural ecosystems! 🎭 