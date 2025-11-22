'use client';
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { reviewCode } from "@/actions/code-review.actions";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

const Playground = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [aiReview, setAiReview] = useState<{
    correctedCode?: string;
    feedback?: string;
  } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  // Configure Monaco Editor before mount
  const handleEditorWillMount = (monaco: any) => {
    // Ensure syntax highlighting is enabled
    monaco.languages.register({ id: 'javascript' });
    monaco.languages.register({ id: 'typescript' });
    monaco.languages.register({ id: 'python' });
    monaco.languages.register({ id: 'java' });
    monaco.languages.register({ id: 'cpp' });
    monaco.languages.register({ id: 'csharp' });
  };

  // Strip markdown code fences from AI corrected code
  const stripMarkdownCodeFences = (code: string): string => {
    // Remove code fences like ```javascript\n...\n``` or ```\n...\n```
    const codeBlockRegex = /^```[\w]*\n([\s\S]*?)```$/m;
    const match = code.match(codeBlockRegex);
    if (match) {
      return match[1].trim();
    }
    // If no code fences found, return as-is
    return code.trim();
  };

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setAiReview(null);


  };

  const handleAiReview = async () => {
    if (!code.trim()) {
      toast.error("No Code Provided", {
        description: "Please write some code before requesting a review.",
      });
      return;
    }

    setIsReviewing(true);
    setAiReview(null);

    try {
      const response = await reviewCode({
        code,
        language,
        session_id: `playground-${Date.now()}`,
      });

      if (response.status === 'success' && response.corrected_code && response.feedback_explanation) {
        setAiReview({
          correctedCode: response.corrected_code,
          feedback: response.feedback_explanation,
        });

        toast.success("Review Complete! ✨", {
          description: "AI has analyzed your code and provided feedback.",
        });
      } else if (response.status === 'failure') {
        // Guardrail or validation error
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

  const handleReset = () => {
    handleLanguageChange(language);
    setAiReview(null);
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Code Playground</h1>
            <p className="text-muted-foreground">Write, test, and get AI feedback on your code</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: Editors */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Code Editor */}
              <Card className="p-6">
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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

                  <div className="flex-1" />

                  <Button
                    onClick={handleAiReview}
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

                <h3 className="font-semibold text-sm text-foreground mb-2">📝 Your Code</h3>
                {/* Monaco Editor - User Code */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-dark"
                    beforeMount={handleEditorWillMount}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </Card>

              {/* AI Corrected Code Editor */}
              {aiReview?.correctedCode && (
                <Card className="p-6">
                  <h3 className="font-semibold text-sm text-foreground mb-2">✨ AI Corrected Code</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language={language}
                      value={stripMarkdownCodeFences(aiReview.correctedCode)}
                      theme="vs-dark"
                      beforeMount={handleEditorWillMount}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        padding: { top: 16, bottom: 16 },
                      }}
                    />
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: AI Feedback Panel */}
            <Card className="p-6 h-fit sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">AI Feedback</h2>
              </div>

              {aiReview?.feedback ? (
                <div className="space-y-4">
                  {/* Feedback Explanation Section */}
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">📝 Analysis & Suggestions</h3>
                    <div className="p-4 bg-muted/50 rounded-lg max-h-[600px] overflow-y-auto text-sm prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      <ReactMarkdown
                        components={{
                          code: ({ className, children, ...props }) => (
                            <code className="bg-muted px-1 py-0.5 rounded" {...props}>
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {aiReview.feedback}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click "Get AI Review" to receive feedback on your code
                  </p>
                </div>
              )}

              {/* Tips Section */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-sm text-foreground mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Write clean, readable code</li>
                  <li>• Add comments to explain logic</li>
                  <li>• Follow best practices</li>
                  <li>• Test edge cases</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Playground;
