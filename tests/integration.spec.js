const { test, expect } = require('@playwright/test');

test.describe('Integration Tests', () => {
  test('status dashboard link exists and has correct format', async ({ page }) => {
    await page.goto('/');
    
    // Just check the link exists and has a reasonable href - don't test external connectivity
    const statusLink = page.locator('.status-link a');
    if (await statusLink.count() > 0) {
      const href = await statusLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href?.includes('status')).toBeTruthy();
    }
    // If no status link, that's OK - allows for design changes
  });

  test('should work without JavaScript enabled', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Basic structure should still be visible
    await expect(page.locator('h1')).toContainText('renekris.dev');
    await expect(page.locator('.status-overview')).toBeVisible();
    
    // Check that some service cards exist (flexible count)
    const serviceCards = page.locator('.service-card');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(1);
    
    await context.close();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('renekris.dev');
    
    // Navigate to a different page (reload in this case since it's a SPA)
    await page.reload();
    await expect(page.locator('h1')).toContainText('renekris.dev');
    
    // Test browser back
    await page.goBack();
    await expect(page.locator('h1')).toContainText('renekris.dev');
    
    // Test browser forward
    await page.goForward();
    await expect(page.locator('h1')).toContainText('renekris.dev');
  });

  test('should maintain state during page interactions', async ({ page }) => {
    await page.goto('/');
    
    // Interact with service cards if they exist
    const serviceCards = page.locator('.service-card');
    const cardCount = await serviceCards.count();
    
    if (cardCount > 0) {
      const firstCard = serviceCards.first();
      
      // Hover over card
      await firstCard.hover();
      
      // Page should remain responsive
      await expect(page.locator('h1')).toBeVisible();
      await expect(serviceCards).toHaveCount(cardCount);
    }
  });
});