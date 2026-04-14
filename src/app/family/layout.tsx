import type { ReactNode } from 'react';

/**
 * Minimal layout for /family/* routes — PUBLIC (unauthenticated) by design.
 *
 * The /family/join route needs to be reachable by someone who doesn't have
 * a Barakah account yet, so it must sit OUTSIDE the auth-required
 * /dashboard layout. This layout inherits from the root layout only
 * (which sets up providers).
 */
export default function FamilyLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#FFF8E1]">{children}</div>;
}
