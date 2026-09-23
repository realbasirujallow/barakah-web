import { PlanGate } from '../../../components/PlanGate';

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlanGate
      required="plus"
      featureName="Savings Goals"
      description="Set goals, track progress, and keep your zakat, emergency savings, and major purchases moving forward."
    >
      {children}
    </PlanGate>
  );
}
