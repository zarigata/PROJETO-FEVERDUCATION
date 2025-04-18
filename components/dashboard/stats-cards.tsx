"use client"

import { useLanguage } from "@/app/i18n/client"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, BookOpen, Award, Clock } from "lucide-react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatsCardsProps {
  isLoading?: boolean
}

export function StatsCards({ isLoading = false }: StatsCardsProps) {
  // Safe access to language context
  const langContext = useLanguage()
  let t: any = {
    teacher: {
      dashboard: {
        stats: {
          students: "Total Students",
          studentsDesc: "Across all classes",
          classes: "Active Classes",
          classesDesc: "Currently teaching",
          assignments: "Assignments",
          assignmentsDesc: "8 need grading",
          hours: "Teaching Hours",
          hoursDesc: "This week",
        },
      },
    },
  }

  if (langContext?.t) {
    t = langContext.t
  }

  const stats = [
    {
      title: t.teacher.dashboard.stats.students,
      value: "128",
      description: t.teacher.dashboard.stats.studentsDesc,
      trend: "up",
      percentage: "12%",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: t.teacher.dashboard.stats.classes,
      value: "6",
      description: t.teacher.dashboard.stats.classesDesc,
      trend: "same",
      percentage: "0%",
      icon: BookOpen,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: t.teacher.dashboard.stats.assignments,
      value: "24",
      description: t.teacher.dashboard.stats.assignmentsDesc,
      trend: "up",
      percentage: "5%",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: t.teacher.dashboard.stats.hours,
      value: "18",
      description: t.teacher.dashboard.stats.hoursDesc,
      trend: "down",
      percentage: "3%",
      icon: Clock,
      color: "text-cyan-500",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="mt-2 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.trend === "up" && (
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    <span className="text-xs font-medium">{stat.percentage}</span>
                  </div>
                )}
                {stat.trend === "down" && (
                  <div className="flex items-center text-red-500">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    <span className="text-xs font-medium">{stat.percentage}</span>
                  </div>
                )}
                {stat.trend === "same" && (
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-xs font-medium">{stat.percentage}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
