"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Info, Users, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function TeacherDashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Sample class events
  const events = [
    {
      id: 1,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      title: "Physics 101",
      time: "10:00 AM - 11:30 AM",
      location: "Room 101",
      students: 32,
      topic: "Mechanics",
      description: "Introduction to Newton's laws of motion and practical demonstrations.",
      materials: ["Textbook Ch. 3", "Lab Equipment", "Handouts"],
      type: "lecture",
    },
    {
      id: 2,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      title: "Chemistry Basics",
      time: "1:30 PM - 3:00 PM",
      location: "Lab 3",
      students: 28,
      topic: "Periodic Table",
      description: "Overview of the periodic table and element properties.",
      materials: ["Periodic Table Chart", "Element Samples", "Worksheets"],
      type: "lab",
    },
    {
      id: 3,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      title: "Advanced Mathematics",
      time: "9:15 AM - 10:45 AM",
      location: "Room 205",
      students: 24,
      topic: "Calculus",
      description: "Derivatives and their applications in real-world problems.",
      materials: ["Textbook Ch. 5", "Problem Sets", "Calculator"],
      type: "lecture",
    },
    {
      id: 4,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
      title: "Biology Lab",
      time: "2:00 PM - 4:00 PM",
      location: "Lab 1",
      students: 30,
      topic: "Cell Structure",
      description: "Microscope examination of plant and animal cells.",
      materials: ["Microscopes", "Slides", "Lab Manual"],
      type: "lab",
    },
    {
      id: 5,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      title: "Physics Lab",
      time: "11:00 AM - 1:00 PM",
      location: "Lab 2",
      students: 32,
      topic: "Optics",
      description: "Experiments with lenses and light behavior.",
      materials: ["Optical Bench", "Lenses", "Light Sources"],
      type: "lab",
    },
    {
      id: 6,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      title: "Chemistry Quiz",
      time: "2:30 PM - 3:30 PM",
      location: "Room 103",
      students: 28,
      topic: "Chemical Bonds",
      description: "Assessment on ionic and covalent bonds.",
      materials: ["Quiz Papers", "Periodic Table Reference"],
      type: "assessment",
    },
    {
      id: 7,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24),
      title: "Math Review",
      time: "10:00 AM - 11:30 AM",
      location: "Room 205",
      students: 24,
      topic: "Pre-Exam Review",
      description: "Comprehensive review of all topics covered for the upcoming exam.",
      materials: ["Review Sheets", "Practice Problems"],
      type: "review",
    },
    {
      id: 8,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 26),
      title: "Biology Field Trip",
      time: "9:00 AM - 3:00 PM",
      location: "City Botanical Garden",
      students: 30,
      topic: "Ecosystems",
      description: "Field study of local plant ecosystems and biodiversity.",
      materials: ["Field Notebooks", "Collection Kits", "Cameras"],
      type: "field-trip",
    },
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-primary/10 text-primary border-primary/30"
      case "lab":
        return "bg-secondary/10 text-secondary border-secondary/30"
      case "assessment":
        return "bg-red-500/10 text-red-500 border-red-500/30"
      case "review":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30"
      case "field-trip":
        return "bg-green-500/10 text-green-500 border-green-500/30"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30"
    }
  }

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "lecture":
        return <Badge className="bg-primary">Lecture</Badge>
      case "lab":
        return <Badge className="bg-secondary">Lab</Badge>
      case "assessment":
        return <Badge className="bg-red-500">Assessment</Badge>
      case "review":
        return <Badge className="bg-amber-500">Review</Badge>
      case "field-trip":
        return <Badge className="bg-green-500">Field Trip</Badge>
      default:
        return <Badge>Other</Badge>
    }
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const today = new Date()
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border p-1"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = isCurrentMonth && today.getDate() === day
      const dayEvents = events.filter(
        (event) => event.date.getDate() === day && event.date.getMonth() === month && event.date.getFullYear() === year,
      )

      days.push(
        <div
          key={`day-${day}`}
          className={`h-24 border border-border p-1 transition-all ${
            isToday ? "bg-accent" : ""
          } ${dayEvents.length > 0 ? "hover:border-primary hover:shadow-sm" : ""}`}
        >
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
            {dayEvents.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {dayEvents.length}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"} scheduled
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className={`rounded px-1 py-0.5 text-xs border ${getEventTypeColor(event.type)} cursor-pointer transition-all hover:shadow-sm`}
                onClick={() => handleEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-[10px] text-muted-foreground">{event.time}</div>
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth} className="group">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="group">
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      <div className="mt-4">
        <h3 className="mb-2 font-medium">Upcoming Events</h3>
        <div className="space-y-2">
          {events
            .filter((event) => event.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 3)
            .map((event, index) => (
              <Card
                key={index}
                className={`p-3 border-l-4 ${
                  event.type === "lecture"
                    ? "border-l-primary"
                    : event.type === "lab"
                      ? "border-l-secondary"
                      : event.type === "assessment"
                        ? "border-l-red-500"
                        : event.type === "review"
                          ? "border-l-amber-500"
                          : "border-l-green-500"
                } cursor-pointer transition-all hover:shadow-md scale-effect`}
                onClick={() => handleEventClick(event)}
                hover
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.time}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedEvent.title}</span>
                {getEventTypeBadge(selectedEvent.type)}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent.students} students</span>
              </div>

              <div className="rounded-md bg-muted p-3">
                <div className="mb-1 text-sm font-medium">Topic:</div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{selectedEvent.topic}</span>
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm font-medium">Description:</div>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>

              <div>
                <div className="mb-1 text-sm font-medium">Materials:</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {selectedEvent.materials.map((material: string, index: number) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                Close
              </Button>
              <Button>Edit Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
