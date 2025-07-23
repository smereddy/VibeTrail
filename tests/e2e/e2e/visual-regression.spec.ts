import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('home page visual snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic elements that might cause flaky tests
    await page.addStyleTag({
      content: `
        .animate-pulse,
        .animate-spin,
        .animate-bounce {
          animation: none !important;
        }
      `
    });
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('create plan page visual snapshot', async ({ page }) => {
    await page.goto('/create-plan');
    
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of the form
    await expect(page).toHaveScreenshot('create-plan-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('create plan form with data visual snapshot', async ({ page }) => {
    await page.goto('/create-plan');
    
    // Fill out the form
    await page.selectOption('[data-testid="city-select"]', 'Los Angeles');
    await page.fill('[data-testid="vibe-input"]', 'cozy coffee shop vibes with live jazz music');
    
    // Take screenshot with filled form
    await expect(page).toHaveScreenshot('create-plan-filled.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('loading state visual snapshot', async ({ page }) => {
    // Mock slow API response to capture loading state
    await page.route('**/api/openai/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.goto('/create-plan');
    await page.selectOption('[data-testid="city-select"]', 'Los Angeles');
    await page.fill('[data-testid="vibe-input"]', 'test vibe');
    
    // Start the request and immediately take screenshot
    await page.click('[data-testid="generate-recommendations"]');
    
    // Wait for loading state to appear
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    await expect(page).toHaveScreenshot('loading-state.png', {
      animations: 'disabled'
    });
  });

  test('about page visual snapshot', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('mobile home page visual snapshot', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('mobile create plan page visual snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/create-plan');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('create-plan-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('navigation component visual snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Focus on navigation component
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    await expect(navigation).toHaveScreenshot('navigation-component.png', {
      animations: 'disabled'
    });
  });

  test('footer component visual snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    await expect(footer).toHaveScreenshot('footer-component.png', {
      animations: 'disabled'
    });
  });

  test('error state visual snapshot', async ({ page }) => {
    // Mock API error
    await page.route('**/api/openai/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API Error' })
      });
    });

    await page.goto('/create-plan');
    await page.selectOption('[data-testid="city-select"]', 'Los Angeles');
    await page.fill('[data-testid="vibe-input"]', 'test vibe');
    await page.click('[data-testid="generate-recommendations"]');

    // Wait for error state
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10000 });
    
    await expect(page).toHaveScreenshot('error-state.png', {
      animations: 'disabled'
    });
  });

  test('dark mode visual comparison', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if dark mode toggle exists and toggle it
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      
      // Wait for dark mode to apply
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('home-page-dark.png', {
        fullPage: true,
        animations: 'disabled'
      });
    }
  });

  // Test different viewport sizes
  const viewports = [
    { name: 'desktop-large', width: 1920, height: 1080 },
    { name: 'desktop-medium', width: 1366, height: 768 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile-large', width: 414, height: 896 },
    { name: 'mobile-small', width: 320, height: 568 }
  ];

  for (const viewport of viewports) {
    test(`responsive design ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  }

  test('component states visual snapshots', async ({ page }) => {
    await page.goto('/create-plan');
    
    // Test empty form state
    await expect(page.locator('[data-testid="vibe-input"]')).toHaveScreenshot('input-empty.png');
    
    // Test filled form state
    await page.fill('[data-testid="vibe-input"]', 'jazz and fine dining');
    await expect(page.locator('[data-testid="vibe-input"]')).toHaveScreenshot('input-filled.png');
    
    // Test city selector
    await expect(page.locator('[data-testid="city-select"]')).toHaveScreenshot('city-select.png');
    
    // Test button states
    const submitButton = page.locator('[data-testid="generate-recommendations"]');
    await expect(submitButton).toHaveScreenshot('button-default.png');
    
    // Hover state
    await submitButton.hover();
    await expect(submitButton).toHaveScreenshot('button-hover.png');
  });
}); 