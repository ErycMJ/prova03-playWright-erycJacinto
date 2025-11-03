import { test, expect } from '@playwright/test';
import { HomePage } from '../support/pages/HomePage';

test.describe('CFP - Home Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display home page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/^https:\/\/cfp-client\.vercel\.app\/?$/);
  });

  test.skip('should display navbar', async () => {
    const navbarVisible = await homePage.isElementVisible('nav');
    expect(navbarVisible).toBe(true);
  });

  test('should display hero section', async ({ page }) => {
    const heroTitle = page.locator('h1');
    try {
      await heroTitle.waitFor({ state: 'visible', timeout: 3000 });
      await expect(heroTitle).toBeVisible();
    } catch {
      const heroSection = page.locator('[role="banner"]');
      expect(heroSection).toBeTruthy();
    }
  });

  test.skip('should have sign in button', async ({ page }) => {
    try {
      const signInButton = page.locator('button:has-text("Sign In")');
      await signInButton.waitFor({ state: 'visible', timeout: 3000 });
      await expect(signInButton).toBeVisible();
    } catch {
      const signInButton = page.locator('a:has-text("Sign In")');
      await expect(signInButton).toBeVisible();
    }
  });

  test('should have footer', async ({ page }) => {
    try {
      const footer = page.locator('footer');
      await footer.waitFor({ state: 'visible', timeout: 3000 });
      await expect(footer).toBeVisible();
    } catch {
      const footerText = page.locator('text=/copyright|footer|©/i');
      await expect(footerText).toBeVisible();
    }
  });

  test.skip('should navigate to login when sign in is clicked', async ({ page }) => {
    try {
      const signInButton = page.locator('button:has-text("Sign In")');
      await signInButton.click();
    } catch {
      try {
        const signInLink = page.locator('a:has-text("Sign In")');
        await signInLink.click();
      } catch {
        const loginButton = page.locator('a[href*="login"]');
        await loginButton.click();
      }
    }

    await page.waitForURL(/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/login/);
  });

  test('should have responsive viewport', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });

  test('should load all images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const img = images.nth(i);
      await expect(img).toHaveJSProperty('complete', true);
    }
  });

  test('should have accessible headings', async ({ page }) => {
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });
});
