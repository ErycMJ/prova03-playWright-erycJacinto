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

  async isElementVisible(selector: string, timeout: number = 30000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async fillInput(selector: string, value: string) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'attached', timeout: 30000 });
    await element.fill(value, { timeout: 60000 });
  }

  async clickButton(selector: string) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'attached', timeout: 30000 });
    await element.click({ timeout: 60000 });
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignora timeout em CI
    });
  }

  async getText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'attached', timeout: 30000 });
    return await element.textContent() || '';
  }

  async selectOption(selector: string, value: string) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'attached', timeout: 30000 });
    await element.selectOption(value, { timeout: 60000 });
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
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    await expect(element).toBeVisible();
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

