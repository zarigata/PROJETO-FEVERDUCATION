"use client"

import { useState } from "react"
import { Sparkles, X, AlertTriangle, TrendingUp, TrendingDown, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InsightItem {
  type: "success" | "warning" | "info"
  title: string
  description: string
  metric?: {
    label: string
    value: string
    trend: "up" | "down" | "neutral"
    change: string
  }
  action?: {
    label: string
    onClick: () => void
  }
}

export function AIInsights() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<InsightItem[]>([])

  const generateInsights = () => {
    setIsLoading(true)

    // Simulate AI generating insights
    setTimeout(() => {
      setInsights([
        {
          type: "warning",
          title: "Declining Participation in Chemistry",
          description:
            "Student participation in Chemistry classes has decreased by 15% over the last month. This correlates with the introduction of the new Periodic Table unit.",
          metric: {
            label: "Participation Rate",
            value: "76%",
            trend: "down",
            change: "-15%",
          },
          action: {
            label: "View Detailed Report",
            onClick: () => console.log("View Chemistry participation report"),
          },
        },
        {
          type: "success",
          title: "Biology Performance Improving",
          description:
            "The interactive lessons on Photosynthesis have resulted in a 12% increase in test scores. Consider applying similar teaching methods to other subjects.",
          metric: {
            label: "Average Score",
            value: "85%",
            trend: "up",
            change: "+12%",
          },
          action: {
            label: "See Teaching Methods",
            onClick: () => console.log("View successful teaching methods"),
          },
        },
        {
          type: "info",
          title: "Student Engagement Pattern",
          description:
            "Data shows higher engagement in morning classes (before 11 AM) compared to afternoon sessions. Consider scheduling more challenging topics earlier in the day.",
          metric: {
            label: "Morning Engagement",
            value: "92%",
            trend: "up",
            change: "+18% vs afternoon",
          },
          action: {
            label: "View Schedule Analysis",
            onClick: () => console.log("View schedule analysis"),
          },
        },
        {
          type: "warning",
          title: "At-Risk Students Identified",
          description:
            "7 students are showing signs of falling behind, particularly in Mathematics. Early intervention is recommended.",
          metric: {
            label: "At-Risk Students",
            value: "7",
            trend: "up",
            change: "+3 from last month",
          },
          action: {
            label: "View Student List",
            onClick: () => console.log("View at-risk students"),
          },
        },
      ])
      setIsLoading(false)
      setIsOpen(true)
    }, 1500)
  }

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getTypeIcon = (type: "success" | "warning" | "info") => {
    if (type === "success") return <TrendingUp className="h-5 w-5 text-green-500" />
    if (type === "warning") return <AlertTriangle className="h-5 w-5 text-amber-500" />
    if (type === "info") return <Lightbulb className="h-5 w-5 text-blue-500" />
    return null
  }

  const getTypeBadge = (type: "success" | "warning" | "info") => {
    if (type === "success") return <Badge className="bg-green-500">Positive Trend</Badge>
    if (type === "warning") return <Badge className="bg-amber-500">Needs Attention</Badge>
    if (type === "info") return <Badge className="bg-blue-500">Insight</Badge>
    return null
  }

  return (
    <div className="relative">
      <Button onClick={generateInsights} disabled={isLoading} variant="gradient" className="group">
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Analyzing Data...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4 transition-all group-hover:rotate-12" />
            AI Insights
          </>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 z-50 w-full max-w-md animate-in fade-in slide-in-from-top-5 md:max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Analysis of your teaching data and student performance</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getTypeIcon(insight.type)}</div>
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                    <div>{getTypeBadge(insight.type)}</div>
                  </div>

                  {insight.metric && (
                    <div className="mt-3 rounded-md bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{insight.metric.label}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{insight.metric.value}</span>
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(insight.metric.trend)}
                            <span
                              className={`text-xs ${
                                insight.metric.trend === "up"
                                  ? "text-green-500"
                                  : insight.metric.trend === "down"
                                    ? "text-red-500"
                                    : ""
                              }`}
                            >
                              {insight.metric.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {insight.action && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={insight.action.onClick}
                        className="w-full justify-center"
                      >
                        {insight.action.label}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
            <p className="text-xs text-muted-foreground">
              Insights generated based on your teaching data and student performance metrics
            </p>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
