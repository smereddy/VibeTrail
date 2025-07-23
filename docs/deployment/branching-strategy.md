# VibeTrail Branching Strategy

## 🌳 **Branch Structure**

VibeTrail uses a **dual-branch strategy** optimized for Netlify deployment and continuous integration:

```
main (development) ──────────────────────────────────
 │                                                   │
 │  ┌─ feature/new-feature ──┐                      │
 │  │                        │                      │
 │  └─ merge ────────────────┘                      │
 │                                                   │
 │  ┌─ bugfix/fix-issue ─────┐                      │
 │  │                        │                      │
 │  └─ merge ────────────────┘                      │
 │                                                   │
 └─ merge to production ──────────── production ────┘
                                           │
                                    [Netlify Deploy]
```

---

## 🚀 **Branch Purposes**

### **`main` Branch (Development)**
- **Purpose**: Active development and integration
- **Stability**: Stable, but may contain latest features being tested
- **Deployment**: Not deployed to production
- **Protection**: Protected branch, requires PR reviews
- **Merges from**: Feature branches, bugfix branches
- **Merges to**: `production` branch

### **`production` Branch (Production)**
- **Purpose**: Production-ready releases
- **Stability**: Highly stable, thoroughly tested
- **Deployment**: **Auto-deploys to Netlify** on every push
- **Protection**: Highly protected, only accepts merges from `main`
- **Merges from**: `main` branch only
- **Merges to**: None (end of pipeline)

---

## 🔄 **Workflow Process**

### **1. Feature Development**
```bash
# Start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Develop and commit
git add .
git commit -m "Add new feature"

# Push and create PR to main
git push -u origin feature/your-feature-name
```

### **2. Code Review & Integration**
1. **Create Pull Request** to `main` branch
2. **Code Review** by team members
3. **Run Tests** (automated via GitHub Actions)
4. **Merge to main** after approval

### **3. Production Release (PR-Based)**
```bash
# Switch to main and ensure it's up to date
git checkout main
git pull origin main

# Create Pull Request from main to production
# This triggers comprehensive testing in GitHub Actions
# 1. Go to GitHub repository
# 2. Click "New Pull Request"
# 3. Set base: production, compare: main
# 4. Wait for all tests to pass
# 5. Merge PR after approval and successful tests
```

### **4. Automated Testing & Deployment**
- **GitHub Actions runs comprehensive tests** on PR to production
- **All tests must pass** before merge is allowed
- **Netlify automatically deploys** when production branch is updated
- **Functions deployed** to `/.netlify/functions/`
- **Environment variables** managed in Netlify dashboard

---

## 🛡️ **Branch Protection Rules**

### **`main` Branch Protection**
```yaml
Required:
  - Pull request reviews (1+ approvals)
  - Status checks must pass
  - Branch must be up to date before merging
  - Dismiss stale reviews when new commits are pushed

Restrictions:
  - No direct pushes to main
  - Only admins can bypass protections
```

### **`production` Branch Protection**
```yaml
Required:
  - Pull request reviews (2+ approvals)
  - All status checks must pass
  - Branch must be up to date before merging
  - Require signed commits

Restrictions:
  - No direct pushes to production
  - Only repository admins can merge
  - Only accept merges from main branch
```

---

## 🔧 **Netlify Configuration**

### **Production Site Settings**
```toml
# netlify.toml (already configured)
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

# Auto-deploy from production branch
```

### **Netlify Dashboard Settings**
1. **Site Settings > Build & Deploy > Continuous Deployment**
2. **Branch to deploy**: `production`
3. **Build command**: `npm run build`
4. **Publish directory**: `dist`
5. **Functions directory**: `netlify/functions`

### **GitHub Secrets Configuration**
Set these secrets in **GitHub Repository > Settings > Secrets and variables > Actions**:

```
OPENAI_API_KEY=your_openai_api_key
QLOO_API_KEY=your_qloo_api_key
```

These are required for:
- Function testing in GitHub Actions
- E2E testing with real API calls
- Integration testing for production readiness

---

## 🧪 **Testing Strategy**

### **Automated Testing Pipeline**

#### **All Branches & PRs**
- **Linting & Build**: ESLint, TypeScript checks, build verification
- **Unit Tests**: Component and service testing with coverage
- **Function Tests**: Local Netlify Functions testing
- **Security Checks**: npm audit and vulnerability scanning

