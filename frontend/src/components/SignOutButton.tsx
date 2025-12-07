'use client'

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

const SignOutButton = () => {
    return (
        <ClerkSignOutButton>
            <Button variant="outline" size="icon">
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Sign out</span>
            </Button>
        </ClerkSignOutButton>
    )
}

export default SignOutButton
