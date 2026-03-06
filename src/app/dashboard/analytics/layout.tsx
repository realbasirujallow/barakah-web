'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Analytics" description="Detailed spending analytics and category breakdowns.">
      {children}
    </PlanGate>
  );
}
