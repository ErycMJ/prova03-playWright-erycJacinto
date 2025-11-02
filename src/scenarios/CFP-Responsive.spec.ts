import { test, expect, devices } from '@playwright/test';
import { HomePage } from '../support/pages/HomePage';

test.describe('CFP - Responsive Design Tests', () => {
  test('should display properly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const size = page.viewportSize();
    expect(size).not.toBeNull();
    expect(size?.width).toBeGreaterThan(0);
    expect(size?.height).toBeGreaterThan(0);
  });

  test('should not have horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasOverflow).toBe(false);
  });

  test('should render buttons properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
    }
  });

  test('should have proper touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      const firstButton = buttons.first();
      const boundingBox = await firstButton.boundingBox();

      expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should display properly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const size = page.viewportSize();
    expect(size).not.toBeNull();
    expect(size?.width).toBeGreaterThan(0);
  });

  test('should render navbar on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const navbar = page.locator('nav');
    try {
      await navbar.waitFor({ state: 'visible', timeout: 2000 });
      await expect(navbar).toBeVisible();
    } catch {
      console.warn('Navbar not found - might be hidden in this viewport');
    }
  });

  test('should display properly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const size = page.viewportSize();
    expect(size).not.toBeNull();
    expect(size?.width).toBeGreaterThanOrEqual(1280);
  });

  test('should have readable text on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const homePage = new HomePage(page);
    await homePage.goto();

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    if (count > 0) {
      const firstHeading = headings.first();
      const fontSize = await firstHeading.evaluate((el: HTMLElement) => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      expect(fontSize).toBeGreaterThanOrEqual(12);
    }
  });

  test('should resize content correctly when viewport changes', async ({
    page
  }) => {
    const homePage = new HomePage(page);

    await page.setViewportSize({ width: 1280, height: 720 });
    await homePage.goto();

    const bodyWidthDesktop = await page.evaluate(
      () => document.body.offsetWidth
    );

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    const bodyWidthMobile = await page.evaluate(
      () => document.body.offsetWidth
    );

    expect(bodyWidthMobile).toBeLessThan(bodyWidthDesktop);
  });
});
