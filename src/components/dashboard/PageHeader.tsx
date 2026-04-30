import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Phase 3 (Apr 27 2026) — shared dashboard page header.
 *
 * Establishes a single visual anchor for every screen under /dashboard:
 *
 *   <h1 text-2xl/3xl font-semibold tracking-tight>{title}</h1>
 *   <p text-sm text-muted-foreground>{subtitle}</p>
 *                                   <RIGHT-SIDE actions slot>
 *
 * Why a component, not a snippet: every page already had its own
 * slightly-different header — text-xl on some, text-2xl on others,
 * text-gray-900 vs text-[#1B5E20] vs text-foreground, the description
 * either text-gray-500 or text-gray-600. Centralising it both fixes
 * the inconsistency and gives us one place to tune the typography
 * scale later.
 *
 * The icon prop is optional and decorative — `aria-hidden` is applied
 * automatically. Do NOT use it to convey meaning that isn't already in
 * the title text. Backwards-compatible with the emoji glyphs that were
 * inline in the old headers.
 */
export interface PageHeaderProps {
  /** The big page title. Plain string keeps screen-reader announcements clean. */
  title: string;
  /** Optional one-line description below the title. */
  subtitle?: React.ReactNode;
  /** Optional decorative emoji or icon shown next to the title. */
  icon?: React.ReactNode;
  /** Optional right-side action area (Buttons, links, badges). */
  actions?: React.ReactNode;
  /** Tighter or looser bottom margin. Defaults to mb-6. */
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('mb-6 flex items-start justify-between gap-4 flex-wrap', className)}>
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          {icon ? <span aria-hidden="true">{icon}</span> : null}
          <span className="break-words">{title}</span>
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2 flex-shrink-0">{actions}</div> : null}
    </header>
  );
}
