'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileEditButton = () => {
    const handleEditProfile = () => {
        toast.info('Edit profile feature coming soon!');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleEditProfile}
            className="rounded-xl gap-2"
        >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
        </Button>
    );
};

export const PreferencesEditButton = () => {
    const router = useRouter();

    const handleEditPreferences = () => {
        router.push('/onboarding');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleEditPreferences}
            className="rounded-xl gap-2"
        >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
        </Button>
    );
};

export const OnboardingButton = () => {
    const router = useRouter();

    return (
        <Button onClick={() => router.push('/onboarding')} className="w-full btn-hero">
            Start Onboarding
        </Button>
    );
};
