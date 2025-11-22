"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, RotateCcw, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
import { reviewCode } from "@/actions/code-review.actions";

interface LessonPlaygroundProps {
  title: string;
  description: string;
  language: string;
  starterCode: string;
  challenge: string;
  hints: string[];
  onComplete: () => Promise<void>;
  onNext: () => void;
  isCompleted: boolean;
  isNextLessonLocked: boolean;
  isLoading: boolean;
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
  isLoading,
}: LessonPlaygroundProps) => {
  const [code, setCode] = useState(starterCode);
  const [aiReview, setAiReview] = useState<{
    correctedCode?: string;
    feedback?: string;
  } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState("challenge");
  const [activeRightTab, setActiveRightTab] = useState("user-code");

  // Configure Monaco Editor before mount
  const handleEditorWillMount = (monaco: any) => {
    monaco.languages.register({ id: 'javascript' });
    monaco.languages.register({ id: 'typescript' });
    monaco.languages.register({ id: 'python' });
    monaco.languages.register({ id: 'java' });
    monaco.languages.register({ id: 'cpp' });
    monaco.languages.register({ id: 'csharp' });
  };

  // Strip markdown code fences from AI corrected code
  const stripMarkdownCodeFences = (code: string): string => {
    const codeBlockRegex = /^```[\w]*\n([\s\S]*?)```$/m;
    const match = code.match(codeBlockRegex);
    if (match) {
      return match[1].trim();
    }
    return code.trim();
  };

  const handleReset = () => {
    setCode(starterCode);
    setAiReview(null);
    setActiveLeftTab("challenge");
    setActiveRightTab("user-code");
  };

  const handleAiReview = async () => {
    if (!code.trim()) {
      toast.error("No Code Provided", {
        description: "Please write some code before requesting a review.",
      });
      return;
    }

    setIsReviewing(true);

    try {
      const response = await reviewCode({
        code,
        language,
        challenge: `${title}: ${challenge}`,
        session_id: `lesson-${Date.now()}`,
      });

      if (response.status === 'success' && response.corrected_code && response.feedback_explanation) {
        setAiReview({
          correctedCode: response.corrected_code,
          feedback: response.feedback_explanation,
        });

        toast.success("Review Complete! ✨", {
          description: "AI has analyzed your code and provided feedback.",
        });

        // Switch to AI tabs
        setActiveLeftTab("ai-feedback");
        setActiveRightTab("ai-code");
      } else if (response.status === 'failure') {
        toast.error("Unable to Review Code", {
          description: response.error_message || "An error occurred during review.",
        });
      }
    } catch (error) {
      console.error('Error during AI review:', error);
      toast.error("Error", {
        description: "Failed to get AI review. Please try again.",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCompleteClick = async () => {
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid lg:grid-cols-3 gap-6 p-6">
          {/* Left Panel - Challenge/AI Feedback Tabs */}
          <Card className="p-6 overflow-auto lg:col-span-1">
            <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>

            <Tabs value={activeLeftTab} onValueChange={setActiveLeftTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="challenge">Challenge</TabsTrigger>
                <TabsTrigger value="ai-feedback" disabled={!aiReview}>
                  AI Feedback
                </TabsTrigger>
              </TabsList>

              <TabsContent value="challenge" className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Challenge</h3>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{challenge}</ReactMarkdown>
                    </div>
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
              </TabsContent>

              <TabsContent value="ai-feedback" className="space-y-4 mt-4">
                {aiReview?.feedback && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-none leading-relaxed [&_p]:mb-4">
                      <ReactMarkdown
                        components={{
                          code: ({ className, children, ...props }) => (
                            <code className="bg-muted px-1 py-0.5 rounded text-xs" {...props}>
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {aiReview.feedback}
                      </ReactMarkdown>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right Panel - Code Editor Tabs */}
          <Card className="p-6 lg:col-span-2 flex flex-col">
            <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="user-code">Your Code</TabsTrigger>
                  <TabsTrigger value="ai-code" disabled={!aiReview?.correctedCode}>
                    AI Corrected Code
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2"
                    disabled={isReviewing}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleAiReview}
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
                    disabled={isReviewing || !code.trim()}
                  >
                    {isReviewing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get AI Review
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <TabsContent value="user-code" className="flex-1 mt-0">
                <div className="h-full border border-border rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-dark"
                    beforeMount={handleEditorWillMount}
                    options={{
                      padding: { top: 16, bottom: 16 },
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="ai-code" className="flex-1 mt-0">
                {aiReview?.correctedCode && (
                  <div className="h-full border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="100%"
                      language={language}
                      value={stripMarkdownCodeFences(aiReview.correctedCode)}
                      theme="vs-dark"
                      beforeMount={handleEditorWillMount}
                      options={{
                        readOnly: true,
                        padding: { top: 16, bottom: 16 },
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                      }}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-card">
        {!isCompleted && (
          <Button
            onClick={handleCompleteClick}
            variant="outline"
            className="gap-2"
            disabled={isCompleting || isLoading}
          >
            {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Mark as Complete
          </Button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}

        <Button onClick={onNext} disabled={isNextLessonLocked || isLoading} className="gap-2 ml-auto">
          {isLoading && !isCompleting && <Loader2 className="w-4 h-4 animate-spin" />}
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
