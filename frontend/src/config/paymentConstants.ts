import { Star, Zap, Shield, LucideIcon } from "lucide-react";

export interface PlanConfig {
  name: string;
  key: string;
  price: { usd: string; pkr: string };
  priceNumeric: number;
  period: string;
  description: string;
  courseGenerations: number;
  credits: number;
  features: string[];
  cta: string;
  popular: boolean;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    name: "Free",
    key: "free",
    price: { usd: "$0", pkr: "₨0" },
    priceNumeric: 0,
    period: "forever",
    description: "Perfect for getting started",
    courseGenerations: 2,
    credits: 20,
    features: [
      "2 course generations",
      "20 credits",
      "Progress tracking",
      "Advanced code playground",
      "AI mentor chat",
      "Code review feedback",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
    icon: Star,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-200",
  },
  plus: {
    name: "Plus",
    key: "plus",
    price: { usd: "$5", pkr: "₨1,400" },
    priceNumeric: 5,
    period: "/month",
    description: "For serious learners",
    courseGenerations: 5,
    credits: 50,
    features: [
      "5 course generations",
      "50 credits",
      "Progress tracking",
      "Advanced code playground",
      "AI mentor chat",
      "Code review feedback",
      "Priority support",
    ],
    cta: "Upgrade to Plus",
    popular: true,
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-200",
  },
  pro: {
    name: "Pro",
    key: "pro",
    price: { usd: "$8", pkr: "₨2,250" },
    priceNumeric: 8,
    period: "/month",
    description: "For aspiring developers",
    courseGenerations: 10,
    credits: 100,
    features: [
      "10 course generations",
      "100 credits",
      "Progress tracking",
      "Advanced code playground",
      "AI mentor chat",
      "Code review feedback",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: false,
    icon: Shield,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-200",
  },
};

export const PLAN_DETAILS = {
  free: { name: "Free Plan", description: "2 course generations", color: "bg-muted" },
  plus: { name: "Plus Plan", description: "5 course generations", color: "bg-primary" },
  pro: { name: "Pro Plan", description: "10 course generations", color: "bg-gradient-to-r from-primary to-secondary" }
};

export const CREDIT_PACKS = {
  pack100: { price: 5, credits: 100 },
  pack250: { price: 12, credits: 250 },
};
