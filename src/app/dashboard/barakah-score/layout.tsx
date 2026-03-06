'use client';
import { ReactNode } from 'react';
import { PlanGate } from '../../../components/PlanGate';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PlanGate required="plus" featureName="Barakah Score" description="Your personalised Islamic financial health score.">
      {children}
    </PlanGate>
  );
}
