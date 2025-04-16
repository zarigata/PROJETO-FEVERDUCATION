"use client"

import { useEffect, useState } from "react"
import { getSupabase, type PerformanceData, type SubjectData, type ClassDistributionData } from "@/lib/supabase"
import { seedDashboardData } from "@/app/actions/seed-dashboard-data"

export function useDashboardData() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [subjectData, setSubjectData] = useState<SubjectData[]>([])
  const [classDistributionData, setClassDistributionData] = useState<ClassDistributionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const supabase = getSupabase()

        // Check if we need to seed data
        const { count: performanceCount } = await supabase
          .from("performance_data")
          .select("*", { count: "exact", head: true })

        if (performanceCount === 0) {
          await seedDashboardData()
        }

        // Fetch performance data
        const { data: performanceResult, error: performanceError } = await supabase
          .from("performance_data")
          .select("*")
          .order("id", { ascending: true })

        if (performanceError) throw new Error(`Error fetching performance data: ${performanceError.message}`)

        // Fetch subject data
        const { data: subjectResult, error: subjectError } = await supabase
          .from("subject_data")
          .select("*")
          .order("id", { ascending: true })

        if (subjectError) throw new Error(`Error fetching subject data: ${subjectError.message}`)

        // Fetch class distribution data
        const { data: distributionResult, error: distributionError } = await supabase
          .from("class_distribution")
          .select("*")
          .order("id", { ascending: true })

        if (distributionError) throw new Error(`Error fetching class distribution data: ${distributionError.message}`)

        // Transform data to match component expectations
        const transformedPerformanceData = performanceResult.map((item) => ({
          ...item,
          score: Number(item.score),
          attendance: Number(item.attendance),
          participation: Number(item.participation),
        }))

        const transformedSubjectData = subjectResult.map((item) => ({
          ...item,
          avg_score: Number(item.avg_score),
          students: Number(item.students),
        }))

        const transformedDistributionData = distributionResult.map((item) => ({
          ...item,
          value: Number(item.value),
        }))

        setPerformanceData(transformedPerformanceData)
        setSubjectData(transformedSubjectData)
        setClassDistributionData(transformedDistributionData)
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscriptions
    const supabase = getSupabase()

    const performanceSubscription = supabase
      .channel("performance-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "performance_data",
        },
        (payload) => {
          console.log("Performance data changed:", payload)
          // Refresh all data when changes occur
          fetchData()
        },
      )
      .subscribe()

    const subjectSubscription = supabase
      .channel("subject-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subject_data",
        },
        () => {
          fetchData()
        },
      )
      .subscribe()

    const distributionSubscription = supabase
      .channel("distribution-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "class_distribution",
        },
        () => {
          fetchData()
        },
      )
      .subscribe()

    // Clean up subscriptions
    return () => {
      performanceSubscription.unsubscribe()
      subjectSubscription.unsubscribe()
      distributionSubscription.unsubscribe()
    }
  }, [])

  return {
    performanceData,
    subjectData,
    classDistributionData,
    loading,
    error,
    // Helper function to map data for charts
    getChartData: () => {
      return {
        performanceData: performanceData.map((item) => ({
          month: item.month,
          score: item.score,
          attendance: item.attendance,
          participation: item.participation,
        })),
        subjectData: subjectData.map((item) => ({
          name: item.name,
          students: item.students,
          avgScore: item.avg_score,
          color: item.color,
        })),
        classDistributionData: classDistributionData.map((item) => ({
          name: item.name,
          value: item.value,
          color: item.color,
        })),
      }
    },
  }
}
