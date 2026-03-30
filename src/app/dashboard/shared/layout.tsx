'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="family" featureName="Shared Family Finances" description="Manage finances together with up to 6 family members.">
      {children}
    </PlanGate>
  );
}
