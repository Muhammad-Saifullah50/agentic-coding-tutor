import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Lesson {
  id: string;
  title: string;
  type: "content" | "quiz" | "playground";
  duration: string;
  completed: boolean;
  locked: boolean;
  // Content lesson properties
  content?: string;
  codeExample?: string;
  // Quiz lesson properties
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  // Playground lesson properties
  description?: string;
  language?: string;
  starterCode?: string;
  challenge?: string;
  hints?: string[];
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

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
                  const canAccess = !lesson.locked;

                  return (
                    <button
                      key={lesson.id}
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
                            isActive ? "text-primary" : "text-foreground"
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
