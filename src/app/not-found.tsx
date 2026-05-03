import Link from 'next/link';
import { Compass } from 'lucide-react';

// Round 17: was a single "Back to Dashboard" CTA that redirected logged-out
// users back to /login → /dashboard → /login... a loop. Now shows two CTAs:
// Home (works for everyone) and Sign in (for users who just got logged
// out by an expired token). Authenticated users can always use the nav
// inside their dashboard to get back — the 404 is rendered outside the
// dashboard layout so we can't easily branch on auth here.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Compass className="w-16 h-16 mx-auto mb-4 text-[#1B5E20]" aria-hidden="true" />
        <h1 className="text-4xl font-bold text-[#1B5E20] mb-2">404</h1>
        <h2 className="text-xl font-semibold text-[#2E7D32] mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="inline-block bg-white text-[#1B5E20] border border-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFF8E1] transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
