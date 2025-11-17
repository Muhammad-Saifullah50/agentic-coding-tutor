import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface LessonContentProps {
  title: string;
  content: string;
  codeExample?: string;
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export const LessonContent = ({
  title,
  content,
  codeExample,
  onComplete,
  onNext,
  isCompleted,
}: LessonContentProps) => {
  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {content}
            </div>
          </div>

          {codeExample && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Example Code:</h3>
              <Card className="bg-muted p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-foreground">{codeExample}</code>
                </pre>
              </Card>
            </div>
          )}

          {/* <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Key Takeaways:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Understand the core concepts presented in this lesson</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Practice with the provided code examples</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Apply these concepts in your own projects</span>
              </li>
            </ul>
          </div> */}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-card">
        {!isCompleted && (
          <Button
            onClick={onComplete}
            variant="outline"
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as Complete
          </Button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
        
        <Button onClick={onNext} className="gap-2 ml-auto">
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
