"use client"

import { useState, useEffect } from "react"
import { useSafeLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  LineChart,
  Line,
} from "recharts"
import { BookOpen, Calendar, Users, MoreHorizontal, ChevronRight } from "lucide-react"

interface OverviewTabProps {
  isLoading?: boolean
}

export function OverviewTab({ isLoading = false }: OverviewTabProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<"day" | "week" | "month" | "year">("week")

  // Add this right after the useState declaration
  useEffect(() => {
    // Ensure activeTimeframe is always a valid key
    if (!progressData[activeTimeframe]) {
      setActiveTimeframe("week")
    }
  }, [activeTimeframe])

  // Add a default timeframes object to ensure these values always exist
  const defaultTimeframes = {
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
  }

  // Replace the language context usage
  // Safe access to language context
  const langContext = useSafeLanguage()
  const t = langContext.t

  // Sample data for charts
  const attendanceData = [
    { name: "Mon", attendance: 92 },
    { name: "Tue", attendance: 88 },
    { name: "Wed", attendance: 95 },
    { name: "Thu", attendance: 90 },
    { name: "Fri", attendance: 85 },
  ]

  const gradeDistributionData = [
    { name: "A", value: 35, color: "#4CAF50" },
    { name: "B", value: 40, color: "#2196F3" },
    { name: "C", value: 15, color: "#FFC107" },
    { name: "D", value: 7, color: "#FF9800" },
    { name: "F", value: 3, color: "#F44336" },
  ]

  const progressData = {
    day: [
      { name: "8 AM", progress: 65 },
      { name: "10 AM", progress: 72 },
      { name: "12 PM", progress: 78 },
      { name: "2 PM", progress: 85 },
      { name: "4 PM", progress: 82 },
    ],
    week: [
      { name: "Mon", progress: 65 },
      { name: "Tue", progress: 72 },
      { name: "Wed", progress: 78 },
      { name: "Thu", progress: 85 },
      { name: "Fri", progress: 82 },
    ],
    month: [
      { name: "Week 1", progress: 65 },
      { name: "Week 2", progress: 72 },
      { name: "Week 3", progress: 78 },
      { name: "Week 4", progress: 85 },
    ],
    year: [
      { name: "Jan", progress: 65 },
      { name: "Feb", progress: 72 },
      { name: "Mar", progress: 78 },
      { name: "Apr", progress: 85 },
      { name: "May", progress: 82 },
      { name: "Jun", progress: 90 },
      { name: "Jul", progress: 88 },
      { name: "Aug", progress: 85 },
      { name: "Sep", progress: 92 },
      { name: "Oct", progress: 95 },
      { name: "Nov", progress: 90 },
      { name: "Dec", progress: 88 },
    ],
  }

  const upcomingClasses = [
    { id: 1, name: "Math 101", time: "9:00 AM - 10:30 AM", room: "Room 204", students: 28 },
    { id: 2, name: "Science", time: "11:00 AM - 12:30 PM", room: "Lab 3", students: 24 },
    { id: 3, name: "History", time: "2:00 PM - 3:30 PM", room: "Room 105", students: 30 },
  ]

  const studentActivityData = [
    { name: "Mon", submissions: 12, questions: 5, participation: 85 },
    { name: "Tue", submissions: 15, questions: 8, participation: 78 },
    { name: "Wed", submissions: 10, questions: 12, participation: 90 },
    { name: "Thu", submissions: 18, questions: 6, participation: 82 },
    { name: "Fri", submissions: 14, questions: 9, participation: 88 },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Attendance Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t.teacher.dashboard.attendance}</CardTitle>
              <CardDescription>{t.teacher.dashboard.attendanceDesc}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Print Report</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="attendance" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t.teacher.dashboard.gradeDistribution}</CardTitle>
              <CardDescription>{t.teacher.dashboard.gradeDistributionDesc}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Print Report</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>{t.teacher.dashboard.weeklyProgress}</CardTitle>
            <CardDescription>{t.teacher.dashboard.weeklyProgressDesc}</CardDescription>
          </div>
          <Tabs value={activeTimeframe} onValueChange={setActiveTimeframe} className="w-auto">
            <TabsList className="bg-muted/50 h-8">
              <TabsTrigger value="day" className="text-xs h-7">
                {t.teacher?.dashboard?.timeframes?.day || "Day"}
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs h-7">
                {t.teacher?.dashboard?.timeframes?.week || "Week"}
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs h-7">
                {t.teacher?.dashboard?.timeframes?.month || "Month"}
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs h-7">
                {t.teacher?.dashboard?.timeframes?.year || "Year"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData[activeTimeframe as keyof typeof progressData] || progressData.week}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#progressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Student Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>{t.teacher.dashboard.studentActivity}</CardTitle>
            <CardDescription>{t.teacher.dashboard.studentActivityDesc}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Print Report</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="submissions" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="questions" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="participation" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>{t.teacher.dashboard.schedule}</CardTitle>
            <CardDescription>{t.teacher.dashboard.scheduleDesc}</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-full">
            <Calendar className="mr-2 h-4 w-4" /> {t.teacher.dashboard.viewSchedule}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cls.time} • {cls.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-sm font-medium">{cls.students} Students</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" /> {Math.round(cls.students * 0.9)} Present
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full text-primary">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
