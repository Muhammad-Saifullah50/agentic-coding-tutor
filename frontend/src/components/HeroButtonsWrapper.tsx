// components/HeroButtonsWrapper.tsx
'use client'

import { useUser } from "@clerk/nextjs"
import { HeroButtons } from "./client/HeroButtons"
import { Skeleton } from "./ui/skeleton"

export function HeroButtonsWrapper() {
  const { user, isLoaded } = useUser()
  
  // Show skeleton while loading
  if (!isLoaded) {
    return <HeroButtonsSkeleton />
  }
  
  const userId = user?.id
  return <HeroButtons userId={userId} />
}

function HeroButtonsSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <Skeleton className="h-14 w-48 rounded-xl" />
      <Skeleton className="h-14 w-40 rounded-xl" />
    </div>
  )
}