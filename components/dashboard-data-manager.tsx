"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabase } from "@/lib/supabase"
import { seedDashboardData } from "@/app/actions/seed-dashboard-data"
import { Loader2, RefreshCw, Plus, Trash } from "lucide-react"

export function DashboardDataManager() {
  const [activeTab, setActiveTab] = useState("performance")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form states
  const [newPerformanceData, setNewPerformanceData] = useState({
    month: "",
    score: "",
    attendance: "",
    participation: "",
  })

  const [newSubjectData, setNewSubjectData] = useState({
    name: "",
    students: "",
    avg_score: "",
    color: "#8b5cf6",
  })

  const [newDistributionData, setNewDistributionData] = useState({
    name: "",
    value: "",
    color: "#8b5cf6",
  })

  const resetForm = () => {
    if (activeTab === "performance") {
      setNewPerformanceData({
        month: "",
        score: "",
        attendance: "",
        participation: "",
      })
    } else if (activeTab === "subjects") {
      setNewSubjectData({
        name: "",
        students: "",
        avg_score: "",
        color: "#8b5cf6",
      })
    } else {
      setNewDistributionData({
        name: "",
        value: "",
        color: "#8b5cf6",
      })
    }
  }

  const handleSeedData = async () => {
    try {
      setLoading(true)
      const result = await seedDashboardData()

      if (result.success) {
        setMessage({ type: "success", text: result.message })
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      console.error("Error seeding data:", error)
      setMessage({ type: "error", text: "Failed to seed data. See console for details." })
    } finally {
      setLoading(false)
    }
  }

  const handleAddData = async () => {
    try {
      setLoading(true)
      const supabase = getSupabase()

      if (activeTab === "performance") {
        const { error } = await supabase.from("performance_data").insert([
          {
            month: newPerformanceData.month,
            score: Number.parseFloat(newPerformanceData.score),
            attendance: Number.parseFloat(newPerformanceData.attendance),
            participation: Number.parseFloat(newPerformanceData.participation),
          },
        ])

        if (error) throw error
        setMessage({ type: "success", text: "Performance data added successfully" })
      } else if (activeTab === "subjects") {
        const { error } = await supabase.from("subject_data").insert([
          {
            name: newSubjectData.name,
            students: Number.parseInt(newSubjectData.students),
            avg_score: Number.parseFloat(newSubjectData.avg_score),
            color: newSubjectData.color,
          },
        ])

        if (error) throw error
        setMessage({ type: "success", text: "Subject data added successfully" })
      } else {
        const { error } = await supabase.from("class_distribution").insert([
          {
            name: newDistributionData.name,
            value: Number.parseInt(newDistributionData.value),
            color: newDistributionData.color,
          },
        ])

        if (error) throw error
        setMessage({ type: "success", text: "Class distribution data added successfully" })
      }

      resetForm()
    } catch (error) {
      console.error("Error adding data:", error)
      setMessage({ type: "error", text: "Failed to add data. See console for details." })
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all data from this table? This action cannot be undone.")) {
      return
    }

    try {
      setLoading(true)
      const supabase = getSupabase()

      if (activeTab === "performance") {
        const { error } = await supabase.from("performance_data").delete().neq("id", 0)
        if (error) throw error
        setMessage({ type: "success", text: "Performance data cleared successfully" })
      } else if (activeTab === "subjects") {
        const { error } = await supabase.from("subject_data").delete().neq("id", 0)
        if (error) throw error
        setMessage({ type: "success", text: "Subject data cleared successfully" })
      } else {
        const { error } = await supabase.from("class_distribution").delete().neq("id", 0)
        if (error) throw error
        setMessage({ type: "success", text: "Class distribution data cleared successfully" })
      }
    } catch (error) {
      console.error("Error clearing data:", error)
      setMessage({ type: "error", text: "Failed to clear data. See console for details." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dashboard Data Manager</CardTitle>
        <CardDescription>Add, update, or reset dashboard data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance Data</TabsTrigger>
            <TabsTrigger value="subjects">Subject Data</TabsTrigger>
            <TabsTrigger value="distribution">Class Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  placeholder="e.g., Jul"
                  value={newPerformanceData.month}
                  onChange={(e) => setNewPerformanceData({ ...newPerformanceData, month: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Average Score (%)</Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="e.g., 85"
                  value={newPerformanceData.score}
                  onChange={(e) => setNewPerformanceData({ ...newPerformanceData, score: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance (%)</Label>
                <Input
                  id="attendance"
                  type="number"
                  placeholder="e.g., 92"
                  value={newPerformanceData.attendance}
                  onChange={(e) => setNewPerformanceData({ ...newPerformanceData, attendance: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participation">Participation (%)</Label>
                <Input
                  id="participation"
                  type="number"
                  placeholder="e.g., 78"
                  value={newPerformanceData.participation}
                  onChange={(e) => setNewPerformanceData({ ...newPerformanceData, participation: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input
                  id="subject-name"
                  placeholder="e.g., Physics"
                  value={newSubjectData.name}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="students">Number of Students</Label>
                <Input
                  id="students"
                  type="number"
                  placeholder="e.g., 30"
                  value={newSubjectData.students}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, students: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avg-score">Average Score (%)</Label>
                <Input
                  id="avg-score"
                  type="number"
                  placeholder="e.g., 82"
                  value={newSubjectData.avg_score}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, avg_score: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-color">Color</Label>
                <Input
                  id="subject-color"
                  type="color"
                  value={newSubjectData.color}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, color: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Category</Label>
                <Input
                  id="class-name"
                  placeholder="e.g., Art"
                  value={newDistributionData.name}
                  onChange={(e) => setNewDistributionData({ ...newDistributionData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-value">Number of Classes</Label>
                <Input
                  id="class-value"
                  type="number"
                  placeholder="e.g., 3"
                  value={newDistributionData.value}
                  onChange={(e) => setNewDistributionData({ ...newDistributionData, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-color">Color</Label>
                <Input
                  id="class-color"
                  type="color"
                  value={newDistributionData.color}
                  onChange={(e) => setNewDistributionData({ ...newDistributionData, color: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {message.text}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedData} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Seed Default Data
          </Button>
          <Button variant="destructive" onClick={handleClearData} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
            Clear Data
          </Button>
        </div>
        <Button onClick={handleAddData} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add Data
        </Button>
      </CardFooter>
    </Card>
  )
}
