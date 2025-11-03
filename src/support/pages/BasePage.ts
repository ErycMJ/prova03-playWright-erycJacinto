import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignora timeout de networkidle em CI
    });
  }

  async verifyTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async verifyUrl(url: string): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async isElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async clickButton(selector: string) {
    await this.page.click(selector);
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignora timeout em CI
    });
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignora timeout em CI
    });
  }

  async verifyElementText(selector: string, expectedText: string) {
    await expect(this.page.locator(selector)).toContainText(expectedText);
  }

  async verifyElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async verifyElementHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }
}

