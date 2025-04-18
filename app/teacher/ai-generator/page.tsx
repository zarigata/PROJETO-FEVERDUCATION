"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Wand2, Download, Copy, Share2, BookOpen, Clock, Target, Users, Lightbulb, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AIGenerator() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [duration, setDuration] = useState([45])
  const [includeActivities, setIncludeActivities] = useState(true)
  const [includeAssessments, setIncludeAssessments] = useState(true)

  // Sample generated lesson plan
  const sampleLessonPlan = `
# Introduction to Photosynthesis

## Learning Objectives
- Understand the basic process of photosynthesis
- Identify the key components needed for photosynthesis
- Explain how plants convert light energy into chemical energy

## Materials Needed
- Plant specimens
- Microscope slides
- Colored pencils
- Photosynthesis diagram handouts
- Interactive simulation software

## Lesson Structure (45 minutes)

### Opening (5 minutes)
- Begin with a quick poll: "Where do plants get their energy?"
- Introduce the concept of photosynthesis as a process that converts light energy into food

### Direct Instruction (15 minutes)
- Present the chemical equation for photosynthesis
- Explain the role of chlorophyll, sunlight, water, and carbon dioxide
- Show animation of the photosynthesis process

### Guided Practice (15 minutes)
- Students work in pairs to label diagrams of plant cells
- Identify chloroplasts and explain their function
- Complete a flowchart showing the inputs and outputs of photosynthesis

### Independent Activity (5 minutes)
- Students write a short paragraph explaining photosynthesis in their own words
- Challenge question: How might photosynthesis be affected in different environments?

### Closing (5 minutes)
- Review key concepts through quick Q&A
- Preview the next lesson on cellular respiration
- Exit ticket: Name three things plants need for photosynthesis

## Assessment
- Completed diagram labels
- Written explanation paragraph
- Exit ticket responses

## Differentiation
- Visual learners: Provide additional diagrams and visual aids
- Advanced students: Explore the light-dependent and light-independent reactions
- Support: Simplified vocabulary list and sentence starters
  `

  const handleGenerate = () => {
    if (!topic || !gradeLevel) return

    setGenerating(true)
    // Simulate API call delay
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Class Generator</h1>
          <p className="text-muted-foreground">
            Create comprehensive lesson plans, activities, and assessments with AI assistance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Lesson Plan Generator</CardTitle>
              <CardDescription>Provide details about your class to generate a customized lesson plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Lesson Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Photosynthesis, World War II, Fractions"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade-level">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger id="grade-level">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary School (K-5)</SelectItem>
                    <SelectItem value="middle">Middle School (6-8)</SelectItem>
                    <SelectItem value="high">High School (9-12)</SelectItem>
                    <SelectItem value="college">College/University</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lesson Duration (minutes)</Label>
                <div className="pt-4">
                  <Slider
                    defaultValue={[45]}
                    max={120}
                    min={15}
                    step={5}
                    value={duration}
                    onValueChange={setDuration}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">15 min</span>
                    <span className="text-sm font-medium">{duration[0]} min</span>
                    <span className="text-sm text-muted-foreground">120 min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-activities" className="cursor-pointer">
                    Include Interactive Activities
                  </Label>
                  <Switch id="include-activities" checked={includeActivities} onCheckedChange={setIncludeActivities} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-assessments" className="cursor-pointer">
                    Include Assessments
                  </Label>
                  <Switch
                    id="include-assessments"
                    checked={includeAssessments}
                    onCheckedChange={setIncludeAssessments}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additional-notes"
                  placeholder="Any specific requirements or focus areas for this lesson..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90"
                onClick={handleGenerate}
                disabled={generating || !topic || !gradeLevel}
              >
                {generating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" /> Generate Lesson Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Generated Lesson Plan</CardTitle>
              <CardDescription>Your AI-generated lesson plan will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {!generated ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-center p-6 border-2 border-dashed rounded-lg border-muted">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Lesson Plan Generated Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Fill out the form on the left and click "Generate Lesson Plan" to create a customized lesson.
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <Clock className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc] mb-2" />
                      <span className="text-sm font-medium">Save Time</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <Target className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc] mb-2" />
                      <span className="text-sm font-medium">Targeted Learning</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <Users className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc] mb-2" />
                      <span className="text-sm font-medium">Student Engagement</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <BookOpen className="h-6 w-6 text-[#6200ee] dark:text-[#bb86fc] mb-2" />
                      <span className="text-sm font-medium">Curriculum Aligned</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#6200ee] dark:bg-[#bb86fc] dark:text-[#121212]">Science</Badge>
                      <Badge variant="outline">Middle School</Badge>
                      <Badge variant="outline">{duration[0]} min</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="preview">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="materials">Materials</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
                        <div className="prose dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap text-sm">{sampleLessonPlan}</pre>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="edit" className="mt-4">
                      <Textarea className="min-h-[500px] font-mono text-sm" defaultValue={sampleLessonPlan} />
                    </TabsContent>
                    <TabsContent value="materials" className="mt-4">
                      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
                        <h3 className="text-lg font-medium mb-4">Suggested Materials</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <BookOpen className="h-3 w-3 text-[#6200ee] dark:text-[#bb86fc]" />
                            </div>
                            <div>
                              <p className="font-medium">Photosynthesis Diagram Handouts</p>
                              <p className="text-sm text-muted-foreground">
                                Printable diagrams showing the process of photosynthesis
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <BookOpen className="h-3 w-3 text-[#6200ee] dark:text-[#bb86fc]" />
                            </div>
                            <div>
                              <p className="font-medium">Interactive Simulation Software</p>
                              <p className="text-sm text-muted-foreground">
                                Digital simulation of the photosynthesis process
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <BookOpen className="h-3 w-3 text-[#6200ee] dark:text-[#bb86fc]" />
                            </div>
                            <div>
                              <p className="font-medium">Plant Specimens</p>
                              <p className="text-sm text-muted-foreground">Various plant samples for observation</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <BookOpen className="h-3 w-3 text-[#6200ee] dark:text-[#bb86fc]" />
                            </div>
                            <div>
                              <p className="font-medium">Microscope Slides</p>
                              <p className="text-sm text-muted-foreground">
                                For examining plant cells and chloroplasts
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#6200ee]/10 dark:bg-[#bb86fc]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <BookOpen className="h-3 w-3 text-[#6200ee] dark:text-[#bb86fc]" />
                            </div>
                            <div>
                              <p className="font-medium">Colored Pencils</p>
                              <p className="text-sm text-muted-foreground">For student diagram labeling activities</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      className="border-[#6200ee] text-[#6200ee] hover:bg-[#6200ee]/10 dark:border-[#bb86fc] dark:text-[#bb86fc]"
                    >
                      <Wand2 className="mr-2 h-4 w-4" /> Regenerate
                    </Button>
                    <Button className="bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90">
                      <Save className="mr-2 h-4 w-4" /> Save to Library
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
