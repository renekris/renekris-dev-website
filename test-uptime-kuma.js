const { chromium } = require('playwright');

async function testUptimeKumaIntegration() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('Testing Uptime Kuma integration...');
    
    // Navigate to staging site
    await page.goto('http://192.168.1.235:8080');
    
    // Wait for the page to load and status checks to run
    await page.waitForTimeout(5000);
    
    // Listen to console logs to see status check output
    page.on('console', msg => {
        console.log('Browser console:', msg.text());
    });
    
    // Check if status dots are present
    const statusDots = await page.locator('.status-dot').count();
    console.log(`Found ${statusDots} status indicators`);
    
    // Check if any status indicators show as online (green)
    const onlineIndicators = await page.locator('.status-dot[style*="background: rgb(0, 255, 136)"]').count();
    console.log(`${onlineIndicators} services showing as online`);
    
    // Try to trigger manual refresh
    await page.evaluate(() => {
        if (window.checkServices) {
            console.log('Triggering manual status check...');
            window.checkServices();
        } else {
            console.log('checkServices function not available');
        }
    });
    
    await page.waitForTimeout(3000);
    
    // Check final status
    const finalOnlineIndicators = await page.locator('.status-dot[style*="background: rgb(0, 255, 136)"]').count();
    console.log(`Final count: ${finalOnlineIndicators} services online`);
    
    console.log('Test completed!');
    
    await browser.close();
}

testUptimeKumaIntegration().catch(console.error);