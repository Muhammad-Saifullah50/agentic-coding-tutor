import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { LessonPlayground } from '../components/course/LessonPlayground';
import { toast } from 'sonner';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
    __esModule: true,
    default: ({ value, onChange }: any) => (
        <textarea
            data-testid="monaco-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

// Mock react-markdown
jest.mock('react-markdown', () => ({
    __esModule: true,
    default: ({ children }: { children: string }) => <div>{children}</div>,
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Sparkles: () => <div data-testid="sparkles-icon" />,
    RotateCcw: () => <div data-testid="rotate-icon" />,
    ChevronRight: () => <div data-testid="chevron-right-icon" />,
    CheckCircle2: () => <div data-testid="check-icon" />,
    Loader2: () => <div data-testid="loader-icon" />,
}));

// Mock server action
jest.mock('@/actions/code-review.actions', () => ({
    reviewCode: jest.fn(() => Promise.resolve({
        status: 'success',
        corrected_code: 'corrected code',
        feedback_explanation: 'Good job!',
    })),
}));

const defaultProps = {
    title: 'Test Lesson',
    description: 'Test Description',
    language: 'python',
    starterCode: 'print("Hello")',
    challenge: 'Write a print statement',
    hints: ['Use print()'],
    onComplete: jest.fn(),
    onNext: jest.fn(),
    isCompleted: false,
    isNextLessonLocked: false,
    isLoading: false,
};

describe('LessonPlayground Component', () => {
    it('renders lesson details', () => {
        render(<LessonPlayground {...defaultProps} />);
        expect(screen.getByText('Test Lesson')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Write a print statement')).toBeInTheDocument();
    });

    it('renders hints', () => {
        render(<LessonPlayground {...defaultProps} />);
        expect(screen.getByText('Use print()')).toBeInTheDocument();
    });

    it('allows code editing', () => {
        render(<LessonPlayground {...defaultProps} />);
        const editor = screen.getByTestId('monaco-editor');
        fireEvent.change(editor, { target: { value: 'print("World")' } });
        expect(editor).toHaveValue('print("World")');
    });

    it('handles AI review', async () => {
        render(<LessonPlayground {...defaultProps} />);
        const reviewButton = screen.getByText('Get AI Review');

        await act(async () => {
            fireEvent.click(reviewButton);
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Review Complete! ✨', {
                description: 'AI has analyzed your code and provided feedback.',
            });
        });
    });

    it('handles completion', async () => {
        render(<LessonPlayground {...defaultProps} />);
        const completeButton = screen.getByText('Mark as Complete');
        fireEvent.click(completeButton);
        expect(defaultProps.onComplete).toHaveBeenCalled();
    });

    it('strips markdown fences from starter code', () => {
        const propsWithMarkdown = {
            ...defaultProps,
            starterCode: '```python\nprint("Hello from Markdown")\n```'
        };
        render(<LessonPlayground {...propsWithMarkdown} />);
        const editor = screen.getByTestId('monaco-editor');
        expect(editor).toHaveValue('print("Hello from Markdown")');
    });
});

