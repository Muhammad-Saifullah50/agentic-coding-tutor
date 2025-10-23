'use client';

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, ArrowLeft, Clock, BookOpen } from "lucide-react";

const courses = [
  {
    id: "python",
    name: "Python Fundamentals",
    description: "Master Python basics from variables to functions",
    language: "Python",
    lessons: 45,
    duration: "8 weeks",
    difficulty: "Beginner",
    progress: 65,
    enrolled: true,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "javascript",
    name: "JavaScript Basics",
    description: "Learn modern JavaScript and ES6+ features",
    language: "JavaScript",
    lessons: 38,
    duration: "6 weeks",
    difficulty: "Beginner",
    progress: 40,
    enrolled: true,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "cpp",
    name: "C++ Programming",
    description: "Object-oriented programming with C++",
    language: "C++",
    lessons: 52,
    duration: "10 weeks",
    difficulty: "Intermediate",
    progress: 0,
    enrolled: false,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "react",
    name: "Web Development with React",
    description: "Build modern web apps with React and TypeScript",
    language: "JavaScript",
    lessons: 60,
    duration: "12 weeks",
    difficulty: "Intermediate",
    progress: 0,
    enrolled: false,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Master DSA concepts with Python",
    language: "Python",
    lessons: 48,
    duration: "10 weeks",
    difficulty: "Advanced",
    progress: 0,
    enrolled: false,
    color: "from-green-500 to-green-600",
  },
  {
    id: "java",
    name: "Java for Beginners",
    description: "Learn Java programming from scratch",
    language: "Java",
    lessons: 42,
    duration: "8 weeks",
    difficulty: "Beginner",
    progress: 0,
    enrolled: false,
    color: "from-red-500 to-orange-600",
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold hidden sm:inline">AI Coding Tutor</span>
              </Link>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Explore <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a course and start your learning journey
          </p>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            My Courses
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses
              .filter((course) => course.enrolled)
              .map((course) => (
                <Card key={course.id} className="border-border/50 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${course.color} text-white text-sm font-medium`}>
                        {course.language}
                      </div>
                      <div className="text-sm text-muted-foreground">{course.difficulty}</div>
                    </div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/courses/${course.id}`} className="w-full">
                      <Button className="btn-hero w-full rounded-xl">
                        Continue Learning
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Courses;
