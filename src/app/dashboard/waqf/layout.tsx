'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Waqf Tracker" description="Track your endowments and charitable contributions.">
      {children}
    </PlanGate>
  );
}
