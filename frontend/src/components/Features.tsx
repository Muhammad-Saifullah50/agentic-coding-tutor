import { FeaturesHeader } from "./client/FeaturesHeader";
import { FeatureItem } from "./client/FeatureItem";

import { FEATURES as features } from "@/constants/landing";

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