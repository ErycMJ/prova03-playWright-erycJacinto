import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/^https:\/\/cfp-client\.vercel\.app/);
  });

  test('should have main content', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should navigate to home page', async ({ page }) => {
    const url = page.url();
    expect(url).toContain('cfp-client.vercel.app');
  });
});
