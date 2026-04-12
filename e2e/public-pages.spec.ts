import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('homepage loads with content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('zakat calculator page loads', async ({ page }) => {
    await page.goto('/zakat-calculator');
    await expect(page.locator('h1')).toContainText('Zakat Calculator');
  });

  test('faraid calculator page loads', async ({ page }) => {
    await page.goto('/faraid-calculator');
    await expect(page.locator('h1')).toContainText('Faraid');
  });

  test('trust page loads', async ({ page }) => {
    await page.goto('/trust');
    await expect(page.locator('h1')).toContainText(/[Tt]rust/);
  });

  test('security page loads with FAQ', async ({ page }) => {
    await page.goto('/security');
    await expect(page.locator('text=Security at Barakah')).toBeVisible();
  });

  test('methodology page loads', async ({ page }) => {
    await page.goto('/methodology');
    await expect(page.locator('text=How Barakah Calculates')).toBeVisible();
  });

  test('privacy policy loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('terms of service loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('learn hub loads', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.locator('h1')).toBeVisible();
  });
});
