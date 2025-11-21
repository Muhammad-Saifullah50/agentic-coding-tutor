'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, ArrowLeft, Clock, BookOpen } from "lucide-react";
import { FullCourseData } from "@/types/course";

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

          {courses.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card/50 border-border/50">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">You haven't created any courses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first AI-powered course. It only takes a few minutes!
              </p>
              <Link href="/courses/create">
                <Button className="btn-hero rounded-xl">
                  Create Your First Course
                </Button>
              </Link>
            </div>
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
};

export default Courses;
