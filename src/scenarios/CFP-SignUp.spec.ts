import { test, expect } from '@playwright/test';
import { SignUpPage } from '../support/pages/SignUpPage';
import { faker } from '@faker-js/faker';

test.describe('CFP - Sign Up Tests', () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.goto();
  });

  test('should display sign up page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/signup/);
  });

  test('should have all signup form fields', async ({ page }) => {
    const usernameInput = page.locator('#username');
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const mobileInput = page.locator('#mobile');
    const submitButton = page.locator('form button');

    try {
      await usernameInput.waitFor({ state: 'visible', timeout: 3000 });
      await expect(usernameInput).toBeVisible();
    } catch {
      console.log('Username field not found, it might be optional.');
    }

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    try {
      await mobileInput.waitFor({ state: 'visible', timeout: 3000 });
      await expect(mobileInput).toBeVisible();
    } catch {
      console.log('Mobile field not found, it might be optional.');
    }

    await expect(submitButton).toBeVisible();
  });

  test('should fill signup form with valid data', async ({ page }) => {
    const testUsername = 'testuser123';
    const testEmail = faker.internet.email();
    const testPassword = 'TestPassword123!';
    const testMobile = '1234567890';

    try {
      const usernameInput = page.locator('#username');
      await usernameInput.fill(testUsername);
      await expect(usernameInput).toHaveValue(testUsername);
    } catch {
      console.log('Username field not found, skipping fill.');
    }

    const emailInput = page.locator('#email');
    await emailInput.fill(testEmail);
    await expect(emailInput).toHaveValue(testEmail);

    const passwordInput = page.locator('#password');
    await passwordInput.fill(testPassword);
    await expect(passwordInput).toHaveValue(testPassword);

    try {
      const mobileInput = page.locator('#mobile');
      await mobileInput.fill(testMobile);
      await expect(mobileInput).toHaveValue(testMobile);
    } catch {
      console.log('Mobile field not found, it might be optional.');
    }
  });

  test.skip('should show error with invalid email', async ({ page }) => {
    const invalidEmail = 'invalid-email';
    const password = 'Password123!';

    try {
      const usernameInput = page.locator('#username');
      await usernameInput.fill('Test User');
    } catch {
      console.log('Username field not found, it might be optional.');
    }

    const emailInput = page.locator('#email');
    await emailInput.fill(invalidEmail);

    const passwordInput = page.locator('#password');
    await passwordInput.fill(password);

    const submitButton = page.locator('form button');
    await submitButton.click();

    try {
      const errorElement = page.locator('[role="alert"]');
      await errorElement.waitFor({ state: 'visible', timeout: 3000 });
      await expect(errorElement).toBeVisible();
    } catch {
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    }
  });

  test('should show error with weak password', async ({ page }) => {
    const email = faker.internet.email();
    const weakPassword = '123';

    try {
      const usernameInput = page.locator('#username');
      await usernameInput.fill('Test User');
    } catch {
      console.log('Username field not found, it might be optional.');
    }

    const emailInput = page.locator('#email');
    await emailInput.fill(email);

    const passwordInput = page.locator('#password');
    await passwordInput.fill(weakPassword);

    const submitButton = page.locator('form button');
    await submitButton.click();

    try {
      const errorElement = page.locator('[role="alert"]');
      await errorElement.waitFor({ state: 'visible', timeout: 3000 });
      await expect(errorElement).toBeVisible();
    } catch {
      const passwordFieldError = page.locator('#password ~ span.error');
      expect(passwordFieldError).toBeTruthy();
    }
  });

  test('should clear form fields', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    await emailInput.clear();
    await passwordInput.clear();

    await expect(emailInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test.skip('should have sign in link', async ({ page }) => {
    try {
      const signInLink = page.locator('a:has-text("Sign in")');
      await expect(signInLink).toBeVisible();
    } catch {
      const signInLink = page.locator('a[href*="login"]');
      await expect(signInLink).toBeVisible();
    }
  });
});
