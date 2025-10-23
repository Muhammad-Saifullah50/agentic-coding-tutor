'use client';
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LessonSidebar, Lesson } from "@/components/course/LessonSidebar";
import { LessonContent } from "@/components/course/LessonContent";
import { LessonQuiz } from "@/components/course/LessonQuiz";
import { LessonPlayground } from "@/components/course/LessonPlayground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Mock data - in real app, this would come from API/database
const courseData: Record<string, any> = {
  python: {
    name: "Python Fundamentals",
    lessons: [
      {
        id: "1",
        title: "Introduction to Python",
        type: "content",
        duration: "15 min",
        completed: false,
        locked: false,
        content: `Welcome to Python Fundamentals! Python is a versatile and beginner-friendly programming language used in web development, data science, artificial intelligence, and more.

In this lesson, you'll learn:
• What makes Python special
• How to write your first Python program
• Basic syntax and structure
• Common use cases for Python

Python's simple syntax makes it perfect for beginners while remaining powerful enough for experts. Let's dive in!`,
        codeExample: `# Your first Python program
print("Hello, World!")

# Variables in Python
name = "Student"
age = 20
print(f"Hello {name}, you are {age} years old!")`,
      },
      {
        id: "2",
        title: "Variables and Data Types Quiz",
        type: "quiz",
        duration: "10 min",
        completed: false,
        locked: false,
        questions: [
          {
            id: "q1",
            question: "Which of the following is a valid variable name in Python?",
            options: ["2_value", "_value", "value-2", "value 2"],
            correctAnswer: 1,
            explanation: "Python variable names can start with underscore or letter, but not with numbers or contain spaces/hyphens.",
          },
          {
            id: "q2",
            question: "What data type is the value: 3.14?",
            options: ["int", "float", "str", "bool"],
            correctAnswer: 1,
            explanation: "3.14 is a floating-point number (float) because it has a decimal point.",
          },
        ],
      },
      {
        id: "3",
        title: "Create Your First Function",
        type: "playground",
        duration: "20 min",
        completed: false,
        locked: false,
        description: "Learn how to create and use functions in Python. Functions are reusable blocks of code that perform specific tasks.",
        language: "python",
        starterCode: `# Define your function here
def greet(name):
    # Your code here
    pass

# Test your function
greet("Alice")`,
        challenge: "Create a function called 'greet' that takes a name parameter and returns a personalized greeting message.",
        hints: [
          "Use the 'def' keyword to define a function",
          "Use 'return' to send a value back from the function",
          "You can use f-strings for string formatting: f'Hello {name}'",
        ],
      },
      {
        id: "4",
        title: "Lists and Loops",
        type: "content",
        duration: "18 min",
        completed: false,
        locked: true,
        content: "Complete previous lessons to unlock this content.",
      },
    ],
  },
  javascript: {
    name: "JavaScript Essentials",
    lessons: [
      {
        id: "1",
        title: "JavaScript Basics",
        type: "content",
        duration: "12 min",
        completed: false,
        locked: false,
        content: `JavaScript is the programming language of the web! It runs in every browser and powers interactive websites.

In this lesson, you'll discover:
• What JavaScript can do
• How to add JavaScript to web pages
• Variables and data types
• Your first interactive script

JavaScript makes websites come alive with interactivity and dynamic content. Let's get started!`,
        codeExample: `// Your first JavaScript program
console.log("Hello, World!");

// Variables in JavaScript
let name = "Student";
const age = 20;
console.log(\`Hello \${name}, you are \${age} years old!\`);`,
      },
      {
        id: "2",
        title: "Functions and Arrays",
        type: "playground",
        duration: "25 min",
        completed: false,
        locked: false,
        description: "Master JavaScript functions and learn how to work with arrays - one of the most important data structures.",
        language: "javascript",
        starterCode: `// Create a function that processes an array
function sumArray(numbers) {
  // Your code here
  
}

// Test your function
const numbers = [1, 2, 3, 4, 5];
console.log(sumArray(numbers)); // Should return 15`,
        challenge: "Write a function that takes an array of numbers and returns their sum.",
        hints: [
          "Use a for loop or forEach to iterate through the array",
          "Initialize a sum variable to 0",
          "Add each number to the sum",
          "Return the final sum",
        ],
      },
    ],
  },
};

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentLessonId, setCurrentLessonId] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = courseData[courseId || ""] || courseData.python;
  const lessons: Lesson[] = course.lessons;
  const currentLesson = lessons.find((l) => l.id === currentLessonId) || lessons[0];

  const handleLessonComplete = () => {
    const lessonIndex = lessons.findIndex((l) => l.id === currentLessonId);
    if (lessonIndex !== -1) {
      lessons[lessonIndex].completed = true;
      
      // Unlock next lesson
      if (lessonIndex + 1 < lessons.length) {
        lessons[lessonIndex + 1].locked = false;
      }
    }
  };

  const handleNext = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      if (!nextLesson.locked) {
        setCurrentLessonId(nextLesson.id);
        setSidebarOpen(false);
      }
    }
  };

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case "content":
        return (
          <LessonContent
            title={currentLesson.title}
            content={currentLesson.content}
            codeExample={currentLesson.codeExample}
            onComplete={handleLessonComplete}
            onNext={handleNext}
            isCompleted={currentLesson.completed}
          />
        );
      
      case "quiz":
        return (
          <LessonQuiz
            title={currentLesson.title}
            questions={currentLesson.questions}
            onComplete={handleLessonComplete}
            onNext={handleNext}
          />
        );
      
      case "playground":
        return (
          <LessonPlayground
            title={currentLesson.title}
            description={currentLesson.description}
            language={currentLesson.language}
            starterCode={currentLesson.starterCode}
            challenge={currentLesson.challenge}
            hints={currentLesson.hints}
            onComplete={handleLessonComplete}
            onNext={handleNext}
            isCompleted={currentLesson.completed}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/courses")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Courses</span>
          </Button>

          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-2">
                <Menu className="w-4 h-4" />
                Lessons
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <LessonSidebar
                lessons={lessons}
                currentLessonId={currentLessonId}
                onLessonSelect={(id) => {
                  setCurrentLessonId(id);
                  setSidebarOpen(false);
                }}
                courseName={course.name}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border overflow-hidden">
          <LessonSidebar
            lessons={lessons}
            currentLessonId={currentLessonId}
            onLessonSelect={setCurrentLessonId}
            courseName={course.name}
          />
        </aside>

        {/* Lesson Content */}
        <main className="flex-1 overflow-hidden">
          {renderLessonContent()}
        </main>
      </div>
    </div>
  );
};

export default Course;
