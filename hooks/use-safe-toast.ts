"use client"

import { useRef } from "react"
import { useToast as useToastOriginal } from "@/components/ui/toast-provider"

type ToastType = "success" | "error" | "info" | "warning"

// Create a fallback toast object
const fallbackToast = {
  toasts: [],
  addToast: (message: string) => {
    console.log("Toast (fallback):", message)
  },
  removeToast: () => {},
  updateToast: () => {},
}

export function useSafeToast() {
  // Call useToast at the top level, outside of any conditions or callbacks
  let toast

  // Initialize toast outside the try-catch block
  try {
    toast = useToastOriginal()
  } catch (error) {
    toast = fallbackToast
  }

  // Create a ref to prevent issues with stale closures
  const toastRef = useRef(toast)
  toastRef.current = toast

  // Create a safe wrapper around addToast
  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    try {
      toastRef.current.addToast(message, type, duration)
    } catch (error) {
      console.log("Toast (fallback):", message)
    }
  }

  // Create a safe wrapper around updateToast
  const updateToast = (id: string, message: string, type: ToastType = "info", duration = 5000) => {
    try {
      if (typeof toastRef.current.updateToast === "function") {
        toastRef.current.updateToast({ id, message, type, duration })
      }
    } catch (error) {
      console.log("Failed to update toast:", id)
    }
  }

  // Create a safe wrapper around removeToast
  const removeToast = (id: string) => {
    try {
      toastRef.current.removeToast(id)
    } catch (error) {
      console.log("Failed to remove toast:", id)
    }
  }

  return {
    toasts: toastRef.current.toasts,
    addToast,
    removeToast,
    updateToast,
  }
}
