"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { useSafeToast } from "@/hooks/use-safe-toast"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab"
import { AnalyticsTab } from "@/components/dashboard/tabs/analytics-tab"
import { ClassesTab } from "@/components/dashboard/tabs/classes-tab"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ErrorLogger } from "@/lib/error-logger"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
// Update the import to use the safer language hook
import { useSafeLanguage } from "@/hooks/use-language"

export default function TeacherDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const { addToast } = useSafeToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New assignment submitted", read: false },
    { id: 2, message: "Parent meeting scheduled", read: false },
    { id: 3, message: "Curriculum update available", read: true },
  ])

  // Replace the language context usage
  // Safe access to language context
  const langContext = useSafeLanguage()
  const locale = langContext.locale
  const t = langContext.t

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateClass = () => {
    addToast("New class creation feature coming soon!", "info")
  }

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      addToast(`Searching for "${searchQuery}"`, "info")
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <ErrorBoundary
      onError={(error, info) => {
        ErrorLogger.logError({
          error,
          info,
          severity: "critical",
          context: "TeacherDashboard",
          user: "Ms. Johnson",
        })
      }}
    >
      <DashboardShell>
        <DashboardHeader
          title={t.common?.dashboard || "Dashboard"}
          description={
            t.teacher?.dashboard?.welcome || "Welcome back! Here's what's happening with your classes today."
          }
          actions={
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t.teacher.dashboard.search}
                  className="w-[200px] lg:w-[300px] pl-9 rounded-full bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="relative">
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>

              <Button onClick={handleCreateClass} className="rounded-full">
                <Plus className="mr-2 h-4 w-4" /> {t.teacher.dashboard.createClass}
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-3">
            <StatsCards isLoading={isLoading} />
          </div>
          <div className="md:col-span-1">
            <QuickActions />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-card rounded-full p-1 h-auto">
            <TabsTrigger
              value="overview"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.teacher?.dashboard?.tabs?.overview || "Overview"}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.teacher?.dashboard?.tabs?.analytics || "Analytics"}
            </TabsTrigger>
            <TabsTrigger
              value="classes"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.teacher?.dashboard?.tabs?.classes || "Classes"}
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="m-0">
                <OverviewTab isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="analytics" className="m-0">
                <AnalyticsTab isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="classes" className="m-0">
                <ClassesTab isLoading={isLoading} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </DashboardShell>
    </ErrorBoundary>
  )
}
