'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Zap, Shield, Star } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { PLANS } from "@/config/paymentConstants";



const plans: Array<{
  name: string;
  key: "free" | "plus" | "pro";
  price: { usd: string; pkr: string };
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}> = [
    {
      name: "Free",
      key: "free",
      price: { usd: "$0", pkr: "₨0" },
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "2 course generations",
        "2 credits",
        "Progress tracking",
        "Advanced code playground",
        "AI mentor chat",
        "Code review feedback",
        "Priority support",
      ],
      cta: "Get Started",
      popular: false,
      icon: Star,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200",
    },
    {
      name: "Plus",
      key: "plus",
      price: { usd: "$50", pkr: "₨14,000" },
      period: "/month",
      description: "For serious learners",
      features: [
        "5 course generations",
        "5 credits",
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
    {
      name: "Pro",
      key: "pro",
      price: { usd: "$80", pkr: "₨22,500" },
      period: "/month",
      description: "For aspiring developers",
      features: [
        "10 course generations",
        "10 credits",
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
  ];


const Pricing = () => {
  const [currency, setCurrency] = useState<'usd' | 'pkr'>('usd');
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { user } = useUser();
  const router = useRouter();

  const handleUpgrade = async (planKey: keyof typeof PLANS) => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Skip Stripe checkout for free tier - just redirect to dashboard
    if (planKey === 'free') {
      router.push('/dashboard');
      return;
    }

    try {
      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session=success`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?session=cancel`;

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey,
          userId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress || '',
          successUrl,
          cancelUrl,
        }),
      });

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await (await import('@stripe/stripe-js')).loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
        );
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
          if (error) {
            console.error('Stripe redirect error:', error);
          }
        }
      } else {
        console.error('Failed to create checkout session', data);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // You could show a toast notification here
    }

    return (
      <section id="pricing" className="py-24 md:py-32 relative overflow-hidden" ref={elementRef}>
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, Transparent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2">Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Choose the plan that fits your learning goals. All plans include access to our AI-powered platform.
            </p>

            {/* Currency Toggle */}
            <div className="inline-flex items-center p-1.5 bg-muted rounded-full border border-border/50 shadow-sm">
              <button
                onClick={() => setCurrency('usd')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${currency === 'usd'
                  ? 'bg-background text-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                International (USD)
              </button>
              <button
                onClick={() => setCurrency('pkr')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${currency === 'pkr'
                  ? 'bg-background text-foreground shadow-md scale-105'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Pakistan (PKR) 🇵🇰
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative flex flex-col transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${plan.popular
                  ? "border-primary shadow-xl md:scale-105 z-10 bg-card"
                  : "border-border/50 bg-card/50 hover:bg-card"
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                )}

                {plan.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">
                    Most Popular
                  </div>
                )}

                <CardHeader className="pb-8 pt-10 relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${plan.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <plan.icon className={`w-6 h-6 ${plan.color}`} />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price[currency]}
                    </span>
                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 relative z-10">
                  <div className="w-full h-px bg-border/50 mb-8" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'} transition-colors duration-300`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-8 pb-10 relative z-10">
                  <Button
                    className={`w-full h-12 rounded-xl text-base font-medium transition-all duration-300 ${plan.popular
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                      : "bg-muted hover:bg-muted/80 text-foreground hover:scale-[1.02]"
                      }`}
                    variant={plan.popular ? "default" : "secondary"}
                    onClick={() => {
                      handleUpgrade(plan.key);
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };
}
export default Pricing
