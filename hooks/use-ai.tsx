/**
 * /////////////////////////////////////////////////////////////////////////////
 * //                                                                         //
 * //  [FEVERDUCATION] - AI Hooks                                             //
 * //  ---------------------------------------------------------------        //
 * //  Custom hooks for interacting with AI services via our backend API.     //
 * //  Handles generation, insights, and fallback mechanisms.                 //
 * //                                                                         //
 * //  CODEX LEVEL: ALPHA-7                                                   //
 * //  VERSION: 1.0.0                                                         //
 * //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
 * //                                                                         //
 * /////////////////////////////////////////////////////////////////////////////
 */

import { useState, useCallback } from "react"

// Types for generation requests
export interface GenerationRequest {
  type: "lesson" | "quiz" | "handout"
  subject: string
  topic: string
  grade: string
  duration?: number
  questionCount?: number
  difficulty?: string
  instructions?: string
}

// Types for insights
export interface InsightItem {
  type: "success" | "warning" | "info"
  title: string
  description: string
  metric?: {
    label: string
    value: string
    trend: "up" | "down" | "neutral"
    change: string
  }
  action?: {
    label: string
    actionType: string
    targetId: string
  }
}

export interface InsightRequest {
  teacherId: string
  timeframe?: "week" | "month" | "quarter" | "year"
  types?: Array<"performance" | "engagement" | "attendance" | "improvement">
}

export interface AIServiceStatus {
  ollama: {
    available: boolean
    model: string
  }
  openrouter: {
    configured: boolean
    model: string | null
  }
}

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [insights, setInsights] = useState<InsightItem[]>([])
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serviceStatus, setServiceStatus] = useState<AIServiceStatus | null>(null)

  // Check AI service status
  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/status")
      if (!response.ok) {
        throw new Error("Failed to check AI service status")
      }
      const status = await response.json()
      setServiceStatus(status)
      return status
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error checking AI status")
      return null
    }
  }, [])

  // Generate content using AI
  const generateContent = useCallback(async (request: GenerationRequest) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      return data.content
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error generating content")
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  // Get AI insights
  const getInsights = useCallback(async (request: InsightRequest) => {
    setIsLoadingInsights(true)
    setError(null)
    
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get insights")
      }

      const data = await response.json()
      setInsights(data.insights)
      return data.insights
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error getting insights")
      // Return some default insights as fallback
      const fallbackInsights = getMockInsights()
      setInsights(fallbackInsights)
      return fallbackInsights
    } finally {
      setIsLoadingInsights(false)
    }
  }, [])

  // Reset state
  const reset = useCallback(() => {
    setGeneratedContent(null)
    setInsights([])
    setError(null)
  }, [])

  return {
    isGenerating,
    generatedContent,
    insights,
    isLoadingInsights,
    error,
    serviceStatus,
    generateContent,
    getInsights,
    checkStatus,
    reset,
  }
}

// Mock insights for fallback
function getMockInsights(): InsightItem[] {
  return [
    {
      type: "warning",
      title: "Declining Participation in Chemistry",
      description:
        "Student participation in Chemistry classes has decreased by 15% over the last month. This correlates with the introduction of the new Periodic Table unit.",
      metric: {
        label: "Participation Rate",
        value: "76%",
        trend: "down",
        change: "-15%",
      },
      action: {
        label: "View Detailed Report",
        actionType: "REPORT",
        targetId: "chemistry-participation"
      },
    },
    {
      type: "success",
      title: "Biology Performance Improving",
      description:
        "The interactive lessons on Photosynthesis have resulted in a 12% increase in test scores. Consider applying similar teaching methods to other subjects.",
      metric: {
        label: "Average Score",
        value: "85%",
        trend: "up",
        change: "+12%",
      },
      action: {
        label: "See Teaching Methods",
        actionType: "METHODS",
        targetId: "biology-methods"
      },
    },
    {
      type: "info",
      title: "Student Engagement Pattern",
      description:
        "Data shows higher engagement in morning classes (before 11 AM) compared to afternoon sessions. Consider scheduling more challenging topics earlier in the day.",
      metric: {
        label: "Morning Engagement",
        value: "92%",
        trend: "up",
        change: "+18% vs afternoon",
      },
      action: {
        label: "View Schedule Analysis",
        actionType: "ANALYSIS",
        targetId: "schedule-analysis"
      },
    },
  ]
}
