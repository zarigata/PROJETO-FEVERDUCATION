"use client"

import { useLanguage } from "@/app/i18n/client"
import { useSafeToast } from "@/hooks/use-safe-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, MessageCircle, Calendar, Bell } from "lucide-react"

export function QuickActions() {
  const { addToast } = useSafeToast()

  // Safe access to language context
  const langContext = useLanguage()
  let t: any = {
    teacher: {
      dashboard: {
        quickActions: "Quick Actions",
        createClass: "Create Class",
        createAssignment: "Create Assignment",
        messageStudents: "Message Students",
        scheduleEvent: "Schedule Event",
        sendReminder: "Send Reminder",
      },
    },
  }

  if (langContext?.t) {
    t = langContext.t
  }

  const handleAction = (action: string) => {
    addToast(`${action} feature coming soon!`, "info")
  }

  const actions = [
    {
      title: t.teacher.dashboard.createClass,
      icon: PlusCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: t.teacher.dashboard.createAssignment,
      icon: FileText,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: t.teacher.dashboard.messageStudents,
      icon: MessageCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: t.teacher.dashboard.scheduleEvent,
      icon: Calendar,
      color: "text-cyan-500",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: t.teacher.dashboard.sendReminder,
      icon: Bell,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t.teacher.dashboard.quickActions}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <Button
              key={i}
              variant="ghost"
              className="justify-start h-auto py-2"
              onClick={() => handleAction(action.title)}
            >
              <div className={`mr-2 h-8 w-8 rounded-full ${action.bgColor} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${action.color}`} />
              </div>
              <span>{action.title}</span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
