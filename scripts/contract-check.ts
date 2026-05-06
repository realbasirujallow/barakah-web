/**
 * scripts/contract-check.ts
 *
 * Cross-repo contract sanity check. Extracts every `apiFetch('/api/...')`
 * call site from `src/lib/api.ts` and pings the corresponding backend
 * endpoint with a HEAD or GET request, expecting a non-404 / non-405
 * response. The intent is NOT to verify auth or business logic — just
 * to catch endpoints that the frontend calls but the backend has
 * removed or renamed (silent contract drift).
 *
 * Usage:
 *   API_BASE=https://api.trybarakah.com npx tsx scripts/contract-check.ts
 *   API_BASE=http://localhost:8080      npx tsx scripts/contract-check.ts
 *
 * Exits non-zero if any endpoint returns 404 (gone) or 405 (method
 * mismatch). Other status codes (200, 401, 403, 429, 500) are treated
 * as "endpoint exists" and are NOT failures — the auth-required and
 * business-logic surface area is huge and out of scope.
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
    // 404 = endpoint missing; 405 = method mismatch — both are contract drift.
    if (status === 404) return { endpoint, status, ok: false, note: 'NOT FOUND — backend removed/renamed?' };
    if (status === 405) return { endpoint, status, ok: false, note: 'METHOD NOT ALLOWED — wrong verb?' };
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
