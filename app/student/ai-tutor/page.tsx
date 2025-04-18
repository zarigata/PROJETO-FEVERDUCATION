"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Paperclip,
  ImageIcon,
  Mic,
  BookOpen,
  Calculator,
  Lightbulb,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

// Sample chat messages
const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello Alex! I'm your AI tutor. How can I help you with your studies today?",
    timestamp: "5:45 PM",
  },
]

// Sample suggested questions
const suggestedQuestions = [
  "Can you explain photosynthesis?",
  "Help me solve this algebra equation: 2x + 5 = 13",
  "What are the main causes of World War II?",
  "How do I write a good thesis statement?",
]

export default function AITutor() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      let response

      if (input.toLowerCase().includes("photosynthesis")) {
        response =
          "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. During photosynthesis, plants take in carbon dioxide and water, and using energy from sunlight, convert them into glucose and oxygen. The chemical equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂"
      } else if (input.toLowerCase().includes("algebra") || input.toLowerCase().includes("equation")) {
        response =
          "Let's solve 2x + 5 = 13:\n\n2x + 5 = 13\n2x = 13 - 5\n2x = 8\nx = 4\n\nThe solution is x = 4. You can verify this by substituting back: 2(4) + 5 = 8 + 5 = 13 ✓"
      } else if (input.toLowerCase().includes("world war")) {
        response =
          "The main causes of World War II include:\n\n1. The harsh Treaty of Versailles which punished Germany after WWI\n2. The rise of fascism in Germany, Italy, and Japan\n3. The Great Depression's global economic impact\n4. The failure of appeasement policies\n5. Germany's invasion of Poland in 1939"
      } else if (input.toLowerCase().includes("thesis")) {
        response =
          "A good thesis statement should:\n\n- Be specific and focused\n- Make a claim that requires evidence\n- Be debatable (not just stating a fact)\n- Appear near the beginning of your paper\n- Set the direction for your entire paper\n\nExample: 'While social media has enhanced connectivity, its negative impacts on mental health and privacy outweigh these benefits.'"
      } else {
        response =
          "That's a great question! I'd be happy to help you with that. Could you provide a bit more detail so I can give you the most accurate information?"
      }

      const aiMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tutor</h1>
          <p className="text-muted-foreground">Get personalized help with your studies and assignments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Tutor" />
                    <AvatarFallback className="bg-[#6200ee] dark:bg-[#bb86fc] text-white">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>EduDroid AI Tutor</CardTitle>
                    <CardDescription>Always available to help</CardDescription>
                  </div>
                  <Badge className="ml-auto bg-[#4caf50]">Online</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-[#6200ee] dark:bg-[#bb86fc] text-white dark:text-[#121212]"
                            : "bg-[#f5f5f5] dark:bg-[#1e1e1e] text-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-white/70 dark:text-[#121212]/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-[#f5f5f5] dark:bg-[#1e1e1e]">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-[#6200ee] dark:bg-[#bb86fc] animate-bounce"></div>
                          <div
                            className="h-2 w-2 rounded-full bg-[#6200ee] dark:bg-[#bb86fc] animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 rounded-full bg-[#6200ee] dark:bg-[#bb86fc] animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Ask me anything about your studies..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pr-20 border-[#6200ee]/30 focus-visible:ring-[#6200ee] dark:border-[#bb86fc]/30 dark:focus-visible:ring-[#bb86fc]"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-[#6200ee] hover:bg-[#3700b3] dark:bg-[#bb86fc] dark:text-[#121212] dark:hover:bg-[#bb86fc]/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Questions</CardTitle>
                <CardDescription>Try asking one of these questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 border-[#6200ee]/30 hover:bg-[#6200ee]/10 dark:border-[#bb86fc]/30 dark:hover:bg-[#bb86fc]/10"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Tools</CardTitle>
                <CardDescription>Additional resources to help you learn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 border-[#6200ee]/30 hover:bg-[#6200ee]/10 dark:border-[#bb86fc]/30 dark:hover:bg-[#bb86fc]/10"
                >
                  <Calculator className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Math Calculator</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 border-[#6200ee]/30 hover:bg-[#6200ee]/10 dark:border-[#bb86fc]/30 dark:hover:bg-[#bb86fc]/10"
                >
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Study Resources</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 border-[#6200ee]/30 hover:bg-[#6200ee]/10 dark:border-[#bb86fc]/30 dark:hover:bg-[#bb86fc]/10"
                >
                  <ImageIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Visual Learning</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 border-[#6200ee]/30 hover:bg-[#6200ee]/10 dark:border-[#bb86fc]/30 dark:hover:bg-[#bb86fc]/10"
                >
                  <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Practice Quizzes</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
