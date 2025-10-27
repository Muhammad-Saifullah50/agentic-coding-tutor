'use client';
import { Button } from "@/components/ui/button";
import  Link from "next/link";
import { Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Image from "next/image";


const Hero = () => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Learning</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Learn to Code
            <span className="block mt-2">
              <span className="text-gradient animate-fade-in" style={{ animationDelay: '0.2s' }}>with AI</span>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Master programming through personalized AI guidance, interactive lessons, and instant code feedback. Your journey to becoming a developer starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="btn-hero w-full sm:w-auto text-base px-8 py-6 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                Start Learning Free
              </Button>
            </Link>
            <Link href="#features">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base px-8 py-6 rounded-2xl hover:scale-105 transition-transform duration-300 backdrop-blur-sm"
              >
                Explore Features
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center pt-8 border-t border-border max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">10k+</div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">5+</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">100+</div>
              <div className="text-sm text-muted-foreground">AI-Powered Lessons</div>
            </div>
          </div>
        </div>

        {/* IDE Screenshot Below Hero */}
        <div 
          ref={elementRef}
          className={`mt-16 md:mt-24 max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="relative group">
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl" />
            
            <div className="relative">
              <Image 
                src={'/ide-screenshot.jpg'} 
                alt="Modern code editor with syntax highlighting and AI assistance"
                className="w-full h-auto rounded-3xl shadow-2xl border border-border/50 group-hover:scale-[1.02] transition-transform duration-500"
                width={1200}
                height={800}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
