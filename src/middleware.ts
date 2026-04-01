import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side route protection middleware.
 *
 * Checks for the presence of the httpOnly auth_token cookie before allowing
 * access to protected routes. This prevents unauthenticated users from even
 * loading the dashboard/admin page bundles — the client-side AuthContext is a
 * secondary guard, not the primary one.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken = request.cookies.has('auth_token');

  // ── Protected routes: require auth_token cookie ──────────────────────
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin');

  if (isProtected && !hasAuthToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('reason', 'expired');
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth pages: redirect to dashboard if already logged in ──────────
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup';

  if (isAuthPage && hasAuthToken) {
    const reason = request.nextUrl.searchParams.get('reason');
    if (reason === 'logout' || reason === 'deleted') {
      // User is intentionally logging out — clear the stale cookie and let /login render
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      response.cookies.delete('refresh_token');
      return response;
    }
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on these routes (skip API, static, etc.)
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
