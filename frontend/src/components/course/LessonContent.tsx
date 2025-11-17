import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CodeBox from "../CodeBox";

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
              <ReactMarkdown >
                {content}
              </ReactMarkdown>
            </div>
          </div>

          {codeExample && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Example Code:</h3>
              <Card className="bg-muted p-4 overflow-x-auto">

                <CodeBox codestr={codeExample}/> 

              </Card>
            </div>
          )}


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
