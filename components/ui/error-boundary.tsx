"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorType: "minimal" | "medium" | "critical"
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorType: "minimal",
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Determine error severity based on error type or message
    let errorType: "minimal" | "medium" | "critical" = "minimal"

    if (error.name === "TypeError" || error.name === "SyntaxError") {
      errorType = "medium"
    }

    if (
      error.name === "ReferenceError" ||
      error.message.includes("undefined") ||
      error.message.includes("null") ||
      error.message.toLowerCase().includes("fatal")
    ) {
      errorType = "critical"
    }

    this.setState({ errorInfo, errorType })

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    } else {
      console.error("Uncaught error:", error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Different UI based on error severity
      switch (this.state.errorType) {
        case "minimal":
          return (
            <Card className="p-6 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Something went wrong</h3>
                  <p className="text-muted-foreground">We've encountered a minor issue</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>
            </Card>
          )

        case "medium":
          return (
            <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                We encountered an error while processing your request. Please try again or refresh the page.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button onClick={this.handleReload}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
                </Button>
              </div>
            </div>
          )

        case "critical":
        default:
          return (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-3xl font-semibold mb-2">Critical Error</h2>
              <p className="text-muted-foreground mb-2 max-w-md">
                We encountered a serious problem that prevents this page from functioning correctly.
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Error: {this.state.error?.message || "Unknown error"}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Go to Home
                  </Link>
                </Button>
                <Button onClick={this.handleReload}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
                </Button>
              </div>
            </div>
          )
      }
    }

    return this.props.children
  }
}
