'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';
import { useI18n } from '../../../lib/i18n';

// 2026-06-18 (Side Hustle Phase 1): the whole /dashboard/side-hustles subtree
// is Family-only. Gate at the layout (not render-then-403) so non-Family users
// see the upgrade paywall instead of a flash of locked content — same pattern
// as investments/layout.tsx and waqf/layout.tsx. The backend independently
// re-validates (writes 403 + PAYWALL_SHOWN; reads return a locked payload), so
// this is purely the UI gate.
export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <PlanGate required="family" featureName={t('sideHustlesFeatureName')} description={t('sideHustlesFeatureDescription')}>
      {children}
    </PlanGate>
  );
}
