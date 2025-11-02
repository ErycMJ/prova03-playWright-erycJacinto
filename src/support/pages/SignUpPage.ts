import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { signUpElements } from '../elements/SignUpElements';

export class SignUpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  async verifySignUpPageVisible() {
    await this.verifyElementVisible(signUpElements.emailInput);
    await this.verifyElementVisible(signUpElements.passwordInput);
    await this.verifyElementVisible(signUpElements.submitButton);
  }

  async fillSignUpForm(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await this.fillInput(signUpElements.nameInput, name);
    await this.fillInput(signUpElements.emailInput, email);
    await this.fillInput(signUpElements.passwordInput, password);
    await this.fillInput(signUpElements.confirmPasswordInput, confirmPassword);
  }

  async submitSignUpForm() {
    await this.clickButton(signUpElements.submitButton);
  }

  async verifySuccessMessage() {
    await this.verifyElementVisible(signUpElements.successMessage);
  }

  async verifyErrorMessage() {
    await this.verifyElementVisible(signUpElements.errorMessage);
  }

  async clickSignInLink() {
    await this.clickButton(signUpElements.signInLink);
  }
}
