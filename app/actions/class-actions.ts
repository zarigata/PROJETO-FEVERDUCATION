"use server"

import { getSupabaseAdmin } from "@/lib/supabase"

export async function createClass(data: {
  title: string
  description: string
  grade: string
  teacherId: string
  currentTopic?: string
}) {
  try {
    const supabase = getSupabaseAdmin()

    const { data: newClass, error } = await supabase
      .from("classes")
      .insert([
        {
          title: data.title,
          description: data.description,
          grade: data.grade,
          teacher_id: data.teacherId,
          current_topic: data.currentTopic || "",
          progress: 0,
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: newClass }
  } catch (error) {
    console.error("Error creating class:", error)
    return { success: false, error: "Failed to create class" }
  }
}

export async function getClasses(teacherId: string) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching classes:", error)
    return { success: false, error: "Failed to fetch classes" }
  }
}

export async function updateClass(
  id: number,
  data: {
    title?: string
    description?: string
    grade?: string
    progress?: number
    currentTopic?: string
    status?: "active" | "archived" | "draft"
  },
) {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from("classes")
      .update({
        title: data.title,
        description: data.description,
        grade: data.grade,
        progress: data.progress,
        current_topic: data.currentTopic,
        status: data.status,
      })
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating class:", error)
    return { success: false, error: "Failed to update class" }
  }
}

export async function deleteClass(id: number) {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from("classes").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting class:", error)
    return { success: false, error: "Failed to delete class" }
  }
}
