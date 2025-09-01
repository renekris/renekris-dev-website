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
    await expect(page.locator('.tagline')).toContainText('Full-Stack Developer & Infrastructure Engineer');
  });

  test('should show system status section', async ({ page }) => {
    await expect(page.locator('.status-overview')).toBeVisible();
    await expect(page.locator('h2')).toContainText('System Status');
  });

  test('should display all status indicators', async ({ page }) => {
    const statusItems = page.locator('.status-item');
    await expect(statusItems).toHaveCount(4);
    
    // Check each status indicator
    await expect(page.locator('.status-item', { hasText: 'Website' })).toBeVisible();
    await expect(page.locator('.status-item', { hasText: 'Minecraft' })).toBeVisible();
    await expect(page.locator('.status-item', { hasText: 'Tarkov SPT' })).toBeVisible();
    await expect(page.locator('.status-item', { hasText: 'Monitoring' })).toBeVisible();
  });

  test('should show all service cards', async ({ page }) => {
    const serviceCards = page.locator('.service-card');
    await expect(serviceCards).toHaveCount(6);
    
    // Check specific service cards exist
    await expect(page.locator('.service-card', { hasText: 'Portfolio Website' })).toBeVisible();
    await expect(page.locator('.service-card', { hasText: 'System Monitoring' })).toBeVisible();
    await expect(page.locator('.service-card', { hasText: 'Minecraft Server' })).toBeVisible();
    await expect(page.locator('.service-card', { hasText: 'Tarkov SPT' })).toBeVisible();
    await expect(page.locator('.service-card', { hasText: 'Management' })).toBeVisible();
    await expect(page.locator('.service-card', { hasText: 'Infrastructure' })).toBeVisible();
  });

  test('should have working status link', async ({ page }) => {
    const statusLink = page.locator('.status-link a');
    await expect(statusLink).toBeVisible();
    await expect(statusLink).toHaveAttribute('href', 'https://status.renekris.dev/status/services');
  });

  test('should display connection information', async ({ page }) => {
    // Check connection boxes are present
    const connectionBoxes = page.locator('.connection-box');
    await expect(connectionBoxes).toHaveCount(4); // 4 services have connection info
    
    // Check specific connection values
    await expect(page.locator('.connection-box .value', { hasText: 'status.renekris.dev' })).toBeVisible();
    await expect(page.locator('.connection-box .value', { hasText: 'renekris.dev' })).toBeVisible();
    await expect(page.locator('.connection-box .value', { hasText: 'https://tarkov.renekris.dev' })).toBeVisible();
    await expect(page.locator('.connection-box .value', { hasText: 'crafty.renekris.dev' })).toBeVisible();
  });

  test('should have proper footer information', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('© 2025 Renekris. Professional Infrastructure & Development.');
    await expect(footer).toContainText('Tech Stack: Docker • Caddy • Cloudflare • Proxmox • Ubuntu Server');
  });
});