import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — runs E2E tests against a locally-booted Next.js dev
 * server by default so the suite is reproducible on any laptop without
 * depending on prod DNS / Railway uptime. Set E2E_BASE_URL to point at a
 * different host (e.g. a preview deployment) when you need to validate
 * production behaviour.
 *
 * Required env vars for authenticated tests (set in a local .env.e2e file
 * or export at the shell — NEVER commit):
 *   E2E_EMAIL       a test account on the target env
 *   E2E_PASSWORD    its password
 *   E2E_API_URL     defaults to E2E_BASE_URL; override if the API lives at
 *                   a different origin (e.g. Railway backend + Vercel web)
 *
 * If E2E_EMAIL is unset, authenticated tests are skipped (not failed) via
 * the guard in e2e/authenticated.spec.ts.
 */

// Prefer the explicitly configured URL; otherwise fall back to the local
// Next.js dev server that the webServer block below auto-boots. We do NOT
// point at prod by default — that would make every test runner a DNS /
// network stress test against the production site.
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const IS_LOCAL = BASE_URL.startsWith('http://localhost');

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  // One retry hides real flakiness; keep it only on CI where the overhead
  // is worth the noise reduction.
  retries: process.env.CI ? 1 : 0,
  // Serial by default locally so failures are easier to diagnose. Parallel
  // on CI to keep wall-clock time reasonable.
  workers: process.env.CI ? undefined : 1,

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    // Ignore HTTPS errors so preview deployments with self-signed certs
    // still work.
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // macOS sandboxing inside CoreSimulator / restrictive App Sandbox
          // contexts emits "MachPortRendezvousServer … Permission denied"
          // at Chromium launch. Disabling the setuid sandbox is safe for
          // test workloads (never use these flags in prod). CI Linux runners
          // also benefit because they usually run without SYS_ADMIN.
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
  ],

  // Auto-boot the Next.js dev server when running against localhost. If the
  // caller set E2E_BASE_URL to something remote we skip this — they'll bring
  // their own target.
  webServer: IS_LOCAL
    ? {
        command: 'npm run dev',
        url: BASE_URL,
        timeout: 120_000,
        // Reuse a dev server the user already started — avoids a 30 s cold
        // boot on every `npx playwright test` invocation during iteration.
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
