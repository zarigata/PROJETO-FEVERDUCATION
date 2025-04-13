"use client"

import { useState } from "react"
import { Wand2, BookOpen, FileText, PenTool, CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function ClassGenerator() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  const handleGenerate = () => {
    setGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)

      // Sample generated content based on the active tab
      const sampleContent = `# Introduction to Photosynthesis

## Learning Objectives
- Understand the basic process of photosynthesis
- Identify the key components involved in photosynthesis
- Explain the importance of photosynthesis for life on Earth

## Key Concepts
Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy. This process takes place in the chloroplasts, specifically in the grana and stroma.

The overall equation for photosynthesis is:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

## Main Components
1. **Light-dependent reactions**: These reactions occur in the thylakoid membrane and convert light energy into chemical energy.
2. **Calvin cycle (light-independent reactions)**: These reactions use the chemical energy produced in the light-dependent reactions to produce glucose.

## Activities
1. Observe different leaves under a microscope to identify chloroplasts
2. Conduct an experiment to demonstrate oxygen production during photosynthesis
3. Create a diagram illustrating the process of photosynthesis

## Assessment
Students will be assessed through a combination of:
- In-class participation
- Lab report on the photosynthesis experiment
- Quiz on key concepts
- Final project presenting a visual model of photosynthesis`

      setGeneratedContent(sampleContent)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Class Generator</h1>
        <p className="text-muted-foreground">
          Create engaging lesson plans, quizzes, and educational content in seconds
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
            <CardDescription>Describe what you want to create and our AI will generate it for you</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lesson">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lesson">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lesson Plan
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <PenTool className="mr-2 h-4 w-4" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="handout">
                  <FileText className="mr-2 h-4 w-4" />
                  Handout
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lesson" className="mt-4 space-y-4">
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
                  <Label htmlFor="grade">Grade Level</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Slider defaultValue={[45]} max={120} min={15} step={5} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15 min</span>
                    <span>45 min</span>
                    <span>120 min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Instructions (Optional)</Label>
                  <Textarea
                    id="additional"
                    placeholder="Include specific activities, learning objectives, or assessment methods..."
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="mt-4 space-y-4">
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
                  <Label htmlFor="questions">Number of Questions</Label>
                  <Slider defaultValue={[10]} max={20} min={5} step={1} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5</span>
                    <span>10</span>
                    <span>20</span>
                  </div>
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-types">Question Types</Label>
                  <Select defaultValue="mixed">
                    <SelectTrigger>
                      <SelectValue placeholder="Select question types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple">Multiple Choice</SelectItem>
                      <SelectItem value="truefalse">True/False</SelectItem>
                      <SelectItem value="short">Short Answer</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="handout" className="mt-4 space-y-4">
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
                  <Input id="topic" placeholder="e.g., Periodic Table" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handout-type">Handout Type</Label>
                  <Select defaultValue="notes">
                    <SelectTrigger>
                      <SelectValue placeholder="Select handout type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notes">Study Notes</SelectItem>
                      <SelectItem value="worksheet">Worksheet</SelectItem>
                      <SelectItem value="guide">Study Guide</SelectItem>
                      <SelectItem value="reference">Reference Sheet</SelectItem>
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

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Instructions (Optional)</Label>
                  <Textarea
                    id="additional"
                    placeholder="Include specific content, formatting preferences, or special instructions..."
                    className="min-h-[100px]"
                  />
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
                  Generate Content
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              {generated
                ? "Your content has been generated. You can edit it before saving."
                : "Your generated content will appear here"}
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
                  <h3 className="text-lg font-medium">No Content Generated Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form and click "Generate Content" to create your educational materials.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {generated && (
              <>
                <Button variant="outline">Edit Further</Button>
                <Button>Save to Library</Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
