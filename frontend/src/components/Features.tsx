'use client'
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Image from "next/image";
import { Code2, LayoutDashboard, MessageSquare, Zap } from "lucide-react";

const features = [
    {
        title: "Personalized Learning Dashboard",
        description: "Track your progress with an intuitive dashboard that shows your achievements, completed lessons, and personalized learning path. Get insights into your coding journey with detailed analytics and recommendations.",
        image: '/feature-dashboard.jpg',
        imageAlt: "AI Coding Tutor dashboard showing course progress and personalized learning paths",
        icon: LayoutDashboard,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "Interactive Code Playground",
        description: "Write, test, and debug your code in a professional-grade editor with real-time AI feedback. Practice coding exercises, experiment with different languages, and get instant guidance when you're stuck.",
        image: '/playground-screenshot.jpg',
        imageAlt: "Interactive code playground with split-view editor and live output console",
        icon: Code2,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        title: "AI Mentor Chat",
        description: "Get instant help from your AI coding mentor. Ask questions about programming concepts, debug issues, and receive detailed explanations tailored to your learning level. Available 24/7 to support your coding journey.",
        image: '/chat-screenshot.jpg',
        imageAlt: "AI mentor chat interface with coding explanations and helpful suggestions",
        icon: MessageSquare,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
];

const FeatureItem = ({ feature, index }: { feature: any, index: number }) => {
    const { elementRef: featureRef, isVisible: featureVisible } = useIntersectionObserver({ threshold: 0.2 });
    const isEven = index % 2 === 0;

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
                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 space-y-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${feature.bgColor} border border-border/50 w-fit`}>
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${feature.color}`}>Feature {index + 1}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                    {feature.title}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                </p>

                <ul className="space-y-3 pt-4">
                    {[1, 2, 3].map((_, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${feature.color}`} />
                            <span className="text-sm text-muted-foreground">Key benefit or feature detail goes here</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const Features = () => {
    const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-muted/30" ref={elementRef}>
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className={`text-center mb-24 max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

                {/* Features with Screenshots */}
                <div className="space-y-32">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;