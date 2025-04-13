"use client"

import { useState } from "react"
import { Wand2, BookOpen, FileText, PenTool, CheckCircle, Copy, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function HomeworkBuilder() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])

  // Sample class data
  const classes = [
    {
      id: 1,
      title: "Biology 101",
      students: 32,
      currentTopic: "Photosynthesis",
    },
    {
      id: 2,
      title: "Chemistry Basics",
      students: 28,
      currentTopic: "Periodic Table",
    },
    {
      id: 3,
      title: "Advanced Mathematics",
      students: 24,
      currentTopic: "Calculus",
    },
  ]

  const handleGenerate = () => {
    setGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)

      // Sample generated content
      const sampleContent = `# Photosynthesis Homework Assignment

## Instructions
Complete the following questions about photosynthesis. Submit your answers by Friday, 5:00 PM.

## Questions

1. **Multiple Choice**: What is the primary pigment involved in photosynthesis?
   a) Chlorophyll
   b) Melanin
   c) Carotene
   d) Xanthophyll

2. **Short Answer**: Explain the role of water in the light-dependent reactions of photosynthesis.

3. **Diagram**: Draw and label the key components of a chloroplast.

4. **Essay Question**: Compare and contrast the light-dependent and light-independent reactions of photosynthesis. Include the location, inputs, outputs, and significance of each process.

5. **Problem Solving**: If a plant produces 30 grams of glucose through photosynthesis, calculate how much carbon dioxide and water were consumed in the process. Show your work using the balanced equation for photosynthesis.

## Bonus Question
Research and explain one adaptation that plants have evolved to maximize photosynthetic efficiency in their specific environment.

## Resources
- Textbook: Chapter 8, pages 156-172
- Class notes from Tuesday's lecture
- Online simulation: www.photosynthesis-sim.edu

## Grading Criteria
- Accuracy of answers: 60%
- Completeness of explanations: 30%
- Proper use of scientific terminology: 10%`

      setGeneratedContent(sampleContent)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleClassSelection = (classId: number) => {
    const className = classes.find((c) => c.id === classId)?.title || ""

    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== className))
    } else {
      setSelectedClasses([...selectedClasses, className])
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Homework Builder</h1>
        <p className="text-muted-foreground">Create personalized homework assignments for your students in seconds</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Create Homework</CardTitle>
            <CardDescription>Describe what you want to create and our AI will generate it for you</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assignment">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assignment">
                  <FileText className="mr-2 h-4 w-4" />
                  Assignment
                </TabsTrigger>
                <TabsTrigger value="worksheet">
                  <PenTool className="mr-2 h-4 w-4" />
                  Worksheet
                </TabsTrigger>
                <TabsTrigger value="project">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Project
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assignment" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select defaultValue="biology">
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" placeholder="e.g., Photosynthesis" defaultValue="Photosynthesis" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questions">Number of Questions</Label>
                  <Slider defaultValue={[5]} max={15} min={3} step={1} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3</span>
                    <span>5</span>
                    <span>15</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-types">Question Types</Label>
                  <Select defaultValue="mixed">
                    <SelectTrigger>
                      <SelectValue placeholder="Select question types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple">Multiple Choice</SelectItem>
                      <SelectItem value="short">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="problem">Problem Solving</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="date" min={new Date().toISOString().split("T")[0]} />
                    <Input type="time" defaultValue="17:00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Include Resources</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="include-resources" defaultChecked />
                    <Label htmlFor="include-resources">Add relevant resources and references</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assign to Classes</Label>
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between rounded-md border p-3">
                        <div className="space-y-1">
                          <div className="font-medium">{cls.title}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{cls.students} students</span>
                            <span>•</span>
                            <span>Current topic: {cls.currentTopic}</span>
                          </div>
                        </div>
                        <Switch
                          checked={selectedClasses.includes(cls.title)}
                          onCheckedChange={() => toggleClassSelection(cls.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Instructions (Optional)</Label>
                  <Textarea
                    id="additional"
                    placeholder="Include specific requirements, formatting preferences, or special instructions..."
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="worksheet" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select defaultValue="biology">
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" placeholder="e.g., Cell Division" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="worksheet-type">Worksheet Type</Label>
                  <Select defaultValue="practice">
                    <SelectTrigger>
                      <SelectValue placeholder="Select worksheet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="practice">Practice Problems</SelectItem>
                      <SelectItem value="review">Review Sheet</SelectItem>
                      <SelectItem value="lab">Lab Worksheet</SelectItem>
                      <SelectItem value="guided">Guided Notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="include-visuals">Include Visuals</Label>
                  <Select defaultValue="yes">
                    <SelectTrigger>
                      <SelectValue placeholder="Include visuals?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="project" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select defaultValue="biology">
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" placeholder="e.g., Ecosystem Analysis" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select defaultValue="research">
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research Project</SelectItem>
                      <SelectItem value="experiment">Experiment</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="creative">Creative Project</SelectItem>
                      <SelectItem value="group">Group Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Project Duration (days)</Label>
                  <Slider defaultValue={[7]} max={30} min={1} step={1} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>7</span>
                    <span>30</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Homework
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generated Homework</CardTitle>
            <CardDescription>
              {generated
                ? "Your homework has been generated. You can edit it before assigning."
                : "Your generated homework will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generated ? (
              <div className="relative">
                <Textarea
                  className="min-h-[400px] font-mono text-sm"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleCopy}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-md border border-dashed p-8 text-center">
                <div className="space-y-2">
                  <Wand2 className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Homework Generated Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form and click "Generate Homework" to create your assignment.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {generated && (
              <>
                <div className="flex items-center gap-2">
                  {selectedClasses.length > 0 ? (
                    <Badge variant="outline" className="bg-primary/10">
                      {selectedClasses.length} {selectedClasses.length === 1 ? "class" : "classes"} selected
                    </Badge>
                  ) : (
                    <Badge variant="outline">No classes selected</Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due Friday
                  </Badge>
                </div>
                <Button disabled={selectedClasses.length === 0}>Assign Homework</Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
