#!/usr/bin/env node
/**
 * Web ↔ Mobile API parity checker.
 *
 * 2026-05-02: founder asked for the manual web/mobile drift audit
 * to be automated so CI catches divergence. This script extracts
 * every backend endpoint URL from BOTH:
 *   • Web client:    src/lib/api.ts          (apiFetch('/api/...'))
 *   • Mobile client: ../barakah_app/lib/services/api/*.dart
 *                    (_dio.{get,post,put,patch,delete}('/api/...'))
 * and prints a diff:
 *   ✅ both    — endpoint present on both clients
 *   ⚠ web-only  — web hits this but mobile doesn't
 *   ⚠ mobile-only — mobile hits this but web doesn't
 *
 * Default mode is report-only. Pass `--strict` (used in CI) to exit
 * non-zero when drift outside the allowlist appears, which catches
 * NEW divergence as it lands without holding up legitimate
 * one-platform endpoints (admin, FCM, web checkout, native exports,
 * etc).
 *
 * The mobile repo is expected at `../barakah_app` relative to this
 * script's repo root (the layout we use locally + in CI). Set
 * MOBILE_REPO env var to override.
 *
 * Heuristics + known limitations:
 *   • Path params are normalised: /api/foo/{id} === /api/foo/123
 *     === /api/foo/${userId}.
 *   • Query strings are stripped — only the path matters.
 *   • Endpoints assembled from variables are best-effort matched.
 *   • This is structural, not behavioural. It catches "missing
 *     endpoint" — it doesn't catch "endpoint exists but expects
 *     different fields." That's a future contract-test layer.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const MOBILE_ROOT = process.env.MOBILE_REPO
  ? resolve(process.env.MOBILE_REPO)
  : resolve(REPO_ROOT, '..', 'barakah_app');

const STRICT = process.argv.includes('--strict');

function color(code, s) {
  return process.stdout.isTTY ? `[${code}m${s}[0m` : s;
}
const green = (s) => color('32', s);
const yellow = (s) => color('33', s);
const red = (s) => color('31', s);
const dim = (s) => color('90', s);

function walk(dir, pred, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === '.dart_tool' || entry === 'build'
        || entry === 'ios' || entry === 'android' || entry.startsWith('.')) continue;
    let s;
    try { s = statSync(full); } catch { continue; }
    if (s.isDirectory()) walk(full, pred, out);
    else if (pred(full)) out.push(full);
  }
  return out;
}

function normalisePath(p) {
  return p
    .split('?')[0]
    // ${id} (TS template) and {id} (REST docs)
    .replace(/\/\$\{[^}]+\}/g, '/{}')
    .replace(/\/\{[a-zA-Z0-9_]+\}/g, '/{}')
    // $id and $groupId (Dart string interpolation)
    .replace(/\/\$[a-zA-Z_][a-zA-Z0-9_]*/g, '/{}')
    // bare numeric ids
    .replace(/\/\d+(?=\/|$)/g, '/{}')
    .replace(/\/$/, '');
}

function extractPathsFromExpression(expr) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
    return [expr.text];
  }

  if (ts.isTemplateExpression(expr)) {
    let path = expr.head.text;
    for (const span of expr.templateSpans) {
      const nextText = span.literal.text;
      if (path.endsWith('/') || nextText.startsWith('/')) {
        path += '{}';
      }
      path += nextText;
    }
    return [path];
  }

  if (ts.isConditionalExpression(expr)) {
    return [
      ...extractPathsFromExpression(expr.whenTrue),
      ...extractPathsFromExpression(expr.whenFalse),
    ];
  }

  if (ts.isParenthesizedExpression(expr)) {
    return extractPathsFromExpression(expr.expression);
  }

  return [];
}

