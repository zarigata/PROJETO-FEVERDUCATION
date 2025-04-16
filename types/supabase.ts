export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      performance_data: {
        Row: {
          id: number
          month: string
          score: number
          attendance: number
          participation: number
          created_at: string
        }
        Insert: {
          id?: number
          month: string
          score: number
          attendance: number
          participation: number
          created_at?: string
        }
        Update: {
          id?: number
          month?: string
          score?: number
          attendance?: number
          participation?: number
          created_at?: string
        }
      }
      subject_data: {
        Row: {
          id: number
          name: string
          students: number
          avg_score: number
          color: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          students: number
          avg_score: number
          color: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          students?: number
          avg_score?: number
          color?: string
          created_at?: string
        }
      }
      class_distribution: {
        Row: {
          id: number
          name: string
          value: number
          color: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          value: number
          color: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          value?: number
          color?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: "teacher" | "student" | "admin"
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: "teacher" | "student" | "admin"
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: "teacher" | "student" | "admin"
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: number
          title: string
          description: string
          grade: string
          teacher_id: string
          progress: number
          current_topic: string
          created_at: string
          status: "active" | "archived" | "draft"
        }
        Insert: {
          id?: number
          title: string
          description: string
          grade: string
          teacher_id: string
          progress?: number
          current_topic?: string
          created_at?: string
          status?: "active" | "archived" | "draft"
        }
        Update: {
          id?: number
          title?: string
          description?: string
          grade?: string
          teacher_id?: string
          progress?: number
          current_topic?: string
          created_at?: string
          status?: "active" | "archived" | "draft"
        }
      }
      students: {
        Row: {
          id: number
          user_id: string
          class_ids: number[]
          performance: number
          last_active: string
          status: "active" | "inactive" | "at-risk"
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          class_ids?: number[]
          performance?: number
          last_active?: string
          status?: "active" | "inactive" | "at-risk"
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          class_ids?: number[]
          performance?: number
          last_active?: string
          status?: "active" | "inactive" | "at-risk"
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
