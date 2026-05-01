# Admin walkthrough runbook

**Goal**: validate every admin-page surface with a real admin session, against production, in ~5 minutes. The Playwright spec at `e2e/admin-walkthrough.spec.ts` exercises 18 admin surfaces; this runbook tells you how to run it safely.

The walkthrough is **not** part of the regular CI run because:
1. It requires temporarily granting admin access to the Apple-review test account
2. It hits the live `/admin/*` endpoints in production — read-only but audit-logged

## Setup (one-time)

1. **Find the user ID** of the test account (`E2E_EMAIL`, typically `applereview@trybarakah.com`):
   - Visit `/dashboard/admin` as an existing admin
   - Users tab → search the email → note the user `ID` shown next to the name

2. **Update Railway env** (backend service `barakah-backend`):
   - Settings → Variables → `ADMIN_USER_IDS`
   - Append the test user's ID (comma-separated): `1,42,N` where `N` is the test ID
   - Save → Railway auto-redeploys (~30s)

3. **Confirm admin access** by logging in as the test account and visiting `/dashboard/admin`. If the URL stays on `/admin` (no redirect to `/dashboard`), you have admin.

## Run

```bash
cd barakah-web
E2E_BASE_URL=https://trybarakah.com \
E2E_EMAIL=applereview@trybarakah.com \
E2E_PASSWORD='<password>'           \
E2E_AS_ADMIN=true                    \
npx playwright test e2e/admin-walkthrough.spec.ts \
  --reporter=list
```

Expected runtime: ~3 minutes for the full 18-test suite.

## Coverage

The spec checks:

**Main admin tabs (8)**
- Overview KPI render
- Users table render
- Alerts tab opens
- Unverified tab + bulk-resend button visible
- Lifecycle campaign center
- Experiments tab
- Deleted archive
- Email Log

**R37 secondary pages (7)**
- `/dashboard/admin/acquisition`
- `/dashboard/admin/funnel`
- `/dashboard/admin/growth`
- `/dashboard/admin/scorecard`
- `/dashboard/admin/email-locales`
- `/dashboard/admin/email-preview`
- `/dashboard/admin/halal-screening`

**R37 drilldown (3)**
- User detail modal opens with activity
- Force-Verify button label is clear
- Bills breakdown + subscriptions page render

## Cleanup (REQUIRED — do not skip)

After the walkthrough finishes, **revert the Railway env var**:

1. Railway → `barakah-backend` → Variables → `ADMIN_USER_IDS`
2. Remove the test user's ID
3. Save → redeploy

Why this matters:
- The Apple-review account is shared among App Store reviewers. Permanent admin access is an audit-trail risk.
- The next App Store review submission must show a clean activity log on this account.
- Granting admin in perpetuity makes log analysis ambiguous when investigating incidents.

## What to do when a test fails

The spec is designed so each test isolates a single surface. If `Alerts tab opens` fails, it's a regression on the alerts tab specifically. Pull up the failed run's screenshot from `test-results/*` and:

1. **Server-side regression** — open Railway logs filtered to `/admin/*` requests around the test timestamp, look for 500s or 403s.
2. **UI regression** — git-blame the matching component (e.g. `src/components/admin/AdminAlertsTab.tsx`) for the most recent commit touching it.
3. **Data shape mismatch** — diff the API response shape for the matching endpoint vs what the component expects.

File a ticket with the failure name, screenshot, and Railway log excerpt.

## CI integration (future)

If we ever want this on CI proper, the cleanest pattern is:

1. Set up a **dedicated `e2e-admin@trybarakah.com` test account** with permanent admin access in a non-prod environment (staging).
2. Point `E2E_BASE_URL` at staging in a separate scheduled GitHub Actions workflow.
3. Run nightly + on PRs that touch `src/app/dashboard/admin/**` or `src/components/admin/**`.

Today this is manual-only because we don't yet have a staging environment with its own DB.
