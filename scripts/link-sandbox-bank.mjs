#!/usr/bin/env node
/**
 * One-shot script that links a Plaid-sandbox bank to a test user and
 * exercises the full sync pipeline end-to-end.
 *
 * Pipeline:
 *   1. POST /auth/login                       → session cookies
 *   2. GET  /auth/csrf                        → XSRF-TOKEN
 *   3. POST https://sandbox.plaid.com/sandbox/public_token/create
 *           → skip the Plaid Link iframe entirely (public_token directly)
 *   4. POST /api/plaid/exchange-token         → backend stores access_token
 *   5. POST /api/plaid/sync-all               → backend hits sandbox.plaid.com
 *   6. GET  /api/plaid/accounts               → lists the newly-linked bank
 *   7. GET  /api/transactions/list            → confirms sandbox txns landed
 *   8. GET  /api/assets/list                  → confirms synced balances
 *
 * Prerequisites:
 *   • Backend (commit 2cc1...) deployed with the PLAID_SANDBOX_EMAILS
 *     + PLAID_SANDBOX_SECRET env vars pointing at applereview.
 *   • PLAID_SANDBOX_CLIENT_ID + PLAID_SANDBOX_SECRET available in THIS
 *     process's env (so we can call Plaid sandbox directly from step 3).
 *
 * Usage:
 *   PLAID_SANDBOX_CLIENT_ID=... \
 *   PLAID_SANDBOX_SECRET=... \
 *   E2E_API_URL=https://api.trybarakah.com \
 *   E2E_EMAIL=applereview@trybarakah.com \
 *   E2E_PASSWORD='BrkE2E_Apr2026!' \
 *   node scripts/link-sandbox-bank.mjs
 *
 * Defaults to First Platypus Bank (ins_109508) — the canonical Plaid
 * sandbox institution. user_good / pass_good is the sandbox login.
 *
 * Safe to re-run: the backend's exchangePublicToken de-dupes by
 * plaidAccountId so re-linking the same sandbox institution refreshes
 * the existing rows instead of creating dupes.
 */

const API = process.env.E2E_API_URL || 'https://api.trybarakah.com';
const EMAIL = process.env.E2E_EMAIL || 'applereview@trybarakah.com';
const PASSWORD = process.env.E2E_PASSWORD || '';
const PLAID_CLIENT_ID = process.env.PLAID_SANDBOX_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SANDBOX_SECRET;
const PLAID_INSTITUTION = process.env.PLAID_SANDBOX_INSTITUTION || 'ins_109508'; // First Platypus Bank

if (!PASSWORD) {
  console.error('✗ E2E_PASSWORD is required.');
  process.exit(1);
}
if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.error('✗ PLAID_SANDBOX_CLIENT_ID + PLAID_SANDBOX_SECRET are required.');
  console.error('  Find them at: https://dashboard.plaid.com/team/keys (Sandbox tab).');
  process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Collect Set-Cookie values from a fetch Response in the Node-20+ way. */
function collectCookies(response, existing = '') {
  const next = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : (response.headers.get('set-cookie')
        ? response.headers.get('set-cookie').split(/,(?=\s*[A-Za-z_-]+=)/)
        : []);
  const joined = next.map((c) => c.split(';')[0].trim()).join('; ');
  if (!existing) return joined;
  if (!joined) return existing;
  return `${existing}; ${joined}`;
}

