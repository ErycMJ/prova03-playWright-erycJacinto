import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para página de login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display login page', async ({ page }) => {
    // Verificar que estamos na página de login
    await expect(page).toHaveURL(/login/);
  });

  test('should have email input field', async ({ page }) => {
    // Verificar que o campo de email existe
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    // Verificar que o campo de senha existe
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    // Verificar que o botão submit existe
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should fill email field', async ({ page }) => {
    // Preencher campo de email
    await page.fill('#email', 'test@example.com');
    await expect(page.locator('#email')).toHaveValue('test@example.com');
  });

  test('should fill password field', async ({ page }) => {
    // Preencher campo de senha
    await page.fill('#password', 'password123');
    await expect(page.locator('#password')).toHaveValue('password123');
  });

  test('should navigate to login page successfully', async ({ page }) => {
    // Verificar URL
    const url = page.url();
    expect(url).toContain('login');
  });
});
