"use client"

import { useState } from "react"
import { BookOpen, Calendar, Clock, Users, TrendingUp, BarChart, PieChart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TeacherDashboardChart } from "@/components/teacher-dashboard-chart"
import { TeacherDashboardCalendar } from "@/components/teacher-dashboard-calendar"
import { AIInsights } from "@/components/ai-insights"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { t } = useLanguage()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{t("nav.dashboard")}</h1>
          <p className="text-muted-foreground">{t("dashboard.welcome")}, Jane Doe</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="group">
            <Calendar className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {t("dashboard.scheduleClass")}
          </Button>
          <Button className="group">
            <BookOpen className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {t("dashboard.createClass")}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher/dashboard/manage-data">
              <BarChart className="mr-2 h-4 w-4" />
              Manage Data
            </Link>
          </Button>
          <AIInsights />
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            {t("dashboard.overview")}
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            {t("dashboard.analytics")}
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            {t("dashboard.schedule")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.totalClasses")}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.totalStudents")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">+18 from last month</p>
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.avgEngagement")}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card className="scale-effect" hover>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.hoursTaught")}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 scale-effect" hover>
              <CardHeader>
                <CardTitle>{t("dashboard.studentPerformance")}</CardTitle>
                <CardDescription>Average scores across all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <TeacherDashboardChart />
              </CardContent>
            </Card>

            <Card className="col-span-3 scale-effect" hover>
              <CardHeader>
                <CardTitle>{t("dashboard.upcomingClasses")}</CardTitle>
                <CardDescription>Your schedule for the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Physics 101",
                      time: "Today, 10:00 AM",
                      students: 32,
                      progress: 100,
                    },
                    {
                      title: "Chemistry Basics",
                      time: "Today, 1:30 PM",
                      students: 28,
                      progress: 100,
                    },
                    {
                      title: "Advanced Mathematics",
                      time: "Tomorrow, 9:15 AM",
                      students: 24,
                      progress: 70,
                    },
                    {
                      title: "Biology Lab",
                      time: "Tomorrow, 2:00 PM",
                      students: 30,
                      progress: 40,
                    },
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-all hover:border-primary hover:shadow-sm cursor-pointer"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{cls.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {cls.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-3 w-3" />
                          {cls.students} students
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress value={cls.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-8">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="md:col-span-1 scale-effect" hover>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Class Distribution</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <TeacherDashboardChart />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 scale-effect" hover>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Student Performance Trends</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <TeacherDashboardChart />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="scale-effect" hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Class Engagement Metrics</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { name: "Physics 101", attendance: 95, participation: 87, completion: 92 },
                    { name: "Chemistry Basics", attendance: 88, participation: 76, completion: 85 },
                    { name: "Advanced Mathematics", attendance: 92, participation: 82, completion: 89 },
                    { name: "Biology Lab", attendance: 97, participation: 90, completion: 94 },
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className="space-y-2 rounded-md border p-3 transition-all hover:border-primary hover:shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cls.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Avg: {Math.round((cls.attendance + cls.participation + cls.completion) / 3)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Attendance</span>
                            <span>{cls.attendance}%</span>
                          </div>
                          <Progress value={cls.attendance} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Participation</span>
                            <span>{cls.participation}%</span>
                          </div>
                          <Progress value={cls.participation} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Completion</span>
                            <span>{cls.completion}%</span>
                          </div>
                          <Progress value={cls.completion} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card className="scale-effect" hover>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Manage your upcoming classes and events</CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherDashboardCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
