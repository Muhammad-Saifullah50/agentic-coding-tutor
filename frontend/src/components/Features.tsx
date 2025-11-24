import { FeaturesHeader } from "./client/FeaturesHeader";
import { FeatureItem } from "./client/FeatureItem";

const features = [
    {
        title: "Personalized Learning Dashboard",
        description: "Track your progress with an intuitive dashboard that shows your achievements, completed lessons, and personalized learning path. Get insights into your coding journey with detailed analytics and recommendations.",
        image: '/feature-dashboard.jpg',
        imageAlt: "AI Coding Tutor dashboard showing course progress and personalized learning paths",
        iconName: "LayoutDashboard",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "AI Assisted Coding Playground",
        description: "Practice coding challenges with intelligent AI assistance built right into your editor. Get real-time hints, code reviews, and personalized feedback as you solve problems. Our interactive playground helps you learn by doing with step-by-step guidance.",
        image: '/ai-playground.png',
        imageAlt: "AI-assisted coding playground with challenge description and code editor",
        iconName: "Code2",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        title: "Personalized Courses for Everyone",
        description: "Create customized learning paths tailored to your unique coding goals, background, and learning style. Our AI analyzes your profile to generate courses that match your experience level, preferred pace, and areas of interest.",
        image: '/personalized-courses.jpg',
        imageAlt: "Personalized course configuration interface showing adaptive learning options",
        iconName: "MessageSquare",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-muted/30">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <FeaturesHeader />

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