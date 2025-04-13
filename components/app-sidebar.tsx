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

export function AppSidebar() {
  const pathname = usePathname()

  const isTeacherPath = pathname.startsWith("/teacher")
  const isStudentPath = pathname.startsWith("/student")
  const isActive = (path: string) => pathname === path

  const teacherItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/teacher/dashboard",
    },
    {
      title: "Classes",
      icon: BookOpen,
      url: "/teacher/classes",
    },
    {
      title: "Students",
      icon: Users,
      url: "/teacher/students",
    },
    {
      title: "Class Generator",
      icon: Wand2,
      url: "/teacher/generator",
    },
    {
      title: "Homework Builder",
      icon: PenTool,
      url: "/teacher/homework-builder",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/teacher/settings",
    },
  ]

  const studentItems = [
    {
      title: "My Classes",
      icon: BookOpen,
      url: "/student/classes",
    },
    {
      title: "Quizzes",
      icon: PenTool,
      url: "/student/quiz",
    },
    {
      title: "AI Tutor",
      icon: MessageSquare,
      url: "/student/chat",
    },
    {
      title: "Profile",
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
                {isTeacherPath ? "Teacher" : "Student"} Mode
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer transition-colors hover:bg-accent/10">
                <Link href="/teacher/dashboard">Teacher Mode</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer transition-colors hover:bg-accent/10">
                <Link href="/student/classes">Student Mode</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isTeacherPath && (
          <SidebarGroup>
            <SidebarGroupLabel>Teacher</SidebarGroupLabel>
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
            <SidebarGroupLabel>Student</SidebarGroupLabel>
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
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">{isTeacherPath ? "Teacher" : "Student"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10 hover:text-accent">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
