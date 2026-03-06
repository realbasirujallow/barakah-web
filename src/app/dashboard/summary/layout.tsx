'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Financial Summary" description="Comprehensive financial summary with export to PDF/CSV.">
      {children}
    </PlanGate>
  );
}
