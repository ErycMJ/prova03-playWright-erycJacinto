import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginElements } from '../elements/LoginElements';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async fillEmail(email: string) {
    await this.page.fill(loginElements.emailInput, email);
  }

  async fillPassword(password: string) {
    await this.page.fill(loginElements.passwordInput, password);
  }

  async clickSubmit() {
    await this.page.click(loginElements.submitButton);
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async assertLoginFailed() {
    await expect(this.page.locator(loginElements.errorMessage)).toBeVisible();
  }

  async assertLoginSuccess() {
    await expect(this.page).not.toHaveURL(/login/);
  }

  async isLoginFormVisible() {
    const form = this.page.locator(loginElements.loginForm);
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
