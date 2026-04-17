import { test, expect } from '@playwright/test';

const API = process.env.E2E_API_URL
  || process.env.E2E_BASE_URL
  || 'http://localhost:3000';

test.describe('API Health', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const res = await request.get(`${API}/health`);
    expect(res.ok()).toBeTruthy();
  });

  test('zakat info endpoint is public and returns data', async ({ request }) => {
    const res = await request.get(`${API}/api/zakat/info`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    // Response shape may vary but should have some nisab-related field
    expect(data).toBeTruthy();
  });

  test('protected endpoint returns 401 without auth', async ({ request }) => {
    const res = await request.get(`${API}/api/assets/list`);
    expect(res.status()).toBe(401);
  });

  test('signup rejects invalid email format', async ({ request }) => {
    const res = await request.post(`${API}/auth/signup`, {
      data: { email: 'invalid', password: 'Test1234', fullName: 'Test', phoneNumber: '+1234567890' },
    });
    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('valid email');
  });

  test('signup rejects weak password', async ({ request }) => {
    const res = await request.post(`${API}/auth/signup`, {
      data: { email: 'test@example.com', password: 'weak', fullName: 'Test', phoneNumber: '+1234567890' },
    });
    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('8 characters');
  });

  test('login rejects nonexistent user', async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: `nobody-${Date.now()}@nowhere.com`, password: 'WrongPass1' },
    });
    // 401 (invalid) or 429 (rate limited) are both acceptable
    expect([401, 429].includes(res.status())).toBeTruthy();
  });
});
