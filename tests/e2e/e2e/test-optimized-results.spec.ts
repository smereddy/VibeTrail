import { test, expect } from '@playwright/test';

test.describe('Optimized Results Page', () => {
  test('should display optimized layout with real recommendations', async ({ page }) => {
    // Navigate to create plan
    await page.goto('/create-plan');
    
    // Fill out the form with a test vibe
    await page.selectOption('select[name="city"]', 'Los Angeles');
    await page.fill('textarea[name="vibe"]', 'cozy coffee shop vibes');
    
    // Submit and wait for results
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/results');
    
    // Wait for the optimized layout to load
    await page.waitForSelector('[data-testid="recommendations-grid"]', { timeout: 30000 });
    
    // Verify optimized header structure
    await expect(page.locator('div.sticky.top-0')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Your Perfect Day in Los Angeles');
    
    // Verify compact selection status
    await expect(page.locator('text=selected')).toBeVisible();
    await expect(page.locator('[data-testid="create-plan-from-selections"]')).toBeVisible();
    
    // Verify taste signals are compact
    const tasteSignals = page.locator('.bg-primary-100.text-primary-700.rounded-full');
    if (await tasteSignals.count() > 0) {
      await expect(tasteSignals.first()).toHaveClass(/text-xs/);
    }
    
    // Verify tab navigation is horizontal and scrollable
    await expect(page.locator('[data-testid="category-tab"]')).toHaveCount({ min: 1 });
    
    // Verify dense grid layout
    const recommendationCards = page.locator('[data-testid="recommendation-card"]');
    await expect(recommendationCards).toHaveCount({ min: 1 });
    
    // Test card interaction - select a few items
    const cardCount = await recommendationCards.count();
    const selectCount = Math.min(3, cardCount);
    
    for (let i = 0; i < selectCount; i++) {
      await recommendationCards.nth(i).click();
      await expect(recommendationCards.nth(i)).toHaveClass(/selected/);
    }
    
    // Verify selection counter updates
    await expect(page.locator('text=' + selectCount + ' selected')).toBeVisible();
    
    // Verify Build Plan button becomes enabled
    const buildPlanBtn = page.locator('[data-testid="create-plan-from-selections"]');
    await expect(buildPlanBtn).not.toHaveClass(/cursor-not-allowed/);
    
    console.log('✅ Optimized Results page layout test passed!');
  });

  test('should handle category switching efficiently', async ({ page }) => {
    await page.goto('/create-plan');
    await page.selectOption('select[name="city"]', 'New York');
    await page.fill('textarea[name="vibe"]', 'jazz and fine dining');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/results');
    await page.waitForSelector('[data-testid="recommendations-grid"]', { timeout: 30000 });
    
    // Get all available category tabs
    const categoryTabs = page.locator('[data-testid="category-tab"]');
    const tabCount = await categoryTabs.count();
    
    if (tabCount > 1) {
      // Test switching between categories
      for (let i = 0; i < Math.min(3, tabCount); i++) {
        await categoryTabs.nth(i).click();
        
        // Wait for content to load
        await page.waitForTimeout(500);
        
        // Verify recommendations are shown
        const cards = page.locator('[data-testid="recommendation-card"]');
        const cardCount = await cards.count();
        
        if (cardCount > 0) {
          await expect(cards.first()).toBeVisible();
        }
        
        console.log(`✅ Category ${i + 1} switching works!`);
      }
    }
  });

  test('should display compact card information efficiently', async ({ page }) => {
    await page.goto('/create-plan');
    await page.selectOption('select[name="city"]', 'Chicago');
    await page.fill('textarea[name="vibe"]', 'foodie paradise');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/results');
    await page.waitForSelector('[data-testid="recommendations-grid"]', { timeout: 30000 });
    
    const cards = page.locator('[data-testid="recommendation-card"]');
    if (await cards.count() > 0) {
      const firstCard = cards.first();
      
      // Verify compact card structure
      await expect(firstCard).toHaveClass(/p-4/); // Compact padding
      
      // Check for essential elements in compact format
      await expect(firstCard.locator('h3')).toBeVisible(); // Title
      await expect(firstCard.locator('.text-xs')).toBeVisible(); // Small text elements
      
      // Verify star rating is compact
      const starRating = firstCard.locator('.w-3.h-3.text-yellow-400');
      if (await starRating.count() > 0) {
        await expect(starRating).toBeVisible();
      }
      
      console.log('✅ Compact card layout verified!');
    }
  });

  test('should work efficiently on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/create-plan');
    
    // Fill form on mobile
    await page.selectOption('select[name="city"]', 'Austin');
    await page.fill('textarea[name="vibe"]', 'live music scene');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/results');
    
    // Wait for mobile-optimized content
    await page.waitForSelector('[data-testid="recommendations-grid"]', { timeout: 30000 });
    
    // Verify mobile header shows
    await expect(page.locator('.sm\\:hidden h1')).toBeVisible();
    
    // Verify horizontal scrollable tabs work on mobile
    const tabContainer = page.locator('.overflow-x-auto');
    await expect(tabContainer).toBeVisible();
    
    // Verify mobile grid layout (should be single column)
    const grid = page.locator('.grid.grid-cols-1');
    await expect(grid).toBeVisible();
    
    // Test mobile card interaction
    const cards = page.locator('[data-testid="recommendation-card"]');
    if (await cards.count() > 0) {
      await cards.first().click();
      await expect(cards.first()).toHaveClass(/selected/);
    }
    
    console.log('✅ Mobile optimized layout works!');
  });

  test('should handle empty states gracefully', async ({ page }) => {
    // Mock empty API response
    await page.route('**/api/openai/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              content: JSON.stringify([])
            }
          }]
        })
      });
    });

    await page.goto('/create-plan');
    await page.selectOption('select[name="city"]', 'Seattle');
    await page.fill('textarea[name="vibe"]', 'test empty state');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/results');
    
    // Should show empty state message
    await expect(page.locator('text=No recommendations yet')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Try a different vibe')).toBeVisible();
    
    console.log('✅ Empty state handling works!');
  });
}); 