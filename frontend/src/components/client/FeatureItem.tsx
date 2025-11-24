'use client';

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Image from "next/image";
import { Code2, LayoutDashboard, MessageSquare, LucideIcon } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    Code2,
    MessageSquare,
};

interface FeatureItemProps {
    feature: {
        title: string;
        description: string;
        image: string;
        imageAlt: string;
        iconName: string;
        color: string;
        bgColor: string;
    };
    index: number;
}

export const FeatureItem = ({ feature, index }: FeatureItemProps) => {
    const { elementRef: featureRef, isVisible: featureVisible } = useIntersectionObserver({ threshold: 0.2 });
    const isEven = index % 2 === 0;

    // Get the icon component from the map
    const IconComponent = iconMap[feature.iconName];

    return (
        <div
            ref={featureRef}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 lg:gap-20 items-center transition-all duration-1000 ease-out ${featureVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
        >
            {/* Image Side */}
            <div className="w-full lg:w-1/2 group perspective-1000">
                <div className={`relative rounded-3xl transition-transform duration-700 ease-out ${featureVisible ? 'rotate-y-0' : isEven ? '-rotate-y-6' : 'rotate-y-6'}`}>
                    {/* Decorative Background Elements */}
                    <div className={`absolute -inset-4 bg-gradient-to-r ${isEven ? 'from-primary/20 to-secondary/20' : 'from-secondary/20 to-accent/20'} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700`} />

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2 z-10">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            </div>
                        </div>
                        <Image
                            src={feature.image}
                            alt={feature.imageAlt}
                            width={800}
                            height={500}
                            className="w-full h-auto pt-8 transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Floating Icon Badge */}
                    <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} p-4 rounded-2xl bg-card shadow-xl border border-border/50 animate-float hidden md:block`}>
                        {IconComponent && <IconComponent className={`w-8 h-8 ${feature.color}`} />}
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 space-y-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${feature.bgColor} border border-border/50 w-fit`}>
                    {IconComponent && <IconComponent className={`w-4 h-4 ${feature.color}`} />}
                    <span className={`text-xs font-bold uppercase tracking-wider ${feature.color}`}>Feature {index + 1}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                    {feature.title}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </div>
    );
};
