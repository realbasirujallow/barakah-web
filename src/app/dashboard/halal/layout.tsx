'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Halal Screener" description="Screen stocks and investments for Shariah compliance.">
      {children}
    </PlanGate>
  );
}
