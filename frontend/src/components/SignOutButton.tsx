'use client'

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

const SignOutButton = () => {
    return (
        <ClerkSignOutButton>
            <Button variant={'ghost'} size={'icon'} className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4" />
            </Button>
        </ClerkSignOutButton>
    )
}

export default SignOutButton
