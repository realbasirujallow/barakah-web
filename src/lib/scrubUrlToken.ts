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
    if (!url.searchParams.has(paramName)) return;
    url.searchParams.delete(paramName);
    const cleaned = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
    // replaceState (not pushState) so Back doesn't return to the
    // token-bearing URL. No reload — React state is preserved.
    window.history.replaceState({}, '', cleaned);
  } catch {
    // Older browsers or blocked history APIs — ignore; leaving the
    // token in the URL is strictly worse than nothing but not a
    // regression from the previous behavior.
  }
}
