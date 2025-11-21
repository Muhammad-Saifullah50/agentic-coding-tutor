'use client';
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LessonSidebar } from "@/components/course/LessonSidebar";
import { LessonContent } from "@/components/course/LessonContent";
import { LessonQuiz } from "@/components/course/LessonQuiz";
import { LessonPlayground } from "@/components/course/LessonPlayground";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; // Removed ArrowLeft
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

  const [currentLessonId, setCurrentLessonId] = useState(() => {
    const firstIncompleteLesson = lessons.find(lesson => !lesson.completed);
    return firstIncompleteLesson?.id || lessons[0]?.id;
  });

  const currentLesson = lessons.find((l) => l.id === currentLessonId) || lessons[0];
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const nextLesson = lessons[currentIndex + 1];
  const isNextLessonLocked = !nextLesson || nextLesson.locked;

  const [isLoading, setIsLoading] = useState(false);

  const handleLessonComplete = async () => {
    const lessonIndex = lessons.findIndex((l) => l.id === currentLessonId);
    if (lessonIndex === -1 || lessons[lessonIndex].completed) {
      handleNext();
      return;
    }

    setIsLoading(true);

    const updatedLessons = lessons.map((lesson, idx) => {
      if (idx === lessonIndex) {
        return { ...lesson, completed: true };
      }
      if (idx === lessonIndex + 1 && lessonIndex + 1 < lessons.length) {
        return { ...lesson, locked: false };
      }
      return lesson;
    });

    const updatedModules = modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => {
        const updatedLesson = updatedLessons.find(ul => ul.id === lesson.id);
        return updatedLesson || lesson;
      })
    }));

    const updatedCourse = {
      ...course,
      modules: updatedModules,
    };

    if (courseData && updatedCourse) {
      await updateCourseProgress(courseData.course_id, updatedCourse);
      router.refresh(); // Re-fetch data to reflect completed lesson and unlocked next lesson
    }

    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      if (!isNextLessonLocked) {
        setCurrentLessonId(nextLesson.id);
        setSidebarOpen(false);
      }
    }
  };

  const handleQuizComplete = async () => {
    await handleLessonComplete();
    handleNext();
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
            isNextLessonLocked={isNextLessonLocked}
            isLoading={isLoading}
          />
        );
      
      case "quiz":
        return (
          <LessonQuiz
            title={currentLesson.title}
            questions={currentLesson.questions}
            onComplete={handleQuizComplete}
            onNext={handleNext}
            isNextLessonLocked={isNextLessonLocked}
            isLoading={isLoading}
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
            isNextLessonLocked={isNextLessonLocked}
            isLoading={isLoading}
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
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-2 m-4">
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
          {renderLessonContent()}
        </main>
      </div>
    </div>
  );
};

export default Course;
