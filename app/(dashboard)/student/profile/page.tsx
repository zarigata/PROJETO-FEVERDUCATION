import { Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function StudentProfile() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-xl">Jane Doe</CardTitle>
            <CardDescription>Student</CardDescription>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="bg-primary/10">
                Grade 10
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                Science Track
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>jane.doe@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>New York, NY</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined September 2023</span>
            </div>

            <Button variant="outline" className="mt-4 w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Your overall performance across all classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall GPA</span>
                  <span className="font-medium text-primary">3.8/4.0</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Class Performance</h3>
                {[
                  { name: "Biology 101", grade: "A", progress: 92 },
                  { name: "Chemistry Basics", grade: "A-", progress: 88 },
                  { name: "Advanced Mathematics", grade: "B+", progress: 85 },
                ].map((cls, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{cls.name}</span>
                      <span className="font-medium">{cls.grade}</span>
                    </div>
                    <Progress value={cls.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and awards you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { icon: Award, title: "Honor Roll", description: "Fall 2023" },
                  { icon: BookOpen, title: "Bookworm", description: "Read 50 articles" },
                  { icon: GraduationCap, title: "Quiz Master", description: "Perfect score on 5 quizzes" },
                ].map((achievement, i) => (
                  <div key={i} className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-2 font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Activity</CardTitle>
              <CardDescription>Your recent learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Completed Photosynthesis Quiz", date: "Today, 9:45 AM", score: "85%" },
                  { title: "Watched 'Cell Division' Video", date: "Yesterday, 2:30 PM", duration: "15 minutes" },
                  { title: "Completed Chemistry Homework", date: "2 days ago", score: "92%" },
                  { title: "Asked 5 questions to AI Tutor", date: "3 days ago", topic: "Biology" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                      {activity.score && <Badge className="mt-1">{activity.score}</Badge>}
                      {activity.duration && <Badge className="mt-1">{activity.duration}</Badge>}
                      {activity.topic && <Badge className="mt-1">{activity.topic}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
