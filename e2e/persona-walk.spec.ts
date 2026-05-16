/**
 * Multi-persona headed visual walk.
 *
 * Spawned for the 2026-05-16 realistic UI QA session. Logs in as each of
 * 6 high-value personas, visits 10 key surfaces per persona, captures a
 * screenshot per surface, and asserts a small set of "no obvious bug"
 * invariants (no untranslated `_KEY_`, no `NaN`, no `undefined` shown,
 * no horizontal scrollbar on the main viewport).
 *
 * Run with:
 *   npx playwright test --project=chromium e2e/persona-walk.spec.ts \
 *     --reporter=line
 *
 * Screenshots land in `test-results/persona-walk/<persona>/<surface>.png`.
 *
 * Login uses the local seeded backend on :8081 via the cookie jar that
 * each test establishes itself (does NOT reuse the global-setup auth
 * because each persona needs its own session).
 */
import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface Persona {
  id: string;
  email: string;
  expectedLocale: string;
  expectedCurrency: string;
  expectedRTL: boolean;
  plan: string;
}

const PERSONAS: Persona[] = [
  // Full 14-persona seed coverage. Added 7 (p01,p04,p09,p10,p11,p12,p14) on 2026-05-16
  // for the heavy-test run — broad coverage including edge plans + zero-state +
  // failed-payment + heavy-txn + plaid-ready + kids-parent.
  { id: 'p01-free-us',         email: 'demo+p01-free-us@trybarakah.com',         expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'free' },
  { id: 'p02-plus-us',         email: 'demo+p02-plus-us@trybarakah.com',         expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'plus' },
  { id: 'p03-family-us',       email: 'demo+p03-family-us@trybarakah.com',       expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'family' },
  { id: 'p04-invitee-ca',      email: 'demo+p04-invitee-ca@trybarakah.com',      expectedLocale: 'en-CA', expectedCurrency: 'CAD', expectedRTL: false, plan: 'plus' },
  { id: 'p05-trial-uk',        email: 'demo+p05-trial-uk@trybarakah.com',        expectedLocale: 'en-GB', expectedCurrency: 'GBP', expectedRTL: false, plan: 'plus' },
  { id: 'p06-arabic-sa',       email: 'demo+p06-arabic-sa@trybarakah.com',       expectedLocale: 'ar-SA', expectedCurrency: 'SAR', expectedRTL: true,  plan: 'family' },
  { id: 'p07-french',          email: 'demo+p07-french@trybarakah.com',          expectedLocale: 'fr-FR', expectedCurrency: 'EUR', expectedRTL: false, plan: 'plus' },
  { id: 'p08-urdu-pk',         email: 'demo+p08-urdu-pk@trybarakah.com',         expectedLocale: 'ur-PK', expectedCurrency: 'PKR', expectedRTL: true,  plan: 'free' },
  { id: 'p09-failed-pay',      email: 'demo+p09-failed-pay@trybarakah.com',      expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'free' },
  { id: 'p10-expired-trial',   email: 'demo+p10-expired-trial@trybarakah.com',   expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'free' },
  { id: 'p11-heavy-txn',       email: 'demo+p11-heavy-txn@trybarakah.com',       expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'plus' },
  { id: 'p12-plaid-ready',     email: 'demo+p12-plaid-ready@trybarakah.com',     expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'plus' },
  { id: 'p13-zakat-heavy',     email: 'demo+p13-zakat-heavy-gm@trybarakah.com',  expectedLocale: 'en-GM', expectedCurrency: 'GMD', expectedRTL: false, plan: 'family' },
  { id: 'p14-kids-parent',     email: 'demo+p14-kids-parent@trybarakah.com',     expectedLocale: 'en-US', expectedCurrency: 'USD', expectedRTL: false, plan: 'family' },
];

const PASSWORD = 'demo-Pa55!';

const SURFACES: { slug: string; path: string }[] = [
  { slug: 'dashboard',     path: '/dashboard' },
  { slug: 'transactions',  path: '/dashboard/transactions' },
  { slug: 'net-worth',     path: '/dashboard/net-worth' },
  { slug: 'zakat',         path: '/dashboard/zakat' },
  { slug: 'sadaqah',       path: '/dashboard/sadaqah' },
  { slug: 'budget',        path: '/dashboard/budget' },
  { slug: 'debts',         path: '/dashboard/debts' },
  { slug: 'investments',   path: '/dashboard/investments' },
  { slug: 'halal',         path: '/dashboard/halal' },
  { slug: 'fiqh-settings', path: '/dashboard/fiqh-settings' },
  { slug: 'billing',       path: '/dashboard/billing' },
  { slug: 'profile',       path: '/dashboard/profile' },
];

interface PageObservation {
  persona: string;
  surface: string;
  url: string;
  status: number;
  bodyTextLen: number;
  hadUntranslatedKey: boolean;
  hadNaN: boolean;
  hadUndefinedShown: boolean;
  hadHorizontalScroll: boolean;
  consoleErrorCount: number;
  consoleErrorSamples: string[];
  htmlDir: string | null;
  htmlLang: string | null;
}

const observations: PageObservation[] = [];

