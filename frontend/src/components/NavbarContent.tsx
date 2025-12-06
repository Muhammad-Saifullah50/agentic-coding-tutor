'use client'

import Link from "next/link"
import { useUser } from "@clerk/nextjs"

export function NavbarContent({ navItems }: { navItems: any[] }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return null
  }

  // Only show nav items if user is not logged in
  if (user) return null

  return (
    <div className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}