#### **PRs to `main` Branch**
- **All basic tests** (above)
- **E2E Tests**: Full Playwright browser testing
- **Integration Tests**: API endpoint validation

#### **PRs to `production` Branch** (Comprehensive)
- **All tests above** +
- **Extended Integration Tests**: Complete API flow testing
- **Production Readiness Check**: Build verification, environment validation
- **Performance Checks**: Build size analysis, function optimization
- **Security Audit**: Comprehensive vulnerability assessment

#### **Post-Production Deployment**
- **Health Monitoring**: Automatic health checks
- **Error Tracking**: Real-time error monitoring
- **Performance Monitoring**: Core Web Vitals tracking

---

## 📋 **Release Process**

### **Regular Release (Weekly)**
1. **Feature freeze** on `main` branch
2. **Final testing** of integrated features
3. **Create release PR** from `main` to `production`
4. **Wait for GitHub Actions** to complete all tests
5. **Code review** and approval (2+ reviewers required)
6. **Release notes** documenting changes
7. **Merge PR** → **GitHub Actions notifies** → **Netlify auto-deploys**
8. **Post-deployment verification** via health checks

### **Hotfix Release (Emergency)**
```bash
# Create hotfix branch from production
git checkout production
git checkout -b hotfix/critical-fix

# Make minimal fix
git add .
git commit -m "Fix critical issue"

# Merge to both production and main
git checkout production
git merge hotfix/critical-fix
git push origin production  # Triggers deployment

git checkout main
git merge hotfix/critical-fix
git push origin main

# Clean up
git branch -d hotfix/critical-fix
git push origin --delete hotfix/critical-fix
```

---

## 🚨 **Emergency Procedures**

### **Rollback Process**
```bash
# Option 1: Netlify Dashboard Rollback
# Go to Netlify Dashboard > Deploys > Click "Restore deploy" on previous version

# Option 2: Git Rollback
git checkout production
git revert <commit-hash>
git push origin production  # Triggers new deployment
```

### **Production Issues**
1. **Immediate assessment** of issue severity
2. **Rollback if critical** using Netlify dashboard
3. **Create hotfix branch** for proper fix
4. **Test hotfix thoroughly** before deployment
5. **Deploy hotfix** via production branch merge

---

## 📊 **Branch Status Monitoring**

### **GitHub Branch Status**
- **Main**: ![Main Status](https://img.shields.io/github/checks-status/smereddy/VibeTrail/main)
- **Production**: ![Production Status](https://img.shields.io/github/checks-status/smereddy/VibeTrail/production)

### **Deployment Status**
- **Production Site**: Monitor via Netlify dashboard
- **Function Health**: `https://your-site.netlify.app/.netlify/functions/health`
- **Performance**: Core Web Vitals tracking

---

## 🎯 **Best Practices**

### **Commit Messages**
```bash
# Feature commits
git commit -m "feat: add new recommendation algorithm"

# Bug fixes
git commit -m "fix: resolve API timeout issues"

# Documentation
git commit -m "docs: update deployment guide"

# Refactoring
git commit -m "refactor: optimize Qloo API integration"
```

### **PR Guidelines**
- **Descriptive titles** explaining the change
- **Detailed descriptions** with context and testing notes
- **Screenshots** for UI changes
- **Link related issues** using GitHub keywords
- **Test results** and performance impact

### **Code Quality**
- **Run tests locally** before pushing
- **Use ESLint and Prettier** for consistent formatting
- **Write meaningful commit messages**
- **Keep PRs focused** and reasonably sized
- **Update documentation** for significant changes

---

## 🔗 **Quick Commands**

### **Common Git Operations**
```bash
# Check current branch and status
git branch -v
git status

# Update main branch
git checkout main && git pull origin main

# Create new feature branch
git checkout -b feature/your-feature

# Push changes and create PR
git push -u origin feature/your-feature

# Release to production
git checkout production && git merge main && git push origin production

# Check deployment status
curl https://your-site.netlify.app/.netlify/functions/health
```

---

## 📚 **Additional Resources**

- [GitHub Flow Documentation](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Netlify Branch Deploys](https://docs.netlify.com/site-deploys/overview/#branch-deploy-controls)
- [Git Branching Best Practices](https://nvie.com/posts/a-successful-git-branching-model/)
- [Semantic Commit Messages](https://www.conventionalcommits.org/)

---

**This branching strategy ensures stable production deployments while maintaining rapid development velocity and easy rollback capabilities.** 