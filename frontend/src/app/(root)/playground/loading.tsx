import { Code2, Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                {/* Icon with spinner */}
                <div className="relative">
                    <div className="p-4 rounded-full bg-accent/10">
                        <Code2 className="w-8 h-8 text-accent" />
                    </div>
                    <Loader2 className="w-6 h-6 text-accent animate-spin absolute -top-1 -right-1" />
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <p className="text-lg font-medium text-foreground">Loading Playground...</p>
                    <p className="text-sm text-muted-foreground mt-1">Setting up your coding environment</p>
                </div>
            </div>
        </div>
    );
}
