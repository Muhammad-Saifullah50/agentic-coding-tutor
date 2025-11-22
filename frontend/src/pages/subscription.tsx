import { PLANS } from '@/config/paymentConstants';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';

export default function SubscriptionPage() {
  const { user } = useUser();
  const router = useRouter();

  const handleUpgrade = async (planKey: string) => {
    if (!user) {
      // redirect to sign in
      router.push('/sign-in');
      return;
    }
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session=success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription?session=cancel`;
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
      const stripe = (await import('@stripe/stripe-js')).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
      const stripeInstance = await stripe;
      stripeInstance?.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      console.error('Failed to create checkout session', data);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Upgrade Your Plan</h1>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {Object.entries(PLANS).map(([key, plan]) => (
          <SubscriptionCard key={key} planKey={key as keyof typeof PLANS} onUpgrade={handleUpgrade} />
        ))}
      </div>
    </div>
  );
}
