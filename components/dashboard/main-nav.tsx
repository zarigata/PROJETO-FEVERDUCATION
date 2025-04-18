"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/app/i18n/client"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  GraduationCap,
  FileText,
  BarChart2,
} from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  // Safe access to language context
  const langContext = useLanguage()
  const locale = langContext?.locale || "en"
  let t: any = {
    common: {
      dashboard: "Dashboard",
      students: "Students",
      classes: "Classes",
      schedule: "Schedule",
      aiGenerator: "AI Generator",
      settings: "Settings",
      resources: "Resources",
      reports: "Reports",
      analytics: "Analytics",
    },
  }

  if (langContext?.t) {
    t = langContext.t
  }

  const navItems = [
    {
      title: t.common.dashboard,
      href: `/${locale}/teacher/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: t.common.students,
      href: `/${locale}/teacher/students`,
      icon: Users,
    },
    {
      title: t.common.classes,
      href: `/${locale}/teacher/classes`,
      icon: BookOpen,
    },
    {
      title: t.common.schedule,
      href: `/${locale}/teacher/schedule`,
      icon: Calendar,
    },
    {
      title: t.common.aiGenerator,
      href: `/${locale}/teacher/ai-generator`,
      icon: MessageSquare,
    },
    {
      title: t.common.resources,
      href: `/${locale}/teacher/resources`,
      icon: GraduationCap,
    },
    {
      title: t.common.reports,
      href: `/${locale}/teacher/reports`,
      icon: FileText,
    },
    {
      title: t.common.analytics,
      href: `/${locale}/teacher/analytics`,
      icon: BarChart2,
    },
    {
      title: t.common.settings,
      href: `/${locale}/teacher/settings`,
      icon: Settings,
    },
  ]

  return (
    <nav className="flex items-center space-x-6">
      <Link href={`/${locale}`} className="hidden items-center space-x-2 md:flex">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
          FE
        </div>
        <span className="hidden font-bold sm:inline-block">{t.common?.appName || "FeverEducation"}</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
