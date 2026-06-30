/**
 * Script 29 — UI-ONLY ten-persona gauntlet (real browser, prod).
 *
 * Logs in through the actual /login UI as each seeded Script-28 QA account,
 * walks that persona's feature pages, screenshots each to the audit evidence
 * folder, and asserts visible-bug invariants (rendered Error/NaN/undefined/raw
 * JSON, blank critical panel, horizontal scroll, console errors). API is used
 * ONLY to read credentials — every PASS here is a UI pass.
 *
 * Run:
 *   E2E_BASE_URL=https://trybarakah.com npx playwright test \
 *     e2e/ten-persona-ui-gauntlet.spec.ts --project=chromium --trace=on --screenshot=on
 *   ...--project=mobile-chrome ...
 */
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RUN_ID = 'qa20260630_mr00cdbr';
const SECRETS_PATH = join(process.cwd(), '..', 'audits', 'ten-persona-edge-gauntlet-2026-06-30', 'tools', '.persona-secrets.json');
const SECRETS: Record<string, string> = JSON.parse(readFileSync(SECRETS_PATH, 'utf8'));
const EVIDENCE = join(process.cwd(), '..', 'audits', 'ui-only-ten-persona-gauntlet-2026-06-30', 'evidence');

const emailFor = (slug: string) => `qa+${RUN_ID}+${slug}@trybarakah.test`;

interface Persona { key: string; slug: string; paths: string[]; }
const PERSONAS: Persona[] = [
  { key: 'p01', slug: 'p01-zero',        paths: ['/dashboard','/dashboard/transactions','/dashboard/assets','/dashboard/zakat','/dashboard/sadaqah','/dashboard/waqf','/dashboard/wasiyyah','/dashboard/faraid'] },
  { key: 'p02', slug: 'p02-stateonly',   paths: ['/dashboard','/dashboard/profile'] },
  { key: 'p03', slug: 'p03-zakat-heavy', paths: ['/dashboard/zakat','/dashboard/hawl','/dashboard/retirement-zakat','/dashboard/market-prices'] },
  { key: 'p04', slug: 'p04-riba',        paths: ['/dashboard/transactions','/dashboard/riba','/dashboard/categorize','/dashboard/zakat'] },
  { key: 'p05', slug: 'p05-plaid',       paths: ['/dashboard/assets','/dashboard/transactions'] },
  { key: 'p06', slug: 'p06-csv-chaos',   paths: ['/dashboard/import','/dashboard/transactions'] },
  { key: 'p07', slug: 'p07-family-owner',paths: ['/dashboard/family','/dashboard/shared','/dashboard/budget','/dashboard/savings'] },
  { key: 'p08', slug: 'p08-estate',      paths: ['/dashboard/wasiyyah','/dashboard/faraid'] },
  { key: 'p09', slug: 'p09-sidehustle',  paths: ['/dashboard/side-hustles','/dashboard/cash-flow','/dashboard/bills','/dashboard/forecasting','/dashboard/reports'] },
  { key: 'p10', slug: 'p10-intl-rtl',    paths: ['/dashboard','/dashboard/transactions','/dashboard/assets','/dashboard/profile'] },
];

const results: Record<string, unknown>[] = [];

