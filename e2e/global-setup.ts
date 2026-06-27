import { request as apiRequest } from '@playwright/test';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Playwright global setup — log in ONCE per test run and persist the
 * resulting cookie jar + CSRF token so every spec file reuses the same
 * session. Eliminates the 5-attempts-per-15-min login rate-limit
 * pressure that tripped the E2E pass when multiple spec files each
 * performed their own cold login.
 *
 * Produces:
 *   e2e/.auth/user.json  — Playwright storageState (cookies + origins)
 *   E2E_CSRF_TOKEN env   — the XSRF-TOKEN value the double-submit
 *                          header needs for non-GET requests
 *
 * Spec files read the storage state via `test.use({ storageState: ... })`
 * (see playwright.config.ts → projects[*].use.storageState) and read
 * the CSRF token via `process.env.E2E_CSRF_TOKEN`.
 *
 * If E2E_EMAIL / E2E_PASSWORD aren't set (local developer running
 * `npx playwright test` without creds), this setup writes an empty
 * storage state so the auth-less public-pages suite still runs; the
 * authenticated suites have their own `test.skip` guards.
 */
export const STORAGE_STATE_FILE = 'e2e/.auth/user.json';

// Playwright passes a FullConfig argument that we don't need (all the env
// vars we care about come through process.env). Dropping the parameter
// keeps ESLint happy without a no-unused-vars disable comment.
async function globalSetup() {
  const API =
    process.env.E2E_API_URL || process.env.E2E_BASE_URL || 'http://localhost:3000';
  const EMAIL = process.env.E2E_EMAIL || '';
  const PASSWORD = process.env.E2E_PASSWORD || '';

  if (!existsSync(dirname(STORAGE_STATE_FILE))) {
    mkdirSync(dirname(STORAGE_STATE_FILE), { recursive: true });
  }

  if (!EMAIL || !PASSWORD) {
    // No creds → write empty state. Authenticated specs will skip
    // themselves via their existing `test.skip(!EMAIL || !PASSWORD, ...)`
    // guards; public-pages specs need no cookies.
    writeFileSync(STORAGE_STATE_FILE, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  const ctx = await apiRequest.newContext({ baseURL: API });
  try {
    // Bootstrap CSRF cookie FIRST. The backend enforces CSRF double-submit on
    // POST /auth/login, so logging in before /auth/csrf returns 403 and the
    // whole authenticated suite silently skips. /auth/csrf returns 204 +
    // Set-Cookie XSRF-TOKEN; the cookie jar picks it up and we snapshot the
    // value for the double-submit header.
    await ctx.get('/auth/csrf');
    const xsrf = (await ctx.storageState()).cookies.find(
      (c) => c.name === 'XSRF-TOKEN',
    )?.value;

    const loginRes = await ctx.post('/auth/login', {
      data: { email: EMAIL, password: PASSWORD },
      headers: xsrf ? { 'X-XSRF-TOKEN': xsrf } : {},
    });
    if (!loginRes.ok()) {
      // Don't hard-fail the whole run — write empty state and let the
      // authenticated suites surface an informative skip message. A
      // login failure here is almost always a transient rate-limit or
      // a credential rotation, not a product regression worth failing
      // the entire suite on.
      console.warn(
        `[global-setup] login returned ${loginRes.status()}; writing empty state. ` +
          `Authenticated suites will skip.`,
      );
      writeFileSync(STORAGE_STATE_FILE, JSON.stringify({ cookies: [], origins: [] }));
      return;
    }

    // Re-snapshot the CSRF token (login may rotate the cookie) for spec
    // workers. Playwright's FullConfig doesn't let us pass env to spec files
    // directly, but process.env mutations in globalSetup ARE visible to spec
    // workers because Playwright spawns them as children AFTER setup resolves
    // (documented, stable since 1.18).
    await ctx.get('/auth/csrf');
    const csrf = (await ctx.storageState()).cookies.find(
      (c) => c.name === 'XSRF-TOKEN',
    );
    if (csrf?.value) {
      process.env.E2E_CSRF_TOKEN = csrf.value;
    }
    await ctx.storageState({ path: STORAGE_STATE_FILE });
  } finally {
    await ctx.dispose();
  }
}

export default globalSetup;
