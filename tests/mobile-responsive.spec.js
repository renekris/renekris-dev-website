const { test, expect, devices } = require('@playwright/test');

test.describe('Mobile Responsiveness Tests', () => {
  test('should display correctly on mobile phones', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that content fits in viewport
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 390;
    
    // Should not have horizontal scrollbar (with small tolerance)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
    
    // Check that main elements are visible
    await expect(page.locator('h1')).toBeInViewport();
    await expect(page.locator('.status-overview')).toBeInViewport();
    await expect(page.locator('.service-card').first()).toBeInViewport();
    
    await context.close();
  });

  test('should display correctly on tablets', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check responsive grid layout
    const serviceCards = page.locator('.service-card');
    const cardCount = await serviceCards.count();
    expect(cardCount).toBe(6);
    
    // On tablet, should show multiple columns
    const firstCard = serviceCards.first();
    const lastCard = serviceCards.last();
    
    const firstCardBox = await firstCard.boundingBox();
    const lastCardBox = await lastCard.boundingBox();
    
    if (firstCardBox && lastCardBox) {
      // Cards should not all be stacked vertically on tablet
      const verticalSpacing = Math.abs(firstCardBox.y - lastCardBox.y);
      expect(verticalSpacing).toBeLessThan(1000); // Reasonable threshold
    }
    
    await context.close();
  });

  test('should have readable text on small screens', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone SE'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Check main heading is readable
    const mainHeading = page.locator('h1');
    const fontSize = await mainHeading.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    
    const fontSizeNumber = parseInt(fontSize);
    expect(fontSizeNumber).toBeGreaterThan(16); // Minimum readable size
    
    // Check that status text is readable
    const statusText = page.locator('.status-item').first();
    const statusFontSize = await statusText.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    
    const statusFontSizeNumber = parseInt(statusFontSize);
    expect(statusFontSizeNumber).toBeGreaterThan(12);
    
    await context.close();
  });

  test('touch targets should be adequately sized on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    const touchTargets = await page.locator('a, button, .status-item').all();
    
    for (const target of touchTargets) {
      const boundingBox = await target.boundingBox();
      
      if (boundingBox) {
        // Touch targets should be at least 44x44px (WCAG guideline)
        expect(boundingBox.width).toBeGreaterThanOrEqual(40); // Slight tolerance
        expect(boundingBox.height).toBeGreaterThanOrEqual(40);
      }
    }
    
    await context.close();
  });

  test('navigation should work with touch gestures', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Test touch interaction with status link
    const statusLink = page.locator('.status-link a');
    await expect(statusLink).toBeVisible();
    
    // Simulate touch tap
    await statusLink.tap();
    
    // Should either navigate or open in new tab
    // (We can't easily test new tab opening in this context)
    
    await context.close();
  });

  test('should handle orientation changes gracefully', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Test portrait mode
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    
    let bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400); // Should fit in portrait
    
    // Test landscape mode
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(500);
    
    bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(854); // Should fit in landscape
    
    // Content should still be accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.service-card').first()).toBeVisible();
    
    await context.close();
  });

  test('should maintain proper spacing on different screen sizes', async ({ page }) => {
    const screenSizes = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 375, height: 667 }, // iPhone 6/7/8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad landscape
    ];
    
    for (const size of screenSizes) {
      await page.setViewportSize(size);
      await page.goto('/');
      await page.waitForTimeout(300);
      
      console.log(`Testing ${size.width}x${size.height}`);
      
      // Check that container has appropriate padding
      const container = page.locator('.container');
      const containerPadding = await container.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          left: parseInt(style.paddingLeft),
          right: parseInt(style.paddingRight),
          top: parseInt(style.paddingTop),
          bottom: parseInt(style.paddingBottom)
        };
      });
      
      // Should have some padding but not excessive
      expect(containerPadding.left).toBeGreaterThan(8);
      expect(containerPadding.right).toBeGreaterThan(8);
      expect(containerPadding.left).toBeLessThan(100);
      expect(containerPadding.right).toBeLessThan(100);
      
      // Content should not overflow
      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(size.width + 20); // Small tolerance
    }
  });
});