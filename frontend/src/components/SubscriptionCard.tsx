"use client";
import { PLANS } from "@/config/paymentConstants";
import { Button } from "@/components/ui/button";
interface SubscriptionCardProps {
  planKey: keyof typeof PLANS;
  onUpgrade: (planKey: string) => void;
}
export default function SubscriptionCard({
  planKey,
  onUpgrade,
}: SubscriptionCardProps) {
  const plan = PLANS[planKey];
  return (
    <div className="border rounded-lg p-4 shadow-sm w-64">
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <p className="text-muted-foreground mb-4">{plan.description}</p>
      <p className="text-2xl font-bold mb-4">${plan.price}/mo</p>
      <Button onClick={() => onUpgrade(planKey)} className="w-full">
        {plan.price === 0 ? "Current Plan" : "Upgrade"}
      </Button>
    </div>
  );
}
