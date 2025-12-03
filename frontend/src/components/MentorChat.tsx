'use client';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useUser } from '@clerk/nextjs';

export default function MentorChat() {
    const { user } = useUser();

    const { control } = useChatKit({
         api: {
            url: process.env.NEXT_PUBLIC_API_URL + '/chatkit',
            
            domainKey: process.env.NEXT_PUBLIC_DOMAIN_KEY || '',
        }
    })
    if (!user) return null;
    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] z-50">
            <ChatKit
                control={control}
                
                title="AI Mentor"
                className="rounded-2xl shadow-2xl border border-border overflow-hidden"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
