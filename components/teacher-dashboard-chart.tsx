"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DetailedAnalyticsModal } from "@/components/detailed-analytics-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Maximize2, AlertCircle, Loader2 } from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="text-xs"
      >{`${value} classes`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export function TeacherDashboardChart() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [modalTitle, setModalTitle] = useState("Detailed Analytics")
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null)

  // Fetch data from Supabase
  const { performanceData, subjectData, classDistributionData, loading, error, getChartData } = useDashboardData()

  // Get formatted data for charts
  const chartData = getChartData()

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const handleDataClick = (data: any, title: string) => {
    setSelectedData(data)
    setModalTitle(title)
    setModalOpen(true)
  }

  const handleChartFullscreen = (chartType: string) => {
    setFullscreenChart(chartType)
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading dashboard data</AlertTitle>
        <AlertDescription>
          {error.message}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // If data is loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="subjects"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="distribution"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Class Distribution
            </TabsTrigger>
          </TabsList>

          {/* Chart type toggle for performance tab */}
          <div className="flex space-x-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
              className="transition-all"
            >
              Line
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="transition-all"
            >
              Bar
            </Button>
          </div>
        </div>

        <TabsContent value="performance" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Trends</CardTitle>
              <CardDescription>Average scores and participation metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-0 right-0 z-10"
                  onClick={() => handleChartFullscreen("performance")}
                >
                  <Maximize2 className="h-4 w-4 mr-1" /> Expand
                </Button>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={chartData.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend onClick={(e) => handleDataClick(e.payload, `${e.value} Metrics`)} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Average Score"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        activeDot={{
                          r: 8,
                          className: "cursor-pointer",
                          onClick: (_, index) =>
                            handleDataClick(
                              chartData.performanceData[index],
                              `${chartData.performanceData[index].month} Performance`,
                            ),
                        }}
                        className="transition-all duration-300"
                      />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        name="Attendance %"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        activeDot={{
                          r: 8,
                          className: "cursor-pointer",
                          onClick: (_, index) =>
                            handleDataClick(
                              chartData.performanceData[index],
                              `${chartData.performanceData[index].month} Performance`,
                            ),
                        }}
                        className="transition-all duration-300"
                      />
                      <Line
                        type="monotone"
                        dataKey="participation"
                        name="Participation %"
                        stroke="#f97316"
                        strokeWidth={2}
                        activeDot={{
                          r: 8,
                          className: "cursor-pointer",
                          onClick: (_, index) =>
                            handleDataClick(
                              chartData.performanceData[index],
                              `${chartData.performanceData[index].month} Performance`,
                            ),
                        }}
                        className="transition-all duration-300"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend onClick={(e) => handleDataClick(e.payload, `${e.value} Metrics`)} />
                      <Bar
                        dataKey="score"
                        name="Average Score"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={(data) => handleDataClick(data, `${data.month} Performance`)}
                      />
                      <Bar
                        dataKey="attendance"
                        name="Attendance %"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={(data) => handleDataClick(data, `${data.month} Performance`)}
                      />
                      <Bar
                        dataKey="participation"
                        name="Participation %"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={(data) => handleDataClick(data, `${data.month} Performance`)}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Hover over data points for more details. Click on data points or legend items to view detailed
                  analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject and number of students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-0 right-0 z-10"
                  onClick={() => handleChartFullscreen("subjects")}
                >
                  <Maximize2 className="h-4 w-4 mr-1" /> Expand
                </Button>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.subjectData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend onClick={(e) => handleDataClick(e.payload, `${e.value} Analytics`)} />
                    <Bar
                      yAxisId="left"
                      dataKey="avgScore"
                      name="Average Score"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      className="cursor-pointer transition-all hover:opacity-80"
                      onClick={(data) => handleDataClick(data, `${data.name} Analytics`)}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="students"
                      name="Number of Students"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                      className="cursor-pointer transition-all hover:opacity-80"
                      onClick={(data) => handleDataClick(data, `${data.name} Analytics`)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Click on bars to see detailed subject performance metrics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Class Distribution</CardTitle>
              <CardDescription>Distribution of classes by subject area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-0 right-0 z-10"
                  onClick={() => handleChartFullscreen("distribution")}
                >
                  <Maximize2 className="h-4 w-4 mr-1" /> Expand
                </Button>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={chartData.classDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onClick={(_, index) =>
                        handleDataClick(
                          chartData.classDistributionData[index],
                          `${chartData.classDistributionData[index].name} Classes`,
                        )
                      }
                      className="cursor-pointer"
                    >
                      {chartData.classDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="transition-all hover:opacity-80" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Hover over pie sections to see detailed class distribution. Click to view more analytics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DetailedAnalyticsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedData}
        title={modalTitle}
      />

      {fullscreenChart && (
        <Dialog open={!!fullscreenChart} onOpenChange={() => setFullscreenChart(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {fullscreenChart === "performance"
                  ? "Student Performance Trends"
                  : fullscreenChart === "subjects"
                    ? "Subject Performance"
                    : "Class Distribution"}
              </DialogTitle>
            </DialogHeader>
            <div className="h-[70vh] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {fullscreenChart === "performance" && chartType === "line" ? (
                  <LineChart data={chartData.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Average Score" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#06b6d4" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="participation"
                      name="Participation %"
                      stroke="#f97316"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : fullscreenChart === "performance" && chartType === "bar" ? (
                  <BarChart data={chartData.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="score" name="Average Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attendance" name="Attendance %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="participation" name="Participation %" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : fullscreenChart === "subjects" ? (
                  <BarChart
                    data={chartData.subjectData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgScore" name="Average Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar
                      yAxisId="right"
                      dataKey="students"
                      name="Number of Students"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={chartData.classDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      className="cursor-pointer"
                    >
                      {chartData.classDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
