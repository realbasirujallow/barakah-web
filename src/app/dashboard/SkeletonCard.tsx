/**
 * Shared skeleton loading primitives.
 * Usage: replace the top-level loading spinner with these to give
 * users a sense of page shape while data fetches.
 */

/** A single card-shaped skeleton (list item, notification row, etc.) */
export function SkeletonCard({ lines = 2, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`bg-white rounded-xl p-4 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
      ))}
    </div>
  );
}

/** A row of summary stat cards (income / expense / net, etc.) */
export function SkeletonSummaryRow({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-${count} gap-4 mb-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

/** A list of N skeleton cards with a header bar above them */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex justify-between items-center">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="h-5 bg-gray-200 rounded w-20 ml-4" />
        </div>
      ))}
    </div>
  );
}

/** A full-page header + summary row + list skeleton (drop-in loader) */
export function SkeletonPage({ summaryCount = 3, listCount = 5 }: { summaryCount?: number; listCount?: number }) {
  return (
    <div>
      {/* Page title + action buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-40" />
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded-lg animate-pulse w-20" />
          <div className="h-9 bg-gray-200 rounded-lg animate-pulse w-24" />
        </div>
      </div>
      <SkeletonSummaryRow count={summaryCount} />
      <SkeletonList count={listCount} />
    </div>
  );
}
