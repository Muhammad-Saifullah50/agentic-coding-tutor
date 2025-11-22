'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface CodeReviewRequest {
    code: string;
    language: string;
    challenge?: string;
    session_id: string;
}

export interface CodeReviewResponse {
    status: 'success' | 'failure';
    corrected_code?: string;
    feedback_explanation?: string;
    error_message?: string;
}

/**
 * Submit code for AI review
 */
export async function reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/code-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CodeReviewResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error reviewing code:', error);
        return {
            status: 'failure',
            error_message: 'Failed to connect to the AI reviewer. Please try again.',
        };
    }
}
