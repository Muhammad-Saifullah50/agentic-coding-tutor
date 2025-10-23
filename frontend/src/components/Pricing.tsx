'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import  Link  from "next/link";
import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const plans = [
  {
    name: "Free",
    price: { usd: "$0", pkr: "₨0" },
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 AI lessons per week",
      "Basic code playground",
      "Community support",
      "Progress tracking",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: { usd: "$9", pkr: "₨2,500" },
    period: "/month",
    description: "For serious learners",
    features: [
      "Unlimited AI lessons",
      "Advanced code playground",
      "AI mentor chat (100 msgs/month)",
      "Code review feedback",
      "Priority support",
      "Downloadable certificates",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: { usd: "$19", pkr: "₨5,000" },
    period: "/month",
    description: "For aspiring developers",
    features: [
      "Everything in Starter",
      "Unlimited AI mentor chat",
      "1-on-1 mentorship sessions",
      "Custom learning paths",
      "Interview preparation",
      "Job placement assistance",
      "Lifetime access to all courses",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

const Pricing = () => {
  const [currency, setCurrency] = useState<'usd' | 'pkr'>('usd');
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="pricing" className="py-20 md:py-32 relative overflow-hidden" ref={elementRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple, Transparent
            <span className="block text-gradient mt-2">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. All plans include access to our AI-powered platform.
          </p>
          
          {/* Currency Toggle */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <span className={`text-sm font-medium transition-colors ${currency === 'usd' ? 'text-foreground' : 'text-muted-foreground'}`}>
              International (USD)
            </span>
            <button
              onClick={() => setCurrency(currency === 'usd' ? 'pkr' : 'usd')}
              className="relative w-14 h-7 bg-muted rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-primary rounded-full transition-transform duration-300 ${currency === 'pkr' ? 'translate-x-7' : ''}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${currency === 'pkr' ? 'text-foreground' : 'text-muted-foreground'}`}>
              🇵🇰 Pakistan (PKR)
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative flex flex-col hover:scale-105 transition-all duration-700 group ${
                plan.popular 
                  ? "border-primary shadow-xl md:scale-105" 
                  : "border-border/50"
              } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-lg animate-pulse">
                  Most Popular
                </div>
              )}
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <CardHeader className="text-center pb-8 pt-8 relative z-10">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold group-hover:scale-110 inline-block transition-transform duration-300">
                    {plan.price[currency]}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1 relative z-10">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-300" />
                      <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-8 relative z-10">
                <Link href="/signup" className="w-full">
                  <Button 
                    className={`w-full rounded-xl hover:scale-105 transition-transform duration-300 ${
                      plan.popular ? "btn-hero" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
