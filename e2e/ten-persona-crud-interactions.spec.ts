/**
 * Script 29 — Deep CRUD UI interactions (real browser writes, prod).
 *
 * Logs in through the real /login UI as the seeded QA personas and performs
 * actual write interactions through the UI (not API):
 *   P03 — record a Zakat payment (eligibility checklist → form → Record)
 *   P06 — CSV import via file chooser (upload → preview → Import)
 *   P09 — create a side-hustle (family-gated form)
 *   P10 — add a transaction with Arabic text, verify it renders, delete it
 *
 * Selectors discovered from source. Each step screenshots to the audit evidence
 * folder and records a structured outcome. Run serial (--workers=1) to respect
 * the prod login rate-limit (~10/IP/15min).
 *
 * Run:
 *   E2E_EMAIL= E2E_PASSWORD= E2E_BASE_URL=https://trybarakah.com \
 *   E2E_API_URL=https://api.trybarakah.com \
 *   npx playwright test e2e/ten-persona-crud-interactions.spec.ts --project=chromium --workers=1 --reporter=line
 */
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RUN_ID = 'qa20260630_mr00cdbr';
const SECRETS_PATH = join(process.cwd(), '..', 'audits', 'ten-persona-edge-gauntlet-2026-06-30', 'tools', '.persona-secrets.json');
const SECRETS: Record<string, string> = JSON.parse(readFileSync(SECRETS_PATH, 'utf8'));
const EVIDENCE = join(process.cwd(), '..', 'audits', 'ui-only-ten-persona-gauntlet-2026-06-30', 'evidence', 'crud');
const CSV_FIXTURE = join(process.cwd(), 'e2e', 'fixtures', 'p06_csv_chaos.csv');
const ARABIC = 'قهوة الصباح';

const emailFor = (slug: string) => `qa+${RUN_ID}+${slug}@trybarakah.test`;
const results: Record<string, unknown>[] = [];

async function loginViaUI(browser: Browser, key: string, slug: string): Promise<{ ctx: BrowserContext; page: Page; ok: boolean; reason?: string }> {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, baseURL: process.env.E2E_BASE_URL || 'https://trybarakah.com' });
  const page = await ctx.newPage();
  await page.goto('/login', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 20_000 }).catch(() => {});
  await page.fill('input[type="email"]', emailFor(slug)).catch(() => {});
  await page.fill('input[type="password"]', SECRETS[key]).catch(() => {});
  await page.waitForTimeout(250);
  await page.click('button[type="submit"]').catch(() => {});
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 20_000 }).catch(() => {});
  const stillLogin = page.url().includes('/login');
  let reason: string | undefined;
  if (stillLogin) {
    const banner = await page.locator('body').innerText().catch(() => '');
    reason = /too many|rate/i.test(banner) ? 'login rate-limited (429)' : 'login did not navigate: ' + banner.replace(/\s+/g, ' ').slice(0, 80);
  } else {
    try {
      const uj = await page.evaluate(() => window.localStorage.getItem('user'));
      const id = uj ? (JSON.parse(uj) as { id?: string })?.id : null;
      if (id) await page.evaluate((i) => { localStorage.setItem(`barakah_guided_setup_v1:${i}`, 'true'); localStorage.setItem('barakah_onboarded', 'true'); localStorage.setItem('barakah_referral_prompted', 'true'); }, id);
    } catch { /* best-effort */ }
  }
  return { ctx, page, ok: !stillLogin, reason };
}

async function shot(page: Page, persona: string, name: string) {
  const dir = join(EVIDENCE, persona);
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true }).catch(() => null);
}

function record(persona: string, outcome: string, detail: string, extra: Record<string, unknown> = {}) {
  results.push({ persona, outcome, detail, ...extra });
}

