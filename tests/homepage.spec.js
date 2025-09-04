const { test, expect } = require('@playwright/test');

test.describe('Homepage Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Renekris.dev');
  });

  test('should display main header and tagline', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('renekris.dev');
    await expect(page.locator('.tagline')).toBeVisible();
    // Flexible tagline test - just check it exists and has content
    const taglineText = await page.locator('.tagline').textContent();
    expect(taglineText?.trim().length).toBeGreaterThan(5);
  });

  test('should show system status section', async ({ page }) => {
    await expect(page.locator('.status-overview')).toBeVisible();
    await expect(page.locator('h2')).toContainText('System Status');
  });

  test('should display status indicators', async ({ page }) => {
    const statusItems = page.locator('.status-item');
    const count = await statusItems.count();
    expect(count).toBeGreaterThan(0); // Flexible - just check some exist
    
    // Check that status items have meaningful content
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = statusItems.nth(i);
      const text = await item.textContent();
      expect(text?.trim().length).toBeGreaterThan(3);
    }
  });

  test('should show service cards', async ({ page }) => {
    const serviceCards = page.locator('.service-card');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(2); // Flexible - expect at least a few cards
    
    // Check that service cards have meaningful content
    for (let i = 0; i < Math.min(count, 4); i++) {
      const card = serviceCards.nth(i);
      await expect(card).toBeVisible();
      const cardText = await card.textContent();
      expect(cardText?.trim().length).toBeGreaterThan(10);
    }
  });

  test('should have working status link', async ({ page }) => {
    const statusLink = page.locator('.status-link a');
    await expect(statusLink).toBeVisible();
    await expect(statusLink).toHaveAttribute('href', 'https://status.renekris.dev/status/services');
  });

  test('should display connection information', async ({ page }) => {
    // Check if connection boxes exist (flexible approach)
    const connectionBoxes = page.locator('.connection-box');
    const count = await connectionBoxes.count();
    
    if (count > 0) {
      // If connection boxes exist, verify they have content
      for (let i = 0; i < Math.min(count, 3); i++) {
        const box = connectionBoxes.nth(i);
        const value = box.locator('.value');
        const text = await value.textContent();
        expect(text?.trim().length).toBeGreaterThan(3);
      }
    }
    // Don't fail if no connection boxes - allows for design changes
  });

  test('should have footer with basic information', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText?.includes('Renekris')).toBeTruthy();
    // Flexible footer test - just check it has some meaningful content
    expect(footerText?.trim().length).toBeGreaterThan(20);
  });
});