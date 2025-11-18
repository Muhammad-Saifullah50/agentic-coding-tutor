"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, RotateCcw, ChevronRight, CheckCircle2 } from "lucide-react";
import ReactMarkdown from 'react-markdown'

interface LessonPlaygroundProps {
  title: string;
  description: string;
  language: string;
  starterCode: string;
  challenge: string;
  hints: string[];
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  isNextLessonLocked: boolean;
}

export const LessonPlayground = ({
  title,
  description,
  language,
  starterCode,
  challenge,
  hints,
  onComplete,
  onNext,
  isCompleted,
  isNextLessonLocked,
}: LessonPlaygroundProps) => {
  const [code, setCode] = useState(starterCode);
  const [aiReview, setAiReview] = useState<string | null>(null);

  const handleReset = () => {
    setCode(starterCode);
    setAiReview(null);
  };

  const handleAiReview = () => {
    // Placeholder for AI review functionality
    setAiReview("Great start! Your code structure looks good. Consider adding error handling for edge cases.");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid lg:grid-cols-3 gap-6 p-6">
          {/* Instructions Panel */}
          <Card className="p-6 overflow-auto lg:col-span-1">
            <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Challenge</h3>
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-sm text-foreground">
                    <ReactMarkdown>

                    {challenge}
                    </ReactMarkdown>
                    </p>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">💡 Hints</h3>
                <ul className="space-y-2">
                  {hints.map((hint, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary font-semibold">{index + 1}.</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {aiReview && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Feedback
                  </h3>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">{aiReview}</p>
                  </Card>
                </div>
              )}
            </div>
          </Card>

          {/* Editor Panel */}
          <Card className="p-6 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Code Editor</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={handleAiReview}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  Get AI Review
                </Button>
              </div>
            </div>

            <div className="flex-1 border border-border rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  padding: {top: 10},
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
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
        
        <Button onClick={onNext} disabled={isNextLessonLocked} className="gap-2 ml-auto">
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
