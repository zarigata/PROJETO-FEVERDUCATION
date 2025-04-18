"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/app/i18n/client"
import { useToast } from "@/components/ui/toast-provider"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample class data
const initialClasses = [
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

export default function ClassesPage() {
  const { t } = useLanguage()
  const { addToast } = useToast()

  const [classes, setClasses] = useState(initialClasses)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<(typeof initialClasses)[0] | null>(null)

  // Form state for creating/editing a class
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    duration: "",
    status: "upcoming",
  })

  // Filter classes based on search query and filter
  const filteredClasses = classes.filter((cls) => {
    // Filter by search query
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesFilter = filter === "all" || cls.status === filter

    return matchesSearch && matchesFilter
  })

  const handleCreateClass = () => {
    // Validate form
    if (!formData.name || !formData.description || !formData.schedule || !formData.duration) {
      addToast("Please fill in all required fields", "error")
      return
    }

    // Create new class
    const newClass = {
      id: classes.length + 1,
      name: formData.name,
      description: formData.description,
      students: 0,
      schedule: formData.schedule,
      duration: formData.duration,
      status: formData.status,
      progress: 0,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    }

    setClasses([...classes, newClass])
    setIsCreateDialogOpen(false)
    resetForm()
    addToast("Class created successfully", "success")
  }

  const handleEditClass = () => {
    if (!selectedClass) return

    // Validate form
    if (!formData.name || !formData.description || !formData.schedule || !formData.duration) {
      addToast("Please fill in all required fields", "error")
      return
    }

    // Update class
    const updatedClasses = classes.map((cls) =>
      cls.id === selectedClass.id
        ? {
            ...cls,
            name: formData.name,
            description: formData.description,
            schedule: formData.schedule,
            duration: formData.duration,
            status: formData.status,
          }
        : cls,
    )

    setClasses(updatedClasses)
    setIsCreateDialogOpen(false)
    resetForm()
    addToast("Class updated successfully", "success")
  }

  const handleDeleteClass = () => {
    if (!selectedClass) return

    // Delete class
    const updatedClasses = classes.filter((cls) => cls.id !== selectedClass.id)
    setClasses(updatedClasses)
    setIsDeleteDialogOpen(false)
    addToast("Class deleted successfully", "success")
  }

  const handleDuplicateClass = (cls: (typeof initialClasses)[0]) => {
    // Create duplicate class
    const duplicateClass = {
      ...cls,
      id: classes.length + 1,
      name: `${cls.name} (Copy)`,
      status: "upcoming",
      progress: 0,
    }

    setClasses([...classes, duplicateClass])
    addToast("Class duplicated successfully", "success")
  }

  const openEditDialog = (cls: (typeof initialClasses)[0]) => {
    setSelectedClass(cls)
    setFormData({
      name: cls.name,
      description: cls.description,
      schedule: cls.schedule,
      duration: cls.duration,
      status: cls.status,
    })
    setIsCreateDialogOpen(true)
  }

  const openDeleteDialog = (cls: (typeof initialClasses)[0]) => {
    setSelectedClass(cls)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      schedule: "",
      duration: "",
      status: "upcoming",
    })
    setSelectedClass(null)
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.common?.classes || "Classes"}</h1>
            <p className="text-muted-foreground">Manage your classes, students, and schedules</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2"
                  onClick={() => {
                    resetForm()
                    setIsCreateDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" /> Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{selectedClass ? "Edit Class" : "Create New Class"}</DialogTitle>
                  <DialogDescription>
                    {selectedClass ? "Update the details of your class" : "Fill in the details to create a new class"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Mathematics 101"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                      placeholder="Brief description of the class"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="schedule" className="text-right">
                      Schedule
                    </Label>
                    <Input
                      id="schedule"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 1h 30m"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={selectedClass ? handleEditClass : handleCreateClass}>
                    {selectedClass ? "Save Changes" : "Create Class"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <form className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
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
                  Filter:{" "}
                  {filter === "all"
                    ? "All Classes"
                    : filter === "active"
                      ? "Active"
                      : filter === "upcoming"
                        ? "Upcoming"
                        : "Archived"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>All Classes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("upcoming")}>Upcoming</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("archived")}>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No classes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No classes match your search criteria" : "Create a new class to get started"}
            </p>
            <Button
              onClick={() => {
                resetForm()
                setIsCreateDialogOpen(true)
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Create Class
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
                            <DropdownMenuItem onClick={() => addToast("View class details", "info")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Class
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(cls)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Class
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateClass(cls)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate Class
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(cls)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Class
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

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Class</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this class? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">{selectedClass && <p className="font-medium">{selectedClass.name}</p>}</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteClass}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
