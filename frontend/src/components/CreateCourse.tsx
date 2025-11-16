'use client';

import { useState } from 'react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [generatedOutline, setGeneratedOutline] = useState<CurriculumOutline | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const router = useRouter();
  const handleEditProfile = (field: string) => {
    toast.info('Edit profile feature coming soon!');
  };

  const handleRegenerateProfile = () => {
    router.push('/edit-profile');
  };

  const handleGenerateCourse = async () => {
    if (!selectedLanguage || !selectedFocus) {
      toast.error('Please select both language and focus area');
      return;
    }

    setIsGenerating(true);

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
        throw new Error(text || 'Failed to create course');
      }

      const result = await res.json();
      console.log(result, 'Resutl')
      setGeneratedOutline(result);
      setIsDialogOpen(true);
      toast.success('Course outline generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmAndCreateCourse = () => {
    if (generatedOutline) {
      router.push(`/courses/${generatedOutline.slug}`);
    }
  };


  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50 shadow-xl animate-scale-in">
          <CardContent className="p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Generating Your Course</h2>
            <p className="text-muted-foreground mb-6">
              AI is preparing your personalized syllabus...
            </p>
            <Progress value={100} className="h-2" />
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

        {/* Learning Profile Section - Enhanced with icons */}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg gap-2">
              <X className="w-4 h-4" />
              Cancel
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
