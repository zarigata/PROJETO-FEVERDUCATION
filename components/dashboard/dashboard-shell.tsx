"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/app/i18n/client"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MainNav } from "@/components/dashboard/main-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Safe access to language context
  const langContext = useLanguage()
  const locale = langContext?.locale || "en"
  let t: any = {}

  if (langContext?.t) {
    t = langContext.t
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-6">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
            <div className="hidden md:block">
              <MainNav />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      {showMobileMenu && isMobile && <MobileNav onClose={() => setShowMobileMenu(false)} />}
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className={cn("mx-auto", className)}>{children}</div>
        </div>
      </main>
    </div>
  )
}
