import { Sparkles, Code2, Terminal, Cpu } from "lucide-react";
import { HeroButtons } from "./client/HeroButtons";
import { HeroScreenshot } from "./client/HeroScreenshot";

const Hero = ({ userId }: { userId: string | undefined | null }) => {
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

          <HeroButtons userId={userId} />

        </div>

        {/* IDE Screenshot Below Hero */}
        <HeroScreenshot />
      </div>
    </section>
  );
};

export default Hero;