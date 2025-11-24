'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroButtonsProps {
    userId: string | undefined | null;
}

export const HeroButtons = ({ userId }: HeroButtonsProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            {userId ? (
                <Link href="/dashboard">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90"
                    >
                        Dashboard
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};
