'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Auto-Categorize" description="Automatically categorize transactions with AI.">
      {children}
    </PlanGate>
  );
}
