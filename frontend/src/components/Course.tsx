'use client';
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LessonSidebar } from "@/components/course/LessonSidebar";
import { LessonContent } from "@/components/course/LessonContent";
import { LessonQuiz } from "@/components/course/LessonQuiz";
import { LessonPlayground } from "@/components/course/LessonPlayground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FullCourseData } from "@/types/course";
import { Module } from "@/types/course";
import { updateCourseProgress } from "@/actions/course.actions";

const Course = ({ courseData }: {courseData: FullCourseData}) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = courseData?.course_data;

  const modules: Module[] = useMemo(() => course?.modules || [], [course]);
  const lessons = useMemo(() => modules.flatMap(m => m.lessons), [modules]);

  const [currentLessonId, setCurrentLessonId] = useState(lessons[0]?.id);

  useEffect(() => {
    const firstIncompleteLesson = lessons.find(lesson => !lesson.completed);
    if (firstIncompleteLesson && firstIncompleteLesson.id !== currentLessonId) {
      setCurrentLessonId(firstIncompleteLesson.id);
    }
  }, [lessons, currentLessonId, router, courseData.course_id]);

  const currentLesson = lessons.find((l) => l.id === currentLessonId) || lessons[0];

  const handleLessonComplete = async () => {
    const lessonIndex = lessons.findIndex((l) => l.id === currentLessonId);
    if (lessonIndex !== -1 && !lessons[lessonIndex].completed) {
      // This will mutate the lesson object which is shared with the modules structure
      lessons[lessonIndex].completed = true;
      
      // Unlock next lesson
      if (lessonIndex + 1 < lessons.length) {
        lessons[lessonIndex + 1].locked = false;
      }
      
      if (courseData && course) {
        await updateCourseProgress(courseData.course_id, course);
      }
    }
    handleNext();
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
    if (!currentLesson) return null;

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

  if (!course) {
    return <div>Loading course...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/courses")}
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
                modules={modules}
                currentLessonId={currentLessonId}
                onLessonSelect={(id) => {
                  setCurrentLessonId(id);
                  setSidebarOpen(false);
                }}
                courseName={course.title}
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
            modules={modules}
            currentLessonId={currentLessonId}
            onLessonSelect={setCurrentLessonId}
            courseName={course.title}
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
