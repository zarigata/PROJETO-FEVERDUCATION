"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { X } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  const bgColors = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  }

  const textColors = {
    success: "text-green-800 dark:text-green-200",
    error: "text-red-800 dark:text-red-200",
    warning: "text-yellow-800 dark:text-yellow-200",
    info: "text-blue-800 dark:text-blue-200",
  }

  return (
    <div className={`rounded-lg border p-4 shadow-md animate-slide-up ${bgColors[toast.type]}`} role="alert">
      <div className="flex items-start">
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColors[toast.type]}`}>{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full ${textColors[toast.type]} hover:bg-white/20 focus:outline-none`}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}
