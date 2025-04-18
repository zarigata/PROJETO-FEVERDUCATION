"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/app/i18n/client"
import { useSafeToast } from "@/hooks/use-safe-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react"

interface ClassesTabProps {
  isLoading?: boolean
}

export function ClassesTab({ isLoading = false }: ClassesTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const { addToast } = useSafeToast()

  // Safe access to language context
  const langContext = useLanguage()
  let t: any = {
    teacher: {
      dashboard: {
        classes: {
          title: "All Classes",
          description: "Manage all your classes",
          search: "Search classes...",
          createClass: "Create Class",
          filter: "Filter",
          filters: {
            all: "All Classes",
            active: "Active",
            upcoming: "Upcoming",
            archived: "Archived",
          },
          noClasses: "No classes found",
          noClassesDesc: "Create a new class to get started",
          actions: {
            view: "View Class",
            edit: "Edit Class",
            duplicate: "Duplicate Class",
            delete: "Delete Class",
          },
        },
      },
    },
  }

  if (langContext?.t) {
    t = langContext.t
  }

  // Sample classes data
  const classes = [
    {
      id: 1,
      name: "Math 101",
      description: "Introduction to Algebra and Calculus",
      students: 28,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      duration: "1h 30m",
      status: "active",
      progress: 65,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      name: "Science",
      description: "Biology, Chemistry and Physics",
      students: 24,
      schedule: "Tue, Thu - 11:00 AM",
      duration: "1h 30m",
      status: "active",
      progress: 42,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      id: 3,
      name: "History",
      description: "World History and Civilizations",
      students: 30,
      schedule: "Mon, Wed - 2:00 PM",
      duration: "1h 30m",
      status: "active",
      progress: 78,
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    },
    {
      id: 4,
      name: "English Literature",
      description: "Classic and Contemporary Literature",
      students: 26,
      schedule: "Tue, Thu - 10:00 AM",
      duration: "1h 30m",
      status: "upcoming",
      progress: 0,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: 5,
      name: "Computer Science",
      description: "Programming and Algorithms",
      students: 22,
      schedule: "Fri - 1:00 PM",
      duration: "2h",
      status: "upcoming",
      progress: 0,
      color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    },
    {
      id: 6,
      name: "Art History",
      description: "Renaissance to Modern Art",
      students: 18,
      schedule: "Mon - 3:00 PM",
      duration: "1h 30m",
      status: "archived",
      progress: 100,
      color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    },
  ]

  const filteredClasses = classes.filter((cls) => {
    // Filter by search query
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesFilter = filter === "all" || cls.status === filter

    return matchesSearch && matchesFilter
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleAction = (action: string, className: string) => {
    addToast(`${action} ${className}`, "info")
  }

  const handleCreateClass = () => {
    addToast("Create class feature coming soon!", "info")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <Skeleton className="h-10 w-full md:w-[300px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <div className="grid gap-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t.teacher.dashboard.classes.search}
            className="w-full md:w-[300px] pl-9 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {t.teacher.dashboard.classes.filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                {t.teacher.dashboard.classes.filters.all}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("active")}>
                {t.teacher.dashboard.classes.filters.active}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("upcoming")}>
                {t.teacher.dashboard.classes.filters.upcoming}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("archived")}>
                {t.teacher.dashboard.classes.filters.archived}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleCreateClass} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.teacher.dashboard.classes.createClass}
          </Button>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t.teacher.dashboard.classes.noClasses}</h3>
          <p className="text-muted-foreground mb-4">{t.teacher.dashboard.classes.noClassesDesc}</p>
          <Button onClick={handleCreateClass} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.teacher.dashboard.classes.createClass}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className={`w-full md:w-2 ${cls.color}`} />
                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{cls.name}</h3>
                        {cls.status === "active" && (
                          <Badge variant="default" className="bg-green-500">
                            Active
                          </Badge>
                        )}
                        {cls.status === "upcoming" && (
                          <Badge
                            variant="outline"
                            className="text-blue-500 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50"
                          >
                            Upcoming
                          </Badge>
                        )}
                        {cls.status === "archived" && (
                          <Badge variant="outline" className="text-gray-500">
                            Archived
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{cls.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.students}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.schedule.split(" - ")[0]}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Schedule</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.duration}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction(t.teacher.dashboard.classes.actions.view, cls.name)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t.teacher.dashboard.classes.actions.view}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(t.teacher.dashboard.classes.actions.edit, cls.name)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t.teacher.dashboard.classes.actions.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(t.teacher.dashboard.classes.actions.duplicate, cls.name)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            {t.teacher.dashboard.classes.actions.duplicate}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(t.teacher.dashboard.classes.actions.delete, cls.name)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.teacher.dashboard.classes.actions.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
