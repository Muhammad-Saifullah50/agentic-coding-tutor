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
import { Play, Sparkles, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";

const Playground = () => {
  const [code, setCode] = useState(`// Write your code here
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`);
  
  const [language, setLanguage] = useState("javascript");
  const [aiReview, setAiReview] = useState<string | null>(null);

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
    
    // Set default code for each language
    const templates: Record<string, string> = {
      javascript: `// Write your code here
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`,
      python: `# Write your code here
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
      typescript: `// Write your code here
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
      java: `// Write your code here
public class Main {
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
      cpp: `// Write your code here
#include <iostream>
#include <string>

std::string greet(std::string name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << greet("World") << std::endl;
    return 0;
}`,
      csharp: `// Write your code here
using System;

class Program {
    static void Main() {
        Console.WriteLine(Greet("World"));
    }
    
    static string Greet(string name) {
        return $"Hello, {name}!";
    }
}`,
    };
    
    setCode(templates[value] || "");
  };

  const handleAiReview = () => {
    // Placeholder for AI review functionality
    setAiReview("AI Review feature coming soon! Connect to Lovable Cloud to enable AI-powered code reviews.");
  };

  const handleReset = () => {
    handleLanguageChange(language);
    setAiReview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Code Playground</h1>
            <p className="text-muted-foreground">Write, test, and get AI feedback on your code</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor Section */}
            <Card className="lg:col-span-2 p-6">
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
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>

                <div className="flex-1" />

                <Button
                  onClick={handleAiReview}
                  className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  Get AI Review
                </Button>
              </div>

              {/* Monaco Editor */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Editor
                  height="500px"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
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

            {/* AI Feedback Panel */}
            <Card className="p-6 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">AI Feedback</h2>
              </div>

              {aiReview ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{aiReview}</p>
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
