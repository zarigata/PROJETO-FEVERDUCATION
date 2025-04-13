"use client"

/**
 * /////////////////////////////////////////////////////////////////////////////
 * //                                                                         //
 * //  [FEVERDUCATION] - AI Insights Component                                //
 * //  ---------------------------------------------------------------        //
 * //  This component connects to our AI backend to generate educational      //
 * //  insights about student performance and teaching effectiveness.         //
 * //                                                                         //
 * //  CODEX LEVEL: ALPHA-7                                                   //
 * //  VERSION: 1.0.0                                                         //
 * //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
 * //                                                                         //
 * /////////////////////////////////////////////////////////////////////////////
 */

import { useState } from "react"
import { Sparkles, X, AlertTriangle, TrendingUp, TrendingDown, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAI, InsightItem } from "@/hooks/use-ai"
import { cn } from "@/lib/utils"

export function AIInsights() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Use our AI hook for insights generation
  const { 
    insights, 
    isLoadingInsights, 
    error, 
    getInsights 
  } = useAI()
  
  const generateInsights = async () => {
    // For demo purposes, we'll use a fixed teacher ID. In a real app, this would come from auth context
    const teacherId = "00000000-0000-0000-0000-000000000001"
    
    const fetchedInsights = await getInsights({
      teacherId,
      timeframe: "month",
      types: ["performance", "engagement", "attendance", "improvement"]
    })
    
    if (fetchedInsights?.length > 0) {
      setIsOpen(true)
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getTypeIcon = (type: "success" | "warning" | "info") => {
    if (type === "success") return <TrendingUp className="h-5 w-5 text-green-500" />
    if (type === "warning") return <AlertTriangle className="h-5 w-5 text-amber-500" />
    if (type === "info") return <Lightbulb className="h-5 w-5 text-blue-500" />
    return null
  }

  const getTypeBadge = (type: "success" | "warning" | "info") => {
    if (type === "success") return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500 text-white">Positive Trend</span>
    if (type === "warning") return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white">Needs Attention</span>
    if (type === "info") return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500 text-white">Insight</span>
    return null
  }

  /**
   * /////////////////////////////////////////////////////////
   * // Handle action click based on actionType and targetId //
   * /////////////////////////////////////////////////////////
   */
  const handleActionClick = (actionType: string, targetId: string) => {
    console.log(`Action triggered: ${actionType} for target ${targetId}`)
    // In a real application, this would navigate or open detailed views
  }

  return (
    <div className="relative">
      <Button onClick={generateInsights} disabled={isLoadingInsights} className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
        {isLoadingInsights ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Analyzing Data...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4 transition-all group-hover:rotate-12" />
            AI Insights
          </>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 z-50 w-full max-w-md animate-in fade-in slide-in-from-top-5 md:max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Analysis of your teaching data and student performance</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getTypeIcon(insight.type)}</div>
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                    <div>{getTypeBadge(insight.type)}</div>
                  </div>

                  {insight.metric && (
                    <div className="mt-3 rounded-md bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{insight.metric.label}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{insight.metric.value}</span>
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(insight.metric.trend)}
                            <span
                              className={`text-xs ${
                                insight.metric.trend === "up"
                                  ? "text-green-500"
                                  : insight.metric.trend === "down"
                                    ? "text-red-500"
                                    : ""
                              }`}
                            >
                              {insight.metric.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {insight.action && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(insight.action!.actionType, insight.action!.targetId)}
                        className="w-full justify-center"
                      >
                        {insight.action.label}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  <p className="font-medium">Error retrieving insights</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {insights.length === 0 && !isLoadingInsights && !error && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-700">
                  <p className="font-medium">No insights available</p>
                  <p className="text-sm">Try adjusting your filters or check back later for new insights.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
