const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test('homepage desktop visual test', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all animations to complete
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('homepage mobile visual test', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12 size
    await page.goto('/');
    
    // Wait for responsive layout to adjust
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('homepage tablet visual test', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 }); // iPad size
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('status section visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Screenshot just the status section
    const statusSection = page.locator('.status-overview');
    await expect(statusSection).toHaveScreenshot('status-section.png');
  });

  test('service cards visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Screenshot the services grid
    const servicesSection = page.locator('.services');
    await expect(servicesSection).toHaveScreenshot('services-section.png');
  });

  test('hover states visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Hover over a service card
    const firstServiceCard = page.locator('.service-card').first();
    await firstServiceCard.hover();
    
    // Wait for hover animation
    await page.waitForTimeout(500);
    
    await expect(firstServiceCard).toHaveScreenshot('service-card-hover.png');
  });
});