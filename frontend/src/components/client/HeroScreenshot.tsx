'use client';

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Image from "next/image";

export const HeroScreenshot = () => {
    const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

    return (
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
                        src={'/landing-page-image.jpg'}
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
    );
};
