import type React from "react"
type ErrorSeverity = "minimal" | "medium" | "critical"

interface ErrorLogData {
  error: Error
  info?: React.ErrorInfo
  severity: ErrorSeverity
  context?: string
  user?: string
  metadata?: Record<string, any>
}

export class ErrorLogger {
  static logError(data: ErrorLogData): void {
    try {
      const { error, info, severity, context, user, metadata } = data

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.group(`Error: ${severity?.toUpperCase() || "UNKNOWN"}`)
        console.error("Error:", error)
        if (info) console.error("Component Stack:", info.componentStack)
        console.log("Context:", context || "Unknown")
        console.log("User:", user || "Unknown")
        console.log("Metadata:", metadata || {})
        console.groupEnd()
      }

      // In production, you would send this to your error tracking service
      if (process.env.NODE_ENV === "production") {
        this.sendToErrorService({
          message: error?.message || "Unknown error",
          stack: error?.stack || "",
          componentStack: info?.componentStack || "",
          severity: severity || "critical",
          context: context || "Unknown",
          user: user || "Unknown",
          metadata: metadata || {},
          timestamp: new Date().toISOString(),
        })
      }

      // For critical errors, you might want to show a user-friendly error UI
      if (severity === "critical") {
        // Could trigger a global error state or redirect
      }
    } catch (err) {
      // Last resort error handling
      console.error("Error in ErrorLogger:", err)
      console.error("Original error:", data?.error || "Unknown")
    }
  }

  private static sendToErrorService(errorData: any): void {
    // This would be implemented to send to your error tracking service
    // Example with fetch:
    /*
    fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    }).catch(err => {
      console.error('Failed to send error to tracking service:', err);
    });
    */

    // For now, just log that we would send this
    console.log("Would send to error tracking service:", errorData)
  }

  static handleGlobalErrors(): void {
    // Set up global error handlers
    if (typeof window !== "undefined") {
      window.onerror = (message, source, lineno, colno, error) => {
        this.logError({
          error: error || new Error(String(message)),
          severity: "critical",
          context: "Global",
          metadata: { source, lineno, colno },
        })

        // Return true to prevent the default browser error handler
        return true
      }

      window.addEventListener("unhandledrejection", (event) => {
        this.logError({
          error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          severity: "critical",
          context: "UnhandledPromiseRejection",
        })
      })
    }
  }
}

// Initialize global error handlers
if (typeof window !== "undefined") {
  ErrorLogger.handleGlobalErrors()
}
