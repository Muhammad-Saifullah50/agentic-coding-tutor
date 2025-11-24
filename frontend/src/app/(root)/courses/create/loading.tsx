import { Sparkles, Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                {/* Icon with spinner */}
                <div className="relative">
                    <div className="p-4 rounded-full bg-primary/10">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <Loader2 className="w-6 h-6 text-primary animate-spin absolute -top-1 -right-1" />
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <p className="text-lg font-medium text-foreground">Creating Course...</p>
                    <p className="text-sm text-muted-foreground mt-1">Preparing AI-powered course generator</p>
                </div>
            </div>
        </div>
    );
}
