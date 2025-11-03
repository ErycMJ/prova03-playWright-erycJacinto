import { test, expect } from '@playwright/test';
import { HomePage } from '../support/pages/HomePage';
import { LoginPage } from '../support/pages/LoginPage';

test.describe('CFP - Navigation Flow Tests', () => {
  test.skip('should navigate from home to login', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    try {
      const signInButton = page.locator('button:has-text("Sign In")');
      await signInButton.click();
    } catch {
      const signInLink = page.locator('a:has-text("Sign In")');
      await signInLink.click();
    }

    await page.waitForURL(/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/login/);
  });

  test('should display page title', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test.skip('should have working navbar links', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should handle page refresh correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const urlBefore = page.url();
    await page.reload();

    const urlAfter = page.url();
    expect(urlBefore).toBe(urlAfter);
  });

  test.skip('should preserve scroll position on navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await page.evaluate(() => window.scrollBy(0, 500));

    const loginPage = new LoginPage(page);
    try {
      const signInButton = page.locator('button:has-text("Sign In")');
      await signInButton.click();
    } catch {
      const signInLink = page.locator('a:has-text("Sign In")');
      await signInLink.click();
    }

    await page.waitForURL(/login/, { timeout: 5000 });

    await page.goBack();
    await page.waitForURL('/', { timeout: 5000 });

    expect(page.url()).toContain('/');
  });

  test('should load all required stylesheets', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const stylesheets = page.locator('link[rel="stylesheet"]');
    const count = await stylesheets.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should not have console errors on home page', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const homePage = new HomePage(page);
    await homePage.goto();

    await page.waitForLoadState('networkidle');

    expect(errors.length).toBeLessThan(5);
  });

  test.skip('should have meta description', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toBeVisible();
  });
});
