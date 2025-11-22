import { render, screen } from '@testing-library/react';
import Profile from '../components/Profile';
import { UserProfile } from '@/types/user';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
  },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Edit2: () => <div data-testid="edit-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
  Code2: () => <div data-testid="code-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Trophy: () => <div data-testid="trophy-icon" />,
  Crown: () => <div data-testid="crown-icon" />,
  Award: () => <div data-testid="award-icon" />,
}));

const mockUserProfile: UserProfile = {
  id: 123,
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

const mockProgressData = {
  totalCourses: 2,
  completedLessons: 5,
  totalLessons: 20,
  completionPercentage: 25,
};

describe('Profile Component', () => {
  it('renders profile information correctly', () => {
    render(<Profile userProfile={mockUserProfile} progressData={mockProgressData} />);
    
    expect(screen.getByRole('heading', { name: 'Test User', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Curious Learner 🚀')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // XP
    expect(screen.getByText('5')).toBeInTheDocument(); // Streak
  });

  it('renders "No Profile Found" when userProfile is null', () => {
    render(<Profile userProfile={null} progressData={mockProgressData} />);
    
    expect(screen.getByText('No Profile Found')).toBeInTheDocument();
    expect(screen.getByText('Start Onboarding')).toBeInTheDocument();
  });

  it('renders progress data correctly', () => {
    render(<Profile userProfile={mockUserProfile} progressData={mockProgressData} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Total Courses
    expect(screen.getByText('5/20 lessons')).toBeInTheDocument();
  });

  it('renders subscription info correctly', () => {
    render(<Profile userProfile={mockUserProfile} progressData={mockProgressData} />);
    
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Plan')).toBeInTheDocument();
  });
});
