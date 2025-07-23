# End-to-End Testing Guide for VibeTrail

This document provides a comprehensive guide to the end-to-end (e2e) testing setup for VibeTrail, covering both browser-based and API-level testing.

## 🧪 Testing Architecture

### Testing Layers

1. **Unit Tests** - Individual component and service testing (Vitest)
2. **API Integration Tests** - Backend API flow testing (Node.js + Fetch)
3. **Browser E2E Tests** - Full user journey testing (Playwright)
4. **Visual Regression Tests** - UI consistency testing (Playwright Screenshots)

### Test Files Structure

```
├── e2e/                           # Playwright browser tests
│   ├── user-journey.spec.ts       # Complete user flow tests
│   ├── api-integration.spec.ts    # API-focused tests
│   ├── visual-regression.spec.ts  # Visual regression tests
│   └── fixtures/
│       └── test-data.ts           # Test data and fixtures
├── e2e_test.cjs                   # Original API integration test
├── e2e_enhanced.cjs               # Enhanced API test with performance tracking
├── playwright.config.ts           # Playwright configuration
└── .github/workflows/e2e-tests.yml # CI/CD workflow
```

## 🚀 Quick Start

### Prerequisites

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Add your API keys:
   # OPENAI_API_KEY=your_key_here
   # QLOO_API_KEY=your_key_here
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   npx playwright install
   ```

### Running Tests

#### All Tests
```bash
npm run test:all          # Run unit tests + e2e tests + API tests
```

#### Individual Test Suites
```bash
npm run test:e2e          # Browser-based e2e tests
npm run test:e2e:ui       # Interactive Playwright UI
npm run test:e2e:api      # Enhanced API integration tests
npm run test:e2e:legacy   # Original API tests
```

#### Specific Test Categories
```bash
# User journey tests only
npx playwright test e2e/user-journey.spec.ts

# Visual regression tests only
npx playwright test e2e/visual-regression.spec.ts

