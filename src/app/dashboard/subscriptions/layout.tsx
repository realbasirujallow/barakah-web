'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Subscription Detector" description="Auto-detect recurring subscriptions and flag non-halal services.">
      {children}
    </PlanGate>
  );
}
