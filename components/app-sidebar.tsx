"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PenTool,
  Settings,
  User,
  Users,
  Wand2,
  Loader2,
} from "lucide-react"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { profile, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { toast } = useToast()

  const isTeacherPath = pathname.startsWith("/teacher")
  const isStudentPath = pathname.startsWith("/student")
  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        variant: "success",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const teacherItems = [
    {
      title: t("nav.dashboard"),
      icon: LayoutDashboard,
      url: "/teacher/dashboard",
    },
    {
      title: t("nav.classes"),
      icon: BookOpen,
      url: "/teacher/classes",
    },
    {
      title: t("nav.students"),
      icon: Users,
      url: "/teacher/students",
    },
    {
      title: t("nav.generator"),
      icon: Wand2,
      url: "/teacher/generator",
    },
    {
      title: t("nav.homework"),
      icon: PenTool,
      url: "/teacher/homework-builder",
    },
    {
      title: t("nav.settings"),
      icon: Settings,
      url: "/teacher/settings",
    },
  ]

  const studentItems = [
    {
      title: t("nav.myClasses"),
      icon: BookOpen,
      url: "/student/classes",
    },
    {
      title: t("nav.quizzes"),
      icon: PenTool,
      url: "/student/quiz",
    },
    {
      title: t("nav.aiTutor"),
      icon: MessageSquare,
      url: "/student/chat",
    },
    {
      title: t("nav.profile"),
      icon: User,
      url: "/student/profile",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-4">
        <Logo />

        <SidebarSeparator className="my-4" />

        <div className="flex w-full items-center justify-between px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent/10">
                {isTeacherPath ? t("mode.teacher") : t("mode.student")}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer transition-colors hover:bg-accent/10">
                <Link href="/teacher/dashboard">{t("mode.teacher")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer transition-colors hover:bg-accent/10">
                <Link href="/student/classes">{t("mode.student")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.home")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/">
                    <Home />
                    <span>{t("nav.home")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isTeacherPath && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("mode.teacher")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {teacherItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url} className="group">
                        <item.icon className="transition-transform group-hover:scale-110" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isStudentPath && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("mode.student")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {studentItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url} className="group">
                        <item.icon className="transition-transform group-hover:scale-110" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-primary transition-all hover:border-accent">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground">{isTeacherPath ? t("mode.teacher") : t("mode.student")}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent/10 hover:text-accent"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
