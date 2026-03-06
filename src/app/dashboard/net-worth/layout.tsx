'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Net Worth Tracker" description="Real-time net worth with assets and debts.">
      {children}
    </PlanGate>
  );
}
