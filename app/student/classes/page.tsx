import Link from "next/link"
import { BookOpen, Clock, Calendar, Users, ArrowRight, PenTool, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentClasses() {
  // Sample class data
  const classes = [
    {
      id: 1,
      title: "Biology 101",
      teacher: "Dr. Jane Smith",
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
      teacher: "Prof. Michael Johnson",
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
      teacher: "Dr. Robert Chen",
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Manage your enrolled classes and track your progress</p>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active Classes</TabsTrigger>
          <TabsTrigger value="completed">Completed Classes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
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
                    <div className="text-sm text-muted-foreground">{cls.progress}% Complete</div>
                  </div>
                  <CardTitle className="mt-2">{cls.title}</CardTitle>
                  <CardDescription>{cls.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <div className="mb-2 text-sm font-medium">Upcoming:</div>
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
                  <Button variant="outline" asChild>
                    <Link href="/student/chat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Get Help
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/student/classes/${cls.id}`}>
                      View Class
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="rounded-lg border p-8 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Completed Classes</h3>
            <p className="mt-2 text-sm text-muted-foreground">You haven't completed any classes yet. Keep learning!</p>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="rounded-lg border p-8 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Upcoming Classes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have any upcoming classes scheduled. Browse available classes to enroll.
            </p>
            <Button className="mt-4">Browse Classes</Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { icon: PenTool, text: "Completed 'Photosynthesis Quiz' with score 85%", time: "Today, 9:45 AM" },
                {
                  icon: BookOpen,
                  text: "Started new topic 'Cell Division' in Biology 101",
                  time: "Yesterday, 2:30 PM",
                },
                {
                  icon: MessageSquare,
                  text: "Asked a question about photosynthesis in AI Tutor",
                  time: "Yesterday, 11:20 AM",
                },
                {
                  icon: BookOpen,
                  text: "Completed reading assignment 'Introduction to Periodic Table'",
                  time: "2 days ago",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <activity.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p>{activity.text}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
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
