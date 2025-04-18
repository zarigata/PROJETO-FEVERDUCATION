"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/i18n/client"
import { useToast } from "@/components/ui/toast-provider"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns"

// Sample schedule data
const initialEvents = [
  {
    id: 1,
    title: "Math 101",
    description: "Introduction to Algebra",
    date: new Date(2025, 3, 16, 9, 0), // April 16, 2025, 9:00 AM
    endTime: new Date(2025, 3, 16, 10, 30), // April 16, 2025, 10:30 AM
    location: "Room 204",
    students: 28,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Science",
    description: "Biology Lab",
    date: new Date(2025, 3, 16, 11, 0), // April 16, 2025, 11:00 AM
    endTime: new Date(2025, 3, 16, 12, 30), // April 16, 2025, 12:30 PM
    location: "Lab 3",
    students: 24,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    id: 3,
    title: "History",
    description: "World History Lecture",
    date: new Date(2025, 3, 16, 14, 0), // April 16, 2025, 2:00 PM
    endTime: new Date(2025, 3, 16, 15, 30), // April 16, 2025, 3:30 PM
    location: "Room 105",
    students: 30,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  {
    id: 4,
    title: "English Literature",
    description: "Poetry Analysis",
    date: new Date(2025, 3, 17, 10, 0), // April 17, 2025, 10:00 AM
    endTime: new Date(2025, 3, 17, 11, 30), // April 17, 2025, 11:30 AM
    location: "Room 302",
    students: 26,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 5,
    title: "Computer Science",
    description: "Programming Workshop",
    date: new Date(2025, 3, 18, 13, 0), // April 18, 2025, 1:00 PM
    endTime: new Date(2025, 3, 18, 15, 0), // April 18, 2025, 3:00 PM
    location: "Computer Lab",
    students: 22,
    color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  },
]

// Helper function to get time options
const getTimeOptions = () => {
  const options = []
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date()
      time.setHours(hour, minute, 0, 0)
      options.push({
        value: time.toISOString(),
        label: format(time, "h:mm a"),
      })
    }
  }
  return options
}

