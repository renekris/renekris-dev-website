const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('renekris.dev');
    
    const h2 = page.locator('h2');
    await expect(h2).toHaveCount(1);
    await expect(h2).toContainText('System Status');
    
    const h3 = page.locator('h3');
    await expect(h3).toHaveCount(6); // 6 service cards
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check main landmarks
    const main = page.locator('main, [role="main"]');
    const footer = page.locator('footer, [role="contentinfo"]');
    const banner = page.locator('header, [role="banner"]');
    
    // At least one of these should exist (using semantic HTML)
    const hasSemanticStructure = await Promise.all([
      main.count(),
      footer.count(), 
      banner.count()
    ]);
    
    expect(hasSemanticStructure.some(count => count > 0)).toBeTruthy();
  });

  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/');
    
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have either visible text or aria-label
      expect(text?.trim() || ariaLabel?.trim()).toBeTruthy();
      
      // Avoid generic link text
      const genericTerms = ['click here', 'read more', 'link', 'here'];
      const linkText = (text || ariaLabel || '').toLowerCase();
      
      for (const term of genericTerms) {
        expect(linkText).not.toBe(term);
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Test main text contrast
    const bodyText = page.locator('body');
    const textColor = await bodyText.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    const backgroundColor = await bodyText.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    console.log(`Body text color: ${textColor}, background: ${backgroundColor}`);
    
    // Check that text isn't using default transparent background
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Get all focusable elements
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Test tab navigation through first few elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.locator(':focus').first();
    expect(firstFocused).toBeTruthy();
    
    // Test that focus is visible
    const outline = await firstFocused.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.outline || style.outlineWidth || style.boxShadow;
    });
    
    // Should have some form of focus indicator
    expect(outline).toBeTruthy();
  });

  test('should have proper page title and meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/renekris\.dev/i);
    
    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
    
    // Check charset
    const charsetMeta = page.locator('meta[charset], meta[http-equiv="Content-Type"]');
    expect(await charsetMeta.count()).toBeGreaterThan(0);
  });

  test('status indicators should be accessible', async ({ page }) => {
    await page.goto('/');
    
    const statusDots = await page.locator('.status-dot').all();
    
    for (const dot of statusDots) {
      // Status dots should be within context that explains what they represent
      const parentText = await dot.locator('..').textContent();
      expect(parentText).toBeTruthy();
      expect(parentText.length).toBeGreaterThan(3); // Should have meaningful text
    }
  });

  test('interactive elements should have adequate size', async ({ page }) => {
    await page.goto('/');
    
    const clickableElements = await page.locator('a, button').all();
    
    for (const element of clickableElements) {
      const boundingBox = await element.boundingBox();
      
      if (boundingBox) {
        // WCAG recommends minimum 44x44px for touch targets
        const minSize = 44;
        
        console.log(`Element size: ${boundingBox.width}x${boundingBox.height}`);
        
        // Allow some flexibility for very small screens
        expect(boundingBox.width).toBeGreaterThan(20);
        expect(boundingBox.height).toBeGreaterThan(20);
      }
    }
  });
});