'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Investments" description="Track stocks, crypto, retirement accounts and more.">
      {children}
    </PlanGate>
  );
}
