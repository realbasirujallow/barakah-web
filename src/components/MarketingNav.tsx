'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

/**
 * Marketing-page top navigation.
 *
 * 2026-05-01 — added after the founder noticed the homepage had no
 * sign-in link or menu options and signed-out users had no path
 * back into the app from `/`. This fills that long-standing gap.
 *
 * Renders at the top of public marketing pages (`/`, `/pricing`,
 * `/compare`, `/learn`, etc.). NOT used inside `/dashboard/*` —
 * the dashboard has its own sidebar + topbar.
 *
 * Pattern follows Linear / Stripe / Notion: small wordmark on the
 * left, navigation items center/right, "Sign in" link as a quiet
 * text link, "Start free" as the primary green button. Mobile
 * collapses to a hamburger that opens an inline panel (no overlay
 * — keeps the marketing pages from feeling app-like).
 */

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Compare', href: '/compare' },
  { label: 'Learn', href: '/learn' },
  { label: 'Methodology', href: '/methodology' },
];

export function MarketingNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Wordmark — clickable home link. Uses the same green as the hero. */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Barakah home"
        >
          <span className="text-lg font-bold text-[#1B5E20] group-hover:text-[#2E7D32] transition">
            🌙 Barakah
          </span>
        </Link>

        {/* Desktop nav — items center */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-[#1B5E20] transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign-in + Start free — desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-[#1B5E20] transition"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] transition"
          >
            Start free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-6 py-4 flex flex-col gap-1 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50 transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50 transition"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2.5 rounded-lg bg-[#1B5E20] text-white text-center font-semibold hover:bg-[#2E7D32] transition"
                onClick={() => setOpen(false)}
              >
                Start free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
