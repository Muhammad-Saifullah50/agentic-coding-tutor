import Link from "next/link"
import { Code2 } from "lucide-react"
import { ThemeToggleButton } from "./ThemeToggleButton"
import { CourseBackButton } from "./CourseBackButton"
import { NavbarUserSection } from "./NavbarUserSection"
import { NavbarContent } from "./NavbarContent"
import { MobileNavWrapper } from "./MobileNavWrapper"

import { NAV_ITEMS } from "@/constants/navigation"

const Navbar = () => {
  const navItems = NAV_ITEMS

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CourseBackButton />
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">CodeQuora</span>
            </Link>
          </div>

          <NavbarContent navItems={navItems} />

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggleButton />
            <NavbarUserSection />
          </div>

          <MobileNavWrapper navItems={navItems} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar