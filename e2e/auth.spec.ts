import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('homepage loads and has signup link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="/signup"]').first()).toBeVisible();
  });

  test('signup page loads with email and password inputs', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('signup rejects weak password', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[type="password"]', 'weak');
    await expect(page.locator('text=Weak')).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'nonexistent@test.com');
    await page.fill('input[type="password"]', 'WrongPassword1');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/invalid|error/i')).toBeVisible({ timeout: 10000 });
  });

  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login**', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
