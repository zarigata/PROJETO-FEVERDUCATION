"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useSafeToast } from "@/hooks/use-safe-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

const SUBJECTS = ["math", "science", "language", "history", "art", "music", "physical_education"]
const LEARNING_STYLES = ["visual", "auditory", "reading", "kinesthetic"]

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AITutor() {
  const { t } = useLanguage()
  const toast = useSafeToast()
  const [isLoading, setIsLoading] = useState(false)
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [learningStyle, setLearningStyle] = useState(LEARNING_STYLES[0])
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI tutor. How can I help you with your studies today?",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    try {
      setIsLoading(true)

      // Add user message
      const userMessage = { role: "user" as const, content: input }
      setMessages((prev) => [...prev, userMessage])
      setInput("")

      // Create context for the AI
      const conversationHistory = messages
        .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
        .join("\n")

      const prompt = `
        ${conversationHistory}
        Student: ${input}
        Tutor:
      `

      // Add empty assistant message that will be filled
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      // Stream the response
      let fullResponse = ""

      streamText({
        model: openai("gpt-4o"),
        prompt: prompt,
        system: `You are a helpful and knowledgeable tutor specializing in ${subject}. 
                Adapt your teaching to a ${learningStyle} learning style. 
                Be encouraging, patient, and explain concepts clearly. 
                If the student asks something you don't know, admit it and suggest resources.
                Keep responses concise and focused on helping the student learn.`,
        onChunk: ({ chunk }) => {
          if (chunk.type === "text-delta") {
            fullResponse += chunk.text
            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content = fullResponse
              return newMessages
            })
          }
        },
      })
    } catch (error) {
      console.error("AI tutor error:", error)
      toast({
        title: t("error"),
        description: t("ai_tutor.error_message"),
        variant: "destructive",
      })

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("ai_tutor.error_response"),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ErrorBoundary fallback={<div className="p-4">{t("error_boundary.something_went_wrong")}</div>}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{t("ai_tutor.title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t("ai_tutor.preferences")}</CardTitle>
              <CardDescription>{t("ai_tutor.customize_experience")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("ai_tutor.subject")}</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subj) => (
                      <SelectItem key={subj} value={subj}>
                        {t(`ai_generator.subjects.${subj}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("ai_tutor.learning_style")}</label>
                <Select value={learningStyle} onValueChange={setLearningStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {t(`ai_tutor.learning_styles.${style}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>{t("ai_tutor.chat")}</CardTitle>
              <CardDescription>{t("ai_tutor.ask_questions")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto border rounded-md p-4 mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        {message.role === "assistant" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Tutor" />
                            <AvatarFallback>AI</AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Student" />
                            <AvatarFallback>ST</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("ai_tutor.message_placeholder")}
                  className="resize-none"
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                  {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                  {t("ai_tutor.send")}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
