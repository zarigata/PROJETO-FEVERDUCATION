"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Database, Server, Activity, Shield } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    teachers: 0,
    students: 0,
    classes: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    // Redirect if not admin
    if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setStats({
          totalUsers: 125,
          teachers: 32,
          students: 92,
          classes: 48,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

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

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform and users</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/database">
              <Database className="mr-2 h-4 w-4" />
              Database
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/logs">
              <Activity className="mr-2 h-4 w-4" />
              System Logs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">+12 from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.teachers}</div>
                    <p className="text-xs text-muted-foreground">+3 from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.students}</div>
                    <p className="text-xs text-muted-foreground">+9 from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Classes</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.classes}</div>
                    <p className="text-xs text-muted-foreground">+5 from last month</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card className="scale-effect" hover>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingStats ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    [
                      { action: "User Created", user: "John Doe", time: "10 minutes ago" },
                      { action: "Class Created", user: "Jane Smith", time: "1 hour ago" },
                      { action: "User Updated", user: "Michael Johnson", time: "2 hours ago" },
                      { action: "User Deleted", user: "Admin", time: "Yesterday" },
                      { action: "System Backup", user: "System", time: "Yesterday" },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-3 transition-all hover:border-primary hover:shadow-sm"
                      >
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">By {activity.user}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingStats ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    [
                      { name: "CPU Usage", value: "23%", status: "normal" },
                      { name: "Memory Usage", value: "45%", status: "normal" },
                      { name: "Disk Space", value: "68%", status: "normal" },
                      { name: "Database Connections", value: "12/50", status: "normal" },
                      { name: "API Response Time", value: "120ms", status: "normal" },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-3 transition-all hover:border-primary hover:shadow-sm"
                      >
                        <p className="font-medium">{metric.name}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              metric.status === "normal" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          <p>{metric.value}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button asChild>
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    View All Users
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {isLoadingStats ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  [
                    { name: "John Doe", email: "john@example.com", role: "Teacher", status: "Active" },
                    { name: "Jane Smith", email: "jane@example.com", role: "Teacher", status: "Active" },
                    { name: "Michael Johnson", email: "michael@example.com", role: "Student", status: "Active" },
                    { name: "Emily Davis", email: "emily@example.com", role: "Student", status: "Inactive" },
                    { name: "Admin User", email: "admin@example.com", role: "Admin", status: "Active" },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3 transition-all hover:border-primary hover:shadow-sm"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "Admin"
                              ? "bg-primary/10 text-primary"
                              : user.role === "Teacher"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-accent/10 text-accent"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>Monitor and manage system resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Server className="mr-2 h-4 w-4" />
                      Restart Server
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="mr-2 h-4 w-4" />
                      View System Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Audit
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">System Health</h3>
                  <div className="space-y-4">
                    {isLoadingStats ? (
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      [
                        { name: "Server Uptime", value: "14 days, 6 hours", status: "good" },
                        { name: "Last Backup", value: "Yesterday, 2:30 AM", status: "good" },
                        { name: "SSL Certificate", value: "Valid (expires in 45 days)", status: "good" },
                        { name: "Error Rate", value: "0.02%", status: "good" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border p-3 transition-all hover:border-primary hover:shadow-sm"
                        >
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                item.status === "good" ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></span>
                            <p className="text-sm">{item.value}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
