'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Transaction Rules" description="Set rules to keep transfers, income, and expenses clean automatically — no more manual tagging.">
      {children}
    </PlanGate>
  );
}
