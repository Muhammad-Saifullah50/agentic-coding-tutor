'use client'

import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

const SignOutButton = () => {
  return (
<Button variant={'outline'}>
    <LogOut className="w-4 h-4" />
</Button>
  )
}

export default SignOutButton