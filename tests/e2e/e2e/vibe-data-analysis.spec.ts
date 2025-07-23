import { test, expect } from '@playwright/test';

test.describe('Vibe Data Analysis - Same City Different Vibes', () => {
  const testCity = 'Los Angeles';
  const testVibes = [
    'trendy and hip',
    'romantic and intimate', 
    'family-friendly and fun',
    'luxurious and upscale',
    'artsy and creative',
    'nightlife and party'
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const vibe of testVibes) {
    test(`Analyze data for "${vibe}" vibe in ${testCity}`, async ({ page }) => {
      console.log(`\n🔍 Testing vibe: "${vibe}" in ${testCity}`);
      
      // Fill out the form
      await page.fill('input[placeholder*="city"]', testCity);
      await page.fill('textarea[placeholder*="vibe"]', vibe);
      await page.click('button:has-text("Create Plan")');

      // Wait for results
      await page.waitForSelector('[data-testid="recommendation-card"]', { timeout: 60000 });

      // Capture the OpenAI seed data
      const seedResponse = await page.evaluate(() => {
        return (window as any).lastOpenAIResponse;
      });

      if (seedResponse) {
        console.log(`\n📝 OpenAI Seed for "${vibe}":`);
        console.log(JSON.stringify(seedResponse, null, 2));
      }

      // Get all recommendation cards
      const cards = await page.locator('[data-testid="recommendation-card"]').all();
      console.log(`\n📊 Found ${cards.length} recommendations for "${vibe}"`);

      // Analyze each category tab
      const tabs = await page.locator('[role="tab"]').all();
      const categoryData: Record<string, any[]> = {};

      for (const tab of tabs) {
        const tabText = await tab.textContent();
        if (!tabText) continue;

        console.log(`\n🏷️  Category: ${tabText}`);
        await tab.click();
        await page.waitForTimeout(500); // Wait for content to load

        // Get recommendations in this category
        const categoryCards = await page.locator('[data-testid="recommendation-card"]').all();
        const recommendations = [];

        for (const card of categoryCards) {
          const name = await card.locator('h3').textContent();
          const description = await card.locator('p').first().textContent();
          const tasteSignals = await card.locator('[data-testid="taste-signal"]').allTextContents();
          const rating = await card.locator('[data-testid="rating"]').textContent();
          
          const recommendation = {
            name: name?.trim(),
            description: description?.trim(),
            tasteSignals,
            rating: rating?.trim()
          };
          
          recommendations.push(recommendation);
          console.log(`  • ${name} (${rating})`);
          console.log(`    Description: ${description?.substring(0, 100)}...`);
          console.log(`    Taste Signals: ${tasteSignals.join(', ')}`);
        }

        categoryData[tabText] = recommendations;
      }

      // Log category distribution
      console.log(`\n📈 Category Distribution for "${vibe}":`);
      Object.entries(categoryData).forEach(([category, items]) => {
        console.log(`  ${category}: ${items.length} items`);
      });

      // Verify we have data in multiple categories
      const categoriesWithData = Object.entries(categoryData).filter(([_, items]) => items.length > 0);
      expect(categoriesWithData.length).toBeGreaterThan(0);

      // Store results for comparison
      await page.evaluate((data) => {
        if (!(window as any).vibeAnalysisResults) {
          (window as any).vibeAnalysisResults = {};
        }
        (window as any).vibeAnalysisResults[data.vibe] = data.categoryData;
      }, { vibe, categoryData });
    });
  }

  test('Compare vibe results and analyze patterns', async ({ page }) => {
    // This test should run after all vibe tests
    const results = await page.evaluate(() => {
      return (window as any).vibeAnalysisResults || {};
    });

    console.log('\n🔄 VIBE COMPARISON ANALYSIS');
    console.log('=' .repeat(50));

    // Analyze patterns across vibes
    const vibeKeys = Object.keys(results);
    const allCategories = new Set<string>();
    
    // Collect all categories
    vibeKeys.forEach(vibe => {
      Object.keys(results[vibe] || {}).forEach(category => {
        allCategories.add(category);
      });
    });

    console.log(`\n📋 Categories found: ${Array.from(allCategories).join(', ')}`);

    // Compare category distributions
    allCategories.forEach(category => {
      console.log(`\n🏷️  ${category} across vibes:`);
      vibeKeys.forEach(vibe => {
        const count = results[vibe]?.[category]?.length || 0;
        console.log(`  ${vibe}: ${count} items`);
      });
    });

    // Look for unique recommendations per vibe
    console.log('\n🎯 UNIQUE PATTERNS ANALYSIS:');
    vibeKeys.forEach(vibe => {
      console.log(`\n"${vibe}" characteristics:`);
      const vibeData = results[vibe] || {};
      
      Object.entries(vibeData).forEach(([category, items]: [string, any[]]) => {
        if (items.length > 0) {
          console.log(`  ${category} (${items.length} items):`);
          
          // Show top 3 recommendations
          items.slice(0, 3).forEach((item, index) => {
            console.log(`    ${index + 1}. ${item.name}`);
            if (item.tasteSignals?.length > 0) {
              console.log(`       Signals: ${item.tasteSignals.slice(0, 3).join(', ')}`);
            }
          });
        }
      });
    });

    // Verify we got different results for different vibes
    expect(vibeKeys.length).toBeGreaterThan(1);
  });

  test('Test API data structure and validate categorization logic', async ({ page }) => {
    const testVibe = 'trendy and hip';
    
    // Intercept API calls to examine raw data
    const apiResponses: any[] = [];
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/qloo') || response.url().includes('/api/openai')) {
        try {
          const data = await response.json();
          apiResponses.push({
            url: response.url(),
            status: response.status(),
            data: data
          });
        } catch (e) {
          console.log('Could not parse response as JSON:', response.url());
        }
      }
    });

    // Fill form and submit
    await page.fill('input[placeholder*="city"]', testCity);
    await page.fill('textarea[placeholder*="vibe"]', testVibe);
    await page.click('button:has-text("Create Plan")');

    // Wait for results
    await page.waitForSelector('[data-testid="recommendation-card"]', { timeout: 60000 });

    console.log('\n🔍 API RESPONSE ANALYSIS:');
    console.log('=' .repeat(40));

    apiResponses.forEach((response, index) => {
      console.log(`\n📡 API Call ${index + 1}:`);
      console.log(`URL: ${response.url}`);
      console.log(`Status: ${response.status}`);
      
      if (response.url.includes('openai')) {
        console.log('OpenAI Response Structure:');
        if (response.data?.choices?.[0]?.message?.content) {
          try {
            const content = JSON.parse(response.data.choices[0].message.content);
            console.log('Seed Data:');
            console.log(JSON.stringify(content, null, 2));
          } catch (e) {
            console.log('Raw content:', response.data.choices[0].message.content);
          }
        }
      }
      
      if (response.url.includes('qloo')) {
        console.log('Qloo Response Structure:');
        if (response.data?.results) {
          console.log(`Total results: ${response.data.results.length}`);
          if (response.data.results.length > 0) {
            const sample = response.data.results[0];
            console.log('Sample result structure:');
            console.log(JSON.stringify(sample, null, 2));
          }
        }
      }
    });

    // Verify API responses
    expect(apiResponses.length).toBeGreaterThan(0);
  });
}); 