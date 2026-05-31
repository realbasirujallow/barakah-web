/**
 * scripts/contract-check.ts
 *
 * Cross-repo contract sanity check. Extracts every `apiFetch('/api/...')`
 * call site from `src/lib/api.ts` and pings the corresponding backend
 * endpoint, treating any response OTHER than 404 as "route exists". The
 * intent is NOT to verify auth or business logic — just to catch endpoints
 * that the frontend calls but the backend has removed or renamed (silent
 * contract drift). 405 (method-not-allowed) means the route IS present
 * (just a different verb than our regex-guessed probe) and is NOT drift.
 *
 * Usage:
 *   API_BASE=https://api.trybarakah.com npx tsx scripts/contract-check.ts
 *   API_BASE=http://localhost:8080      npx tsx scripts/contract-check.ts
 *
 * Exits non-zero only if an endpoint returns 404 (gone). All other status
 * codes (200, 401, 403, 405, 422, 429, 500) are treated as "endpoint exists"
 * and are NOT failures — the auth-required and business-logic surface area is
 * huge and out of scope. Unresolved dynamic paths (nested template literals)
 * are skipped rather than probed.
 *
 * 2026-05-06: created as part of the overnight readiness backlog. Run
 * in CI on every backend or web PR that touches /api/* to catch drift
 * before deploy.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const API_BASE = process.env.API_BASE ?? 'https://api.trybarakah.com';
const TIMEOUT_MS = 10_000;

interface EndpointCall {
  method: string;
  path: string;
}

function extractEndpoints(): EndpointCall[] {
  const apiFile = join(__dirname, '..', 'src', 'lib', 'api.ts');
  const source = readFileSync(apiFile, 'utf-8');
  const calls: EndpointCall[] = [];
  const seen = new Set<string>();

  // Match `apiFetch('/api/foo'` or `apiFetch(`${...}/api/foo`)`.
  // Capture the path literal. method defaults to GET; we look for
  // `method: 'POST'|'PUT'|'DELETE'|'PATCH'` in the same line block.
  const regex = /apiFetch\(\s*['"`]([^'"`]+)['"`][^)]*?(?:method:\s*['"`](GET|POST|PUT|DELETE|PATCH)['"`])?[^)]*\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    const path = match[1];
    if (!path.startsWith('/api/')) continue;
    // Replace template-literal segments with a placeholder so we can ping
    // an example value (works for /api/admin/users/{id}/... etc.)
    const concretePath = path.replace(/\$\{[^}]+\}/g, '1');
    // Skip paths we couldn't fully resolve: a NESTED template literal (e.g.
    // `/api/x${year ? `?year=${year}` : ''}`) truncates at the inner backtick
    // and leaves a stray `${`, which would be probed as a bogus 404. That's a
    // checker artifact, not real contract drift — don't probe it.
    if (concretePath.includes('${')) continue;
    const method = (match[2] ?? 'GET').toUpperCase();
    const key = `${method} ${concretePath}`;
    if (seen.has(key)) continue;
    seen.add(key);
    calls.push({ method, path: concretePath });
  }
  return calls;
}

interface PingResult {
  endpoint: EndpointCall;
  status: number;
  ok: boolean;
  note: string;
}

async function ping(endpoint: EndpointCall): Promise<PingResult> {
  const url = `${API_BASE}${endpoint.path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: endpoint.method === 'GET' ? 'GET' : endpoint.method,
      signal: controller.signal,
      // Send an empty body for non-GET so the route exists check passes
      ...(endpoint.method !== 'GET' && {
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      }),
    });
    const status = res.status;
    // 404 = endpoint missing → real contract drift (the thing this tool targets).
    if (status === 404) return { endpoint, status, ok: false, note: 'NOT FOUND — backend removed/renamed?' };
    // 405 = the route EXISTS but our probe used a different verb than the backend
    // allows. Verb detection here is regex-based and imperfect (multi-line
    // apiFetch calls, POST/PUT/DELETE-only routes), and "method mismatch" is NOT
    // the drift this tool targets (removed/renamed routes). Treat 405 as
    // "exists" so verb-only quirks don't false-positive and erode trust.
    if (status === 405) return { endpoint, status, ok: true, note: 'exists (405 — route present, verb-only)' };
    // Everything else (200/401/403/422/429/500) means the route exists.
    return { endpoint, status, ok: true, note: 'exists' };
  } catch (err) {
    return {
      endpoint,
      status: 0,
      ok: false,
      note: err instanceof Error ? err.message : 'unknown error',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main(): Promise<void> {
  const endpoints = extractEndpoints();
  console.log(`Checking ${endpoints.length} unique endpoint(s) against ${API_BASE}\n`);

  const results: PingResult[] = [];
  for (const ep of endpoints) {
    const r = await ping(ep);
    results.push(r);
    const tag = r.ok ? '✓' : '✗';
    console.log(`  ${tag} ${r.status.toString().padStart(3)} ${ep.method.padEnd(6)} ${ep.path}  ${r.ok ? '' : '— ' + r.note}`);
  }

  const failures = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failures.length}/${results.length} endpoints exist on ${API_BASE}`);
  if (failures.length > 0) {
    console.error(`\n${failures.length} contract drift(s) detected:`);
    for (const f of failures) {
      console.error(`  ${f.endpoint.method} ${f.endpoint.path} — ${f.note}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('contract-check failed:', err);
  process.exit(2);
});
