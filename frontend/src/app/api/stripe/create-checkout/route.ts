import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { planKey, userId, email, successUrl, cancelUrl } = await request.json();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/stripe/create-checkout`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                email,
                plan: planKey,
                success_url: successUrl,
                cancel_url: cancelUrl,
            }),
        }
    );

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });
}