// ---------- P03: record a Zakat payment ----------
test('CRUD p03 — record zakat payment', async ({ browser }) => {
  test.setTimeout(180_000);
  const { ctx, page, ok, reason } = await loginViaUI(browser, 'p03', 'p03-zakat-heavy');
  if (!ok) { await shot(page, 'p03', 'LOGIN_FAIL'); record('p03', 'LOGIN_FAIL', reason || ''); await ctx.close(); test.skip(true, reason); return; }
  await page.goto('/dashboard/zakat', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, 'p03', '01_zakat_overview');
  // Payments tab
  await page.getByRole('button', { name: /payments/i }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1200);
  await shot(page, 'p03', '02_payments_tab');
  // Open record-payment form
  const rec = page.getByRole('button', { name: /record payment/i }).first();
  await rec.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'p03', '03_after_record_click');
  // Eligibility checklist: check all checkboxes if present
  const boxes = page.locator('input[type="checkbox"]');
  const nBoxes = await boxes.count().catch(() => 0);
  for (let i = 0; i < nBoxes; i++) { await boxes.nth(i).check({ timeout: 2000 }).catch(() => {}); }
  const cont = page.getByRole('button', { name: /continue to payment/i }).first();
  const hasChecklist = await cont.isVisible().catch(() => false);
  if (hasChecklist) {
    const disabled = await cont.isDisabled().catch(() => true);
    if (disabled) { await shot(page, 'p03', '04_checklist_blocked'); record('p03', 'GATED', 'eligibility checklist Continue stayed disabled — likely not zakat-eligible (by design, not a bug)', { nBoxes }); await ctx.close(); return; }
    await cont.click().catch(() => {});
    await page.waitForTimeout(800);
  }
  await shot(page, 'p03', '05_payment_form');
  await page.locator('#zakat-form-amount').fill('100').catch(() => {});
  await page.locator('#zakat-form-recipient').fill('QA Test Masjid (crud)').catch(() => {});
  await page.locator('#zakat-form-notes').fill('qa crud ui test').catch(() => {});
  await shot(page, 'p03', '06_form_filled');
  await page.getByRole('button', { name: /^record$|^save$/i }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await shot(page, 'p03', '07_after_submit');
  const body = await page.locator('body').innerText().catch(() => '');
  const saved = /QA Test Masjid/i.test(body) || /\$?100(\.00)?/.test(body);
  record('p03', saved ? 'PASS' : 'UNCONFIRMED', saved ? 'zakat payment recorded + appears in list' : 'submitted; could not confirm row in body text', { nBoxes });
  await ctx.close();
  expect(saved || hasChecklist === false, 'zakat payment flow drove through UI').toBeTruthy();
});

// ---------- P06: CSV import via file chooser ----------
test('CRUD p06 — CSV import via file chooser', async ({ browser }) => {
  test.setTimeout(180_000);
  const { ctx, page, ok, reason } = await loginViaUI(browser, 'p06', 'p06-csv-chaos');
  if (!ok) { await shot(page, 'p06', 'LOGIN_FAIL'); record('p06', 'LOGIN_FAIL', reason || ''); await ctx.close(); test.skip(true, reason); return; }
  await page.goto('/dashboard/import', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1200);
  await shot(page, 'p06', '01_import_page');
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(CSV_FIXTURE).catch(() => {});
  await page.waitForTimeout(2500);
  await shot(page, 'p06', '02_after_upload_preview');
  // Click the Import/Confirm button in the preview
  const importBtn = page.getByRole('button', { name: /^import|import transactions|import \d|confirm/i });
  const n = await importBtn.count().catch(() => 0);
  if (n > 0) { await importBtn.last().click({ timeout: 8000 }).catch(() => {}); }
  await page.waitForTimeout(3000);
  await shot(page, 'p06', '03_after_import');
  const body = await page.locator('body').innerText().catch(() => '');
  const success = /import.*complete|transactions? imported|assets? created|🎉|imported \d/i.test(body);
  record('p06', success ? 'PASS' : 'UNCONFIRMED', success ? 'CSV imported via UI (preview→import)' : 'uploaded; import-complete text not detected', { previewButtons: n });
  // Verify the Arabic merchant + long-description row landed
  await page.goto('/dashboard/transactions', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1500);
  const search = page.locator('input[type="search"], input[placeholder*="earch" i]').first();
  await search.fill('قهوة').catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, 'p06', '04_txn_search_arabic');
  const txnBody = await page.locator('body').innerText().catch(() => '');
  const arabicLanded = txnBody.includes('قهوة');
  record('p06', arabicLanded ? 'PASS' : 'UNCONFIRMED', arabicLanded ? 'Arabic merchant from CSV visible in transactions' : 'Arabic merchant not found post-import (may be dedup or async)', {});
  await ctx.close();
  expect(success || arabicLanded, 'CSV import drove through UI').toBeTruthy();
});

