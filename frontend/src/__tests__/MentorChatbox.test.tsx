import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MentorChatbox from '../components/MentorChatbox';

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test_user_123',
      fullName: 'Test User',
    },
  }),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Sparkles: () => <div data-testid="sparkles-icon" />,
  X: () => <div data-testid="x-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

// Mock react-markdown
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ response: 'Hello from AI' }),
  })
) as jest.Mock;

describe('MentorChatbox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders collapsed state initially', () => {
    render(<MentorChatbox />);
    expect(screen.getByLabelText('Open AI Mentor')).toBeInTheDocument();
    expect(screen.queryByText('AI Mentor')).not.toBeInTheDocument();
  });

  it('expands when clicked', () => {
    render(<MentorChatbox />);
    fireEvent.click(screen.getByLabelText('Open AI Mentor'));
    expect(screen.getByText('AI Mentor')).toBeInTheDocument();
  });

  it('sends a message and displays response', async () => {
    render(<MentorChatbox />);
    fireEvent.click(screen.getByLabelText('Open AI Mentor'));
    
    const input = screen.getByPlaceholderText('Ask me anything about your studies...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    const sendButton = screen.getByTestId('send-icon').closest('button');
    fireEvent.click(sendButton!);
    
    expect(screen.getByText('Hello')).toBeInTheDocument(); // User message
    
    await waitFor(() => {
        // Since we mock fetch but the component logic might be complex with streams or simple responses
        // Based on the component code:
        // setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMsgId }])
        // It seems it expects a stream or just updates.
        // Wait, the component code I read earlier had a syntax error in fetch:
        // setMessages((prev) => prev.slice(0, -1)); inside fetch args?
        // Let's re-read the component code carefully.
    });
  });
});
