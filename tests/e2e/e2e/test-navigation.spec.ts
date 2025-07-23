import { test, expect } from '@playwright/test';

test('debug navigation structure', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Debug: Log all links on the page
  const links = await page.locator('a').all();
  console.log(`Found ${links.length} links on the page`);
  
  for (let i = 0; i < Math.min(links.length, 10); i++) {
    const link = links[i];
    const href = await link.getAttribute('href');
    const text = await link.textContent();
    console.log(`Link ${i}: "${text}" -> ${href}`);
  }
  
  // Check if specific navigation exists
  const aboutLink = page.locator('a[href="/about"]');
  const aboutExists = await aboutLink.count();
  console.log(`About link exists: ${aboutExists > 0}`);
  
  if (aboutExists > 0) {
    await aboutLink.click();
    await page.waitForTimeout(1000);
    console.log(`Current URL after clicking: ${page.url()}`);
  }
  
  // Check for any navigation menu
  const nav = page.locator('nav');
  const navExists = await nav.count();
  console.log(`Navigation element exists: ${navExists > 0}`);
  
  if (navExists > 0) {
    const navLinks = await nav.locator('a').all();
    console.log(`Navigation has ${navLinks.length} links`);
  }
}); 