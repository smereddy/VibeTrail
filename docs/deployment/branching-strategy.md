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

### **3. Production Release**
```bash
# Switch to main and ensure it's up to date
git checkout main
git pull origin main

# Create PR from main to production
# OR merge directly if you have permissions
git checkout production
git pull origin production
git merge main
git push origin production
```

### **4. Automatic Deployment**
- **Netlify automatically deploys** when `production` branch is updated
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

---

## 🧪 **Testing Strategy**

### **Branch-Specific Testing**

#### **Feature Branches**
- **Unit tests**: Run locally before committing
- **Linting**: ESLint and TypeScript checks
- **Build verification**: Ensure `npm run build` succeeds

#### **`main` Branch**
- **Integration tests**: Full E2E testing
- **API tests**: Validate all Netlify Functions
- **Performance tests**: Load testing and optimization
- **Security scans**: Dependency vulnerability checks

#### **`production` Branch**
- **Production smoke tests**: Health checks after deployment
- **Monitoring**: Real-time error tracking
- **Rollback readiness**: Immediate rollback capability

---

## 📋 **Release Process**

### **Regular Release (Weekly)**
1. **Feature freeze** on `main` branch
2. **Final testing** of integrated features
3. **Create release PR** from `main` to `production`
4. **Release notes** documenting changes
5. **Merge to production** → **Auto-deploy**
6. **Post-deployment verification**

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