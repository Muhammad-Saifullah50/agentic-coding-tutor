import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { UserProfile } from '@/types/user';

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
    Code2: () => <div data-testid="code-icon" />,
    User: () => <div data-testid="user-icon" />,
    Menu: () => <div data-testid="menu-icon" />,
}));

// Mock child components
jest.mock('../components/MobileNav', () => () => <div data-testid="mobile-nav" />);
jest.mock('../components/ThemeToggleButton', () => ({
    ThemeToggleButton: () => <div data-testid="theme-toggle" />,
}));
jest.mock('../components/CourseBackButton', () => ({
    CourseBackButton: () => <div data-testid="course-back-button" />,
}));

const mockUser: UserProfile = {
    id: '123',
    username: 'Test User',
    email: 'test@example.com',
    imageUrl: 'https://example.com/avatar.jpg',
    ageRange: '18-24',
    educationLevel: 'Undergraduate',
    techBackground: 'Beginner',
    goals: ['Learn Python'],
    timePerWeek: '5-10 hours',
    learningMode: 'Visual',
    xp: 100,
    streak: 5,
    credits: 10,
    subscription_plan: 'free',
    stripe_customer_id: null,
    stripe_subscription_id: null,
    created_at: '2023-01-01',
};

describe('Navbar Component', () => {
    it('renders logo and brand name', () => {
        render(<Navbar user={null} />);
        expect(screen.getByText('CodeQuora')).toBeInTheDocument();
        expect(screen.getByTestId('code-icon')).toBeInTheDocument();
    });

    it('renders navigation items when user is not logged in', () => {
        render(<Navbar user={null} />);
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('Pricing')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Start Learning Free')).toBeInTheDocument();
    });

    it('renders dashboard and profile when user is logged in', () => {
        render(<Navbar user={mockUser} />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('renders mobile nav', () => {
        render(<Navbar user={null} />);
        expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
    });
});
