'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, Menu, LogOut } from "lucide-react"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ThemeToggleButton } from "./ThemeToggleButton";
import { useSupabaseUser } from '@/hooks/useSupabaseUser'
import { createClient } from '@/utils/supabase/client'

const Navbar = () => {
  const supabase = createClient()


  const { user, loading } = useSupabaseUser()

  const [open, setOpen] = useState(false);

  //todo: have to separate mobile nav and make it client component and make this desktop nav server component.

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Playground", href: "/playground" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">CodeQuora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.href.startsWith("#") ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggleButton />
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="btn-hero rounded-xl">Start Learning Free</Button>
                </Link>
              </>
            ) : (
              <>
              <Link href="/dashboard">
                      <Button 
                        className="rounded-xl" 
                        
                        disabled={!user.confirmed_at}
                      >
                        Dashboard
                      </Button>
                    </Link>
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  onClick={() => supabase.auth.signOut()}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
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
                        onClick={() => supabase.auth.signOut()}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
