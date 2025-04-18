"use client"

import type React from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { SidebarNav } from "@/components/sidebar/sidebar-nav"

type DashboardLayoutProps = {
  children: React.ReactNode
  userRole?: "teacher" | "student"
}

export function DashboardLayout({ children, userRole = "teacher" }: DashboardLayoutProps) {
  // Determine user role from the URL if not provided
  // This is a fallback and should be replaced with proper auth
  const determinedRole = userRole

  return (
    <ErrorBoundary>
      <SidebarNav userRole={determinedRole}>{children}</SidebarNav>
    </ErrorBoundary>
  )
}
