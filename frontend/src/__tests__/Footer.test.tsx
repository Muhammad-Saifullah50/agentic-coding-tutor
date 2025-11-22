import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Code2: () => <div data-testid="code-icon" />,
    Github: () => <div data-testid="github-icon" />,
    Twitter: () => <div data-testid="twitter-icon" />,
    Linkedin: () => <div data-testid="linkedin-icon" />,
    Mail: () => <div data-testid="mail-icon" />,
}));

describe('Footer Component', () => {
    it('renders brand info', () => {
        render(<Footer />);
        expect(screen.getByText('AI Coding Tutor')).toBeInTheDocument();
        expect(screen.getByText(/Learn to code smarter/i)).toBeInTheDocument();
    });

    it('renders links sections', () => {
        render(<Footer />);
        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Company')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('renders copyright', () => {
        render(<Footer />);
        expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
});
