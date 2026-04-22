/**
 * Remove one-time bearer tokens (password reset, email verification,
 * family invite) from the browser URL after the page reads them into
 * memory.
 *
 * R7 audit (2026-04-21): email-delivered links land users on
 * `/reset-password?token=…`, `/verify-email?token=…`, or
 * `/family/join?token=…`. The raw token sits in the URL bar until the
 * user navigates away. That surface area leaks:
 *   - into browser history (Cmd-Y / Ctrl-H shows it)
 *   - into screenshots the user shares with support
 *   - into copied URLs the user pastes anywhere
 *   - into the Referer header on any outbound link from the page
 *
 * Tokens now live in HMAC-blind-indexed storage on the backend (see
 * TokenBlindIndex.java), so a DB leak can't reverse them — but the raw
 * bearer still sits in the URL during the brief window before the user
 * acts. `history.replaceState` silently rewrites the URL without
 * reloading the page or adding a history entry. The captured token
 * stays in React state; the address bar goes clean.
 *
 * Call ONCE on page mount after you've read the token into local
 * state. Works on Next.js App-Router pages; no-op on the server.
 */
export function scrubTokenFromUrl(paramName: string = 'token'): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    let changed = false;
    // Query-string removal (?token=…) — R7.
    if (url.searchParams.has(paramName)) {
      url.searchParams.delete(paramName);
      changed = true;
    }
    // R8 audit: token is now delivered in the URL fragment
    // (#token=…). The server never sees it, but it's still visible
    // in the address bar until we scrub. Clear the fragment too.
    if (url.hash && new RegExp('(?:^|&|#)' + paramName + '=').test(url.hash)) {
      url.hash = '';
      changed = true;
    }
    if (!changed) return;
    const cleaned = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
    // replaceState (not pushState) so Back doesn't return to the
    // token-bearing URL. No reload — React state is preserved.
    window.history.replaceState({}, '', cleaned);
    // R11 audit L-4 (2026-04-22): post-scrub self-check. If for any reason
    // the replaceState call failed silently (browser restrictions,
    // extensions intercepting history APIs, etc.) we want to know about it
    // in observability — a stale token in the URL after a "successful"
    // scrub is a latent leak. Sentry breadcrumb only, not user-facing.
    if (typeof window !== 'undefined') {
      const afterHref = window.location.href;
      const pattern = new RegExp('[?&#]' + paramName + '=');
      if (pattern.test(afterHref)) {
        console.warn('[scrubTokenFromUrl] token still present in URL after replaceState');
      }
    }
  } catch {
    // Older browsers or blocked history APIs — ignore; leaving the
    // token in the URL is strictly worse than nothing but not a
    // regression from the previous behavior.
  }
}

/**
 * Read a one-time token from either the URL fragment (preferred,
 * server never sees it) or the query string (backward-compat with
 * links issued before the R8 fragment rollout). Call on page mount.
 */
export function readTokenFromUrl(paramName: string = 'token'): string | null {
  if (typeof window === 'undefined') return null;
  try {
    // Fragment — "#token=xyz" or "#token=xyz&foo=bar"
    const hash = window.location.hash || '';
    if (hash.length > 1) {
      const raw = hash.startsWith('#') ? hash.slice(1) : hash;
      const params = new URLSearchParams(raw);
      const t = params.get(paramName);
      if (t) return t;
    }
    // Query — "?token=xyz"
    const url = new URL(window.location.href);
    return url.searchParams.get(paramName);
  } catch {
    return null;
  }
}
