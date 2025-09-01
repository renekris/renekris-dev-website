const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Inject performance measuring script
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
          });
          
          // Get Cumulative Layout Shift
          let cls = 0;
          new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            });
            vitals.CLS = cls;
          }).observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => resolve(vitals), 1000);
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      });
    });
    
    console.log('Core Web Vitals:', metrics);
    
    // Assert reasonable performance thresholds
    if (metrics.FCP) {
      expect(metrics.FCP).toBeLessThan(2000); // FCP < 2s
    }
    if (metrics.LCP) {
      expect(metrics.LCP).toBeLessThan(4000); // LCP < 4s  
    }
    if (metrics.CLS !== undefined) {
      expect(metrics.CLS).toBeLessThan(0.25); // CLS < 0.25
    }
  });

  test('all external links should be accessible', async ({ page, context }) => {
    await page.goto('/');
    
    // Get all external links
    const externalLinks = await page.locator('a[href^="http"]').all();
    
    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      console.log(`Testing link: ${href}`);
      
      // Create new page to test link
      const newPage = await context.newPage();
      
      try {
        const response = await newPage.goto(href, { timeout: 10000 });
        expect(response.status()).toBeLessThan(400);
      } catch (error) {
        console.warn(`Link ${href} failed: ${error.message}`);
        // Don't fail test for external links that might be temporarily unavailable
      } finally {
        await newPage.close();
      }
    }
  });

  test('images should load efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Check for any images (though current site is mostly CSS/text)
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      const naturalHeight = await img.evaluate(el => el.naturalHeight);
      
      console.log(`Image ${src}: ${naturalWidth}x${naturalHeight}`);
      
      // Ensure images actually loaded
      expect(naturalWidth).toBeGreaterThan(0);
      expect(naturalHeight).toBeGreaterThan(0);
    }
  });

  test('CSS animations should be smooth', async ({ page }) => {
    await page.goto('/');
    
    // Test the status dot animation
    const statusDot = page.locator('.status-dot').first();
    
    // Check that animation is running
    const animationName = await statusDot.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.animationName;
    });
    
    expect(animationName).toBe('pulse');
    
    // Check animation duration
    const animationDuration = await statusDot.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.animationDuration;
    });
    
    expect(animationDuration).toBe('2s');
  });
});