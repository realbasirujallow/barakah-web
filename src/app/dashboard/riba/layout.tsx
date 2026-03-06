'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Riba Detector" description="Scan transactions to flag interest-bearing activity.">
      {children}
    </PlanGate>
  );
}
