"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/app/i18n/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  X,
} from "lucide-react"

interface MobileNavProps {
  onClose: () => void
}

export function MobileNav({ onClose }: MobileNavProps) {
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
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-sm border-r bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/${locale}`} className="flex items-center space-x-2" onClick={onClose}>
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
              FE
            </div>
            <span className="font-bold">{t.common?.appName || "FeverEducation"}</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
