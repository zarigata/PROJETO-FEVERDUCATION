"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/app/i18n/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookOpen, Calendar, LayoutDashboard, LogOut, Settings, Sparkles, Users } from "lucide-react"

type SidebarNavProps = {
  children: React.ReactNode
  userRole?: "teacher" | "student"
}

export function SidebarNav({ children, userRole = "teacher" }: SidebarNavProps) {
  const { t, locale } = useLanguage()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.includes(`/${locale}/${userRole}/${path}`) || false
  }

  const teacherLinks = [
    {
      href: `/${locale}/teacher/dashboard`,
      label: t.common.dashboard || "Dashboard",
      icon: LayoutDashboard,
      active: isActive("dashboard"),
    },
    {
      href: `/${locale}/teacher/students`,
      label: t.common.students || "Students",
      icon: Users,
      active: isActive("students"),
    },
    {
      href: `/${locale}/teacher/classes`,
      label: t.common.classes || "Classes",
      icon: BookOpen,
      active: isActive("classes"),
    },
    {
      href: `/${locale}/teacher/schedule`,
      label: t.common.schedule || "Schedule",
      icon: Calendar,
      active: isActive("schedule"),
    },
    {
      href: `/${locale}/teacher/ai-generator`,
      label: t.common.aiGenerator || "AI Generator",
      icon: Sparkles,
      active: isActive("ai-generator"),
    },
    {
      href: `/${locale}/teacher/settings`,
      label: t.common.settings || "Settings",
      icon: Settings,
      active: isActive("settings"),
    },
  ]

  const studentLinks = [
    {
      href: `/${locale}/student/dashboard`,
      label: t.common.dashboard || "Dashboard",
      icon: LayoutDashboard,
      active: isActive("dashboard"),
    },
    {
      href: `/${locale}/student/classes`,
      label: t.common.classes || "Classes",
      icon: BookOpen,
      active: isActive("classes"),
    },
    {
      href: `/${locale}/student/assignments`,
      label: t.common.assignments || "Assignments",
      icon: Calendar,
      active: isActive("assignments"),
    },
    {
      href: `/${locale}/student/ai-tutor`,
      label: t.common.aiTutor || "AI Tutor",
      icon: Sparkles,
      active: isActive("ai-tutor"),
    },
    {
      href: `/${locale}/student/settings`,
      label: t.common.settings || "Settings",
      icon: Settings,
      active: isActive("settings"),
    },
  ]

  const links = userRole === "teacher" ? teacherLinks : studentLinks

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="flex flex-col gap-2 p-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">{t.common.appName || "EduPlatform"}</span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild isActive={link.active}>
                        <Link href={link.href}>
                          <link.icon className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ModeToggle />
                <LanguageSwitcher />
              </div>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${locale}/login`}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.common.logout || "Logout"}
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <div className="flex items-center md:hidden mb-4">
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
