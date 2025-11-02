import { Page, expect } from '@playwright/test';

export class TestUtils {
  static async clickWhenReady(
    page: Page,
    selector: string,
    timeout: number = 5000
  ) {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    await element.click();
  }

  static async fillFieldClear(page: Page, selector: string, value: string) {
    const field = page.locator(selector);
    await field.click();
    await field.clear();
    await field.fill(value);
  }

  static async elementExists(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'attached', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  static async getAllTexts(page: Page, selector: string): Promise<string[]> {
    return await page.locator(selector).allTextContents();
  }

  static async waitForNavigation(page: Page, callback: () => Promise<void>) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      callback()
    ]);
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }

  static async checkConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  static async fillMultipleFields(page: Page, fields: Record<string, string>) {
    for (const [selector, value] of Object.entries(fields)) {
      await page.fill(selector, value);
    }
  }

  static async getFormData(
    page: Page,
    formSelector: string
  ): Promise<Record<string, string>> {
    return await page
      .locator(formSelector)
      .evaluate((form: HTMLFormElement) => {
        const formData = new FormData(form);
        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
          data[key] = value as string;
        });

        return data;
      });
  }

  static async verifyTableData(
    page: Page,
    tableSelector: string,
    expectedData: string[]
  ): Promise<boolean> {
    const tableText = await page.locator(tableSelector).textContent();
    return expectedData.every(data => tableText?.includes(data));
  }

  static async waitForApiCall(
    page: Page,
    urlPattern: string,
    timeout: number = 10000
  ) {
    return await page.waitForResponse(
      response => response.url().includes(urlPattern),
      { timeout }
    );
  }

  static async getRequestHeaders(
    page: Page,
    urlPattern: string
  ): Promise<Record<string, string>> {
    let headers: Record<string, string> = {};

    page.on('request', request => {
      if (request.url().includes(urlPattern)) {
        headers = request.headers();
      }
    });

    return headers;
  }

  static async retry(
    callback: () => Promise<void>,
    maxAttempts: number = 3,
    delay: number = 1000
  ) {
    let lastError;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        await callback();
        return;
      } catch (error) {
        lastError = error;
        if (i < maxAttempts - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, delay * Math.pow(2, i))
          );
        }
      }
    }

    throw lastError;
  }

  static compareObjects(expected: any, actual: any): boolean {
    return JSON.stringify(expected) === JSON.stringify(actual);
  }

  static generateRandomString(length: number = 10): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }

  static generateRandomEmail(): string {
    return `test_${this.generateRandomString(8)}@test.com`;
  }

  static formatDate(date: Date, format: string = 'DD/MM/YYYY'): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', String(year));
  }
}

export default TestUtils;
