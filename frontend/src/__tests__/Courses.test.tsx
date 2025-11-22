import React from 'react';
import { render, screen } from '@testing-library/react';
import Courses from '../components/Courses';
import { FullCourseData } from '@/types/course';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  BookOpen: () => <div data-testid="book-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
}));

const mockCourses: FullCourseData[] = [
  {
    id: 1,
    user_id: 'user1',
    title: 'Python Basics',
    slug: 'python-basics',
    course_id: 'course1',
    created_at: '2023-01-01',
    course_data: {
      title: 'Python Basics',
      slug: 'python-basics',
      course_id: 'course1',
      modules: [
        {
          title: 'Module 1',
          lessons: [
            {
              id: 'l1',
              type: 'content',
              title: 'Lesson 1',
              duration: '10m',
              completed: true,
              locked: false,
              content: '...',
            },
            {
              id: 'l2',
              type: 'content',
              title: 'Lesson 2',
              duration: '20m',
              completed: false,
              locked: false,
              content: '...',
            },
          ],
        },
      ],
    },
  },
];

describe('Courses Component', () => {
  it('renders "My Courses" heading', () => {
    render(<Courses courses={mockCourses} />);
    expect(screen.getByText('My Courses')).toBeInTheDocument();
  });

  it('renders course list when courses exist', () => {
    render(<Courses courses={mockCourses} />);
    expect(screen.getByText('Python Basics')).toBeInTheDocument();
    expect(screen.getByText('2 lessons')).toBeInTheDocument();
    expect(screen.getByText('30m')).toBeInTheDocument(); // 10m + 20m
    expect(screen.getByText('50%')).toBeInTheDocument(); // 1/2 completed
  });

  it('renders empty state when no courses', () => {
    render(<Courses courses={[]} />);
    expect(screen.getByText("You haven't created any courses yet")).toBeInTheDocument();
    expect(screen.getByText('Create Your First Course')).toBeInTheDocument();
  });
});
