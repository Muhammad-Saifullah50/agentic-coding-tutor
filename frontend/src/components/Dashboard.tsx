'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, BookOpen, Play, Trophy, TrendingUp, Zap, Sparkles } from "lucide-react";
import aiMentor from "./../../public/ai-mentor.jpg";

import { FullCourseData } from "@/types/course";
import { UserProfile } from "@/types/user";

interface DashboardProps {
  courses: FullCourseData[];
  userProfile: UserProfile | null;
}

const Dashboard = ({ courses, userProfile }: DashboardProps) => {


  const userProgress = {
    currentStreak: userProfile?.streak || 0,
    totalXP: userProfile?.xp || 0,
    coursesInProgress: courses.length,
    lessonsCompleted: courses.reduce((acc, fullCourse) => {
      return acc + fullCourse.course_data.modules.reduce((lessonAcc, module) => {
        return lessonAcc + module.lessons.filter(lesson => lesson.completed).length;
      }, 0);
    }, 0),
  };



  return (
    <div className="min-h-screen bg-background ">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome back, Saifullah! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to continue your coding journey today?
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/courses/create">
                <Button className="btn-hero rounded-xl gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Create Course</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-semibold">{userProgress.currentStreak} day streak!</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold mb-1">{userProgress.totalXP}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{userProgress.coursesInProgress}</div>
                <div className="text-sm text-muted-foreground">Active Courses</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <div className="text-2xl font-bold mb-1">{userProgress.lessonsCompleted}</div>
                <div className="text-sm text-muted-foreground">Lessons Done</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold mb-1">{userProgress.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Subscription & Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold">{userProfile?.subscription_plan || 'Free'}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-semibold">{userProfile?.credits || 0}</span>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full rounded-xl">
                    Purchase Credits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {courses && courses.length > 0 ? (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Continue Learning
                  </CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((fullCourse) => {

                    const course = fullCourse.course_data;
                    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
                    const completedLessons = course.modules.reduce((acc, module) => {
                      return acc + module.lessons.filter(lesson => lesson.completed).length;
                    }, 0);
                    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                    return (
                      <div key={course.course_id} className="p-4 rounded-xl border border-border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold mb-1">{course.title}</h4>
                          </div>
                          <Link href={`/courses/${fullCourse.course_id}`}>
                            <Button size="sm" className="btn-hero rounded-lg">
                              Continue
                            </Button>
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">You haven't created any courses yet!</h3>
                <p className="text-muted-foreground mb-6">Start your learning journey by creating your first course.</p>
                <Link href="/courses/create">
                  <Button className="btn-hero rounded-xl gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Your First Course
                  </Button>
                </Link>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into your learning activities</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4">
                <Link href="/courses" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5 rounded-xl"
                  >
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="font-medium">Browse Courses</span>
                  </Button>
                </Link>
                <Link href="/playground" className="block">
                  < Button
                    variant="outline"
                    className="w-full h-24 flex-col gap-2 hover:border-accent hover:bg-accent/5 rounded-xl"
                  >
                    <Code2 className="w-6 h-6 text-accent" />
                    <span className="font-medium">Code Playground</span>
                  </Button>
                </Link>
                <Link href="/quiz" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-24 flex-col gap-2 hover:border-secondary hover:bg-secondary/5 rounded-xl"
                  >
                    <Trophy className="w-6 h-6 text-secondary" />
                    <span className="font-medium">Take Quiz</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Mentor */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center">
                <img
                  src={aiMentor}
                  alt="AI Mentor"
                  className="w-32 h-32 mx-auto mb-4 rounded-2xl"
                />
                <h3 className="text-xl font-bold mb-2">Your AI Mentor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Need help? Ask me anything about coding!
                </p>
                <Button className="btn-hero w-full rounded-xl">
                  Chat with Mentor
                </Button>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete today's challenge to earn bonus XP and maintain your streak!
                </p>
                <Button variant="outline" className="w-full rounded-xl">
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
