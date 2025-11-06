'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggleButton } from "./ThemeToggleButton"

interface MobileNavProps {
  user: any // Replace with your user type
  navItems: Array<{ label: string; href: string }>
  onSignOut: () => void
}

export const MobileNav = ({ user, navItems, onSignOut }: MobileNavProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <ThemeToggleButton />
          </div>
          {navItems.map((item) => (
            item.href.startsWith("#") ? (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button className="btn-hero w-full rounded-xl">
                    Start Learning Free
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button
                    className="w-full rounded-xl"
                    disabled={!user.confirmed_at}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full rounded-xl gap-2"
                  onClick={onSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}