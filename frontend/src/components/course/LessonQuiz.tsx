"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonQuizProps {
  title: string;
  questions: Question[];
  onComplete: () => void;
  isLoading: boolean;
}

export const LessonQuiz = ({
  title,
  questions,
  onComplete,
  onNext,
  isNextLessonLocked,
  isLoading,
}: LessonQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer.toString();

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsSubmitted(true);
    
    if (isCorrect && !completedQuestions.includes(currentQuestionIndex)) {
      setScore(score + 1);
      setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
    }
  };

  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const handleNext = () => {
    if (isLastQuestion) {
      setIsQuizCompleted(true);
      onComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>•</span>
              <span>Score: {score}/{questions.length}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-colors",
                    index < currentQuestionIndex ? "bg-accent" :
                    index === currentQuestionIndex ? "bg-primary" :
                    "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <Card className="p-6 mb-6 bg-muted/50">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            <RadioGroup
              value={selectedAnswer || ""}
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index.toString();
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const showResult = isSubmitted;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all",
                      !showResult && isSelected && "border-primary bg-primary/5",
                      !showResult && !isSelected && "border-border hover:border-primary/50",
                      showResult && isCorrectAnswer && "border-accent bg-accent/5",
                      showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/5"
                    )}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-foreground"
                    >
                      {option}
                    </Label>
                    {showResult && isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </Card>

          {/* Explanation */}
          {isSubmitted && (
            <Card className={cn(
              "p-6",
              isCorrect ? "bg-accent/5 border-accent" : "bg-destructive/5 border-destructive"
            )}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {isCorrect ? "Correct!" : "Not quite right"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-card">
        <div className="text-sm text-muted-foreground">
          {isSubmitted && isLastQuestion ? "Quiz completed!" : ""}
        </div>
        
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isLoading}
            className="ml-auto"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Answer"}
          </Button>
        ) : isQuizCompleted ? (
          <Button
            onClick={onNext}
            disabled={isNextLessonLocked || isLoading}
            className="gap-2 ml-auto"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Next Lesson"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
            <Button
              onClick={handleNext}
              disabled={!isSubmitted || isLoading}
              className="gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLastQuestion ? "Complete Quiz" : "Next Question")}
              {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
