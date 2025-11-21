import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Module } from '@/types/course'
import React, { useRef, useEffect } from "react";


interface LessonSidebarProps {
  modules: Module[];
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  courseName: string;
}

export const LessonSidebar = ({
  modules,
  currentLessonId,
  onLessonSelect,
  courseName,
}: LessonSidebarProps) => {
  const allLessons = modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(l => l.completed).length;
  const lessonRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  useEffect(() => {
    const currentLessonRef = lessonRefs.current.get(currentLessonId);
    if (currentLessonRef) {
      currentLessonRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLessonId]);

console.log(modules, 'asASa')
  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-2">{courseName}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{completedLessons}/{totalLessons} completed</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={moduleIndex}>
              <h3 className="text-lg font-semibold mb-2 px-4">{module.title}</h3>
              <div className="space-y-2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isActive = lesson.id === currentLessonId;
                  const canAccess = !lesson.locked || lesson.completed;

                  return (
                    <button
                      key={lesson.id}
                      ref={el => lessonRefs.current.set(lesson.id, el)}
                      onClick={() => canAccess && onLessonSelect(lesson.id)}
                      disabled={!canAccess}
                      className={cn(
                        "w-full text-left p-4 rounded-lg transition-all",
                        "hover:bg-accent/50",
                        isActive && "bg-primary/10 border-l-4 border-primary",
                        !canAccess && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              Lesson {lessonIndex + 1}
                            </span>
                            {lesson.type === "playground" && (
                              <PlayCircle className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          <h3 className={cn(
                            "font-medium text-sm mb-1",
                            isActive ? "text-foreground font-semibold" : "text-foreground"
                          )}>
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
