"use client"

import { useState, useEffect } from "react"
import { useSafeLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { MoreHorizontal, Download, Share2 } from "lucide-react"

interface AnalyticsTabProps {
  isLoading?: boolean
}

// Add a default timeframes object to ensure these values always exist
const defaultTimeframes = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
}

export function AnalyticsTab({ isLoading = false }: AnalyticsTabProps) {
  const [activeTimeframe, setActiveTimeframe] = useState("week")

  // Add this after the useState declaration
  useEffect(() => {
    // Ensure activeTimeframe is always a valid key
    if (!["day", "week", "month", "year"].includes(activeTimeframe)) {
      setActiveTimeframe("week")
    }
  }, [activeTimeframe])

  // Replace the language context usage
  // Safe access to language context
  const langContext = useSafeLanguage()
  const t = langContext.t

  // Sample data for charts
  const performanceData = [
    { name: "Math 101", average: 78, highest: 95, lowest: 62 },
    { name: "Science", average: 82, highest: 98, lowest: 65 },
    { name: "History", average: 75, highest: 90, lowest: 60 },
    { name: "English", average: 85, highest: 97, lowest: 70 },
  ]

  const engagementData = [
    { name: "Discussions", value: 85 },
    { name: "Assignments", value: 92 },
    { name: "Quizzes", value: 78 },
    { name: "Projects", value: 88 },
    { name: "Group Work", value: 76 },
  ]

  const skillData = [
    { subject: "Critical Thinking", A: 80, fullMark: 100 },
    { subject: "Problem Solving", A: 75, fullMark: 100 },
    { subject: "Communication", A: 85, fullMark: 100 },
    { subject: "Collaboration", A: 78, fullMark: 100 },
    { subject: "Creativity", A: 82, fullMark: 100 },
    { subject: "Research", A: 70, fullMark: 100 },
  ]

  const timeSpentData = [
    { name: "Lectures", hours: 24, color: "#3B82F6" },
    { name: "Assignments", hours: 18, color: "#8B5CF6" },
    { name: "Discussions", hours: 12, color: "#10B981" },
    { name: "Grading", hours: 15, color: "#F59E0B" },
    { name: "Preparation", hours: 20, color: "#EC4899" },
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Class Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t.teacher.dashboard.analytics.classPerformance}</CardTitle>
              <CardDescription>{t.teacher.dashboard.analytics.classPerformanceDesc}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="highest" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="lowest" stroke="#F43F5E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t.teacher.dashboard.analytics.studentEngagement}</CardTitle>
              <CardDescription>{t.teacher.dashboard.analytics.studentEngagementDesc}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Skill Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t.teacher.dashboard.analytics.skillBreakdown}</CardTitle>
              <CardDescription>{t.teacher.dashboard.analytics.skillBreakdownDesc}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Student Skills"
                    dataKey="A"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.6}
                  />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Time Spent Analysis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t.teacher.dashboard.analytics.timeSpent}</CardTitle>
              <CardDescription>{t.teacher.dashboard.analytics.timeSpentDesc}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeSpentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="hours"
                    label={({ name, value }) => `${name}: ${value}h`}
                  >
                    {timeSpentData.map((entry, index) => (
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
    </div>
  )
}
