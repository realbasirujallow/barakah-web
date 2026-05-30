#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# Barakah web deploy helper  (CANONICAL way to deploy barakah-web)
#
# Why this exists:
#   Railway builds the web app with Nixpacks by running `npm run build`
#   (= `next build`, which type-checks). If that build fails, Railway marks
#   the deployment FAILED but SILENTLY keeps serving the previous (old)
#   deployment. A broken `railway up` therefore looks "fine" on the live
#   site while your fixes never actually ship.
#
#   This script reproduces Railway's build LOCALLY first and ABORTS before
#   ever calling `railway up` if it fails -- so a broken build can never
#   silently replace (or fail to replace) the running deployment unnoticed.
#
# Usage:
#   ./scripts/deploy-web.sh
#
# Env overrides:
#   RAILWAY_SERVICE   Railway service name      (default: barakah-web)
#   DEPLOY_URL        URL to verify post-deploy (default: https://trybarakah.com)
#   SKIP_VERIFY=1     Skip the post-deploy curl check
# ---------------------------------------------------------------------------

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RAILWAY_SERVICE="${RAILWAY_SERVICE:-barakah-web}"
DEPLOY_URL="${DEPLOY_URL:-https://trybarakah.com}"

# ---------------------------------------------------------------------------
# [1/4] Build locally exactly like Railway does (next build => type-check).
# ---------------------------------------------------------------------------
echo "==> [1/4] Building locally (npm run build) -- same step Railway runs ..."
if ! npm run build; then
  echo "" >&2
  echo "ERROR: 'npm run build' FAILED locally." >&2
  echo "       This is the SAME build Railway runs; it would FAIL there too and" >&2
  echo "       Railway would silently keep serving the old deployment." >&2
  echo "       Aborting -- 'railway up' was NOT triggered. Fix the errors above." >&2
  exit 1
fi

# Capture the build id Next.js just produced so we can confirm it goes live.
LOCAL_BUILD_ID=""
if [ -f .next/BUILD_ID ]; then
  LOCAL_BUILD_ID="$(cat .next/BUILD_ID)"
  echo "==> Local build OK. BUILD_ID=${LOCAL_BUILD_ID}"
else
  echo "==> Local build OK. (no .next/BUILD_ID found -- post-deploy check will be skipped)"
fi

# ---------------------------------------------------------------------------
# [2/4] Deploy to Railway.
# ---------------------------------------------------------------------------
echo "==> [2/4] Deploying to Railway service '${RAILWAY_SERVICE}' ..."
if ! railway up --service "${RAILWAY_SERVICE}"; then
  echo "ERROR: 'railway up' returned a non-zero exit code." >&2
  echo "       Check the build logs above and 'railway status'." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# [3/4] Report Railway's view of the latest deployment (best effort).
# ---------------------------------------------------------------------------
echo "==> [3/4] Railway status:"
railway status 2>/dev/null || echo "    (could not read 'railway status')"

# ---------------------------------------------------------------------------
# [4/4] Verify the NEW build is actually live (best effort, advisory).
#   Next.js embeds the BUILD_ID in served HTML as /_next/static/<BUILD_ID>/.
#   Cloudflare may cache HTML, so this is advisory: a mismatch is a WARNING,
#   not a hard failure (it may just be CDN propagation/caching).
# ---------------------------------------------------------------------------
if [ "${SKIP_VERIFY:-0}" = "1" ] || [ -z "${LOCAL_BUILD_ID}" ]; then
  echo "==> [4/4] Post-deploy verification skipped."
  echo "Done."
  exit 0
fi

echo "==> [4/4] Verifying ${DEPLOY_URL} is serving BUILD_ID ${LOCAL_BUILD_ID} ..."
attempts=10
sleep_s=12
found=0
for i in $(seq 1 "${attempts}"); do
  # Cache-bust query param to dodge Cloudflare HTML caching where possible.
  html="$(curl -fsSL --max-time 20 "${DEPLOY_URL}/?_v=${LOCAL_BUILD_ID}" 2>/dev/null || true)"
  if printf '%s' "${html}" | grep -q "${LOCAL_BUILD_ID}"; then
    found=1
    break
  fi
  echo "    attempt ${i}/${attempts}: new build not visible yet, waiting ${sleep_s}s ..."
  sleep "${sleep_s}"
done

if [ "${found}" = "1" ]; then
  echo "==> SUCCESS: ${DEPLOY_URL} is serving the new build (${LOCAL_BUILD_ID})."
  echo "Done."
else
  echo "" >&2
  echo "WARNING: After ~$((attempts * sleep_s))s, ${DEPLOY_URL} did not report BUILD_ID" >&2
  echo "         ${LOCAL_BUILD_ID}. The deploy may still be propagating, Cloudflare may" >&2
  echo "         be serving cached HTML, OR the Railway deployment did not go live." >&2
  echo "         CHECK: railway status   and   curl -sSL ${DEPLOY_URL} | grep _next/static" >&2
  exit 2
fi
