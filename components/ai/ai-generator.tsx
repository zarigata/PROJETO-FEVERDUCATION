"use client"

import { useState } from "react"
import { useSafeLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useSafeToast } from "@/hooks/use-safe-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const LESSON_TYPES = ["quiz", "worksheet", "presentation", "activity", "homework"]
const GRADE_LEVELS = ["elementary", "middle", "high", "college"]
const SUBJECTS = ["math", "science", "language", "history", "art", "music", "physical_education"]

export function AIGenerator() {
  const { t } = useSafeLanguage()
  const toast = useSafeToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("lesson")
  const [generatedContent, setGeneratedContent] = useState("")

  // Lesson plan state
  const [lessonType, setLessonType] = useState(LESSON_TYPES[0])
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[0])
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [topic, setTopic] = useState("")

  // Quiz state
  const [quizTopic, setQuizTopic] = useState("")
  const [questionCount, setQuestionCount] = useState("10")
  const [difficulty, setDifficulty] = useState("medium")

  // Feedback state
  const [studentWork, setStudentWork] = useState("")
  const [feedbackType, setFeedbackType] = useState("constructive")

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setGeneratedContent("")

      let prompt = ""

      if (activeTab === "lesson") {
        if (!topic.trim()) {
          toast({
            title: "Error",
            description: "Topic is required",
            variant: "destructive",
          })
          setIsGenerating(false)
          return
        }

        prompt = `Create a ${lessonType} for ${gradeLevel} school students about ${topic} in the subject of ${subject}. Include learning objectives, activities, and assessment methods.`
      } else if (activeTab === "quiz") {
        if (!quizTopic.trim()) {
          toast({
            title: "Error",
            description: "Topic is required",
            variant: "destructive",
          })
          setIsGenerating(false)
          return
        }

        prompt = `Create a ${difficulty} difficulty quiz with ${questionCount} questions about ${quizTopic}. Include questions, multiple choice options, and answers.`
      } else if (activeTab === "feedback") {
        if (!studentWork.trim()) {
          toast({
            title: "Error",
            description: "Student work is required",
            variant: "destructive",
          })
          setIsGenerating(false)
          return
        }

        prompt = `Provide ${feedbackType} feedback for this student work: "${studentWork}". Include strengths, areas for improvement, and specific suggestions.`
      }

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
        system:
          "You are an expert educational content creator and teacher. Create high-quality, engaging, and pedagogically sound educational content.",
      })

      setGeneratedContent(text)

      toast({
        title: "Success",
        description: "Content generated successfully",
      })
    } catch (error) {
      console.error("AI generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast({
      title: "Success",
      description: "Copied to clipboard",
    })
  }

  const handleSave = () => {
    // This would typically save to a database
    toast({
      title: "Success",
      description: "Saved successfully",
    })
  }

  return (
    <ErrorBoundary fallback={<div className="p-4">Something went wrong</div>}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">AI Content Generator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Content</CardTitle>
              <CardDescription>Select options to generate educational content</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="lesson">Lesson Plan</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="lesson" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lesson Type</label>
                    <Select value={lessonType} onValueChange={setLessonType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LESSON_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade Level</label>
                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subj) => (
                          <SelectItem key={subj} value={subj}>
                            {subj.charAt(0).toUpperCase() + subj.slice(1).replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic</label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter a specific topic"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic</label>
                    <Input
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      placeholder="Enter quiz topic"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Questions</label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["5", "10", "15", "20"].map((count) => (
                          <SelectItem key={count} value={count}>
                            {count}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["easy", "medium", "hard"].map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student Work</label>
                    <Textarea
                      value={studentWork}
                      onChange={(e) => setStudentWork(e.target.value)}
                      placeholder="Paste student work here"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback Type</label>
                    <Select value={feedbackType} onValueChange={setFeedbackType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["constructive", "detailed", "simple", "encouraging"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>Your AI-generated educational content will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] max-h-[500px] overflow-y-auto border rounded-md p-4 bg-muted/30">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : generatedContent ? (
                  <div className="whitespace-pre-wrap">{generatedContent}</div>
                ) : (
                  <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                    No content generated yet. Configure options and click Generate.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCopy} disabled={!generatedContent || isGenerating}>
                Copy
              </Button>
              <Button onClick={handleSave} disabled={!generatedContent || isGenerating}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
