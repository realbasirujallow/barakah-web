import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

// ── Load E2E credentials from a gitignored .env.e2e (zero-dependency) ────────
// This config's header has ALWAYS documented "set in a local .env.e2e file",
// but nothing actually loaded it — so creds placed there per the instructions
// were silently ignored, global-setup logged in with blank creds, and every
// authenticated suite skipped while looking "configured". Fixed 2026-05-30.
//
// Precedence: a variable already present in the shell environment WINS, so
// `E2E_PASSWORD=… npx playwright test` still overrides the file. `.env.e2e`
// (and `e2e/.env.e2e`) are covered by `.env*` in .gitignore — the password
// never enters git or the chat transcript. Quotes around values are stripped.
for (const envPath of ['.env.e2e', 'e2e/.env.e2e']) {
  if (!existsSync(envPath)) continue;
  for (const rawLine of readFileSync(envPath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

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

  // Log in ONCE per test run, persist the cookie jar, reuse it across
  // every spec file. Eliminates the 5-per-15-min login rate-limit
  // pressure that tripped a full suite run where each spec did its own
  // cold login. See e2e/global-setup.ts for the flow; spec files that
  // want authenticated behaviour read `e2e/.auth/user.json` via
  // `test.use({ storageState })` or `apiRequest.newContext({ storageState })`.
  globalSetup: './e2e/global-setup.ts',

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
    // Mobile-web viewports for the persona walk (2026-06-24). persona-walk
    // creates its own per-persona context and reads `test.info().project.name`
    // to size that context to the device, so responsive layout, the hamburger
    // drawer, and modal sizing get exercised at real phone widths.
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
    {
      name: 'mobile-safari',
      use: {
        // devices['iPhone 14'] defaults to the WebKit engine (real Safari
        // emulation). Requires `npx playwright install webkit`.
        ...devices['iPhone 14'],
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
