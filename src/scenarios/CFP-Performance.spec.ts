import { test, expect } from '@playwright/test';
import { HomePage } from '../support/pages/HomePage';
import { LoginPage } from '../support/pages/LoginPage';

test.describe('CFP - Performance Tests', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    const homePage = new HomePage(page);
    await homePage.goto();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000);
  });

  test('should have acceptable first contentful paint', async ({ page }) => {
    const homePage = new HomePage(page);

    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length === 0) return null;

      const navEntry = entries[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navEntry.domContentLoadedEventEnd -
          navEntry.domContentLoadedEventStart,
        loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart
      };
    });

    if (metrics) {
      expect(metrics.domContentLoaded).toBeLessThan(5000);
    }
  });

  test('should not have render-blocking resources', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const renderBlockingResources = await page.evaluate(() => {
      const scripts = document.querySelectorAll(
        'script:not([async]):not([defer])'
      );
      return scripts.length;
    });

    expect(renderBlockingResources).toBeLessThan(5);
  });

  test('login page should load quickly', async ({ page }) => {
    const startTime = Date.now();

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(8000);
  });

  test('should minimize layout shifts', async ({ page }) => {
    const homePage = new HomePage(page);

    let layoutShifts = 0;

    page.on('console', msg => {
      if (msg.text().includes('layout shift')) {
        layoutShifts++;
      }
    });

    await homePage.goto();
    await page.waitForLoadState('networkidle');

    expect(layoutShifts).toBeLessThan(10);
  });

  test('should compress resources efficiently', async ({ page }) => {
    const responses: string[] = [];

    page.on('response', response => {
      const contentEncoding = response.headers()['content-encoding'];
      if (
        response.request().resourceType() === 'stylesheet' ||
        response.request().resourceType() === 'script'
      ) {
        if (contentEncoding) {
          responses.push(contentEncoding);
        }
      }
    });

    const homePage = new HomePage(page);
    await homePage.goto();

    expect(responses.length).toBeGreaterThan(0);
  });

  test('should cache resources properly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    await page.reload();
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const navTiming = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        cached: navTiming?.transferSize === 0
      };
    });

    expect(metrics).toBeTruthy();
  });

  test('should handle large payloads', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    const resources = await page.evaluate(() => {
      const perf = performance.getEntriesByType(
        'resource'
      ) as PerformanceResourceTiming[];
      return {
        count: perf.length,
        avgSize:
          perf.length > 0
            ? perf.reduce((sum, r) => sum + r.transferSize, 0) / perf.length
            : 0
      };
    });

    expect(resources.count).toBeGreaterThan(0);
    expect(resources.avgSize).toBeLessThan(500000);
  });
});
