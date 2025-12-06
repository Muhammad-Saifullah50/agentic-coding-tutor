// components/HeroButtonsWrapper.tsx
'use client'

import { useUser } from "@clerk/nextjs"
import { HeroButtons } from "./client/HeroButtons"
import { HeroButtonsWrapperSkeleton } from "./skeletons/HeroButtonsWrapperSkeleton"

export function HeroButtonsWrapper() {
  const { user, isLoaded } = useUser()

  // Show skeleton while loading
  if (!isLoaded) {
    return <HeroButtonsWrapperSkeleton />
  }

  const userId = user?.id
  return <HeroButtons userId={userId} />
}