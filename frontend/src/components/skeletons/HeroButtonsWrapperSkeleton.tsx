
import { Skeleton } from "@/components/ui/skeleton"

export function HeroButtonsWrapperSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Skeleton className="h-14 w-48 rounded-xl" />
            <Skeleton className="h-14 w-40 rounded-xl" />
        </div>
    )
}
