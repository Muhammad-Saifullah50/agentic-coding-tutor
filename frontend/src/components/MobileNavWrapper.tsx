// components/MobileNavWrapper.tsx
'use client'

import MobileNav from "@/components/MobileNav"
import { useUser } from "@clerk/nextjs"

export function MobileNavWrapper({ navItems }: { navItems: any[] }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return null
  }

  // Convert Clerk user to your format if needed
  const userProfile = user ? {
    userId: user.id,
    username: user.username || user.firstName || 'User',
    imageUrl: user.imageUrl,
    // Add other fields your MobileNav expects
  } : null

  return <MobileNav user={userProfile} navItems={navItems} />
}