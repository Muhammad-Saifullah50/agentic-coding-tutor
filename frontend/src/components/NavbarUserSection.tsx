'use client'

import Link from "next/link"
import { User } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { NavbarUserSectionSkeleton } from "./skeletons/NavbarUserSectionSkeleton"

export function NavbarUserSection() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <NavbarUserSectionSkeleton />
  }

  if (!user) {
    return (
      <>
        <Link href="/sign-in">
          <Button variant="ghost">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="btn-hero rounded-xl">Start Learning Free</Button>
        </Link>
      </>
    )
  }

  return (
    <>
      <Link href="/dashboard">
                  <SignOutButton />

        <Button className="rounded-xl">Dashboard</Button>
      </Link>
      <Link href={`/profile/${user.id}`}>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 p-0 overflow-hidden ring-2 ring-border hover:ring-primary transition-all hover:scale-105"
        >
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.username || 'User'}
              width={32}
              height={32}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </Button>
      </Link>
    </>
  )
}