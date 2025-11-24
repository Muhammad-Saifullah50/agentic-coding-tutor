import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code2, User, Target, Clock, Brain, Trophy, Award, Sparkles, Crown } from 'lucide-react';
import { UserProfile } from '@/types/user';
import Image from 'next/image';
import { ProfileEditButton, PreferencesEditButton, OnboardingButton } from './client/ProfileActions';
import { Button } from '@/components/ui/button';

interface ProfileProps {
  userProfile: UserProfile | null;
  progressData: {
    totalCourses: number;
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
  };
}

const Profile = ({ userProfile, progressData }: ProfileProps) => {
  // Get current plan from user profile, default to 'free'
  const currentPlan = userProfile?.subscription_plan || 'free';
  const currentCredits = userProfile?.credits || 0;

  // Plan details
  const planDetails = {
    free: { name: 'Free Plan', description: '2 course generations', color: 'bg-muted' },
    plus: { name: 'Plus Plan', description: '5 course generations', color: 'bg-primary' },
    pro: { name: 'Pro Plan', description: '10 course generations', color: 'bg-gradient-to-r from-primary to-secondary' }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Profile Found</CardTitle>
            <CardDescription>Please complete onboarding first</CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {userProfile.imageUrl ? (
                  <Image
                    src={userProfile.imageUrl}
                    alt={userProfile.username}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-accent shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">{userProfile.username}</h1>
          <p className="text-muted-foreground text-lg">Curious Learner 🚀</p>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
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
                <ProfileEditButton />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{userProfile.username}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{userProfile.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Age Group</span>
                <span className="font-medium">{userProfile.ageRange}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Education Level</span>
                <span className="font-medium">{userProfile.educationLevel}</span>
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card className="border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
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
                <PreferencesEditButton />
              </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Background</span>
                </div>
                <p className="font-medium">{userProfile.techBackground}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Goals</span>
                </div>
                <p className="font-medium text-sm">{userProfile.goals[0]}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Time Commitment</span>
                </div>
                <p className="font-medium">{userProfile.timePerWeek}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Learning Style</span>
                </div>
                <p className="font-medium">{userProfile.learningMode}</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">{userProfile?.xp || 0}</div>
                  <div className="text-xs text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/5">
                  <div className="text-2xl font-bold text-secondary mb-1">{userProfile?.streak || 0}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/5">
                  <div className="text-2xl font-bold text-accent mb-1">{progressData.totalCourses}</div>
                  <div className="text-xs text-muted-foreground">Courses Enrolled</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course Completion</span>
                  <span className="text-sm text-muted-foreground">
                    {progressData.completedLessons}/{progressData.totalLessons} lessons
                  </span>
                </div>
                <Progress value={progressData.completionPercentage} className="h-3" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>
                    {progressData.completionPercentage > 0
                      ? "You're doing great! Keep it up!"
                      : "Start your learning journey today!"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card className="border-border/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both bg-gradient-to-br from-primary/5 to-secondary/5">
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
              {/* Current Plan */}
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${currentPlan === 'free' ? 'bg-muted text-foreground' :
                      currentPlan === 'plus' ? 'bg-primary' :
                        'bg-gradient-to-r from-primary to-secondary'
                    }`}>
                    {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                  </span>
                </div>
                <p className="font-semibold text-lg mb-1">
                  {planDetails[currentPlan as keyof typeof planDetails]?.name || 'Free Plan'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {planDetails[currentPlan as keyof typeof planDetails]?.description || '2 course generations'}
                </p>
              </div>

              {/* Credits */}
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Available Credits</span>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-primary">{currentCredits}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use credits to generate courses and access premium features
                </p>
              </div>

              {/* Upgrade Button */}
              {currentPlan !== 'pro' && (
                <Link href="/pricing">
                  <Button className="w-full btn-hero rounded-xl gap-2">
                    <Award className="w-5 h-5" />
                    {currentPlan === 'free' ? 'Upgrade Plan' : 'Upgrade to Pro'}
                  </Button>
                </Link>
              )}

              {currentPlan === 'pro' && (
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary">You're on the best plan! 🎉</p>
                </div>
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
