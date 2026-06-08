import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    await expect(page.locator('input[formcontrolname="email"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should disable submit button when form is empty', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test('should disable submit button with invalid email', async ({ page }) => {
    await page.fill('input[formcontrolname="email"]', 'not-an-email');
    await page.fill('input[formcontrolname="password"]', 'secret');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test('should enable submit button with valid credentials', async ({ page }) => {
    await page.fill('input[formcontrolname="email"]', 'user@example.com');
    await page.fill('input[formcontrolname="password"]', 'password123');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });

  test('should show error banner on failed login', async ({ page }) => {
    await page.route('**/api/v1/auth/login/', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Invalid credentials' }) })
    );

    await page.fill('input[formcontrolname="email"]', 'wrong@example.com');
    await page.fill('input[formcontrolname="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.auth-error-banner')).toBeVisible();
    await expect(page.locator('.auth-error-banner')).toContainText('E-mail ou senha incorretos');
  });

  test('should navigate to /companies after successful login', async ({ page }) => {
    await page.route('**/api/v1/auth/login/', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { token: 'fake-token-123' }, error: null }),
      })
    );
    await page.route('**/api/v1/companies/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { count: 0, results: [], next: null, previous: null }, error: null }),
      })
    );

    await page.fill('input[formcontrolname="email"]', 'user@example.com');
    await page.fill('input[formcontrolname="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/companies');
  });

  test('should navigate to signup page via link', async ({ page }) => {
    await page.click('a[routerlink="/signup"]');
    await expect(page).toHaveURL('/signup');
  });
});
