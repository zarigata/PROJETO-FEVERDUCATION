"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/app/i18n/client"
import { useToast } from "@/components/ui/toast-provider"
import { Search, Filter, Clock, FileText, CheckCircle2, MoreHorizontal, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

// Sample assignments data
const initialAssignments = [
  {
    id: 1,
    title: "Algebra Equations",
    description: "Solve the given set of algebraic equations",
    subject: "Mathematics",
    teacher: "Ms. Johnson",
    dueDate: new Date(2025, 3, 17), // April 17, 2025
    status: "pending",
    priority: "high",
    progress: 0,
    attachments: 2,
  },
  {
    id: 2,
    title: "Lab Report: Photosynthesis",
    description: "Write a lab report on the photosynthesis experiment",
    subject: "Science",
    teacher: "Mr. Davis",
    dueDate: new Date(2025, 3, 20), // April 20, 2025
    status: "in_progress",
    priority: "medium",
    progress: 45,
    attachments: 1,
  },
  {
    id: 3,
    title: "Essay: Industrial Revolution",
    description: "Write an essay about the impacts of the Industrial Revolution",
    subject: "History",
    teacher: "Mrs. Wilson",
    dueDate: new Date(2025, 3, 22), // April 22, 2025
    status: "in_progress",
    priority: "low",
    progress: 75,
    attachments: 3,
  },
  {
    id: 4,
    title: "Vocabulary Quiz",
    description: "Complete the vocabulary quiz for Chapter 5",
    subject: "English",
    teacher: "Mr. Thompson",
    dueDate: new Date(2025, 3, 15), // April 15, 2025
    status: "completed",
    priority: "medium",
    progress: 100,
    attachments: 0,
    grade: "A",
    submittedDate: new Date(2025, 3, 14), // April 14, 2025
  },
  {
    id: 5,
    title: "Programming Project",
    description: "Create a simple calculator application",
    subject: "Computer Science",
    teacher: "Ms. Lee",
    dueDate: new Date(2025, 3, 25), // April 25, 2025
    status: "pending",
    priority: "high",
    progress: 0,
    attachments: 1,
  },
  {
    id: 6,
    title: "Art History Presentation",
    description: "Prepare a presentation on Renaissance art",
    subject: "Art",
    teacher: "Mr. Garcia",
    dueDate: new Date(2025, 3, 18), // April 18, 2025
    status: "in_progress",
    priority: "medium",
    progress: 30,
    attachments: 5,
  },
  {
    id: 7,
    title: "Physics Problem Set",
    description: "Solve the mechanics problems from Chapter 7",
    subject: "Science",
    teacher: "Mr. Davis",
    dueDate: new Date(2025, 3, 12), // April 12, 2025
    status: "completed",
    priority: "high",
    progress: 100,
    attachments: 1,
    grade: "B+",
    submittedDate: new Date(2025, 3, 11), // April 11, 2025
  },
]

interface Assignment {
  id: number
  title: string
  description: string
  subject: string
  teacher: string
  dueDate: Date
  status: "pending" | "in_progress" | "completed"
  priority: "high" | "medium" | "low"
  progress: number
  attachments: number
  grade?: string
  submittedDate?: Date
}

interface AssignmentCardProps {
  assignment: Assignment
  onMarkComplete: () => void
  onViewDetails: () => void
  onUpdateProgress: (progress: number) => void
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onMarkComplete,
  onViewDetails,
  onUpdateProgress,
}) => {
  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          {assignment.title}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {assignment.status !== "completed" && (
                <DropdownMenuItem onClick={onMarkComplete}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Complete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>
          {assignment.subject} - Due: {format(assignment.dueDate, "MMM dd, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Due Date: {format(assignment.dueDate, "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>{assignment.description.substring(0, 50)}...</span>
        </div>
        <div className="flex items-center gap-2">
          {assignment.priority === "high" && <Badge variant="destructive">High Priority</Badge>}
          {assignment.priority === "medium" && <Badge variant="secondary">Medium Priority</Badge>}
          {assignment.priority === "low" && <Badge variant="outline">Low Priority</Badge>}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{assignment.progress}%</span>
          </div>
          <Progress value={assignment.progress} />
          {assignment.status !== "completed" && (
            <div className="flex justify-center">
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Update Progress"
                className="w-24 text-center"
                onChange={(e) => {
                  const progress = Number.parseInt(e.target.value)
                  if (!isNaN(progress) && progress >= 0 && progress <= 100) {
                    onUpdateProgress(progress)
                  }
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function StudentAssignmentsPage() {
  const { t } = useLanguage()
  const { addToast } = useToast()
  
  const [assignments, setAssignments] = useState(initialAssignments)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")\
  const [selectedAssignment, setSelectedAssignment: any] = useState<Assignment | null>(null)
  const [isAssignmentDetailsOpen, setIsAssignmentDetailsOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  
  // Filter assignments based on search query, active tab, and filter
  const filteredAssignments = assignments.filter((assignment) => {
    // Filter by search query
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.teacher.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    let matchesTab = true
    if (activeTab === "pending") {
      matchesTab = assignment.status === "pending" || assignment.status === "in_progress"
    } else if (activeTab === "completed") {
      matchesTab = assignment.status === "completed"
    }
    
    // Filter by priority/subject
    let matchesFilter = true
    if (filter !== "all") {
      if (filter === "high" || filter === "medium" || filter === "low") {
        matchesFilter = assignment.priority === filter
      } else {
        matchesFilter = assignment.subject === filter
      }
    }

    return matchesSearch && matchesTab && matchesFilter
  })
  
  // Get unique subjects for filter
  const subjects = [...new Set(assignments.map(a => a.subject))]
  
  const markAsComplete = (id: number) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id 
          ? { ...assignment, status: "completed", progress: 100 } 
          : assignment
      )
    )
    
    addToast("Assignment marked as complete", "success")
  }
  
  const viewAssignmentDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsAssignmentDetailsOpen(true)
  }
  
  const updateProgress = (id: number, progress: number) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id 
          ? { 
              ...assignment, 
              progress,
              status: progress === 100 ? "completed" : progress > 0 ? "in_progress" : "pending"
            } 
          : assignment
      )
    )
    
    addToast("Progress updated", "success")
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.common?.assignments || "Assignments"}</h1>
            <p className="text-muted-foreground">
              Track and manage your assignments
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
                className="w-full md:w-[300px] pl-9 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 w-full md:w-auto">
                  <Filter className="h-4 w-4" />
                  Filter: {filter === "all" ? "All" : filter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("high")}>
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("medium")}>
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("low")}>
                  Low Priority
                </DropdownMenuItem>
                {subjects.map((subject) => (
                  <DropdownMenuItem key={subject} onClick={() => setFilter(subject)}>
                    {subject}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle>Assignment Overview</CardTitle>
              <CardDescription>Track your progress across all assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="text-sm text-muted-foreground">
                      {assignments.filter(a => a.status === "pending").length} assignments
                    </span>
                  </div>
                  <Progress 
                    value={
                      (assignments.filter(a => a.status === "pending").length / assignments.length) * 100
                    } 
                    className="h-2 bg-orange-100 dark:bg-orange-900/20"
                    indicatorClassName="bg-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">In Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {assignments.filter(a => a.status === "in_progress").length} assignments
                    </span>
                  </div>
                  <Progress 
                    value={
                      (assignments.filter(a => a.status === "in_progress").length / assignments.length) * 100
                    } 
                    className="h-2 bg-blue-100 dark:bg-blue-900/20"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {assignments.filter(a => a.status === "completed").length} assignments
                    </span>
                  </div>
                  <Progress 
                    value={
                      (assignments.filter(a => a.status === "completed").length / assignments.length) * 100
                    } 
                    className="h-2 bg-green-100 dark:bg-green-900/20"
                    indicatorClassName="bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Assignments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No assignments found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filter !== "all"
                    ? "No assignments match your search criteria"
                    : "You don't have any assignments yet"}
                </p>
              </Card>
            ) : (
              filteredAssignments.map((assignment) => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  onMarkComplete={() => markAsComplete(assignment.id)}
                  onViewDetails={() => viewAssignmentDetails(assignment)}
                  onUpdateProgress={(progress) => updateProgress(assignment.id, progress)}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending assignments</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filter !== "all"
                    ? "No pending assignments match your search criteria"
                    : "You've completed all your assignments!"}
                </p>
              </Card>
            ) : (
              filteredAssignments.map((assignment) => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  onMarkComplete={() => markAsComplete(assignment.id)}
                  onViewDetails={() => viewAssignmentDetails(assignment)}
                  onUpdateProgress={(progress) => updateProgress(assignment.id, progress)}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
