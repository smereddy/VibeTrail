import { test, expect } from '@playwright/test';

test.describe('VibeTrail Working Navigation', () => {
  test('should navigate to create plan page', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to create plan
    await page.click('a[href="/create-plan"]');
    await expect(page).toHaveURL('/create-plan');
    
    // Verify we're on the create plan page
    await expect(page.locator('h1')).toBeVisible();
    
    console.log('✅ Create plan navigation works!');
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/create-plan');
    
    // Navigate back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    
    console.log('✅ Home navigation works!');
  });

  test('should handle anchor navigation within home page', async ({ page }) => {
    await page.goto('/');
    
    // Test anchor navigation (these stay on same page but change hash)
    const anchorLinks = [
      { text: 'How it works', hash: '#how-it-works' },
      { text: 'Pricing', hash: '#pricing' },
      { text: 'Blog', hash: '#blog' }
    ];
    
    for (const link of anchorLinks) {
      await page.click(`text=${link.text}`);
      await page.waitForTimeout(500); // Wait for scroll animation
      
      // Check that we're still on home page with the correct hash
      expect(page.url()).toContain(link.hash);
      console.log(`✅ Anchor navigation to ${link.text} works!`);
    }
  });

  test('should work on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Test mobile navigation
    await page.click('a[href="/create-plan"]');
    await expect(page).toHaveURL('/create-plan');
    
    console.log('✅ Mobile navigation works!');
  });
}); 