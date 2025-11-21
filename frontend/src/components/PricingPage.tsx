import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, ArrowLeft, Check, Sparkles, Crown, Zap } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      '5 AI lessons per month',
      'Personalized syllabus',
      'Code playground',
      'Basic progress tracking',
      'Community support',
    ],
    cta: 'Continue Free',
    highlighted: false,
    color: 'from-muted to-muted',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For serious learners',
    icon: Sparkles,
    features: [
      'Unlimited AI lessons',
      'Personalized quizzes',
      'Full progress analytics',
      'Priority AI feedback',
      'Download certificates',
      'Email support',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
    color: 'from-primary to-accent',
    badge: 'Recommended',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$49',
    period: 'per month',
    description: 'Ultimate learning experience',
    icon: Crown,
    features: [
      'Everything in Pro',
      '1:1 AI mentor sessions',
      'Custom learning paths',
      'Early feature access',
      'Priority support',
      'Career guidance',
    ],
    cta: 'Go Premium',
    highlighted: false,
    color: 'from-secondary to-primary',
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold hidden sm:inline">AI Coding Tutor</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Learning Path</span> 🚀
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock unlimited AI-guided lessons, personalized feedback, and comprehensive progress insights
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`border-border/50 shadow-lg transition-all hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both ${plan.highlighted ? 'ring-2 ring-primary scale-105 md:scale-110' : ''
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-medium shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${plan.color} ${plan.highlighted ? '' : 'opacity-70'}`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-xl h-12 ${plan.highlighted ? 'btn-hero' : ''}`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <p className="mb-2">All plans include access to our AI coding playground and community</p>
          <p className="flex items-center justify-center gap-2 text-xs">
            <span>Powered by</span>
            <span className="font-semibold">Paddle</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