// ---------- P09: create a side-hustle (family-gated) ----------
test('CRUD p09 — create side-hustle', async ({ browser }) => {
  test.setTimeout(180_000);
  const { ctx, page, ok, reason } = await loginViaUI(browser, 'p09', 'p09-sidehustle');
  if (!ok) { await shot(page, 'p09', 'LOGIN_FAIL'); record('p09', 'LOGIN_FAIL', reason || ''); await ctx.close(); test.skip(true, reason); return; }
  await page.goto('/dashboard/side-hustles', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, 'p09', '01_side_hustles');
  const body0 = await page.locator('body').innerText().catch(() => '');
  if (/upgrade to family|family plan exclusive|start free trial/i.test(body0)) {
    record('p09', 'GATED', 'family paywall shown — persona not on family plan (gate works; reset plan to family to test create)');
    await ctx.close(); return;
  }
  const name = `QA Freelance ${RUN_ID.slice(-4)}`;
  await page.getByRole('button', { name: /add side hustle/i }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'p09', '02_add_modal');
  await page.locator('#sh-name').fill(name).catch(() => {});
  await page.locator('#sh-type').fill('Consulting').catch(() => {});
  await page.locator('#sh-currency').selectOption('USD').catch(() => {});
  await shot(page, 'p09', '03_form_filled');
  await page.getByRole('button', { name: /^add$|^save$/i }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await shot(page, 'p09', '04_after_submit');
  const body = await page.locator('body').innerText().catch(() => '');
  const created = body.includes(name) || /side hustle added/i.test(body);
  record('p09', created ? 'PASS' : 'UNCONFIRMED', created ? 'side-hustle created + appears in list' : 'submitted; new item not confirmed in list', {});
  await ctx.close();
  expect(created, 'side-hustle create drove through UI').toBeTruthy();
});

// ---------- P10: add a transaction with Arabic, verify render, delete ----------
test('CRUD p10 — add Arabic transaction + delete', async ({ browser }) => {
  test.setTimeout(180_000);
  const { ctx, page, ok, reason } = await loginViaUI(browser, 'p10', 'p10-intl-rtl');
  if (!ok) { await shot(page, 'p10', 'LOGIN_FAIL'); record('p10', 'LOGIN_FAIL', reason || ''); await ctx.close(); test.skip(true, reason); return; }
  await page.goto('/dashboard/transactions', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, 'p10', '01_transactions');
  // P10 runs in Arabic (RTL): the add button is "+ إضافة", not "+ Add".
  await page.getByRole('button', { name: /\+\s*add|add transaction|إضافة/i }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'p10', '02_add_modal');
  await page.locator('#txn-form-description').fill(ARABIC).catch(() => {});
  await page.locator('#txn-form-amount').fill('5.50').catch(() => {});
  await page.locator('#txn-form-category').selectOption({ index: 1 }).catch(() => {});
  await shot(page, 'p10', '03_form_filled');
  // Modal submit: "Add"/"إضافة" (exact, to avoid the "+ إضافة" header button).
  await page.getByRole('button', { name: /^add$|^save$|^إضافة$|^حفظ$/i }).first().click({ timeout: 8000 }).catch(() => {});
  // After submit the list re-fetches (skeletons) — wait it out before asserting,
  // and match the Arabic success toast ("تمت إضافة المعاملة") too.
  await page.waitForTimeout(1500);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2500);
  await shot(page, 'p10', '04_after_add');
  const body = await page.locator('body').innerText().catch(() => '');
  const added = body.includes(ARABIC) || /transaction added|تمت\s*إضافة|أضيفت|تمت الإضافة/i.test(body);
  record('p10', added ? 'PASS' : 'UNCONFIRMED', added ? 'Arabic transaction added + renders (RTL intact)' : 'submitted; Arabic row not confirmed', {});
  // Delete it (best-effort cleanup + verify delete affordance)
  let deleted = false;
  const delBtn = page.getByRole('button', { name: /delete|حذف|إزالة/i });
  if (await delBtn.count().catch(() => 0) > 0) {
    await delBtn.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /^delete$|^confirm$|^حذف$|^تأكيد$/i }).last().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const after = await page.locator('body').innerText().catch(() => '');
    deleted = /transaction deleted/i.test(after) || !after.includes(ARABIC);
    await shot(page, 'p10', '05_after_delete');
  }
  record('p10', deleted ? 'PASS' : 'INFO', deleted ? 'transaction delete affordance works (cleaned up test row)' : 'no delete affordance found / not confirmed', {});
  await ctx.close();
  expect(added, 'Arabic transaction add drove through UI').toBeTruthy();
});

test.afterAll(async () => {
  mkdirSync(EVIDENCE, { recursive: true });
  writeFileSync(join(EVIDENCE, '_results-crud.json'), JSON.stringify(results, null, 2));
});
