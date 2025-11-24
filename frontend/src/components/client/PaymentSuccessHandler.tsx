'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export const PaymentSuccessHandler = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const session = searchParams.get('session');

        if (session === 'success') {
            toast.success('Payment successful!', {
                description: 'Your subscription has been activated. Welcome aboard! 🎉',
                duration: 6000,
            });

            // Clean up URL
            window.history.replaceState({}, '', '/dashboard');
        } else if (session === 'cancel') {
            toast.info('Payment cancelled', {
                description: 'You can upgrade anytime from the pricing page.',
                duration: 5000,
            });

            // Clean up URL
            window.history.replaceState({}, '', '/pricing');
        }
    }, [searchParams]);

    return null;
};
