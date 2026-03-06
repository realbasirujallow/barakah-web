'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Wasiyyah Planner" description="Plan your Islamic will and beneficiary shares.">
      {children}
    </PlanGate>
  );
}
