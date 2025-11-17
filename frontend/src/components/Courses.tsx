'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, ArrowLeft, Clock, BookOpen } from "lucide-react";
import { FullCourse, FullCourseData } from "@/types/course";

const Courses = ({ courses }: { courses: FullCourseData[] }) => {
  console.log(courses)
  // Helper: Get total lessons
  const getTotalLessons = (course: FullCourseData) =>
    course.course_data.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  // Helper: Calculate total duration (string sum)
const getTotalDuration = (course: FullCourseData) => {
  const durations = course.course_data.modules
    .flatMap((m) => m.lessons.map((l) => parseInt(l.duration)))
    .filter(Boolean);

  const totalMinutes = durations.reduce((a, b) => a + b, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
};


  // Helper: Calculate progress %
  const getProgress = (course: FullCourseData) => {
    const lessons = course.course_data.modules.flatMap(m => m.lessons);
    const completed = lessons.filter(l => l.completed).length;
    return lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Top Navigation */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold hidden sm:inline">AI Coding Tutor</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Explore <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a course and start your learning journey
          </p>
        </div>

        {/* Course Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            My Courses
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const totalLessons = getTotalLessons(course);
              const totalDuration = getTotalDuration(course);
              const progress = getProgress(course);

              return (
                <Card key={course.slug} className="border-border/50 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">

                    {/* Lesson count + duration */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalLessons} lessons</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{totalDuration}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Modules Display */}
                    <div className="text-sm text-muted-foreground">
                      <strong>Modules:</strong>
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        {course.course_data.modules.map((mod, i) => (
                          <li key={i}>
                            {mod.title} ({mod.lessons.length} lessons)
                          </li>
                        ))}
                      </ul>
                    </div>

                  </CardContent>

                  <CardFooter>
                    <Link href={`/courses/${course.course_id}`} className="w-full">
                      <Button className="btn-hero w-full rounded-xl">
                        Continue Learning
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Courses;
