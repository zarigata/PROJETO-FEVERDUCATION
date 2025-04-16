import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Type definitions for our database tables
export type PerformanceData = {
  id: number
  month: string
  score: number
  attendance: number
  participation: number
  created_at: string
}

export type SubjectData = {
  id: number
  name: string
  students: number
  avg_score: number
  color: string
  created_at: string
}

export type ClassDistributionData = {
  id: number
  name: string
  value: number
  color: string
  created_at: string
}

// User profile type
export type UserProfile = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: "teacher" | "student" | "admin"
  created_at: string
}

// Create a single instance of the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return supabaseInstance
}

// Server-side client with higher privileges
export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Create a browser client specifically for auth
export const createBrowserSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}
