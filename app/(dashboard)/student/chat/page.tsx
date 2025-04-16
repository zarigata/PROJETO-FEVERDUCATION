"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Lightbulb, BookOpen, PenTool, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function StudentChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI tutor. How can I help you with your studies today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("photosynthesis")) {
        response =
          "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy. The basic equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Would you like me to explain the light-dependent and light-independent reactions in more detail?"
      } else if (input.toLowerCase().includes("quiz") || input.toLowerCase().includes("test")) {
        response =
          "I'd be happy to help you prepare for your quiz! What subject is it on? I can create practice questions, explain concepts, or help you review specific topics."
      } else if (input.toLowerCase().includes("homework")) {
        response =
          "I can definitely help with your homework. What specific questions or problems are you working on? Remember, I'm here to guide you through the learning process, not just provide answers."
      } else {
        response =
          "That's an interesting question! I'd be happy to help you understand this topic better. Would you like me to provide a simple explanation, go into more detail, or perhaps suggest some practice exercises?"
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQuestions = [
    "Can you explain photosynthesis in simple terms?",
    "Help me prepare for my biology quiz tomorrow",
    "I'm stuck on my math homework, can you help?",
    "What's the difference between mitosis and meiosis?",
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-8rem)]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">AI Tutor</CardTitle>
                  <CardDescription>Your personal learning assistant</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-8rem)] overflow-y-auto pb-0">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        <span className="text-xs font-medium">{message.role === "assistant" ? "AI Tutor" : "You"}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-muted p-4">
                      <div className="mb-1 flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-xs font-medium">AI Tutor</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Ask anything about your studies..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Tabs defaultValue="suggestions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggestions">
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Suggested Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setInput(question)
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Current Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Photosynthesis
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Cell Division
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      <PenTool className="mr-1 h-3 w-3" />
                      Biology Quiz
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Ecosystems
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Class Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    Photosynthesis Lecture Notes
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <PenTool className="mr-2 h-4 w-4 text-primary" />
                    Biology Practice Quiz
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    Cell Structure Diagram
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">External Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    Khan Academy: Photosynthesis
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    National Geographic: Plant Cells
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    Biology Interactive Simulations
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
