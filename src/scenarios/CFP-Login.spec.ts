import { test, expect } from '@playwright/test';
import { LoginPage } from '../support/pages/LoginPage';
import users from '../support/fixtures/users.json';

test.describe('CFP - Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should have all login form elements', async ({ page }) => {
    await loginPage.isLoginFormVisible();
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should fail with invalid credentials', async ({ page }) => {
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);
    await loginPage.assertLoginFailed();
  });

  test('should fill email field correctly', async ({ page }) => {
    const testEmail = 'test@example.com';
    await loginPage.fillEmail(testEmail);
    await expect(page.locator('#email')).toHaveValue(testEmail);
  });

  test('should fill password field correctly', async ({ page }) => {
    const testPassword = 'testPassword123';
    await loginPage.fillPassword(testPassword);
    await expect(page.locator('#password')).toHaveValue(testPassword);
  });

  test('should display error message on failed login', async ({ page }) => {
    await loginPage.login('nonexistent@example.com', 'wrongpassword');
    const errorElement = page.locator('.error-message');

    try {
      await errorElement.waitFor({ state: 'visible', timeout: 3000 });
      await expect(errorElement).toBeVisible();
    } catch {
      const alertElement = page.locator('[role="alert"]');
      await expect(alertElement).toBeVisible();
    }
  });

  test('should be able to clear email field', async ({ page }) => {
    await loginPage.fillEmail('test@example.com');
    await page.locator('#email').clear();
    await expect(page.locator('#email')).toHaveValue('');
  });

  test('should be able to clear password field', async ({ page }) => {
    await loginPage.fillPassword('password123');
    await page.locator('#password').clear();
    await expect(page.locator('#password')).toHaveValue('');
  });
});