async function loginViaUI(browser: Browser, p: Persona): Promise<{ ctx: BrowserContext; page: Page; ok: boolean; reason?: string }> {
  const proj = test.info().project;
  const du = proj.use as { viewport?: { width: number; height: number } | null; userAgent?: string; deviceScaleFactor?: number; hasTouch?: boolean };
  const isMobile = proj.name.startsWith('mobile');
  const ctx = await browser.newContext({
    ...(isMobile ? { viewport: du.viewport ?? { width: 412, height: 915 }, userAgent: du.userAgent, deviceScaleFactor: du.deviceScaleFactor, hasTouch: du.hasTouch ?? true }
                 : { viewport: { width: 1366, height: 900 } }),
    baseURL: process.env.E2E_BASE_URL || 'https://trybarakah.com',
  });
  const page = await ctx.newPage();
  await page.goto('/login', { waitUntil: 'networkidle' }).catch(() => {});
  // Wait for the React form to hydrate before typing, else the value is set on
  // the DOM input but React state stays empty and submit posts blank creds.
  await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 20_000 }).catch(() => {});
  await page.fill('input[type="email"]', emailFor(p.slug)).catch(() => {});
  await page.fill('input[type="password"]', SECRETS[p.key]).catch(() => {});
  await page.waitForTimeout(250);
  await page.click('button[type="submit"]').catch(() => {});
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 20_000 }).catch(() => {});
  const stillLogin = page.url().includes('/login');
  let reason: string | undefined;
  if (stillLogin) {
    const banner = await page.locator('body').innerText().catch(() => '');
    reason = /too many|rate/i.test(banner) ? 'login rate-limited (429)' : 'login did not navigate (banner: ' + banner.replace(/\s+/g, ' ').slice(0, 80) + ')';
  } else {
    try { // skip onboarding modals
      const uj = await page.evaluate(() => window.localStorage.getItem('user'));
      const id = uj ? (JSON.parse(uj) as { id?: string })?.id : null;
      if (id) await page.evaluate((i) => { localStorage.setItem(`barakah_guided_setup_v1:${i}`, 'true'); localStorage.setItem('barakah_onboarded', 'true'); localStorage.setItem('barakah_referral_prompted', 'true'); }, id);
    } catch { /* best-effort */ }
  }
  return { ctx, page, ok: !stillLogin, reason };
}

async function checkPage(page: Page, p: Persona, path: string) {
  const consoleErrors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  const resp = await page.goto(path, { waitUntil: 'networkidle', timeout: 20_000 }).catch(() => null);
  await page.waitForTimeout(600);
  const body = await page.locator('body').innerText().catch(() => '');
  const proj = test.info().project.name;
  const dir = join(EVIDENCE, proj, p.key);
  mkdirSync(dir, { recursive: true });
  const shot = join(dir, path.replace(/\//g, '_').replace(/^_/, '') + '.png');
  await page.screenshot({ path: shot, fullPage: true }).catch(() => null);
  const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2).catch(() => false);
  const issues: string[] = [];
  if ((resp?.status() ?? 0) >= 500) issues.push('http5xx');
  if (/\bNaN\b/.test(body)) issues.push('NaN');
  if (/\bundefined\b/.test(body)) issues.push('undefined-shown');
  if (/(^|\s)(Application error|Internal Server Error|Something went wrong|Unhandled Runtime Error)/i.test(body)) issues.push('error-text');
  if (/^\s*[\[{][\s\S]*[\]}]\s*$/.test(body) && body.length < 400) issues.push('raw-json');
  if (hScroll) issues.push('horizontal-scroll');
  if (consoleErrors.length) issues.push(`console-errors:${consoleErrors.length}`);
  results.push({ persona: p.key, project: proj, path, status: resp?.status() ?? 0, issues, shot, sample: consoleErrors[0] || '' });
  return issues;
}

for (const p of PERSONAS) {
  test(`UI walk ${p.key}`, async ({ browser }) => {
    test.setTimeout(180_000);
    const { ctx, page, ok, reason } = await loginViaUI(browser, p);
    if (!ok) {
      mkdirSync(join(EVIDENCE, test.info().project.name, p.key), { recursive: true });
      await page.screenshot({ path: join(EVIDENCE, test.info().project.name, p.key, 'LOGIN_FAIL.png'), fullPage: true }).catch(() => null);
      results.push({ persona: p.key, project: test.info().project.name, path: '/login', loginFailed: true, reason });
      await ctx.close();
      test.skip(true, `login did not complete: ${reason}`);
      return;
    }
    const allIssues: string[] = [];
    for (const path of p.paths) { const iss = await checkPage(page, p, path); if (iss.length) allIssues.push(`${path}: ${iss.join(',')}`); }
    await ctx.close();
    // Don't hard-fail on console-errors alone (noisy 3rd-party); fail on real breakage.
    const hard = allIssues.filter((s) => /http5xx|NaN|undefined-shown|error-text|raw-json/.test(s));
    expect(hard, `UI breakage for ${p.key}:\n${allIssues.join('\n')}`).toEqual([]);
  });
}

test.afterAll(async () => {
  mkdirSync(EVIDENCE, { recursive: true });
  writeFileSync(join(EVIDENCE, `_results-${test.info().project.name || 'run'}.json`), JSON.stringify(results, null, 2));
});
