import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IllustrationScene, type IllustrationName } from './Illustrations';

/**
 * Reusable empty-state component for dashboard pages.
 *
 * Inspired by Monarch's empty-state pattern: instead of a blank canvas
 * with a single CTA, show users a representative preview of what the
 * screen WILL look like once they have data, plus 1-3 actions.
 *
 * Phase 4 polish (2026-04-27):
 *   • Hardcoded #1B5E20 swapped for semantic tokens (bg-primary,
 *     text-primary, etc.) so light/dark mode are consistent.
 *   • Icon disc grew from 56px to 64px and uses bg-primary/10 for a
 *     softer, Monarch-style halo instead of the harsher bg-green-50.
 *   • Border-dashed stays — it's the universal "this is where data
 *     would go" cue and Monarch + Rocket Money both use it.
 *
 * Three slots:
 *   - icon: emoji or short svg-string (renders in a soft circle)
 *   - title + description: framing text
 *   - actions: 1-3 CTAs (first one is filled/primary)
 *   - preview: optional sample-row preview to show what the screen
 *              looks like when populated. Renders behind a subtle
 *              "Sample preview" tag so users don't think it's their data.
 *
 * Keep instances LOW-NOISE: don't try to fit a marketing page in here.
 * Three short lines + 1-2 CTAs + optional 2-3 sample rows is the bar.
 */

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

interface EmptyStateProps {
  icon?: string | ReactNode;
  /** R40 (2026-05-01): when supplied, renders a CustomPainter-style
   * SVG illustration in place of the icon disc. Stripe-tier polish
   * for hero empty states (asset list, no transactions, family page).
   * The icon prop becomes optional when an illustration is given. */
  illustration?: IllustrationName;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  preview?: ReactNode;
  /** Visual variant; defaults to "card". "bare" drops the outer card chrome
   * so the component fits inside an existing card-styled container. */
  variant?: 'card' | 'bare';
}

export default function EmptyState({
  icon,
  illustration,
  title,
  description,
  actions = [],
  preview,
  variant = 'card',
}: EmptyStateProps) {
  // Subtle 200ms fade-up on mount. Matches Monarch's polish: empty
  // states feel less abrupt when they ease in instead of pop. Animation
  // is CSS-only (no library) and is gated by `prefers-reduced-motion`
  // via Tailwind's motion-safe modifier — accessibility preserved.
  const wrapperClass = cn(
    variant === 'card'
      ? 'bg-card border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center'
      : 'p-8 text-center',
    'motion-safe:animate-fade-up-200',
  );

  const baseButton =
    'inline-flex items-center justify-center px-5 py-2.5 rounded-md font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  const primaryButton =
    'bg-primary text-primary-foreground hover:bg-primary/90';
  const secondaryButton =
    'bg-card border border-border text-foreground hover:bg-accent';

  return (
    <div className={wrapperClass}>
      {illustration ? (
        <div className="mb-3 inline-block">
          <IllustrationScene scene={illustration} size={120} />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-3xl mb-3">
          <span aria-hidden="true">{icon}</span>
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground tracking-tight mb-1">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto leading-relaxed">{description}</p>
      )}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
          {actions.map((action, i) => {
            const isPrimary = action.primary || i === 0;
            const className = cn(baseButton, isPrimary ? primaryButton : secondaryButton);
            if (action.href) {
              return (
                <Link key={action.label} href={action.href} className={className}>
                  {action.label}
                </Link>
              );
            }
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={className}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
      {preview && (
        <div className="mt-6 text-left max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2 justify-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sample preview</span>
            <span className="h-px flex-1 bg-border max-w-[60px]" />
          </div>
          <div className="opacity-60 pointer-events-none select-none">
            {preview}
          </div>
        </div>
      )}
    </div>
  );
}
