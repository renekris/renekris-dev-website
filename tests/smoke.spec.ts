import { test, expect } from '@playwright/test'
import { site } from '../src/content/site'

test.describe('Homepage Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero section renders with name, role, and tech badges', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section')
    await expect(heroSection).toBeVisible()

    const heroName = page.getByTestId('hero-name')
    await expect(heroName).toBeVisible()
    await expect(heroName).toContainText(site.hero.name)

    const heroRole = page.locator('.hero-role')
    await expect(heroRole).toBeVisible()
    await expect(heroRole).toContainText(site.hero.role)

    const techBadges = page.locator('.hero-tech-badge')
    await expect(techBadges).toHaveCount(site.hero.techStack.length)

    for (const tech of site.hero.techStack) {
      await expect(page.locator('.hero-tech-stack')).toContainText(tech)
    }
  })

  test('theme toggle persists across page reloads', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').locator('visible=true')
    await expect(themeToggle).toBeVisible()

    const initialTheme = await page.evaluate(() => {
      return localStorage.getItem('theme-preference')
    })

    await themeToggle.click()
    await page.waitForTimeout(100)

    const themeAfterFirstClick = await page.evaluate(() => {
      return localStorage.getItem('theme-preference')
    })
    expect(themeAfterFirstClick).not.toBe(initialTheme)

    await page.reload()
    await page.waitForLoadState('networkidle')

    const themeAfterReload = await page.evaluate(() => {
      return localStorage.getItem('theme-preference')
    })
    expect(themeAfterReload).toBe(themeAfterFirstClick)
  })

  test('resume download link is available and points to valid file', async ({ page, request }) => {
    const resumeLink = page.getByTestId('resume-download')
    await expect(resumeLink).toBeVisible()
    await expect(resumeLink).toContainText(site.resume.buttonText)

    const href = await resumeLink.getAttribute('href')
    expect(href).toBe(site.resume.path)

    const response = await request.get(href!)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
  })

  test('contact links are present and have correct destinations', async ({ page }) => {
    const contactSection = page.getByTestId('contact-section')
    await expect(contactSection).toBeVisible()

    const emailLink = page.getByTestId('contact-email')
    await expect(emailLink).toBeVisible()
    const emailHref = await emailLink.getAttribute('href')
    expect(emailHref).toBe(`mailto:${site.contact.email}`)

    const linkedinLink = page.getByTestId('contact-linkedin')
    await expect(linkedinLink).toBeVisible()
    const linkedinHref = await linkedinLink.getAttribute('href')
    expect(linkedinHref).toBe(site.contact.linkedin)
    await expect(linkedinLink).toHaveAttribute('target', '_blank')
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')

    const githubLink = page.getByTestId('contact-github')
    await expect(githubLink).toBeVisible()
    const githubHref = await githubLink.getAttribute('href')
    expect(githubHref).toBe(site.contact.github)
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')

    await expect(page.getByTestId('contact-phone')).toHaveCount(0)
  })

  test('SEO metadata is present and correct', async ({ page }) => {
    await expect(page).toHaveTitle(site.seo.title)

    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', site.seo.description)

    const keywords = page.locator('meta[name="keywords"]')
    await expect(keywords).toHaveAttribute('content', site.seo.keywords)

    const author = page.locator('meta[name="author"]')
    await expect(author).toHaveAttribute('content', site.seo.author)

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', site.seo.canonical)

    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', site.seo.title)

    const ogDescription = page.locator('meta[property="og:description"]')
    await expect(ogDescription).toHaveAttribute('content', site.seo.description)

    const ogUrl = page.locator('meta[property="og:url"]')
    await expect(ogUrl).toHaveAttribute('content', site.seo.canonical)

    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute('content', site.seo.twitterCard)
  })

  test('JSON-LD structured data is present', async ({ page }) => {
    const jsonLdScripts = page.locator('script[type="application/ld+json"]')
    const count = await jsonLdScripts.count()
    expect(count).toBeGreaterThanOrEqual(3)

    const personSchema = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of scripts) {
        const data = JSON.parse(script.textContent || '{}')
        if (data['@type'] === 'Person') return data
      }
      return null
    })

    expect(personSchema).not.toBeNull()
    expect(personSchema.name).toBe(site.hero.name)
    expect(personSchema.jobTitle).toBe(site.structuredData.jobTitles[0])
    expect(personSchema.email).toBe(site.contact.email)
    expect(personSchema.telephone).toBeUndefined()

    const websiteSchema = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of scripts) {
        const data = JSON.parse(script.textContent || '{}')
        if (data['@type'] === 'WebSite') return data
      }
      return null
    })

    expect(websiteSchema).not.toBeNull()
    expect(websiteSchema.url).toBe(site.seo.canonical)
  })
})

test.describe('Mobile Responsive Tests', () => {
  test('mobile viewport renders hero section without layout issues', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const heroSection = page.getByTestId('hero-section')
    await expect(heroSection).toBeVisible()

    const heroName = page.getByTestId('hero-name')
    await expect(heroName).toBeVisible()

    const box = await heroName.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeLessThanOrEqual(375)

    const techBadges = page.locator('.hero-tech-badge')
    await expect(techBadges).toHaveCount(site.hero.techStack.length)

    const contactSection = page.getByTestId('contact-section')
    await expect(contactSection).toBeVisible()

    const resumeLink = page.getByTestId('resume-download')
    await expect(resumeLink).toBeVisible()
  })
})
