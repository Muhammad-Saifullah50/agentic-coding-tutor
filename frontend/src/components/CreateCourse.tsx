'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, RefreshCw, User, Code2, Target, Clock, Brain, Edit2, Check, X } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

const CreateCourse = ({ userProfile }: { userProfile: UserProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [generatedOutline, setGeneratedOutline] = useState<CurriculumOutline | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  // New state for polling
  const [isPolling, setIsPolling] = useState(false);

  const router = useRouter();

  const languages = [
    { value: 'python', label: 'Python', color: 'from-blue-500 to-blue-600' },
    { value: 'javascript', label: 'JavaScript', color: 'from-yellow-500 to-yellow-600' },
    { value: 'java', label: 'Java', color: 'from-red-500 to-orange-600' },
    { value: 'cpp', label: 'C++', color: 'from-purple-500 to-purple-600' },
    { value: 'csharp', label: 'C#', color: 'from-green-500 to-green-600' },
    { value: 'go', label: 'Go', color: 'from-cyan-500 to-cyan-600' },
  ];

  const focuses = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Development',
    'Game Development',
    'Backend Development',
    'DevOps',
    'Cybersecurity',
  ];

  const handleEditProfile = (field: string) => {
    toast.info('Edit profile feature coming soon!');
  };

  const handleRegenerateProfile = () => {
    router.push('/edit-profile');
  };

  /**
   * Poll the workflow status endpoint until the outline is ready
   */
  const pollWorkflowStatus = async (wfId: string) => {
    const maxAttempts = 120; // Poll for up to 2 minutes
    let attempts = 0;

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        setIsLoading(false);
        setIsPolling(false);
        toast.error('Outline generation timed out. Please check if the Temporal worker is running.');
        console.error('Polling timed out after', maxAttempts, 'attempts');
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/workflow-status/${wfId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch workflow status');
        }

        const statusData = await res.json();
        console.log(`Poll attempt ${attempts + 1}: Status =`, statusData.status);

        if (statusData.status === 'OUTLINE_READY' && statusData.outline) {
          // Outline is ready!
          console.log('✅ Outline received!', statusData.outline);

          // Parse outline if it's a string
          let parsedOutline = statusData.outline;
          if (typeof statusData.outline === 'string') {
            try {
              parsedOutline = JSON.parse(statusData.outline);
              console.log('Parsed outline from JSON string');
            } catch (e) {
              console.error('Failed to parse outline JSON:', e);
            }
          }

          setGeneratedOutline(parsedOutline);
          console.log('original', statusData.outline)
          console.log(parsedOutline, 'parsed')
          setIsDialogOpen(true);
          setIsLoading(false);
          setIsPolling(false);
          toast.success('Course outline generated successfully!');
          return;
        }

        // Update loading message based on current status
        if (statusData.status === 'GENERATING_OUTLINE') {
          setLoadingMessage(`AI is crafting your personalized syllabus... (${attempts + 1}s)`);
        } else if (statusData.status === 'STARTING') {
          setLoadingMessage('Initializing AI agents...');
        }

        // Status is still STARTING or GENERATING - poll again
        attempts++;
        setTimeout(() => poll(), 1000); // Poll every 1 second

      } catch (error) {
        console.error('Polling error:', error);
        // Continue polling on error, but show in console
        attempts++;
        setTimeout(() => poll(), 1000); // Retry on error
      }
    };

    await poll();
  };

  /**
   * Step 1: Start the workflow and begin polling
   */
  const handleGenerateCourse = async () => {
    if (!selectedLanguage || !selectedFocus) {
      toast.error('Please select both language and focus area');
      return;
    }

    setIsLoading(true);
    setIsPolling(true);
    setLoadingMessage('Starting AI course generation...');

    try {
      const res = await fetch('http://localhost:8000/create-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            language: selectedLanguage,
            focus: selectedFocus
          },
          userProfile: userProfile
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to start course generation');
      }

      const result = await res.json();
      const wfId = result.workflow_id;

      setWorkflowId(wfId);
      setLoadingMessage('AI is preparing your personalized syllabus...');

      // Start polling for the outline
      await pollWorkflowStatus(wfId);

    } catch (error) {
      console.error(error);
      toast.error('Failed to start course generation. Please try again.');
      setIsLoading(false);
      setIsPolling(false);
      setLoadingMessage('');
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
    setIsLoading(true);
    setLoadingMessage('Generating your full course. This may take a moment...');

    try {
      const res = await fetch(`http://localhost:8000/generate-course/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true, userId: userProfile.userId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate final course');
      }

      const result = await res.json();
      const parsedCourse = JSON.parse(result.course)

      router.push(`/courses/${parsedCourse.slug}`)
      toast.success('Your course has been successfully generated!');
      // have to save course in db 
      // then get its id and then get the slug and then route

    } catch (error) {
      console.error(error);
      toast.error('Failed to generate final course. Please try again.');
      setIsLoading(false);
      setLoadingMessage('');
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
      await fetch(`http://localhost:8000/generate-course/${workflowId}`, {
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

  // Loading screen for both workflow start and course generation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50 shadow-xl animate-scale-in">
          <CardContent className="p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isPolling ? 'Generating Outline' : 'Generating Full Course'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {loadingMessage}
            </p>
            <Progress value={100} className="h-2" />
            {isPolling && (
              <p className="text-xs text-muted-foreground mt-4">
                This usually takes 10-30 seconds...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Confirm Your <span className="text-gradient">Learning Profile</span> ✨
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your AI tutor uses this information to personalize your syllabus and exercises
          </p>
        </div>

        {/* Learning Profile Section */}
        <Card className="mb-8 border-border/50 shadow-lg animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Your Learning Profile</CardTitle>
                  <CardDescription>AI is ready to personalize your course!</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateProfile}
                className="rounded-xl gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Regenerate</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Background', value: userProfile.techBackground, icon: Code2, color: 'from-primary/10 to-primary/5 border-primary/20' },
                { label: 'Learning Goal', value: userProfile.goals[0], icon: Target, color: 'from-secondary/10 to-secondary/5 border-secondary/20' },
                { label: 'Time Commitment', value: userProfile.timePerWeek, icon: Clock, color: 'from-accent/10 to-accent/5 border-accent/20' },
                { label: 'Learning Style', value: userProfile.learningMode, icon: Brain, color: 'from-primary/10 to-secondary/5 border-primary/20' },
                { label: 'Age Range', value: userProfile.ageRange, icon: User, color: 'from-secondary/10 to-accent/5 border-secondary/20' },
              ].map(item => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-br ${item.color} border`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm">{item.value}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProfile(item.label)}
                      className="rounded-full h-8 w-8 flex-shrink-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* AI Ready Indicator */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium">Your AI tutor is ready to create a personalized learning experience!</p>
            </div>
          </CardContent>
        </Card>

        {/* Course Configuration */}
        <Card className="border-border/50 shadow-lg animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/10">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div>
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

            {/* Generate Button */}
            <Button
              onClick={handleGenerateCourse}
              disabled={!selectedLanguage || !selectedFocus}
              className="w-full btn-hero rounded-xl h-14 text-base gap-2 font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Looks Good → Generate Course
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleRegenerateProfile}
                className="text-sm text-muted-foreground"
              >
                Edit Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Human-in-the-Loop approval */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] bg-background border-border/50 shadow-2xl">
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