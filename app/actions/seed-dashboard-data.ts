"use server"

import { getSupabaseAdmin } from "@/lib/supabase"

export async function seedDashboardData() {
  const supabase = getSupabaseAdmin()

  try {
    // Create tables if they don't exist
    await supabase.rpc("create_dashboard_tables")

    // Check if data already exists
    const { count: performanceCount } = await supabase
      .from("performance_data")
      .select("*", { count: "exact", head: true })

    // Only seed if no data exists
    if (performanceCount === 0) {
      // Seed performance data
      await supabase.from("performance_data").insert([
        { month: "Jan", score: 75, attendance: 92, participation: 68 },
        { month: "Feb", score: 82, attendance: 89, participation: 75 },
        { month: "Mar", score: 78, attendance: 94, participation: 72 },
        { month: "Apr", score: 85, attendance: 91, participation: 80 },
        { month: "May", score: 88, attendance: 95, participation: 85 },
        { month: "Jun", score: 92, attendance: 97, participation: 90 },
      ])

      // Seed subject data
      await supabase.from("subject_data").insert([
        { name: "Biology", students: 32, avg_score: 85, color: "#8b5cf6" },
        { name: "Chemistry", students: 28, avg_score: 78, color: "#06b6d4" },
        { name: "Physics", students: 24, avg_score: 82, color: "#f97316" },
        { name: "Mathematics", students: 30, avg_score: 76, color: "#10b981" },
      ])

      // Seed class distribution data
      await supabase.from("class_distribution").insert([
        { name: "Science", value: 5, color: "#8b5cf6" },
        { name: "Math", value: 4, color: "#06b6d4" },
        { name: "Language", value: 3, color: "#f97316" },
        { name: "History", value: 2, color: "#10b981" },
      ])

      return { success: true, message: "Dashboard data seeded successfully" }
    }

    return { success: true, message: "Data already exists, skipping seed" }
  } catch (error) {
    console.error("Error seeding dashboard data:", error)
    return { success: false, message: "Failed to seed dashboard data", error }
  }
}