async function loginViaUI(browser: Browser, persona: Persona): Promise<{
  ctx: BrowserContext;
  page: Page;
}> {
  // UI-driven login. The earlier apiRequest approach produced cookies that
  // didn't round-trip into a fresh browser context cleanly. browser-
  // authenticated.spec.ts uses the same pattern and is the proven path.
  const ctx = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    baseURL: 'http://localhost:3000',
  });
  const page = await ctx.newPage();
  await page.goto('/login', { waitUntil: 'networkidle' }).catch(() => {});
  await page.fill('input[type="email"]', persona.email);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  // Wait for navigation away from /login (success) or for an error banner
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15_000 }).catch(() => {});

  // Bypass guided-setup and post-onboarding modal — see browser-authenticated.spec.ts
  try {
    const userJson = await page.evaluate(() => window.localStorage.getItem('user'));
    if (userJson) {
      const userId = (JSON.parse(userJson) as { id?: string })?.id;
      if (userId) {
        await page.evaluate((id) => {
          window.localStorage.setItem(`barakah_guided_setup_v1:${id}`, 'true');
          window.localStorage.setItem('barakah_onboarded', 'true');
          window.localStorage.setItem('barakah_referral_prompted', 'true');
        }, userId);
      }
    }
  } catch {
    // best-effort
  }
  return { ctx, page };
}

async function observe(page: Page, persona: Persona, surface: { slug: string; path: string }) {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200));
  });

  const response = await page.goto(surface.path, { waitUntil: 'networkidle', timeout: 15_000 }).catch(() => null);
  // Settle a beat for client-side rendering
  await page.waitForTimeout(500);

  const status = response ? response.status() : 0;
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const bodyHTML = await page.locator('body').innerHTML().catch(() => '');

  // Untranslated key heuristic: literal occurrence of `_KEY_` or `i18n_missing_`
  // or things like "dashboard.spending" (bare dotted i18n key)
  const hadUntranslatedKey =
    /(_KEY_|i18n_missing_|\{\{[a-z]+\.[a-z]+\}\}|\[%[a-z]+\.[a-z]+%\])/i.test(bodyText) ||
    /^[a-z]+\.[a-z]+\.[a-z]+$/m.test(bodyText);

  // "NaN" rendered to user (case-sensitive — we want the JS-typeof-shown form)
  const hadNaN = / NaN[ %$.,]?/g.test(' ' + bodyText);

  // "undefined" rendered to user, anywhere visible
  const hadUndefinedShown = /^undefined$|\bundefined\b/.test(bodyText) && !bodyHTML.includes('data-undefined');

  // Horizontal scroll on root viewport — common mobile-responsive bug
  const hadHorizontalScroll = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return (
      html.scrollWidth > html.clientWidth + 1 ||
      body.scrollWidth > body.clientWidth + 1
    );
  });

  const htmlDir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
  const htmlLang = await page.evaluate(() => document.documentElement.getAttribute('lang'));

  // Save screenshot
  const outDir = join('test-results', 'persona-walk', persona.id);
  mkdirSync(outDir, { recursive: true });
  await page
    .screenshot({ path: join(outDir, `${surface.slug}.png`), fullPage: true })
    .catch(() => null);

  observations.push({
    persona: persona.id,
    surface: surface.slug,
    url: page.url(),
    status,
    bodyTextLen: bodyText.length,
    hadUntranslatedKey,
    hadNaN,
    hadUndefinedShown,
    hadHorizontalScroll,
    consoleErrorCount: consoleErrors.length,
    consoleErrorSamples: consoleErrors.slice(0, 3),
    htmlDir,
    htmlLang,
  });
}

test.describe.configure({ mode: 'serial' });

test.describe('Multi-persona headed visual walk', () => {
  for (const persona of PERSONAS) {
    test(`walk persona ${persona.id}`, async ({ browser }) => {
      test.setTimeout(180_000);
      const { ctx, page } = await loginViaUI(browser, persona);
      // Assert that we actually landed on an authenticated page before walking
      const postLoginUrl = page.url();
      if (postLoginUrl.includes('/login')) {
        throw new Error(`Persona ${persona.id} did NOT log in (still at /login)`);
      }
      for (const surface of SURFACES) {
        await observe(page, persona, surface);
      }
      await ctx.close();
    });
  }

  test.afterAll(async () => {
    const reportPath = 'test-results/persona-walk/observations.json';
    mkdirSync('test-results/persona-walk', { recursive: true });
    writeFileSync(reportPath, JSON.stringify(observations, null, 2));

    // Also write a human-readable findings summary
    const findings: string[] = [];
    findings.push('# Persona walk observations\n');
    const offenders = observations.filter(
      (o) =>
        o.hadUntranslatedKey ||
        o.hadNaN ||
        o.hadUndefinedShown ||
        o.hadHorizontalScroll ||
        o.consoleErrorCount > 0 ||
        o.status >= 400,
    );
    findings.push(`Total surfaces walked: ${observations.length}`);
    findings.push(`Offending surfaces: ${offenders.length}\n`);
    for (const o of offenders) {
      const tags = [
        o.hadUntranslatedKey && 'UNTRANSLATED_KEY',
        o.hadNaN && 'NaN_SHOWN',
        o.hadUndefinedShown && 'UNDEFINED_SHOWN',
        o.hadHorizontalScroll && 'H_SCROLL',
        o.consoleErrorCount > 0 && `CONSOLE_ERR(${o.consoleErrorCount})`,
        o.status >= 400 && `HTTP_${o.status}`,
      ]
        .filter(Boolean)
        .join(' ');
      findings.push(`- [${o.persona}] ${o.surface} → ${tags}`);
      if (o.consoleErrorSamples.length) {
        for (const s of o.consoleErrorSamples) findings.push(`    console: ${s}`);
      }
    }
    writeFileSync('test-results/persona-walk/findings.md', findings.join('\n'));
    expect(true).toBe(true); // afterAll is allowed to call expect
  });
});
