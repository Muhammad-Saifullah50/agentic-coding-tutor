'use client';
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonSidebar, Lesson } from "@/components/course/LessonSidebar";
import { LessonContent } from "@/components/course/LessonContent";
import { LessonQuiz } from "@/components/course/LessonQuiz";
import { LessonPlayground } from "@/components/course/LessonPlayground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


const Course = ({courseData}) => {

  console.log(courseData)
  
  const router = useRouter();
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
