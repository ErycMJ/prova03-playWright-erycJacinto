import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginElements } from '../elements/LoginElements';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignora timeout
    });
    // Aguarda o formulário de login estar visível
    await this.page.locator(loginElements.loginForm).waitFor({ state: 'visible', timeout: 30000 }).catch(() => {
      console.warn('Login form not visible within timeout');
    });
  }

  async fillEmail(email: string) {
    const emailInput = this.page.locator(loginElements.emailInput);
    await emailInput.waitFor({ state: 'attached', timeout: 30000 });
    await emailInput.fill(email, { timeout: 60000 });
  }

  async fillPassword(password: string) {
    const passwordInput = this.page.locator(loginElements.passwordInput);
    await passwordInput.waitFor({ state: 'attached', timeout: 30000 });
    await passwordInput.fill(password, { timeout: 60000 });
  }

  async clickSubmit() {
    const submitButton = this.page.locator(loginElements.submitButton);
    await submitButton.waitFor({ state: 'attached', timeout: 30000 });
    await submitButton.click({ timeout: 60000 });
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignora timeout
    });
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async assertLoginFailed() {
    const errorElement = this.page.locator(loginElements.errorMessage);
    await errorElement.waitFor({ state: 'visible', timeout: 30000 });
  }

  async assertLoginSuccess() {
    await expect(this.page).not.toHaveURL(/login/);
  }

  async isLoginFormVisible() {
    const form = this.page.locator(loginElements.loginForm);
    await form.waitFor({ state: 'visible', timeout: 30000 }).catch(() => false);
    return await form.isVisible();
  }

  async closeErrorMessage() {
    const errorClose = this.page.locator(
      `${loginElements.errorMessage} button:has-text("×")`
    );
    if (await errorClose.isVisible()) {
      await errorClose.click();
    }
  }
}