export default function SchedulePage() {
  const { t } = useLanguage()
  const { addToast } = useToast()

  const [events, setEvents] = useState(initialEvents)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 16)) // April 16, 2025
  const [view, setView] = useState<"day" | "week">("week")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<(typeof initialEvents)[0] | null>(null)

  // Form state for creating/editing an event
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    location: "",
    students: "0",
  })

  // Get days for the current week view
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Filter events for the current view
  const filteredEvents = events.filter((event) => {
    if (view === "day") {
      return isSameDay(event.date, currentDate)
    } else {
      return event.date >= weekStart && event.date <= weekEnd
    }
  })

  const handleCreateEvent = () => {
    // Validate form
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
      addToast("Please fill in all required fields", "error")
      return
    }

    // Create start and end date objects
    const startDate = new Date(`${formData.date}T${formData.startTime}`)
    const endDate = new Date(`${formData.date}T${formData.endTime}`)

    // Validate times
    if (endDate <= startDate) {
      addToast("End time must be after start time", "error")
      return
    }

    // Create new event
    const newEvent = {
      id: events.length + 1,
      title: formData.title,
      description: formData.description,
      date: startDate,
      endTime: endDate,
      location: formData.location,
      students: Number.parseInt(formData.students, 10),
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    }

    setEvents([...events, newEvent])
    setIsCreateDialogOpen(false)
    resetForm()
    addToast("Event created successfully", "success")
  }

  const handleEditEvent = () => {
    if (!selectedEvent) return

    // Validate form
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
      addToast("Please fill in all required fields", "error")
      return
    }

    // Create start and end date objects
    const startDate = new Date(`${formData.date}T${formData.startTime}`)
    const endDate = new Date(`${formData.date}T${formData.endTime}`)

    // Validate times
    if (endDate <= startDate) {
      addToast("End time must be after start time", "error")
      return
    }

    // Update event
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: formData.title,
            description: formData.description,
            date: startDate,
            endTime: endDate,
            location: formData.location,
            students: Number.parseInt(formData.students, 10),
          }
        : event,
    )

    setEvents(updatedEvents)
    setIsCreateDialogOpen(false)
    resetForm()
    addToast("Event updated successfully", "success")
  }

  const handleDeleteEvent = () => {
    if (!selectedEvent) return

    // Delete event
    const updatedEvents = events.filter((event) => event.id !== selectedEvent.id)
    setEvents(updatedEvents)
    setIsDeleteDialogOpen(false)
    addToast("Event deleted successfully", "success")
  }

  const openEditDialog = (event: (typeof initialEvents)[0]) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: format(event.date, "yyyy-MM-dd"),
      startTime: format(event.date, "HH:mm"),
      endTime: format(event.endTime, "HH:mm"),
      location: event.location,
      students: event.students.toString(),
    })
    setIsCreateDialogOpen(true)
  }

  const openDeleteDialog = (event: (typeof initialEvents)[0]) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      location: "",
      students: "0",
    })
    setSelectedEvent(null)
  }

  const navigatePrevious = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, -1))
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1))
    }
  }

  const navigateNext = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, 1))
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1))
    }
  }

  const navigateToday = () => {
    setCurrentDate(new Date(2025, 3, 16)) // Reset to April 16, 2025
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.common?.schedule || "Schedule"}</h1>
            <p className="text-muted-foreground">Manage your classes and events</p>
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
                  <Plus className="h-4 w-4" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                  <DialogDescription>
                    {selectedEvent ? "Update the details of your event" : "Fill in the details to create a new event"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Math 101"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                      placeholder="Brief description of the event"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(new Date(formData.date), "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          {/* Calendar component would go here */}
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Room 204"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="students" className="text-right">
                      Students
                    </Label>
                    <Input
                      id="students"
                      type="number"
                      min="0"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                      className="col-span-3"
                      placeholder="Number of students"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={selectedEvent ? handleEditEvent : handleCreateEvent}>
                    {selectedEvent ? "Save Changes" : "Create Event"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>
                  {view === "day"
                    ? format(currentDate, "MMMM d, yyyy")
                    : `${format(weekStart, "MMMM d")} - ${format(weekEnd, "MMMM d, yyyy")}`}
                </CardTitle>
                <CardDescription>{view === "day" ? "Daily schedule" : "Weekly schedule"}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={navigatePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={navigateToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Select value={view} onValueChange={(value) => setView(value as "day" | "week")}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "day" ? (
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
                    <p className="text-muted-foreground mb-4">There are no events scheduled for this day</p>
                    <Button
                      onClick={() => {
                        resetForm()
                        setIsCreateDialogOpen(true)
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" /> Add Event
                    </Button>
                  </div>
                ) : (
                  filteredEvents
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onEdit={() => openEditDialog(event)}
                        onDelete={() => openDeleteDialog(event)}
                      />
                    ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="space-y-2">
                    <div className="text-center p-2 font-medium">
                      <div>{format(day, "EEE")}</div>
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center mx-auto",
                          isSameDay(day, new Date(2025, 3, 16)) && "bg-primary text-primary-foreground",
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {events
                        .filter((event) => isSameDay(event.date, day))
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((event) => (
                          <div
                            key={event.id}
                            className={cn("p-2 rounded-md text-sm cursor-pointer", event.color)}
                            onClick={() => openEditDialog(event)}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(event.date, "h:mm a")} - {format(event.endTime, "h:mm a")}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">{selectedEvent && <p className="font-medium">{selectedEvent.title}</p>}</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteEvent}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

// Helper component for event cards in day view
function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: any
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className={cn("p-4 rounded-lg border flex justify-between", event.color)}>
      <div className="space-y-1">
        <div className="font-medium text-lg">{event.title}</div>
        <div className="text-sm">{event.description}</div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {format(event.date, "h:mm a")} - {format(event.endTime, "h:mm a")}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {event.students} students
          </div>
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
