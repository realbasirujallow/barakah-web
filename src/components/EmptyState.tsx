import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Reusable empty-state component for dashboard pages.
 *
 * Inspired by Monarch's empty-state pattern: instead of a blank canvas
 * with a single CTA, show users a representative preview of what the
 * screen WILL look like once they have data, plus 1-3 actions.
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
  icon: string;
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
  const wrapperClass = (variant === 'card'
    ? 'bg-white border-2 border-dashed border-green-200 rounded-2xl p-8 text-center'
    : 'p-8 text-center')
    + ' motion-safe:animate-fade-up-200';

  return (
    <div className={wrapperClass}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-3xl mb-3">
        <span aria-hidden="true">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-[#1B5E20] mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto leading-relaxed">{description}</p>
      )}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
          {actions.map((action, i) => {
            const baseClass = action.primary || i === 0
              ? 'inline-flex items-center justify-center bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition text-sm'
              : 'inline-flex items-center justify-center bg-white border border-gray-300 text-[#1B5E20] px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition text-sm';
            if (action.href) {
              return (
                <Link key={action.label} href={action.href} className={baseClass}>
                  {action.label}
                </Link>
              );
            }
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={baseClass}
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
            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Sample preview</span>
            <span className="h-px flex-1 bg-gray-200 max-w-[60px]" />
          </div>
          <div className="opacity-60 pointer-events-none select-none">
            {preview}
          </div>
        </div>
      )}
    </div>
  );
}
