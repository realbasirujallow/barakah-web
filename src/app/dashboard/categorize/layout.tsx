'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Auto-Categorize" description="Sort your transactions into clean categories automatically — no more manual tagging.">
      {children}
    </PlanGate>
  );
}
