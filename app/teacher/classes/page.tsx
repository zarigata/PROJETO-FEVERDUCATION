import Link from "next/link"
import { BookOpen, Clock, Calendar, Users, ArrowRight, PenTool, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TeacherClasses() {
  // Sample class data
  const classes = [
    {
      id: 1,
      title: "Biology 101",
      grade: "High School - 10th Grade",
      nextClass: "Today, 10:00 AM",
      progress: 65,
      students: 32,
      description: "Introduction to biological concepts and principles",
      currentTopic: "Photosynthesis",
      upcomingAssignments: [
        { title: "Photosynthesis Quiz", due: "Tomorrow", type: "quiz" },
        { title: "Lab Report: Plant Cells", due: "Friday", type: "assignment" },
      ],
    },
    {
      id: 2,
      title: "Chemistry Basics",
      grade: "High School - 9th Grade",
      nextClass: "Tomorrow, 1:30 PM",
      progress: 42,
      students: 28,
      description: "Fundamental principles of chemistry",
      currentTopic: "Periodic Table",
      upcomingAssignments: [{ title: "Elements Quiz", due: "Next Monday", type: "quiz" }],
    },
    {
      id: 3,
      title: "Advanced Mathematics",
      grade: "High School - 11th Grade",
      nextClass: "Wednesday, 9:15 AM",
      progress: 78,
      students: 24,
      description: "Advanced mathematical concepts and problem-solving",
      currentTopic: "Calculus",
      upcomingAssignments: [
        { title: "Problem Set 5", due: "Thursday", type: "assignment" },
        { title: "Mid-term Exam", due: "Next Friday", type: "exam" },
      ],
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and track student progress</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Class
        </Button>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active Classes</TabsTrigger>
          <TabsTrigger value="archived">Archived Classes</TabsTrigger>
          <TabsTrigger value="drafts">Draft Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.id} className="overflow-hidden">
                <div className="h-2 bg-primary"></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10">
                      Active
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Class</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate Class</DropdownMenuItem>
                        <DropdownMenuItem>Archive Class</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="mt-2">{cls.title}</CardTitle>
                  <CardDescription>{cls.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-muted-foreground">{cls.progress}%</span>
                  </div>
                  <Progress value={cls.progress} className="h-2" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cls.nextClass}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cls.students} students</span>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="mb-1 text-sm font-medium">Current Topic:</div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{cls.currentTopic}</span>
                    </div>
                  </div>

                  {cls.upcomingAssignments.length > 0 && (
                    <div>
                      <div className="mb-2 text-sm font-medium">Upcoming Assignments:</div>
                      <div className="space-y-2">
                        {cls.upcomingAssignments.map((assignment, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex items-center gap-2">
                              {assignment.type === "quiz" ? (
                                <PenTool className="h-4 w-4 text-primary" />
                              ) : assignment.type === "exam" ? (
                                <Calendar className="h-4 w-4 text-primary" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-primary" />
                              )}
                              <span className="text-sm">{assignment.title}</span>
                            </div>
                            <Badge variant="outline">{assignment.due}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Students
                  </Button>
                  <Button asChild>
                    <Link href={`/teacher/classes/${cls.id}`}>
                      Manage Class
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          <div className="rounded-lg border p-8 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Archived Classes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't archived any classes yet. Archived classes are hidden from students but can be restored.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          <div className="rounded-lg border p-8 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Draft Classes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have any draft classes. Create a new class to get started.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create New Class
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Upcoming Schedule</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { title: "Biology 101", time: "Today, 10:00 AM - 11:30 AM", students: 32, room: "Room 101" },
                { title: "Chemistry Basics", time: "Today, 1:30 PM - 3:00 PM", students: 28, room: "Lab 3" },
                { title: "Advanced Mathematics", time: "Tomorrow, 9:15 AM - 10:45 AM", students: 24, room: "Room 205" },
                { title: "Biology Lab", time: "Friday, 2:00 PM - 4:00 PM", students: 30, room: "Lab 1" },
              ].map((session, index) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{session.title}</p>
                      <Badge variant="outline">{session.room}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.time}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.students} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
