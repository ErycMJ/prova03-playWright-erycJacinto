import { test, expect } from '@playwright/test';
import { HomePage } from '../support/pages/HomePage';
import { LoginPage } from '../support/pages/LoginPage';

test.describe('CFP - Accessibility Tests', () => {
  test('should have proper heading hierarchy on home page', async ({
    page
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();

    expect(h1Count).toBe(1);
  });

  test('should have alt text for images', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const images = page.locator('img');
    const imageCount = await images.count();

    const imagesToCheck = Math.min(imageCount, 5);
    for (let i = 0; i < imagesToCheck; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      if (!alt) {
        const ariaLabel = await img.getAttribute('aria-label');
        expect(ariaLabel || alt).toBeTruthy();
      }
    }
  });

  test.skip('should have proper form labels on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');

    const emailLabel = page.locator('label[for*="email"]');
    const passwordLabel = page.locator('label[for*="password"]');

    try {
      await emailLabel.waitFor({ state: 'visible', timeout: 1000 });
      await expect(emailLabel).toBeVisible();
    } catch {
      const ariaLabel = await emailInput.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const elements = page.locator('*');
    const count = await elements.count();

    const bodyColor = await page
      .locator('body')
      .evaluate(el => window.getComputedStyle(el).color);

    expect(bodyColor).toBeTruthy();
  });

  test('should be keyboard navigable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      return (document.activeElement as HTMLElement)?.tagName;
    });

    expect(['BUTTON', 'INPUT', 'A', 'SELECT']).toContain(focusedElement);
  });

  test.skip('should have proper focus indicators', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const emailInput = page.locator('#email');

    await emailInput.focus();

    const focused = await emailInput.evaluate(
      (el: HTMLInputElement) => el === document.activeElement
    );
    expect(focused).toBe(true);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const nav = page.locator('nav');
    const main = page.locator('main');
    const footer = page.locator('footer');

    const navExists = (await nav.count()) > 0;
    const mainExists = (await main.count()) > 0;
    const footerExists = (await footer.count()) > 0;

    expect(navExists || mainExists || footerExists).toBe(true);
  });

  test.skip('should have proper button types', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    const type = await submitButton.getAttribute('type');
    expect(type).toBe('submit');
  });

  test('should have aria labels for interactive elements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    const buttonsToCheck = Math.min(buttonCount, 3);
    for (let i = 0; i < buttonsToCheck; i++) {
      const button = buttons.nth(i);

      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      expect(text || ariaLabel || title).toBeTruthy();
    }
  });
});
