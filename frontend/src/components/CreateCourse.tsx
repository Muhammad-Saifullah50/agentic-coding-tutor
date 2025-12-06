'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Sparkles, User, Code2, Target, Clock, Brain, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfile } from '@/types/user';
import { CurriculumOutline } from '@/types/curriculum';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { PROGRAMMING_LANGUAGES as languages, FOCUS_AREAS as focuses, GOALS, CODING_EXPERIENCES, TECH_BACKGROUNDS, EDUCATION_LEVELS, AGE_RANGES, LEARNING_SPEEDS, LEARNING_MODES, TIME_COMMITMENTS, PREFERRED_LANGUAGES } from "@/constants/onboarding";


const CreateCourse = ({ userProfile }: { userProfile: UserProfile }) => {

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [generatedOutline, setGeneratedOutline] = useState<CurriculumOutline | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [editableProfile, setEditableProfile] = useState(userProfile);
  const [additionalNotes, setAdditionalNotes] = useState('');


  const router = useRouter();


  const profileOptions = {
    goals: GOALS,
    codingExperience: CODING_EXPERIENCES,
    techBackground: TECH_BACKGROUNDS,
    educationLevel: EDUCATION_LEVELS,
    ageRange: AGE_RANGES,
    learningSpeed: LEARNING_SPEEDS,
    learningMode: LEARNING_MODES,
    timePerWeek: TIME_COMMITMENTS,
    preferredLanguage: PREFERRED_LANGUAGES,
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditableProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (value: string) => {
    setEditableProfile(prev => ({ ...prev, goals: [value] }));
  };

  /**
   * Poll the workflow status endpoint until the outline is ready
   */
  const [outlineToastId, setOutlineToastId] = useState<string | number | null>(null);

  const pollWorkflowStatus = async (wfId: string, toastId: string | number) => {
    const maxAttempts = 120; // Poll for up to 2 minutes
    let attempts = 0;

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        toast.error('Outline generation timed out.', { id: toastId });
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/workflow-status/${wfId}`);
        if (!res.ok) throw new Error('Failed to fetch workflow status');

        const statusData = await res.json();

        if (statusData.status === 'OUTLINE_READY' && statusData.outline) {
          let parsedOutline = statusData.outline;
          if (typeof statusData.outline === 'string') {
            try {
              parsedOutline = JSON.parse(statusData.outline);
            } catch (e) {
              console.error('Failed to parse outline JSON:', e);
              toast.error('Failed to parse course outline.', { id: toastId });
              return;
            }
          }

          // Check for guardrail error
          if (parsedOutline.error) {
            toast.error(parsedOutline.message || parsedOutline.error, {
              id: toastId,
              duration: 5000,
              className: 'bg-destructive text-destructive-foreground',
            });
            return;
          }

          setGeneratedOutline(parsedOutline);
          toast.success('Outline generated!', {
            id: toastId,
            duration: Infinity,
            action: {
              label: 'View Outline',
              onClick: () => setIsDialogOpen(true),
            },
          });
          return;
        }

        attempts++;
        setTimeout(() => poll(), 1000);

      } catch (error) {
        console.error('Polling error:', error);
        attempts++;
        setTimeout(() => poll(), 1000);
      }
    };

    await poll();
  };

  const handleGenerateCourse = async () => {
    if (!selectedLanguage || !selectedFocus) {
      toast.error('Please select both language and focus area');
      return;
    }

    const toastId = toast.loading('Generating course outline...');
    setOutlineToastId(toastId);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/create-curriculum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            language: selectedLanguage,
            focus: selectedFocus,
            additionalNotes: additionalNotes,
          },
          userProfile: editableProfile,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to start course generation');
      }

      const result = await res.json();
      const wfId = result.workflow_id;

      setWorkflowId(wfId);
      await pollWorkflowStatus(wfId, toastId);

    } catch (error) {
      console.error(error);
      toast.error('Failed to start course generation.', { id: toastId });
    }
  };

  /**
   * Step 2: Approve the outline and generate the full course
   */
  const handleConfirmAndCreateCourse = async () => {
    if (!workflowId) {
      toast.error('Workflow ID is missing. Please try again.');
      return;
    }

    setIsDialogOpen(false);
    const courseToastId = toast.loading('Course is being generated, takes 4-5 mins. You can navigate to other pages.');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/generate-course/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true, userId: userProfile.userId }),
      });

      if (!res.ok) {
        const text = await res.text();
              toast.error('Failed to generate final course. Please try again.', { id: courseToastId });
        throw new Error(text || 'Failed to generate final course');
      }

      const result = await res.json();

      // Check for guardrail error in final course generation
      // Note: The backend might return the error directly or wrapped.
      // Based on the activity, if it fails, it returns a JSON string with error.
      // But here we are calling the temporal workflow which returns the result.
      // If the activity returns an error JSON, it will be in `result`.

      let parsedResult = result;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (e) { 
          // ignore
        }
      }

      if (parsedResult && parsedResult.error) {
        toast.error(parsedResult.message || parsedResult.error, {
          id: courseToastId,
          duration: 5000,
          className: 'bg-destructive text-destructive-foreground',
        });
        return;
      }

      const parsedCourseId = result.course_id

      toast.success('Your course has been successfully generated!', {
        id: courseToastId,
        action: {
          label: 'View Course',
          onClick: () => router.push(`/courses/${parsedCourseId}`),
        },
      });

    } catch (error) {
      console.error(error);
      toast.error('Failed to generate final course. Please try again.', { id: courseToastId });
    }
  };

  /**
   * Handler for rejecting the outline
   */
  const handleRejectOutline = async () => {
    if (!workflowId) {
      toast.error('Workflow ID is missing. Please try again.');
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/generate-course/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false }),
      });

      setIsDialogOpen(false);
      toast.info('Course generation cancelled. You can start over.');

    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel course generation.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Confirm Your <span className="text-gradient">Learning Profile</span> ✨
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your AI tutor uses this information to personalize your syllabus and exercises
          </p>
        </div>

        {/* Learning Profile Section */}
        <Card className="mb-8 border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className='flex flex-col gap-1'>
                  <CardTitle>Your Learning Profile</CardTitle>
                  <CardDescription>AI is ready to personalize your course!</CardDescription>
                </div>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Background', value: editableProfile.techBackground, field: 'techBackground', options: profileOptions.techBackground, icon: Code2, color: 'from-primary/10 to-primary/5 border-primary/20' },
                { label: 'Coding Experience', value: editableProfile.codingExperience, field: 'codingExperience', options: profileOptions.codingExperience, icon: Code2, color: 'from-secondary/10 to-secondary/5 border-secondary/20' },
                { label: 'Learning Goal', value: editableProfile.goals[0], field: 'goals', options: profileOptions.goals, icon: Target, color: 'from-secondary/10 to-secondary/5 border-secondary/20' },
                { label: 'Learning Speed', value: editableProfile.learningSpeed, field: 'learningSpeed', options: profileOptions.learningSpeed, icon: Clock, color: 'from-primary/10 to-primary/5 border-primary/20' },
                { label: 'Time Commitment', value: editableProfile.timePerWeek, field: 'timePerWeek', options: profileOptions.timePerWeek, icon: Clock, color: 'from-accent/10 to-accent/5 border-accent/20' },
                { label: 'Learning Style', value: editableProfile.learningMode, field: 'learningMode', options: profileOptions.learningMode, icon: Brain, color: 'from-primary/10 to-secondary/5 border-primary/20' },
                { label: 'Age Range', value: editableProfile.ageRange, field: 'ageRange', options: profileOptions.ageRange, icon: User, color: 'from-secondary/10 to-accent/5 border-secondary/20' },
              ].map(item => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-br ${item.color} border`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div className="w-full">
                        <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                        {item.options && item.field ? (
                          <Select
                            value={item.value}
                            onValueChange={(value) => {
                              if (item.field === 'goals') {
                                handleGoalChange(value);
                              } else {
                                handleProfileChange(item.field as keyof UserProfile, value);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-transparent border-none p-0 h-auto font-medium text-sm focus:ring-0">
                              <SelectValue placeholder={`Select ${item.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-medium text-sm">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Ready Indicator */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium">These changes will only take effect for your current course generation</p>
            </div>
          </CardContent>
        </Card>

        {/* Course Configuration */}
        <Card className="border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/10">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div className='flex flex-col gap-1'>
                <CardTitle>Course Configuration</CardTitle>
                <CardDescription>Choose your programming focus</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Programming Language */}
            <div>
              <label className="text-sm font-medium mb-3 block">Programming Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map(lang => (
                  <Button
                    key={lang.value}
                    variant={selectedLanguage === lang.value ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage(lang.value)}
                    className="rounded-xl h-auto py-4 relative overflow-hidden"
                  >
                    {selectedLanguage === lang.value && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${lang.color} opacity-90`} />
                    )}
                    <span className="relative z-10">{lang.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Learning Focus */}
            <div>
              <label className="text-sm font-medium mb-3 block">Learning Focus</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {focuses.map(focus => (
                  <Button
                    key={focus}
                    variant={selectedFocus === focus ? 'default' : 'outline'}
                    onClick={() => setSelectedFocus(focus)}
                    className="rounded-xl h-auto py-4"
                  >
                    {focus}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="additionalNotes" className="text-sm font-medium mb-3 block">Additional Notes</label>
              <Textarea
                id="additionalNotes"
                placeholder="Write any additional notes for course generation..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateCourse}
              disabled={!selectedLanguage || !selectedFocus}
              className="w-full btn-hero rounded-xl h-14 text-base gap-2 font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Looks Good → Generate Course
            </Button>


          </CardContent>
        </Card>
      </div>

      {/* Dialog for Human-in-the-Loop approval */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[625px] bg-background border-border/50 shadow-2xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Your Personalized Course Outline
            </DialogTitle>
            <DialogDescription>
              Here is the curriculum your AI tutor has generated for you.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{generatedOutline?.title}</h2>
              {generatedOutline?.modules.map((module, index) => (
                <div key={index} className="p-4 rounded-lg border border-border/50 bg-secondary/5">
                  <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <p className="text-xs text-muted-foreground font-medium mb-3">Duration: {module.duration}</p>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleRejectOutline} className="rounded-lg gap-2">
              <X className="w-4 h-4" />
              Reject & Start Over
            </Button>
            <Button onClick={handleConfirmAndCreateCourse} className="btn-hero rounded-lg gap-2">
              <Check className="w-4 h-4" />
              Confirm & Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCourse;