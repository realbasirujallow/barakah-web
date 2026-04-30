import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn/ui's class-merge helper. Combines clsx (conditional classes) with
 * tailwind-merge (de-dupes conflicting Tailwind classes — last-one-wins,
 * but with awareness of which utilities conflict, e.g. `p-2 p-4` → `p-4`).
 *
 * Use anywhere you compose className strings:
 *   className={cn('px-4 py-2', isPrimary && 'bg-primary', className)}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
