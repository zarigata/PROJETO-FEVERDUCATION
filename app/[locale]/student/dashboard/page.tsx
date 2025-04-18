"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, Award, ArrowRight, CheckCircle2, MessageSquare } from "lucide-react"
import { useLanguage } from "@/app/i18n/client"

// Sample data
const upcomingClasses = [
  { id: 1, name: "Mathematics", time: "9:00 AM - 10:30 AM", room: "Room 204", teacher: "Ms. Johnson" },
  { id: 2, name: "Science", time: "11:00 AM - 12:30 PM", room: "Lab 3", teacher: "Mr. Davis" },
  { id: 3, name: "History", time: "2:00 PM - 3:30 PM", room: "Room 105", teacher: "Mrs. Wilson" },
]

const assignments = [
  {
    id: 1,
    title: "Algebra Equations",
    subject: "Mathematics",
    dueDate: "Tomorrow",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    title: "Lab Report: Photosynthesis",
    subject: "Science",
    dueDate: "Friday",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    title: "Essay: Industrial Revolution",
    subject: "History",
    dueDate: "Next Monday",
    status: "pending",
    priority: "low",
  },
  { id: 4, title: "Vocabulary Quiz", subject: "English", dueDate: "Completed", status: "completed", priority: "none" },
]

const courses = [
  { id: 1, name: "Mathematics", progress: 68, teacher: "Ms. Johnson", nextClass: "Tomorrow, 9:00 AM" },
  { id: 2, name: "Science", progress: 75, teacher: "Mr. Davis", nextClass: "Today, 11:00 AM" },
  { id: 3, name: "History", progress: 42, teacher: "Mrs. Wilson", nextClass: "Today, 2:00 PM" },
  { id: 4, name: "English", progress: 89, teacher: "Mr. Thompson", nextClass: "Thursday, 10:00 AM" },
]

export default function StudentDashboard() {
  const { t } = useLanguage()

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.common.dashboard}</h1>
          <p className="text-muted-foreground">{t.student.dashboard.welcome}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.student.dashboard.stats.courses}</p>
                  <h3 className="text-2xl font-bold">4</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.student.dashboard.stats.assignments}</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.student.dashboard.stats.hours}</p>
                  <h3 className="text-2xl font-bold">12.5</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.student.dashboard.stats.grade}</p>
                  <h3 className="text-2xl font-bold">B+</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t.student.dashboard.tabs.overview}</TabsTrigger>
            <TabsTrigger value="courses">{t.student.dashboard.tabs.courses}</TabsTrigger>
            <TabsTrigger value="assignments">{t.student.dashboard.tabs.assignments}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>{t.student.dashboard.schedule}</CardTitle>
                <CardDescription>{t.student.dashboard.scheduleDesc}</CardDescription>
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
                          <span className="text-sm font-medium">{cls.teacher}</span>
                          <div className="text-xs text-muted-foreground">Teacher</div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-[#6200ee] dark:text-[#bb86fc]">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-[#6200ee] text-[#6200ee] hover:bg-[#6200ee]/10 dark:border-[#bb86fc] dark:text-[#bb86fc]"
                >
                  <Calendar className="mr-2 h-4 w-4" /> {t.teacher.dashboard.viewSchedule}
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>{t.student.dashboard.upcomingAssignments}</CardTitle>
                <CardDescription>{t.student.dashboard.upcomingAssignmentsDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments
                    .filter((a) => a.status === "pending")
                    .slice(0, 3)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-[#e0e0e0] dark:border-[#333333]"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-2 h-10 rounded-full ${
                              assignment.priority === "high"
                                ? "bg-[#f44336]"
                                : assignment.priority === "medium"
                                  ? "bg-[#ff9800]"
                                  : "bg-[#4caf50]"
                            }`}
                          />
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              assignment.priority === "high"
                                ? "destructive"
                                : assignment.priority === "medium"
                                  ? "outline"
                                  : "default"
                            }
                          >
                            {t.student.dashboard.due} {assignment.dueDate}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-[#6200ee] text-[#6200ee] hover:bg-[#6200ee]/10 dark:border-[#bb86fc] dark:text-[#bb86fc]"
                >
                  {t.student.dashboard.viewAll}
                </Button>
              </CardFooter>
            </Card>

            {/* AI Tutor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{t.student.dashboard.aiTutor}</CardTitle>
                <CardDescription>{t.student.dashboard.aiTutorDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#f5f5f5] dark:bg-[#1a1a1a] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#6200ee] dark:bg-[#bb86fc] flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white dark:text-[#121212]" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t.student.dashboard.needHelp}</h3>
                      <p className="text-sm text-muted-foreground">{t.student.dashboard.askAi}</p>
                    </div>
                  </div>
                  <Button className="bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90">
                    {t.student.dashboard.startChat}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{course.name}</CardTitle>
                      <Badge variant="outline">{course.nextClass}</Badge>
                    </div>
                    <CardDescription>Teacher: {course.teacher}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t.student.dashboard.courseProgress}</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-[#6200ee] dark:text-[#bb86fc] hover:bg-[#6200ee]/10">
                      {t.student.dashboard.viewCourse}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.student.dashboard.allAssignments}</CardTitle>
                <CardDescription>{t.student.dashboard.allAssignmentsDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending">{t.student.dashboard.pending}</TabsTrigger>
                    <TabsTrigger value="completed">{t.student.dashboard.completed}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending" className="mt-4 space-y-4">
                    {assignments
                      .filter((a) => a.status === "pending")
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-[#e0e0e0] dark:border-[#333333]"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-2 h-10 rounded-full ${
                                assignment.priority === "high"
                                  ? "bg-[#f44336]"
                                  : assignment.priority === "medium"
                                    ? "bg-[#ff9800]"
                                    : "bg-[#4caf50]"
                              }`}
                            />
                            <div>
                              <h3 className="font-medium">{assignment.title}</h3>
                              <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge
                              variant={
                                assignment.priority === "high"
                                  ? "destructive"
                                  : assignment.priority === "medium"
                                    ? "outline"
                                    : "default"
                              }
                            >
                              {t.student.dashboard.due} {assignment.dueDate}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <CheckCircle2 className="h-4 w-4 text-[#4caf50]" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="completed" className="mt-4 space-y-4">
                    {assignments
                      .filter((a) => a.status === "completed")
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-[#e0e0e0] dark:border-[#333333]"
                        >
                          <div className="flex items-center gap-4">
                            <CheckCircle2 className="h-5 w-5 text-[#4caf50]" />
                            <div>
                              <h3 className="font-medium">{assignment.title}</h3>
                              <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-[#4caf50]/10 text-[#4caf50] border-[#4caf50]/20">
                              {t.student.dashboard.completed}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
