'use client';

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export const FeaturesHeader = () => {
    const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

    return (
        <div ref={elementRef} className={`text-center mb-24 max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-muted">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-background shadow-sm">
                    Why Choose Us
                </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                Everything You Need to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2">Master Coding</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Our AI-powered platform provides all the tools, guidance, and real-time feedback you need to become a confident programmer.
            </p>
        </div>
    );
};
