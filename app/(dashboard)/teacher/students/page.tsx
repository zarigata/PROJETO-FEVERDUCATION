"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, UserPlus, Filter, Download, MoreHorizontal, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TeacherStudents() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  // Sample student data
  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Biology 101", "Chemistry Basics"],
      performance: 92,
      lastActive: "Today, 9:45 AM",
      status: "active",
    },
    {
      id: 2,
      name: "Samantha Lee",
      email: "samantha.l@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Biology 101", "Advanced Mathematics"],
      performance: 88,
      lastActive: "Today, 10:15 AM",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.c@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Chemistry Basics", "Advanced Mathematics"],
      performance: 76,
      lastActive: "Yesterday, 3:30 PM",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Biology 101"],
      performance: 95,
      lastActive: "Today, 8:20 AM",
      status: "active",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.k@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Chemistry Basics"],
      performance: 82,
      lastActive: "2 days ago",
      status: "inactive",
    },
    {
      id: 6,
      name: "Jessica Taylor",
      email: "jessica.t@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Biology 101", "Advanced Mathematics"],
      performance: 90,
      lastActive: "Today, 11:05 AM",
      status: "active",
    },
    {
      id: 7,
      name: "Ryan Patel",
      email: "ryan.p@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Advanced Mathematics"],
      performance: 68,
      lastActive: "Yesterday, 1:15 PM",
      status: "at-risk",
    },
    {
      id: 8,
      name: "Olivia Wilson",
      email: "olivia.w@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      classes: ["Biology 101", "Chemistry Basics"],
      performance: 85,
      lastActive: "Today, 9:30 AM",
      status: "active",
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.classes.some((cls) => cls.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      case "at-risk":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-500"
    if (performance >= 75) return "text-blue-500"
    if (performance >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">Manage and monitor your students' progress</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students by name, email, or class..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Showing {filteredStudents.length} of {students.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.classes.map((cls, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/10">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getPerformanceColor(student.performance)}`}>
                          {student.performance}%
                        </span>
                      </div>
                      <Progress value={student.performance} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{student.lastActive}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(student.status)}`}></div>
                      <span className="capitalize text-sm">{student.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Student</DropdownMenuItem>
                          <DropdownMenuItem>View Progress</DropdownMenuItem>
                          <DropdownMenuItem>Remove from Class</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((acc, student) => acc + student.performance, 0) / students.length)}%
            </div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((student) => student.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((students.filter((student) => student.status === "active").length / students.length) * 100)}%
              of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((student) => student.status === "at-risk").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((students.filter((student) => student.status === "at-risk").length / students.length) * 100)}%
              of total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