function extractWebEndpoints() {
  const apiFile = join(REPO_ROOT, 'src/lib/api.ts');
  if (!existsSync(apiFile)) {
    throw new Error(`web api.ts not found at ${apiFile}`);
  }
  const src = readFileSync(apiFile, 'utf8');
  const sourceFile = ts.createSourceFile(apiFile, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const endpoints = new Set();

  function visit(node) {
    if (ts.isCallExpression(node)
        && ts.isIdentifier(node.expression)
        && node.expression.text === 'apiFetch'
        && node.arguments.length > 0) {
      for (const rawPath of extractPathsFromExpression(node.arguments[0])) {
        if (rawPath.includes('/api') || rawPath.startsWith('/admin')) {
          const path = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
          endpoints.add(normalisePath(path));
        } else if (rawPath.startsWith('/auth')) {
          endpoints.add(normalisePath(rawPath));
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return endpoints;
}

function extractMobileEndpoints() {
  const apiDir = join(MOBILE_ROOT, 'lib/services/api');
  if (!existsSync(apiDir)) {
    throw new Error(`mobile api dir not found at ${apiDir} (set MOBILE_REPO env var if it lives elsewhere)`);
  }
  const dartFiles = walk(apiDir, (f) => f.endsWith('.dart'));
  const endpoints = new Set();
  const re = /_dio\.(?:get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g;
  for (const file of dartFiles) {
    const src = readFileSync(file, 'utf8');
    let m;
    while ((m = re.exec(src)) !== null) {
      endpoints.add(normalisePath(m[1]));
    }
  }
  return endpoints;
}

const WEB_ONLY_ADMIN_AND_MARKETING = new Set([
  '/api/lifecycle/save-offer/accept',
  '/api/contact',
  '/api/careers/apply',
  '/api/churn/start',
  '/api/churn/pause',
  '/api/churn/exit-survey',
  '/api/onboarding/seed-demo',
  '/api/feature-flags/me',
  '/api/feature-flags/resolve',
  '/api/referrals/click/{}',
  '/api/lifecycle/summary',
]);

const WEB_ONLY_DATA_MANAGEMENT = new Set([
  '/api/assets/bulk-delete',
  '/api/assets/grouped',
  '/api/categorize/rules',
  '/api/categorize/rules/{}',
  '/api/transactions/recategorize',
  '/api/transactions/all',
  '/api/transactions/bulk-import',
  '/api/transactions/mark-reviewed',
  '/api/transactions/monthly-summary',
  '/api/transactions/process-recurring',
  '/api/transactions/usage',
]);

const WEB_ONLY_BROWSER_SURFACES = new Set([
  '/api/barakah-score',
  '/api/currency/rates',
  '/api/currency/convert',
  '/api/dashboard/insights',
  '/api/debts/payment-suggestions',
  '/api/family/invite/preview',
  '/api/family/members',
  '/api/halal/check/{}',
  '/api/halal/screening-status',
  '/api/investments/benchmarks',
  '/api/investments/portfolio/history',
  '/api/notifications/fcm-token',
  '/api/notifications/{}',
  '/api/notifications/{}/read',
  '/api/zakat/calculate',
  '/api/zakat/fitr',
  '/api/zakat/scholarly-references',
  '/api/zakat/snapshots',
  '/api/zakat/snapshots/locked',
  '/api/zakat/supported-currencies',
]);

const WEB_ONLY_AUTH_AND_BILLING = new Set([
  '/api/stripe/upgrade',
  '/api/subscriptions/cancellations',
  '/api/subscriptions/undismiss',
  '/auth/export-data',
  '/auth/google/confirm-link',
  '/auth/logout',
  '/auth/setup-complete',
  '/auth/verify-email',
]);

/**
 * Endpoints intentionally on web only. Most are admin (`/admin/*`),
 * web checkout/account-management flows, or dense browser data tools.
 */
function isWebOnlyAllowed(p) {
  if (p.startsWith('/admin/')) return true;
  return WEB_ONLY_ADMIN_AND_MARKETING.has(p)
    || WEB_ONLY_DATA_MANAGEMENT.has(p)
    || WEB_ONLY_BROWSER_SURFACES.has(p)
    || WEB_ONLY_AUTH_AND_BILLING.has(p);
}

const MOBILE_ONLY_NATIVE_SURFACES = new Set([
  '/api/assets/{}/update-price',
  '/api/bills/upcoming',
  '/api/import/monarch/preview',
  '/api/investments/benchmark',
  '/api/investments/benchmark-catalog',
  '/api/investments/holdings/{}/price',
  '/api/riba/analyze/{}',
  '/api/shared/groups/{}/members/{}',
  '/api/shared/groups/{}/regenerate-invite',
  '/api/side-hustles/{}/export/csv',
  '/api/side-hustles/{}/export/pdf',
  '/api/side-hustles/{}/summary',
  '/api/transactions/category-detail',
  '/api/transactions/export/csv',
  '/api/transactions/export/pdf',
  '/api/transactions/{}/receipt',
  '/api/zakat/calculate-gold-jewelry',
  '/api/zakat/calculate-savings-account',
  '/api/zakat/retirement-method',
]);

const MOBILE_ONLY_AUTH_AND_PUSH = new Set([
  '/auth/phone',
  '/auth/refresh',
  '/api/notifications/register-device',
  '/api/notifications/unregister-device',
  '/api/notifications/fcm/register',
  '/api/notifications/fcm/unregister',
]);

const MOBILE_ONLY_LEGACY_ALIASES = new Set([
  '/transactions/mark-reviewed',
]);

/**
 * Endpoints intentionally on mobile only: native integrations,
 * binary exports/downloads, native auth/refresh, and one legacy
 * admin alias that remains in the mobile API facade.
 */
function isMobileOnlyAllowed(p) {
  return MOBILE_ONLY_NATIVE_SURFACES.has(p)
    || MOBILE_ONLY_AUTH_AND_PUSH.has(p)
    || MOBILE_ONLY_LEGACY_ALIASES.has(p);
}

function main() {
  console.log('Web ↔ Mobile API parity check');
  console.log(dim(`Web:    ${REPO_ROOT}/src/lib/api.ts`));
  console.log(dim(`Mobile: ${MOBILE_ROOT}/lib/services/api/`));
  console.log(dim(`Mode:   ${STRICT ? 'strict (CI gating)' : 'report-only'}`));
  console.log();

  const web = extractWebEndpoints();
  const mobile = extractMobileEndpoints();

  const both = new Set([...web].filter(p => mobile.has(p)));
  const webOnly = [...web].filter(p => !mobile.has(p)).sort();
  const mobileOnly = [...mobile].filter(p => !web.has(p)).sort();

  const realWebOnly = webOnly.filter(p => !isWebOnlyAllowed(p));
  const realMobileOnly = mobileOnly.filter(p => !isMobileOnlyAllowed(p));

  console.log(`${green('✅ both:           ')} ${both.size}`);
  console.log(`${dim('   web-only allowed: ')} ${webOnly.length - realWebOnly.length}`);
  console.log(`${yellow('⚠ web-only DRIFT:  ')} ${realWebOnly.length}`);
  console.log(`${dim('   mobile-only allowed:')} ${mobileOnly.length - realMobileOnly.length}`);
  console.log(`${yellow('⚠ mobile-only DRIFT:')} ${realMobileOnly.length}`);
  console.log();

  if (realWebOnly.length > 0) {
    console.log(yellow('Web-only DRIFT (web has these, mobile does not):'));
    realWebOnly.forEach(p => console.log(`  ${p}`));
    console.log();
  }
  if (realMobileOnly.length > 0) {
    console.log(yellow('Mobile-only DRIFT (mobile has these, web does not):'));
    realMobileOnly.forEach(p => console.log(`  ${p}`));
    console.log();
  }

  if (realWebOnly.length === 0 && realMobileOnly.length === 0) {
    console.log(green('✅ No parity drift outside allowlist.'));
    return 0;
  }

  if (STRICT) {
    console.log(red('FAIL — drift outside allowlist (--strict mode).'));
    console.log(dim('Resolve by either:'));
    console.log(dim('  1. Implementing the missing-side endpoint, or'));
    console.log(dim('  2. Adding the path to the allowlist in this script with a'));
    console.log(dim('     comment explaining why it is intentionally one-platform.'));
    return 1;
  }

  console.log(dim('Report-only mode — exit 0. Pass --strict to fail on drift.'));
  return 0;
}

process.exit(main());
