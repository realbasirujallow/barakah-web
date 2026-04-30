/**
 * Shared skeleton loading primitives.
 *
 * Phase 4 polish (2026-04-27): swapped hardcoded bg-white / bg-gray-200
 * for the shadcn semantic tokens (bg-card / bg-accent) so skeletons now
 * adapt to dark mode and read as "loading shapes" rather than "white
 * boxes with grey blocks." The pulse rhythm is unchanged (Tailwind's
 * built-in animate-pulse).
 *
 * Usage: replace inline "Loading…" text or "..." placeholders with
 * <SkeletonCard /> / <SkeletonSummaryRow /> / <SkeletonList /> /
 * <SkeletonPage /> while data fetches.
 */

/** A single card-shaped skeleton (list item, notification row, etc.) */
export function SkeletonCard({ lines = 2, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`bg-card rounded-xl p-4 border border-border animate-pulse ${className}`}>
      <div className="h-4 bg-accent rounded w-1/3 mb-2" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="h-3 bg-accent rounded w-2/3 mt-2" />
      ))}
    </div>
  );
}

// Lookup table keeps complete class strings visible to Tailwind's JIT scanner
// so grid-cols-* variants are never purged in production builds.
const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

/** A row of summary stat cards (income / expense / net, etc.). Visually
 *  matches the new <KpiCard> dimensions so a skeleton-→-data swap
 *  doesn't reflow the page. */
export function SkeletonSummaryRow({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid ${GRID_COLS[count] ?? 'grid-cols-3'} gap-4 mb-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl px-5 py-4 border border-border animate-pulse">
          <div className="h-3 bg-accent rounded w-1/2 mb-3" />
          <div className="h-7 bg-accent rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

/** A list of N skeleton cards (transaction rows, bills, etc.) */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse flex justify-between items-center">
          <div className="flex-1">
            <div className="h-4 bg-accent rounded w-1/3 mb-2" />
            <div className="h-3 bg-accent rounded w-1/4" />
          </div>
          <div className="h-5 bg-accent rounded w-20 ml-4" />
        </div>
      ))}
    </div>
  );
}

/** A full-page header + summary row + list skeleton (drop-in loader).
 *  Mirrors the new PageHeader + KpiCard scale so the layout doesn't
 *  pop when real data arrives. */
export function SkeletonPage({ summaryCount = 3, listCount = 5 }: { summaryCount?: number; listCount?: number }) {
  return (
    <div>
      {/* Page title + action buttons */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="h-8 bg-accent rounded animate-pulse w-48 mb-2" />
          <div className="h-4 bg-accent rounded animate-pulse w-64" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-accent rounded-md animate-pulse w-20" />
          <div className="h-9 bg-accent rounded-md animate-pulse w-24" />
        </div>
      </header>
      <SkeletonSummaryRow count={summaryCount} />
      <SkeletonList count={listCount} />
    </div>
  );
}
