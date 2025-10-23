'use client';

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, BookOpen, Play, Trophy, TrendingUp, Zap, Sparkles } from "lucide-react";
import aiMentor from "@/assets/ai-mentor.jpg";

const Dashboard = () => {
  // Mock data - will be replaced with real data
  const userProgress = {
    currentStreak: 7,
    totalXP: 1250,
    coursesInProgress: 2,
    lessonsCompleted: 24,
  };

  const recentCourses = [
    {
      id: 1,
      name: "Python Fundamentals",
      progress: 65,
      language: "Python",
      color: "text-blue-500",
    },
    {
      id: 2,
      name: "JavaScript Basics",
      progress: 40,
      language: "JavaScript",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold hidden sm:inline">AI Coding Tutor</span>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
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
              <Link to="/create-course">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="p-4 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{course.name}</h4>
                        <p className={`text-sm ${course.color}`}>{course.language}</p>
                      </div>
                      <Button size="sm" className="btn-hero rounded-lg">
                        Continue
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into your learning activities</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4">
                <Link to="/courses" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5 rounded-xl"
                  >
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="font-medium">Browse Courses</span>
                  </Button>
                </Link>
                <Link to="/playground" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex-col gap-2 hover:border-accent hover:bg-accent/5 rounded-xl"
                  >
                    <Code2 className="w-6 h-6 text-accent" />
                    <span className="font-medium">Code Playground</span>
                  </Button>
                </Link>
                <Link to="/quiz" className="block">
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
