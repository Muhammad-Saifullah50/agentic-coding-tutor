'use client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code2, ArrowLeft, Edit2, User, Target, Clock, Brain, Trophy, Award, Sparkles, Crown } from 'lucide-react';
import { toast } from 'sonner';

import { UserProfile } from '@/types/user';

interface ProfileProps {
  userProfile: UserProfile | null;
}

const Profile = ({ userProfile }: ProfileProps) => {
  const navigate = useNavigate();
  const [currentPlan] = useState('free'); // 'free', 'pro', 'premium'

  // Mock progress data
  const progressData = {
    hoursStudied: 24,
    lessonsCompleted: 18,
    topicsMastered: 5,
    totalLessons: 45,
    completionPercentage: 40,
    streak: userProfile?.streak || 0,
    xp: userProfile?.xp || 0,
  };

  const handleEditProfile = () => {
    toast.info('Edit profile feature coming soon!');
  };

  const handleEditPreferences = () => {
    navigate('/onboarding');
  };

  // if (!userProfile) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center p-4">
  //       <Card className="max-w-md w-full">
  //         <CardHeader>
  //           <CardTitle>No Profile Found</CardTitle>
  //           <CardDescription>Please complete onboarding first</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button onClick={() => navigate('/onboarding')} className="w-full btn-hero">
  //             Start Onboarding
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold hidden sm:inline">AI Coding Tutor</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 animate-fade-in text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-accent shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">Saifullah</h1>
          <p className="text-muted-foreground text-lg">Curious Learner 🚀</p>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-border/50 shadow-lg animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Personal Info</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditProfile}
                  className="rounded-xl gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">Saifullah</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">user@example.com</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Age Group</span>
                {/* <span className="font-medium">{userProfile.ageRange}</span> */}
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card className="border-border/50 shadow-lg animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10">
                    <Brain className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Learning Preferences</CardTitle>
                    <CardDescription>Personalized for your journey</CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditPreferences}
                  className="rounded-xl gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Background</span>
                </div>
                {/* <p className="font-medium">{userProfile.techBackground}</p> */}
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Goals</span>
                </div>
                {/* <p className="font-medium text-sm">{userProfile.goals[0]}</p> */}
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Time Commitment</span>
                </div>
                {/* <p className="font-medium">{userProfile.timePerWeek}</p> */}
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Learning Style</span>
                </div>
                {/* <p className="font-medium">{userProfile.learningMode}</p> */}
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-border/50 shadow-lg animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/10">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Progress Overview</CardTitle>
                  <CardDescription>Your learning achievements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats Grid */}
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">{progressData.xp}</div>
                  <div className="text-xs text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/5">
                  <div className="text-2xl font-bold text-secondary mb-1">{progressData.streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/5">
                  <div className="text-2xl font-bold text-accent mb-1">{progressData.topicsMastered}</div>
                  <div className="text-xs text-muted-foreground">Topics Mastered</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course Completion</span>
                  <span className="text-sm text-muted-foreground">
                    {progressData.lessonsCompleted}/{progressData.totalLessons} lessons
                  </span>
                </div>
                <Progress value={progressData.completionPercentage} className="h-3" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>You're doing great! Keep it up!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card className="border-border/50 shadow-lg animate-fade-in bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Subscription & Billing</CardTitle>
                  <CardDescription>Manage your plan</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  {currentPlan === 'free' && (
                    <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">Free</span>
                  )}
                  {currentPlan === 'pro' && (
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">Pro</span>
                  )}
                  {currentPlan === 'premium' && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium">Premium</span>
                  )}
                </div>
                <p className="font-semibold text-lg mb-1">
                  {currentPlan === 'free' && 'Free Plan'}
                  {currentPlan === 'pro' && 'Pro Plan'}
                  {currentPlan === 'premium' && 'Premium Plan'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === 'free' && '5 AI lessons per month'}
                  {currentPlan === 'pro' && 'Unlimited lessons + analytics'}
                  {currentPlan === 'premium' && 'Everything + 1:1 AI sessions'}
                </p>
              </div>

              {currentPlan === 'free' && (
                <Link to="/pricing">
                  <Button className="w-full btn-hero rounded-xl gap-2">
                    <Award className="w-5 h-5" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}

              {currentPlan !== 'free' && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Next billing date: January 1, 2026</p>
                  <Button variant="link" className="text-primary">
                    Manage Subscription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
