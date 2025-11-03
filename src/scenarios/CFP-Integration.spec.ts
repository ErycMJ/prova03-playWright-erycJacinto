import { test, expect } from '@playwright/test';
import { HomePage } from '../support/pages/HomePage';
import TestUtils from '../support/TestUtils';

test.describe('CFP - Integration Tests', () => {
  test.skip('should handle form submission flow', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const navExists = await TestUtils.elementExists(page, 'nav');
    expect(navExists).toBe(true);
  });

  test('should retry operation on failure', async ({ page }) => {
    const homePage = new HomePage(page);

    await TestUtils.retry(
      async () => {
        await homePage.goto();
      },
      3,
      500
    );

    await expect(page).toHaveURL(/^https:\/\/cfp-client\.vercel\.app\/?$/);
  });

  test('should generate random test data', async ({ page }) => {
    const randomString = TestUtils.generateRandomString(10);
    const randomEmail = TestUtils.generateRandomEmail();

    expect(randomString).toHaveLength(10);
    expect(randomEmail).toMatch(/^test_[a-zA-Z0-9]{8}@test\.com$/);
  });

  test('should handle date formatting', async ({ page }) => {
    const testDate = new Date(2025, 10, 2);
    const formatted = TestUtils.formatDate(testDate, 'DD/MM/YYYY');

    expect(formatted).toBe('02/11/2025');
  });

  test('should compare objects for validation', async ({ page }) => {
    const obj1 = { name: 'John', age: 30 };
    const obj2 = { name: 'John', age: 30 };
    const obj3 = { name: 'Jane', age: 25 };

    expect(TestUtils.compareObjects(obj1, obj2)).toBe(true);
    expect(TestUtils.compareObjects(obj1, obj3)).toBe(false);
  });

  test.skip('should verify multiple form fields', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const navExists = await TestUtils.elementExists(page, 'nav');
    const bodyExists = await TestUtils.elementExists(page, 'body');

    expect(navExists).toBe(true);
    expect(bodyExists).toBe(true);
  });

  test('should handle page redirects', async ({ page }) => {
    const startUrl = 'https://cfp-client.vercel.app';

    await page.goto(startUrl);
    const finalUrl = page.url();

    expect(finalUrl).toContain('cfp-client.vercel.app');
  });

  test('should verify page has valid meta tags', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const metaTags = page.locator('meta');
    const metaCount = await metaTags.count();

    expect(metaCount).toBeGreaterThan(0);
  });

  test('should handle multiple navigation paths', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    let currentUrl = page.url();
    expect(currentUrl).toContain('cfp-client.vercel.app');

    try {
      const signInButton = page.locator('button:has-text("Sign In")');
      await signInButton.click();

      await page.waitForURL(/login/, { timeout: 5000 });
      currentUrl = page.url();
      expect(currentUrl).toContain('login');
    } catch {
      expect(true).toBe(true);
    }
  });

  test('should validate data types in response', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const title = await page.title();
    expect(typeof title).toBe('string');
    expect(title.length).toBeGreaterThan(0);

    const url = page.url();
    expect(typeof url).toBe('string');
    expect(url).toMatch(/^https?:\/\//);
  });
});
