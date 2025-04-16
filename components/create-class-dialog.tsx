"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClass } from "@/app/actions/class-actions"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreateClassDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateClassDialog({ isOpen, onClose, onSuccess }: CreateClassDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    grade: "",
    currentTopic: "",
  })
  const { user } = useAuth()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const result = await createClass({
        title: formData.title,
        description: formData.description,
        grade: formData.grade,
        teacherId: user.id,
        currentTopic: formData.currentTopic,
      })

      if (result.success) {
        toast({
          title: "Class created",
          description: "Your new class has been created successfully",
          variant: "success",
        })
        onSuccess?.()
        onClose()
        // Reset form
        setFormData({
          title: "",
          description: "",
          grade: "",
          currentTopic: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create class",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating class:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>Fill in the details to create a new class</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Class Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Biology 101"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the class"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={formData.grade} onValueChange={(value) => handleSelectChange("grade", value)} required>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Elementary - 3rd Grade">Elementary - 3rd Grade</SelectItem>
                  <SelectItem value="Elementary - 4th Grade">Elementary - 4th Grade</SelectItem>
                  <SelectItem value="Elementary - 5th Grade">Elementary - 5th Grade</SelectItem>
                  <SelectItem value="Middle School - 6th Grade">Middle School - 6th Grade</SelectItem>
                  <SelectItem value="Middle School - 7th Grade">Middle School - 7th Grade</SelectItem>
                  <SelectItem value="Middle School - 8th Grade">Middle School - 8th Grade</SelectItem>
                  <SelectItem value="High School - 9th Grade">High School - 9th Grade</SelectItem>
                  <SelectItem value="High School - 10th Grade">High School - 10th Grade</SelectItem>
                  <SelectItem value="High School - 11th Grade">High School - 11th Grade</SelectItem>
                  <SelectItem value="High School - 12th Grade">High School - 12th Grade</SelectItem>
                  <SelectItem value="College">College</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentTopic">Current Topic (Optional)</Label>
              <Input
                id="currentTopic"
                name="currentTopic"
                placeholder="e.g., Photosynthesis"
                value={formData.currentTopic}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
