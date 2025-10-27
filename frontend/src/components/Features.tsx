'use client'
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Image from "next/image";

const features = [
  {
    title: "Personalized Learning Dashboard",
    description: "Track your progress with an intuitive dashboard that shows your achievements, completed lessons, and personalized learning path. Get insights into your coding journey with detailed analytics and recommendations.",
    image: '/dashboard-screenshot.jpg' ,
    imageAlt: "AI Coding Tutor dashboard showing course progress and personalized learning paths",
  },
  {
    title: "Interactive Code Playground",
    description: "Write, test, and debug your code in a professional-grade editor with real-time AI feedback. Practice coding exercises, experiment with different languages, and get instant guidance when you're stuck.",
    image: '/playground-screenshot.jpg',
    imageAlt: "Interactive code playground with split-view editor and live output console",
  },
  {
    title: "AI Mentor Chat",
    description: "Get instant help from your AI coding mentor. Ask questions about programming concepts, debug issues, and receive detailed explanations tailored to your learning level. Available 24/7 to support your coding journey.",
    image: '/chat-screenshot.jpg',
    imageAlt: "AI mentor chat interface with coding explanations and helpful suggestions",
  },
];

const Features = () => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden" ref={elementRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="block text-gradient mt-2">Master Coding</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides all the tools and guidance you need to become a confident programmer.
          </p>
        </div>

        {/* Features with Screenshots */}
        <div className="space-y-24 md:space-y-32">
          {features.map((feature, index) => {
            const FeatureItem = () => {
              const { elementRef: featureRef, isVisible: featureVisible } = useIntersectionObserver({ threshold: 0.2 });
              
              return (
                <div 
                  ref={featureRef}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-8 lg:gap-12 items-center transition-all duration-700 ${
                    featureVisible 
                      ? 'opacity-100 translate-x-0' 
                      : index % 2 === 0 
                        ? 'opacity-0 -translate-x-10' 
                        : 'opacity-0 translate-x-10'
                  }`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative group">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-all duration-500" />
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />
                      
                      <Image 
                        src={feature.image}
                        alt={feature.imageAlt}
                        width={800}
                        height={500}
                        className="relative w-full h-auto rounded-3xl shadow-2xl border border-border/50 group-hover:scale-[1.02] transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            };
            
            return <FeatureItem key={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
