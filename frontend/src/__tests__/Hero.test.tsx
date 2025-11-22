import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
});

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Sparkles: () => <div data-testid="sparkles-icon" />,
    ArrowRight: () => <div data-testid="arrow-right-icon" />,
    Code2: () => <div data-testid="code-icon" />,
    Terminal: () => <div data-testid="terminal-icon" />,
    Cpu: () => <div data-testid="cpu-icon" />,
}));

// Mock custom hook
jest.mock('@/hooks/use-intersection-observer', () => ({
    useIntersectionObserver: () => ({
        elementRef: { current: null },
        isVisible: true,
    }),
}));

describe('Hero Component', () => {
    it('renders main heading', () => {
        render(<Hero userId={null} />);
        expect(screen.getByText(/Master Coding/i)).toBeInTheDocument();
        expect(screen.getByText(/with AI Guidance/i)).toBeInTheDocument();
    });

    it('renders "Start Learning Free" when user is not logged in', () => {
        render(<Hero userId={null} />);
        expect(screen.getByText('Start Learning Free')).toBeInTheDocument();
        expect(screen.getByText('Explore Features')).toBeInTheDocument();
    });

    it('renders "Dashboard" when user is logged in', () => {
        render(<Hero userId="test_user" />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.queryByText('Start Learning Free')).not.toBeInTheDocument();
    });

    it('renders stats', () => {
        render(<Hero userId={null} />);
        expect(screen.getByText('10k+')).toBeInTheDocument();
        expect(screen.getByText('Active Learners')).toBeInTheDocument();
    });
});
