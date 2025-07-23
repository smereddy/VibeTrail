import { test, expect, Page } from '@playwright/test';

// Test data
const TEST_CITIES = ['Los Angeles', 'New York', 'Chicago'];
const TEST_VIBES = [
  'cozy coffee shop vibes',
  'outdoor adventure day',
  'cultural exploration',
  'foodie paradise',
  'jazz and cocktails evening'
];

test.describe('VibeTrail User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await expect(page).toHaveTitle(/VibeTrail/);
  });

  test('should complete full user journey from home to plan creation', async ({ page }) => {
    // Step 1: Home page should load correctly
    await expect(page.locator('h1')).toContainText('VibeTrail');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();

    // Step 2: Navigate to create plan
    await page.click('[data-testid="create-plan-button"]');
    await expect(page).toHaveURL('/create-plan');

    // Step 3: Select a city
    await page.selectOption('[data-testid="city-select"]', TEST_CITIES[0]);
    await expect(page.locator('[data-testid="city-select"]')).toHaveValue(TEST_CITIES[0]);

    // Step 4: Enter vibe input
    const vibeInput = TEST_VIBES[0];
    await page.fill('[data-testid="vibe-input"]', vibeInput);
    await expect(page.locator('[data-testid="vibe-input"]')).toHaveValue(vibeInput);

    // Step 5: Submit the form
    await page.click('[data-testid="generate-recommendations"]');
    
    // Step 6: Wait for results page and verify loading state
    await expect(page).toHaveURL('/results');
    
    // Check for loading spinner initially
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Wait for recommendations to load (with timeout)
    await expect(page.locator('[data-testid="recommendations-grid"]')).toBeVisible({ timeout: 30000 });
    
    // Step 7: Verify recommendations are displayed
    await expect(page.locator('[data-testid="recommendation-card"]')).toHaveCount({ min: 1 });
    
    // Step 8: Select some recommendations
    const recommendationCards = page.locator('[data-testid="recommendation-card"]');
    const cardCount = await recommendationCards.count();
    
    // Select at least 3 items (minimum required for plan creation)
    const selectCount = Math.min(3, cardCount);
    for (let i = 0; i < selectCount; i++) {
      await recommendationCards.nth(i).click();
      await expect(recommendationCards.nth(i)).toHaveClass(/selected/);
    }
    
    // Step 9: Navigate to plan creation
    await page.click('[data-testid="create-plan-from-selections"]');
    await expect(page).toHaveURL('/plan');
    
    // Step 10: Verify plan page shows scheduled items
    await expect(page.locator('[data-testid="scheduled-plan"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-testid="time-slot"]')).toHaveCount({ min: selectCount });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/openai/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API Error' })
      });
    });

    await page.goto('/create-plan');
    await page.selectOption('[data-testid="city-select"]', TEST_CITIES[0]);
    await page.fill('[data-testid="vibe-input"]', TEST_VIBES[0]);
    await page.click('[data-testid="generate-recommendations"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/error/i);
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/create-plan');

    // Try to submit without city selection
    await page.fill('[data-testid="vibe-input"]', TEST_VIBES[0]);
    await page.click('[data-testid="generate-recommendations"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="city-error"]')).toBeVisible();

    // Try to submit without vibe input
    await page.selectOption('[data-testid="city-select"]', TEST_CITIES[0]);
    await page.fill('[data-testid="vibe-input"]', '');
    await page.click('[data-testid="generate-recommendations"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="vibe-error"]')).toBeVisible();
  });

  test('should handle different recommendation categories', async ({ page }) => {
    await page.goto('/create-plan');
    await page.selectOption('[data-testid="city-select"]', TEST_CITIES[0]);
    await page.fill('[data-testid="vibe-input"]', 'jazz music and fine dining');
    await page.click('[data-testid="generate-recommendations"]');

    await expect(page).toHaveURL('/results');
    await expect(page.locator('[data-testid="recommendations-grid"]')).toBeVisible({ timeout: 30000 });

    // Should show category tabs
    await expect(page.locator('[data-testid="category-tabs"]')).toBeVisible();
    
    // Should have multiple categories available
    const categoryTabs = page.locator('[data-testid="category-tab"]');
    await expect(categoryTabs).toHaveCount({ min: 2 });

    // Test switching between categories
    if (await categoryTabs.count() > 1) {
      await categoryTabs.nth(1).click();
      await expect(page.locator('[data-testid="recommendation-card"]')).toHaveCount({ min: 1 });
    }
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Mobile navigation should work
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Complete basic flow on mobile
    await page.click('[data-testid="create-plan-button"]');
    await expect(page).toHaveURL('/create-plan');
    
    await page.selectOption('[data-testid="city-select"]', TEST_CITIES[0]);
    await page.fill('[data-testid="vibe-input"]', TEST_VIBES[0]);
    
    // Mobile form should be responsive
    await expect(page.locator('[data-testid="vibe-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="generate-recommendations"]')).toBeVisible();
  });

  test('should export plan successfully', async ({ page }) => {
    // Complete the flow to get to plan page
    await page.goto('/create-plan');
    await page.selectOption('[data-testid="city-select"]', TEST_CITIES[0]);
    await page.fill('[data-testid="vibe-input"]', TEST_VIBES[0]);
    await page.click('[data-testid="generate-recommendations"]');
    
    await expect(page).toHaveURL('/results');
    await expect(page.locator('[data-testid="recommendations-grid"]')).toBeVisible({ timeout: 30000 });
    
    // Select recommendations
    const recommendationCards = page.locator('[data-testid="recommendation-card"]');
    const cardCount = await recommendationCards.count();
    const selectCount = Math.min(3, cardCount);
    
    for (let i = 0; i < selectCount; i++) {
      await recommendationCards.nth(i).click();
    }
    
    await page.click('[data-testid="create-plan-from-selections"]');
    await expect(page).toHaveURL('/plan');
    await expect(page.locator('[data-testid="scheduled-plan"]')).toBeVisible({ timeout: 30000 });
    
    // Test export functionality
    await page.click('[data-testid="export-plan"]');
    await expect(page).toHaveURL('/export');
    
    // Should show export options
    await expect(page.locator('[data-testid="export-options"]')).toBeVisible();
    
    // Test calendar export (download will be triggered)
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-calendar"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/\.ics$/);
  });
});

test.describe('VibeTrail Navigation', () => {
  test('should navigate between all pages', async ({ page }) => {
    await page.goto('/');
    
    const navigationLinks = [
      { text: 'About', url: '/about' },
      { text: 'Insights', url: '/insights' },
      { text: 'Weekend', url: '/weekend' }
    ];
    
    for (const link of navigationLinks) {
      await page.click(`text=${link.text}`);
      await expect(page).toHaveURL(link.url);
      
      // Go back to home
      await page.click('[data-testid="home-link"]');
      await expect(page).toHaveURL('/');
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="create-plan-button"]');
    await expect(page).toHaveURL('/create-plan');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/create-plan');
  });
});

test.describe('VibeTrail Accessibility', () => {
  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Basic accessibility checks
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toHaveText(/VibeTrail/);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for form labels
    await page.goto('/create-plan');
    await expect(page.locator('label[for="city-select"]')).toBeVisible();
    await expect(page.locator('label[for="vibe-input"]')).toBeVisible();
  });
}); 