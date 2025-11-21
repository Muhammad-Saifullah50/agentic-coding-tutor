import Link from "next/link"
import { Code2 } from "lucide-react"
import MobileNav from "@/components/MobileNav"
import { ThemeToggleButton } from "./ThemeToggleButton"
import { UserProfile } from "@/types/user"
import { Button } from "./ui/button"
import { UserButton } from "@clerk/nextjs"
import { Skeleton } from "./ui/skeleton"
import { CourseBackButton } from "./CourseBackButton" // New import

const Navbar = ({ user }: { user: UserProfile | null }) => { // Removed async keyword


  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Playground", href: "/playground" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ]


  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2"> {/* New flex container to group button and logo */}
            <CourseBackButton /> {/* New button component */}
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">CodeQuora</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!user && navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggleButton />
            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="btn-hero rounded-xl">Start Learning Free</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button
                    className="rounded-xl"
                  >
                    Dashboard
                  </Button>
                </Link>
                <UserButton fallback={<Skeleton className="rounded-full h-10 w-10"/>}/>
                {/* todo: have to check the skeleton */}
              </>
            )}
          </div>
          {/* Mobile Menu */}
          <MobileNav user={user} navItems={navItems} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar