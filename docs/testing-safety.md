# Browser test environments

Production smoke runs only `public-pages.spec.ts` and non-mutation `api-health.spec.ts`, on Chromium desktop/mobile. It needs no account credentials. `@mutation` excludes signup/login POST probes from that tier. The workflow does not use the curated app-review account.

Run the ten-persona UI/CRUD suites against an isolated local seeded backend only. Set `E2E_TEN_PERSONAS_SEEDED=1`, a local `E2E_BASE_URL`, `E2E_PERSONA_RUN_ID` matching the seeded account emails, and `E2E_PERSONA_SECRETS_PATH` pointing to the private JSON credential manifest. Keep manifests outside Git. Optional `E2E_EVIDENCE_DIR` controls artifact output; default output is ignored `test-results/`.

Without explicit opt-in those suites skip before reading private fixtures. Opting in with missing fixtures or a nonlocal target fails collection. An enabled scenario's failed login and horizontal overflow fail tests. Other authenticated suites also fail an unsuccessful configured login; deliberately omitted credentials remain an explicit environment skip, not proof of successful authenticated coverage.

The dependency refresh removes Vite's reported advisories. Full `npm audit` still reports the development-only braces chain (GHSA-vfj7-8cjw-p6xm); as of October 21, 2026 the advisory lists no patched version, and npm publishes 3.0.3 as latest. Production-only audit is separate. Do not force an eslint-config-next downgrade, delete the audit gate, or describe the remaining finding as fixed. Keep untrusted patterns out of lint/build tooling and revisit when an upstream fix is published.

Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm .
