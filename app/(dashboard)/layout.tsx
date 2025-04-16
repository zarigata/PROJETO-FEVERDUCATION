"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push("/")
    } else if (!isLoading && user && profile) {
      // Redirect based on role if in the wrong section
      const isTeacherPath = pathname.startsWith("/teacher")
      const isStudentPath = pathname.startsWith("/student")

      if (profile.role === "teacher" && isStudentPath) {
        router.push("/teacher/dashboard")
      } else if (profile.role === "student" && isTeacherPath) {
        router.push("/student/classes")
      }
    }
  }, [user, profile, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login in useEffect
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