# API integration tests only
npx playwright test e2e/api-integration.spec.ts
```

## 🎯 Test Coverage

### User Journey Tests (`e2e/user-journey.spec.ts`)

**Complete User Flow Testing:**
- ✅ Home page loading and navigation
- ✅ Create plan form validation
- ✅ City selection and vibe input
- ✅ API integration (OpenAI + Qloo)
- ✅ Results page with recommendations
- ✅ Recommendation selection and filtering
- ✅ Plan creation and scheduling
- ✅ Export functionality
- ✅ Error handling and edge cases
- ✅ Mobile responsiveness
- ✅ Accessibility compliance

**Test Scenarios:**
```typescript
// Example test structure
test('should complete full user journey from home to plan creation', async ({ page }) => {
  // 1. Navigate to home page
  // 2. Go to create plan
  // 3. Select city and enter vibe
  // 4. Submit and wait for recommendations
  // 5. Select recommendations
  // 6. Create and verify plan
});
```

### API Integration Tests (`e2e/api-integration.spec.ts`)

**Backend API Validation:**
- ✅ OpenAI seed extraction validation
- ✅ Qloo API integration testing
- ✅ Error handling and timeouts
- ✅ Rate limiting behavior
- ✅ CORS configuration
- ✅ Malformed request handling
- ✅ Large payload processing

### Visual Regression Tests (`e2e/visual-regression.spec.ts`)

**UI Consistency Testing:**
- ✅ Home page screenshots
- ✅ Create plan form states
- ✅ Loading states
- ✅ Error states
- ✅ Mobile vs desktop layouts
- ✅ Component-level screenshots
- ✅ Multiple viewport testing

### Enhanced API Tests (`e2e_enhanced.cjs`)

**Performance and Reliability:**
- ✅ Performance metrics tracking
- ✅ Comprehensive error handling
- ✅ Retry logic with exponential backoff
- ✅ Detailed reporting and analytics
- ✅ Multiple city/vibe combinations
- ✅ Seed validation and structure checking

## 📊 Performance Monitoring

### Metrics Tracked

1. **Timing Metrics:**
   - Seed extraction time (target: <15s)
   - Qloo API response time (target: <10s)
   - Total flow completion time (target: <30s)

2. **Success Metrics:**
   - Overall success rate (target: >80%)
   - API error rates
   - Timeout frequencies

3. **Quality Metrics:**
   - Seed extraction accuracy
   - Recommendation relevance
   - Response structure validation

### Performance Thresholds

```typescript
export const PERFORMANCE_THRESHOLDS = {
  SEED_EXTRACTION_MAX_TIME: 15000, // 15 seconds
  QLOO_REQUEST_MAX_TIME: 10000,    // 10 seconds
  TOTAL_FLOW_MAX_TIME: 30000,      // 30 seconds
  MIN_SUCCESS_RATE: 0.8            // 80% success rate
};
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: [
    { command: 'npm run dev', port: 5173 },
    { command: 'npm run proxy', port: 3001 },
  ],
});
```

### Test Data Management

Centralized test data in `e2e/fixtures/test-data.ts`:

```typescript
export const TEST_VIBES = [
  {
    input: 'cozy coffee shop vibes',
    expectedCategories: ['food', 'activity'],
    expectedSeeds: ['coffee', 'cozy', 'cafe'],
    context: 'indoor'
  },
  // ... more test cases
];
```

## 🤖 CI/CD Integration

### GitHub Actions Workflow

The e2e tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Workflow Jobs:**
1. **e2e-tests**: Core functionality testing
2. **visual-regression-tests**: UI consistency testing
3. **performance-tests**: Performance benchmarking

**Artifacts Generated:**
- Playwright HTML reports
- Performance metrics (JSON)
- Visual regression screenshots
- Test execution logs

### Environment Variables Required

```bash
# Required secrets in GitHub repository:
OPENAI_API_KEY=your_openai_api_key
QLOO_API_KEY=your_qloo_api_key
```

## 🐛 Debugging and Troubleshooting

### Local Debugging

1. **Interactive Mode**:
   ```bash
   npm run test:e2e:ui
   ```

2. **Debug Specific Test**:
   ```bash
   npx playwright test --debug e2e/user-journey.spec.ts
   ```

3. **Visual Test Updates**:
   ```bash
   npx playwright test --update-snapshots
   ```

### Common Issues

#### API Key Issues
```bash
# Verify environment variables
node -e "console.log(process.env.OPENAI_API_KEY ? 'OpenAI key found' : 'OpenAI key missing')"
node -e "console.log(process.env.QLOO_API_KEY ? 'Qloo key found' : 'Qloo key missing')"
```

#### Proxy Server Issues
```bash
# Check if proxy server is running
curl http://localhost:3001/api/health
```

#### Visual Test Failures
```bash
# Update visual baselines after UI changes
npx playwright test --update-snapshots e2e/visual-regression.spec.ts
```

### Test Data Validation

The enhanced API test includes comprehensive validation:

```javascript
// Seed validation example
function validateSeed(seed, vibeContext) {
  const errors = [];
  
  if (!seed.text || typeof seed.text !== 'string') {
    errors.push('Invalid text field');
  }
  
  if (!['food', 'activity', 'media', 'general'].includes(seed.category)) {
    errors.push(`Invalid category: ${seed.category}`);
  }
  
  if (typeof seed.confidence !== 'number' || seed.confidence < 0 || seed.confidence > 1) {
    errors.push(`Invalid confidence: ${seed.confidence}`);
  }
  
  // ... more validation
}
```

## 📈 Reporting and Analytics

### Test Reports

1. **Playwright HTML Report**: Interactive test results with traces
2. **Performance JSON Reports**: Detailed metrics and timing data
3. **Visual Regression Reports**: Screenshot comparisons
4. **CI Artifacts**: Downloadable test outputs

### Report Locations

```bash
# Local test reports
playwright-report/           # Playwright HTML report
test-results/               # Individual test results
e2e-report-*.json          # Performance reports
```

### Metrics Dashboard

The enhanced API test generates comprehensive metrics:

```json
{
  "performance": {
    "totalTests": 8,
    "successfulTests": 7,
    "failedTests": 1,
    "successRate": "87.5%",
    "averageTimePerTest": "12500ms",
    "averageSeedExtractionTime": "8200ms",
    "averageQlooRequestTime": "3800ms"
  }
}
```

## 🔮 Future Enhancements

### Planned Improvements

1. **Load Testing**: Concurrent user simulation
2. **Cross-Browser Testing**: Extended browser matrix
3. **Accessibility Testing**: Automated a11y validation
4. **Performance Budgets**: Automated performance regression detection
5. **Mock Services**: Offline testing capabilities
6. **Test Parallelization**: Faster test execution

### Contributing to Tests

1. **Adding New Test Cases**:
   - Update `e2e/fixtures/test-data.ts` with new test data
   - Add test scenarios to appropriate spec files
   - Update documentation

2. **Visual Test Maintenance**:
   - Review visual changes carefully
   - Update baselines only for intentional UI changes
   - Test across different viewports

3. **Performance Monitoring**:
   - Monitor test execution times
   - Update performance thresholds as needed
   - Investigate performance regressions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Qloo API Documentation](https://docs.qloo.com/)

---

**Happy Testing! 🚀**

For questions or issues with the e2e testing setup, please check the existing test files for examples or create an issue in the repository. 