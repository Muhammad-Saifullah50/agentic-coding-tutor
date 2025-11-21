'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ArrowRight, Code2, Terminal, Cpu } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Image from "next/image";

const Hero = () => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Centered Content */}
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-md shadow-sm hover:bg-primary/15 transition-colors cursor-default">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 fill-mode-both">
            Master Coding
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">with AI Guidance</span>
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both font-light">
            Accelerate your journey from beginner to pro with personalized AI mentorship, interactive challenges, and real-time code analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90"
              >
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border-2 hover:bg-accent/5"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-16 justify-center pt-10 border-t border-border/40 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            {[
              { label: "Active Learners", value: "10k+", icon: Terminal },
              { label: "Programming Languages", value: "5+", icon: Code2 },
              { label: "AI-Powered Lessons", value: "100+", icon: Cpu },
            ].map((stat, index) => (
              <div key={index} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors duration-300">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IDE Screenshot Below Hero */}
        <div
          ref={elementRef}
          className={`mt-20 md:mt-32 max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-20 rotate-x-12'
            }`}
          style={{ perspective: '2000px' }}
        >
          <div className="relative group rounded-3xl">
            {/* Animated glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-[2rem] opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[2rem] blur-3xl" />

            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-background/50 backdrop-blur-xl">
              <div className="absolute top-0 left-0 right-0 h-12 bg-muted/50 border-b border-white/5 flex items-center px-6 gap-2 z-10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-4 px-4 py-1 rounded-md bg-background/50 text-xs text-muted-foreground font-mono border border-white/5">
                  agentic-tutor.tsx
                </div>
              </div>
              <Image
                src={'/ide-screenshot.jpg'}
                alt="Modern code editor with syntax highlighting and AI assistance"
                className="w-full h-auto pt-12 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                width={1400}
                height={900}
                priority
              />

              {/* Floating UI Elements (Decorative) */}
              <div className="absolute bottom-8 right-8 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 shadow-xl animate-float hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">AI Assistant Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;