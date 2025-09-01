const { test, expect } = require('@playwright/test');

test.describe('Integration Tests', () => {
  test('status dashboard link should be accessible', async ({ page, context }) => {
    await page.goto('/');
    
    const statusLink = page.locator('.status-link a');
    await expect(statusLink).toHaveAttribute('href', 'https://status.renekris.dev/status/services');
    
    // Test that the link can be opened (will open in new tab)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      statusLink.click({ modifiers: ['Meta'] }) // Cmd+Click or Ctrl+Click to open in new tab
    ]);
    
    // Wait for new page to load
    try {
      await newPage.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Should navigate to status page
      expect(newPage.url()).toContain('status.renekris.dev');
      
      // Basic check that it's the monitoring page
      const title = await newPage.title();
      expect(title).toBeTruthy();
      
    } catch (error) {
      console.warn('Status page may not be accessible:', error.message);
    } finally {
      await newPage.close();
    }
  });

  test('should handle network connectivity issues gracefully', async ({ page, context }) => {
    // Test with slow network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time even with network delay
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
    
    // Page should still be functional
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.status-overview')).toBeVisible();
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
    await expect(page.locator('.service-card')).toHaveCount(6);
    
    // Links should still work
    const statusLink = page.locator('.status-link a');
    await expect(statusLink).toHaveAttribute('href', 'https://status.renekris.dev/status/services');
    
    await context.close();
  });

  test('should handle different user agents', async ({ browser }) => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', // Chrome
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', // Safari
      'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0', // Firefox
    ];
    
    for (const userAgent of userAgents) {
      const context = await browser.newContext({
        userAgent: userAgent
      });
      const page = await context.newPage();
      
      await page.goto('/');
      
      // Should load properly regardless of user agent
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.service-card')).toHaveCount(6);
      
      await context.close();
    }
  });

  test('should work in different timezones', async ({ page }) => {
    // Test with different timezone
    await page.emulateTimezone('America/New_York');
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.status-overview')).toBeVisible();
    
    // Test with another timezone
    await page.emulateTimezone('Asia/Tokyo');
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.status-overview')).toBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('renekris.dev');
    
    // Navigate to a different page (if we had one) or reload
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
    
    // Interact with service cards
    const serviceCards = page.locator('.service-card');
    const firstCard = serviceCards.first();
    
    // Hover over card
    await firstCard.hover();
    
    // Check that hover state is applied
    const transform = await firstCard.evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    
    // Should have transform applied (hover effect)
    expect(transform).not.toBe('none');
    
    // Move away and check hover state is removed
    await page.locator('h1').hover();
    await page.waitForTimeout(500); // Wait for transition
    
    const transformAfter = await firstCard.evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    
    // Transform should be reset or different
    expect(transformAfter !== transform || transformAfter === 'none').toBeTruthy();
  });

  test('should handle concurrent user interactions', async ({ page }) => {
    await page.goto('/');
    
    // Simulate rapid interactions
    const promises = [];
    const serviceCards = await page.locator('.service-card').all();
    
    // Hover over multiple cards quickly
    for (let i = 0; i < Math.min(3, serviceCards.length); i++) {
      promises.push(serviceCards[i].hover());
      await page.waitForTimeout(50); // Small delay between hovers
    }
    
    await Promise.all(promises);
    
    // Page should still be responsive
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.service-card')).toHaveCount(6);
  });
});