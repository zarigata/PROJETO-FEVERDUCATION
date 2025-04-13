"use client"

import { useState } from "react"
import { Download, Filter, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface DetailedAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  data?: any
  title?: string
}

export function DetailedAnalyticsModal({
  isOpen,
  onClose,
  data = null,
  title = "Detailed Analytics",
}: DetailedAnalyticsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for demonstration
  const sampleData = {
    subject: "Chemistry",
    period: "Last 30 days",
    metrics: {
      attendance: { value: 88, change: -4, trend: "down" },
      participation: { value: 76, change: -15, trend: "down" },
      completion: { value: 85, change: -2, trend: "down" },
      avgScore: { value: 78, change: -6, trend: "down" },
    },
    students: [
      { name: "Alex Johnson", attendance: 95, participation: 85, completion: 90, avgScore: 88 },
      { name: "Samantha Lee", attendance: 92, participation: 78, completion: 88, avgScore: 85 },
      { name: "Michael Chen", attendance: 85, participation: 65, completion: 80, avgScore: 72 },
      { name: "Emily Rodriguez", attendance: 98, participation: 90, completion: 95, avgScore: 92 },
      { name: "David Kim", attendance: 75, participation: 60, completion: 70, avgScore: 68 },
    ],
    topics: [
      { name: "Periodic Table", difficulty: "Medium", avgScore: 82, engagement: 80 },
      { name: "Chemical Bonds", difficulty: "Hard", avgScore: 75, engagement: 72 },
      { name: "Balancing Equations", difficulty: "Hard", avgScore: 70, engagement: 68 },
      { name: "States of Matter", difficulty: "Easy", avgScore: 88, engagement: 85 },
    ],
    aiInsights: [
      "Student participation drops significantly during the Chemical Bonds topic",
      "Students who attended the optional review sessions scored 15% higher on average",
      "Engagement is highest in the first 20 minutes of class, suggesting a need for activity rotation",
    ],
  }

  const displayData = data || sampleData

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (trend === "down") return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return null
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-500"
    if (trend === "down") return "text-red-500"
    return ""
  }

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Easy") return "bg-green-500"
    if (difficulty === "Medium") return "bg-amber-500"
    if (difficulty === "Hard") return "bg-red-500"
    return "bg-gray-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {title}
            <Badge className="ml-2">{displayData.subject}</Badge>
            <Badge variant="outline">{displayData.period}</Badge>
          </DialogTitle>
          <DialogDescription>Detailed analysis and insights for better teaching outcomes</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="topics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Topics
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(displayData.metrics).map(([key, metric]: [string, any]) => (
                <Card key={key} className="scale-effect" hover>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{metric.value}%</div>
                      <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span>
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={metric.value}
                      className="mt-2 h-2"
                      indicatorClassName={metric.trend === "down" ? "bg-red-500" : ""}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Key Observations</h4>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Overall participation has decreased by 15% this month</li>
                      <li>The most challenging topic appears to be Balancing Equations</li>
                      <li>5 students are showing significant improvement</li>
                      <li>3 students may need additional support</li>
                    </ul>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Recommendations</h4>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Consider introducing more interactive activities for Chemical Bonds</li>
                      <li>Schedule additional review sessions for Balancing Equations</li>
                      <li>Implement peer learning groups to improve participation</li>
                      <li>Provide targeted support for the 3 students who are struggling</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="mt-4">
            <div className="flex justify-between mb-4">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                <div className="col-span-2">Student</div>
                <div>Attendance</div>
                <div>Participation</div>
                <div>Completion</div>
                <div>Avg. Score</div>
              </div>
              <div className="divide-y">
                {displayData.students.map((student: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="col-span-2 font-medium">{student.name}</div>
                    <div>{student.attendance}%</div>
                    <div>{student.participation}%</div>
                    <div>{student.completion}%</div>
                    <div>{student.avgScore}%</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="mt-4">
            <div className="space-y-4">
              {displayData.topics.map((topic: any, index: number) => (
                <Card key={index} className="scale-effect" hover>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{topic.name}</h3>
                        <Badge className={`mt-1 ${getDifficultyColor(topic.difficulty)}`}>{topic.difficulty}</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium">{topic.avgScore}%</span>
                        </div>
                        <Progress value={topic.avgScore} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Engagement</span>
                          <span className="font-medium">{topic.engagement}%</span>
                        </div>
                        <Progress value={topic.engagement} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.aiInsights.map((insight: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-md border p-4 hover:border-primary transition-all"
                    >
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Generate Full Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
