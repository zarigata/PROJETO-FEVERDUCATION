"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Mail, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSafeLanguage } from "@/hooks/use-language"

// Mock student data
const students = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    level: "Intermediate",
    progress: 78,
    lastActive: "Today",
    status: "active",
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    level: "Beginner",
    progress: 45,
    lastActive: "Yesterday",
    status: "active",
  },
  {
    id: 3,
    name: "Taylor Wilson",
    email: "t.wilson@example.com",
    level: "Advanced",
    progress: 92,
    lastActive: "2 days ago",
    status: "active",
  },
  {
    id: 4,
    name: "Morgan Lee",
    email: "morgan.l@example.com",
    level: "Intermediate",
    progress: 67,
    lastActive: "Today",
    status: "inactive",
  },
  {
    id: 5,
    name: "Casey Brown",
    email: "c.brown@example.com",
    level: "Beginner",
    progress: 23,
    lastActive: "1 week ago",
    status: "inactive",
  },
]

export default function StudentsPage() {
  const { t } = useSafeLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.level.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout userType="teacher">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t.teacher?.students?.title || "Students"}</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.teacher?.students?.searchPlaceholder || "Search students..."}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              {t.teacher?.students?.addStudent || "Add Student"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.filter((s) => s.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((students.filter((s) => s.status === "active").length / students.length) * 100)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
              </div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.teacher?.students?.name || "Student"}</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>{t.teacher?.students?.progress || "Progress"}</TableHead>
                  <TableHead>{t.teacher?.students?.lastActive || "Last Active"}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">{t.teacher?.students?.actions || "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.level}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-full rounded-full bg-blue-600" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-sm">{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.lastActive}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === "active" ? "default" : "secondary"}
                        className={
                          student.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }
                      >
                        {student.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t.teacher?.students?.actions || "Actions"}</DropdownMenuLabel>
                          <DropdownMenuItem>{t.teacher?.students?.viewProfile || "View Profile"}</DropdownMenuItem>
                          <DropdownMenuItem>View Progress</DropdownMenuItem>
                          <DropdownMenuItem>Assign to Class</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            {t.teacher?.students?.sendMessage || "Send Message"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
