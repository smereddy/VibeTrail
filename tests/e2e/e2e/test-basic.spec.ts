import { test, expect } from '@playwright/test';

test('basic home page test', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Check if the page loads
  await expect(page).toHaveTitle(/vibetrail/i);
  
  // Check if main content is visible
  await expect(page.locator('body')).toBeVisible();
  
  console.log('✅ Basic page test passed!');
}); 