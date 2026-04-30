'use client';

import * as React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Phase 17 (Apr 30 2026) — household promo banner.
 *
 * The third-party UX audit's call-out: "Family/collaboration is
 * present but not central. Monarch makes 'manage money together'
 * feel native. In Barakah, family is important, but it still reads
 * like one module among many."
 *
 * This banner addresses the gap one promotional surface at a time:
 *
 *   • Free + Plus user who has NOT selected the Family plan, AND
 *     who picked "household" during onboarding (or never picked
 *     at all): show a soft promo encouraging them to enable family
 *     sharing.
 *   • Family-plan user with ZERO invited members: show a different
 *     copy nudge — "Invite a household member" — pointing at the
 *     existing family management page.
 *   • Family-plan user with ≥1 member: hide entirely, show a
 *     household indicator chip elsewhere (separate component).
 *
 * Dismissible via localStorage. Single line of copy + one CTA. Does
 * NOT live above the Daily Ritual — it's secondary information.
 *
 * Pure component. The parent page derives the variant + dismiss
 * state and passes it in. Auto-hides when `variant` is 'none'.
 */

export type HouseholdBannerVariant = 'invite-promo' | 'invite-empty' | 'none';

export interface HouseholdPromoBannerProps {
  variant: HouseholdBannerVariant;
  /** Dismiss callback; the banner does not handle persistence itself. */
  onDismiss?: () => void;
  className?: string;
}

const COPY: Record<Exclude<HouseholdBannerVariant, 'none'>, {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}> = {
  'invite-promo': {
    title: 'Manage money together',
    body: 'Add up to 6 household members to share budgets, joint zakat, and estate planning.',
    ctaLabel: 'See Family plan',
    ctaHref: '/dashboard/billing',
  },
  'invite-empty': {
    title: 'Invite your first household member',
    body: "You're on the Family plan but no one else is on it yet. Add a spouse, parent, or adult child.",
    ctaLabel: 'Invite member',
    ctaHref: '/dashboard/family',
  },
};

export function HouseholdPromoBanner({
  variant,
  onDismiss,
  className,
}: HouseholdPromoBannerProps) {
  if (variant === 'none') return null;
  const copy = COPY[variant];

  return (
    <div
      role="region"
      aria-label="Household sharing promo"
      className={cn(
        'mb-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3',
        className,
      )}
    >
      <span
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0"
        aria-hidden="true"
      >
        <Users className="w-4 h-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{copy.title}</p>
        <p className="text-xs text-muted-foreground">{copy.body}</p>
      </div>
      <Link
        href={copy.ctaHref}
        className="text-xs font-semibold text-primary hover:text-primary/80 px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors flex-shrink-0"
      >
        {copy.ctaLabel} →
      </Link>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss household promo"
          className="text-muted-foreground hover:text-foreground text-sm leading-none flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}
