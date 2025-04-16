"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"
import { getSupabase, type UserProfile } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: "teacher" | "student" | "admin",
  ) => Promise<{
    success: boolean
    error?: string
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean
    error?: string
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    success: boolean
    error?: string
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = getSupabase()

    // Check for active session
    const checkSession = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
          return
        }

        if (data?.session) {
          setSession(data.session)
          setUser(data.session.user)

          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single()

          if (profileError) {
            console.error("Error fetching profile:", profileError)
          } else if (profileData) {
            setProfile(profileData as UserProfile)
            setIsAdmin(profileData.role === "admin")
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      setSession(session)
      setUser(session?.user || null)

      if (session?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        } else if (profileData) {
          setProfile(profileData as UserProfile)
          setIsAdmin(profileData.role === "admin")
        }

        // Redirect based on user role if on login page
        if (pathname === "/" || pathname === "/signup") {
          if (profileData?.role === "admin") {
            router.push("/admin/dashboard")
          } else if (profileData?.role === "teacher") {
            router.push("/teacher/dashboard")
          } else if (profileData?.role === "student") {
            router.push("/student/classes")
          }
        }
      } else if (event === "SIGNED_OUT") {
        setProfile(null)
        setIsAdmin(false)
        // Redirect to login page if signed out
        router.push("/")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, pathname])

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "teacher" | "student" | "admin",
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabase()

      // First check if the email already exists
      const { data: existingUser } = await supabase.from("profiles").select("email").eq("email", email).single()

      if (existingUser) {
        return { success: false, error: "Email already in use" }
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Try to delete the auth user if profile creation fails
          await supabase.auth.admin.deleteUser(data.user.id)
          return { success: false, error: "Failed to create user profile" }
        }

        return { success: true }
      }

      return { success: false, error: "User creation failed" }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Reset password error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
