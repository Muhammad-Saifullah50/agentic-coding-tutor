'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code2, Sparkles, Target, Brain, Clock, CheckCircle2, Edit2 } from 'lucide-react';
import { updateUserProfile } from '@/actions/profile.actions';
import { toast } from 'sonner';
import {
  AGE_RANGES,
  EDUCATION_LEVELS,
  TECH_BACKGROUNDS,
  CODING_EXPERIENCES,
  GOALS,
  LEARNING_SPEEDS,
  LEARNING_MODES,
  TIME_COMMITMENTS,
  PREFERRED_LANGUAGES
} from "@/constants/onboarding";

const Onboarding = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({

    ageRange: '',
    educationLevel: '',
    techBackground: '',
    codingExperience: '',
    goals: [] as string[],
    learningSpeed: '',
    learningMode: '',
    timePerWeek: '',
    preferredLanguage: '',
  });

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      setIsGenerating(true);

      const result = await updateUserProfile(formData, userId);

      if (!result.success) {

        toast.error('Error updating profile', {
          description: 'Something went wrong while updating your profile. Please try again.',
        });
        return;
      }

      toast.success('Profile Created', {
        description: 'Your personalized learning profile has been created successfully!',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        description: 'An unexpected error occurred while creating profile.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50 shadow-xl animate-scale-in">
          <CardContent className="p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse">
                <Sparkles className="w-12 h-12 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Building Your Profile</h2>
            <p className="text-muted-foreground mb-6">
              Creating your personalized learning experience...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <Code2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to AI Coding Tutor</h1>
          <p className="text-muted-foreground">Let's personalize your learning journey</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {step + 1} of {totalSteps}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-border/50 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <CardHeader>
            {step === 0 && (
              <>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Tell Us About Yourself</CardTitle>
                <CardDescription>Help us understand your background</CardDescription>
              </>
            )}
            {step === 1 && (
              <>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>What Are Your Goals?</CardTitle>
                <CardDescription>Select all that apply</CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Your Learning Style</CardTitle>
                <CardDescription>How do you learn best?</CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Time Commitment</CardTitle>
                <CardDescription>How much time can you dedicate?</CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Review Your Profile</CardTitle>
                <CardDescription>Your personalized learning profile</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 0: Background */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AGE_RANGES.map(range => (
                      <Button
                        key={range}
                        variant={formData.ageRange === range ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, ageRange: range })}
                        className="rounded-xl"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Education Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EDUCATION_LEVELS.map(level => (
                      <Button
                        key={level}
                        variant={formData.educationLevel === level ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, educationLevel: level })}
                        className="rounded-xl"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tech Background</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TECH_BACKGROUNDS.map(bg => (
                      <Button
                        key={bg}
                        variant={formData.techBackground === bg ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, techBackground: bg })}
                        className="rounded-xl"
                      >
                        {bg}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Coding Experience</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CODING_EXPERIENCES.map(exp => (
                      <Button
                        key={exp}
                        variant={formData.codingExperience === exp ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, codingExperience: exp })}
                        className="rounded-xl"
                      >
                        {exp}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Goals */}
            {step === 1 && (
              <div className="space-y-2">
                {GOALS.map(goal => (
                  <Button
                    key={goal}
                    variant={formData.goals.includes(goal) ? 'default' : 'outline'}
                    onClick={() => toggleGoal(goal)}
                    className="w-full justify-start rounded-xl h-auto py-4"
                  >
                    <CheckCircle2 className={`w-5 h-5 mr-3 ${formData.goals.includes(goal) ? 'opacity-100' : 'opacity-30'}`} />
                    {goal}
                  </Button>
                ))}
              </div>
            )}

            {/* Step 2: Learning Style */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Learning Speed</label>
                  <div className="grid grid-cols-1 gap-2">
                    {LEARNING_SPEEDS.map(speed => (
                      <Button
                        key={speed}
                        variant={formData.learningSpeed === speed ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, learningSpeed: speed })}
                        className="rounded-xl h-auto py-4"
                      >
                        {speed}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Learning Mode</label>
                  <div className="grid grid-cols-1 gap-2">
                    {LEARNING_MODES.map(mode => (
                      <Button
                        key={mode}
                        variant={formData.learningMode === mode ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, learningMode: mode })}
                        className="rounded-xl h-auto py-4"
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Time */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Time Per Week</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_COMMITMENTS.map(time => (
                      <Button
                        key={time}
                        variant={formData.timePerWeek === time ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, timePerWeek: time })}
                        className="rounded-xl h-auto py-4"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Language</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PREFERRED_LANGUAGES.map(lang => (
                      <Button
                        key={lang}
                        variant={formData.preferredLanguage === lang ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, preferredLanguage: lang })}
                        className="rounded-xl"
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-3">
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-4 space-y-3">
                    {[
                      { label: 'Age Range', value: formData.ageRange, step: 0 },
                      { label: 'Education', value: formData.educationLevel, step: 0 },
                      { label: 'Tech Background', value: formData.techBackground, step: 0 },
                      { label: 'Experience', value: formData.codingExperience, step: 0 },
                      { label: 'Goals', value: formData.goals.join(', '), step: 1 },
                      { label: 'Learning Speed', value: formData.learningSpeed, step: 2 },
                      { label: 'Learning Mode', value: formData.learningMode, step: 2 },
                      { label: 'Time per Week', value: formData.timePerWeek, step: 3 },
                      { label: 'Language', value: formData.preferredLanguage, step: 3 },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-medium">{item.value || 'Not set'}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setStep(item.step)}
                          className="rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-xl flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="btn-hero rounded-xl flex-1"
            disabled={
              (step === 0 && (!formData.ageRange || !formData.educationLevel || !formData.techBackground || !formData.codingExperience)) ||
              (step === 1 && formData.goals.length === 0) ||
              (step === 2 && (!formData.learningSpeed || !formData.learningMode)) ||
              (step === 3 && (!formData.timePerWeek || !formData.preferredLanguage))
            }
          >
            {step === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
