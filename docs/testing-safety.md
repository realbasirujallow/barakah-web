# Browser test environments

Production smoke runs only `public-pages.spec.ts` and non-mutation `api-health.spec.ts`, on Chromium desktop/mobile. It needs no account credentials. `@mutation` excludes signup/login POST probes from that tier. The workflow does not use the curated app-review account.

The release gate checks both basic liveness and dependency-aware readiness. `/health` returning 200 does not override `/actuator/health` returning DOWN. Set `E2E_READINESS_URL` to the actual backend health URL when the website proxies API calls but not Actuator. The default is `${E2E_API_URL}/actuator/health`; the production workflow explicitly selects `https://api.trybarakah.com/actuator/health`. A staging override must supply its matching readiness URL too. Readiness must return HTTP 200 and JSON status UP; do not skip or weaken it to make a degraded deployment look green.

```bash
E2E_EMAIL= E2E_PASSWORD= \
E2E_BASE_URL=https://trybarakah.com E2E_API_URL=https://trybarakah.com \
E2E_READINESS_URL=https://api.trybarakah.com/actuator/health \
npx playwright test e2e/public-pages.spec.ts e2e/api-health.spec.ts \
  --project=chromium --project=mobile-chrome --grep-invert @mutation
```

Run the ten-persona UI/CRUD suites against an isolated local seeded backend only. Set `E2E_TEN_PERSONAS_SEEDED=1`, a local `E2E_BASE_URL`, `E2E_PERSONA_RUN_ID` matching the seeded account emails, and `E2E_PERSONA_SECRETS_PATH` pointing to the private JSON credential manifest. Keep manifests outside Git. Optional `E2E_EVIDENCE_DIR` controls artifact output; default output is ignored `test-results/`.

Without explicit opt-in those suites skip before reading private fixtures. Opting in with missing fixtures or a nonlocal target fails collection. An enabled scenario's failed login and horizontal overflow fail tests. Other authenticated suites also fail an unsuccessful configured login; deliberately omitted credentials remain an explicit environment skip, not proof of successful authenticated coverage.

The dependency refresh removes Vite's reported advisories. Full `npm audit` still reports the development-only braces chain (GHSA-vfj7-8cjw-p6xm); as of October 21, 2026 the advisory lists no patched version, and npm publishes 3.0.3 as latest. Production-only audit is separate. Do not force an eslint-config-next downgrade, delete the audit gate, or describe the remaining finding as fixed. Keep untrusted patterns out of lint/build tooling and revisit when an upstream fix is published.

Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm .
