import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTitle } from "@/components/ui/chart"
import { Users, BookOpen, Award, Clock, ArrowUpRight, ArrowDownRight, Calendar, Plus } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const attendanceData = [
  { name: "Mon", attendance: 92 },
  { name: "Tue", attendance: 88 },
  { name: "Wed", attendance: 95 },
  { name: "Thu", attendance: 90 },
  { name: "Fri", attendance: 85 },
]

const performanceData = [
  { name: "Math 101", average: 78, highest: 95, lowest: 62 },
  { name: "Science", average: 82, highest: 98, lowest: 65 },
  { name: "History", average: 75, highest: 90, lowest: 60 },
  { name: "English", average: 85, highest: 97, lowest: 70 },
]

const gradeDistributionData = [
  { name: "A", value: 35, color: "#4CAF50" },
  { name: "B", value: 40, color: "#2196F3" },
  { name: "C", value: 15, color: "#FFC107" },
  { name: "D", value: 7, color: "#FF9800" },
  { name: "F", value: 3, color: "#F44336" },
]

const upcomingClasses = [
  { id: 1, name: "Math 101", time: "9:00 AM - 10:30 AM", room: "Room 204", students: 28 },
  { id: 2, name: "Science", time: "11:00 AM - 12:30 PM", room: "Lab 3", students: 24 },
  { id: 3, name: "History", time: "2:00 PM - 3:30 PM", room: "Room 105", students: 30 },
]

export default function TeacherDashboard() {
  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Ms. Johnson! Here's what's happening with your classes today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90">
              <Plus className="mr-2 h-4 w-4" /> Create New Class
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value="128"
            description="Across all classes"
            trend="up"
            percentage="12%"
            icon={<Users className="h-5 w-5 text-[#6200ee] dark:text-[#bb86fc]" />}
          />
          <StatsCard
            title="Active Classes"
            value="6"
            description="Currently teaching"
            trend="same"
            percentage="0%"
            icon={<BookOpen className="h-5 w-5 text-[#6200ee] dark:text-[#bb86fc]" />}
          />
          <StatsCard
            title="Assignments"
            value="24"
            description="8 need grading"
            trend="up"
            percentage="5%"
            icon={<Award className="h-5 w-5 text-[#6200ee] dark:text-[#bb86fc]" />}
          />
          <StatsCard
            title="Teaching Hours"
            value="18"
            description="This week"
            trend="down"
            percentage="3%"
            icon={<Clock className="h-5 w-5 text-[#6200ee] dark:text-[#bb86fc]" />}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Weekly Attendance Chart */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Weekly Attendance</CardTitle>
                  <CardDescription>Average attendance rate across all classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-[300px]">
                    <ChartTitle>Weekly Attendance (%)</ChartTitle>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="attendance" fill="#6200ee" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Overall grade distribution across classes</CardDescription>
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

            {/* Class Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
                <CardDescription>Average, highest, and lowest scores by class</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="average" stroke="#6200ee" strokeWidth={2} />
                      <Line type="monotone" dataKey="highest" stroke="#03dac6" strokeWidth={2} />
                      <Line type="monotone" dataKey="lowest" stroke="#f44336" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your upcoming classes for today</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#6200ee] text-[#6200ee] hover:bg-[#6200ee]/10 dark:border-[#bb86fc] dark:text-[#bb86fc]"
                >
                  <Calendar className="mr-2 h-4 w-4" /> View Full Schedule
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#e0e0e0] dark:border-[#333333]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-[#6200ee] dark:text-[#bb86fc]" />
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
                        <Button variant="ghost" size="icon" className="text-[#6200ee] dark:text-[#bb86fc]">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>Comprehensive analytics for all your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed analytics content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Classes</CardTitle>
                <CardDescription>Manage all your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Class management content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "same"
  percentage: string
  icon: React.ReactNode
}

function StatsCard({ title, value, description, trend, percentage, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center">
            {icon}
          </div>
          {trend === "up" && (
            <div className="flex items-center text-[#4CAF50]">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span className="text-xs font-medium">{percentage}</span>
            </div>
          )}
          {trend === "down" && (
            <div className="flex items-center text-[#F44336]">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span className="text-xs font-medium">{percentage}</span>
            </div>
          )}
          {trend === "same" && (
            <div className="flex items-center text-muted-foreground">
              <span className="text-xs font-medium">{percentage}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