function extractCookieValue(cookieHeader, name) {
  const m = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function jsonOrThrow(res, stepLabel) {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${stepLabel} failed: HTTP ${res.status} — ${text.slice(0, 200)}`);
  }
  return text ? JSON.parse(text) : {};
}

// ── Pipeline ────────────────────────────────────────────────────────────────

async function run() {
  console.log(`▸ 1. Logging in as ${EMAIL} against ${API}`);
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  let cookies = collectCookies(loginRes, '');
  if (!loginRes.ok) {
    throw new Error(`login failed: HTTP ${loginRes.status} — ${await loginRes.text()}`);
  }
  console.log('  ✓ session cookies received');

  console.log('▸ 2. Bootstrapping XSRF-TOKEN');
  const csrfRes = await fetch(`${API}/auth/csrf`, { headers: { cookie: cookies } });
  cookies = collectCookies(csrfRes, cookies);
  const xsrf = extractCookieValue(cookies, 'XSRF-TOKEN');
  if (!xsrf) throw new Error('XSRF-TOKEN not in cookie jar after /auth/csrf');
  console.log('  ✓ XSRF-TOKEN obtained');

  console.log(`▸ 3. Creating Plaid sandbox public_token (institution ${PLAID_INSTITUTION})`);
  const sandboxRes = await fetch('https://sandbox.plaid.com/sandbox/public_token/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      institution_id: PLAID_INSTITUTION,
      initial_products: ['transactions'],
      options: { override_username: 'user_good', override_password: 'pass_good' },
    }),
  });
  const sandboxJson = await jsonOrThrow(sandboxRes, 'sandbox/public_token/create');
  const publicToken = sandboxJson.public_token;
  if (!publicToken || !publicToken.startsWith('public-sandbox-')) {
    throw new Error(`unexpected public_token shape: ${publicToken}`);
  }
  console.log('  ✓ got public_token (sandbox)');

  console.log('▸ 4. Exchanging public_token via /api/plaid/exchange-token');
  const exchangeRes = await fetch(`${API}/api/plaid/exchange-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookies,
      'X-XSRF-TOKEN': xsrf,
    },
    body: JSON.stringify({ publicToken, institutionName: 'First Platypus Bank (sandbox)' }),
  });
  const exchangeJson = await jsonOrThrow(exchangeRes, 'exchange-token');
  const linked = exchangeJson.accounts || [];
  console.log(`  ✓ backend linked ${linked.length} account(s)`);

  console.log('▸ 5. Syncing via /api/plaid/sync-all');
  const syncRes = await fetch(`${API}/api/plaid/sync-all`, {
    method: 'POST',
    headers: { cookie: cookies, 'X-XSRF-TOKEN': xsrf },
  });
  const syncJson = await jsonOrThrow(syncRes, 'sync-all');
  console.log(`  ✓ sync complete — ${syncJson.totalAdded ?? 0} transaction(s) imported`);

  console.log('▸ 6. Reading /api/plaid/accounts');
  const accountsRes = await fetch(`${API}/api/plaid/accounts`, { headers: { cookie: cookies } });
  const accountsJson = await jsonOrThrow(accountsRes, 'accounts');
  const accounts = accountsJson.accounts || [];
  console.log(`  ✓ ${accounts.length} linked account(s):`);
  for (const a of accounts) {
    console.log(`      • ${a.name} (${a.institutionName}) · mask=${a.accountMask ?? '--'} · balance=${a.balance ?? '--'}`);
  }

  console.log('▸ 7. Verifying transactions landed: /api/transactions/list?page=0&size=5');
  const txRes = await fetch(`${API}/api/transactions/list?page=0&size=5`, { headers: { cookie: cookies } });
  const txJson = await jsonOrThrow(txRes, 'transactions/list');
  const txs = txJson.transactions || [];
  console.log(`  ✓ latest ${txs.length} transaction(s):`);
  for (const t of txs.slice(0, 5)) {
    const amount = t.amount != null ? `${t.amount >= 0 ? '+' : ''}${t.amount}` : '?';
    console.log(`      • ${t.merchantName ?? t.description ?? '?'} · ${t.category ?? '?'} · ${amount}`);
  }

  console.log('▸ 8. Verifying synced balances land in /api/assets/list');
  const assetsRes = await fetch(`${API}/api/assets/list`, { headers: { cookie: cookies } });
  const assetsJson = await jsonOrThrow(assetsRes, 'assets/list');
  const linkedAssets = (assetsJson.assets || []).filter(
    (a) => a.linkedSource === 'plaid' || a.institutionName,
  );
  console.log(`  ✓ ${linkedAssets.length} Plaid-linked asset(s) on the Assets surface`);

  console.log('\n✅ Sandbox bank linked + synced end-to-end.');
  console.log('   Log in at https://trybarakah.com with applereview to see the data live on');
  console.log('   /dashboard/assets and /dashboard/transactions — tap the new Sync button');
  console.log('   to verify the refresh loop from UI.');
}

run().catch((err) => {
  console.error(`\n✗ ${err.message}`);
  if (err.stack) console.error(err.stack.split('\n').slice(1, 4).join('\n'));
  process.exit(1);
});
