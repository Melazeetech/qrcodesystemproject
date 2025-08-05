import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          matric_number: string
          first_name: string
          last_name: string
          email: string
          department: string
          level: string
          phone_number: string
          created_at: string
        }
        Insert: {
          id?: string
          matric_number: string
          first_name: string
          last_name: string
          email: string
          department: string
          level: string
          phone_number: string
          created_at?: string
        }
        Update: {
          id?: string
          matric_number?: string
          first_name?: string
          last_name?: string
          email?: string
          department?: string
          level?: string
          phone_number?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          code: string
          title: string
          credit_unit: number
          lecturer: string
          department: string
          level: string
          semester: string
          session: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          credit_unit: number
          lecturer: string
          department: string
          level: string
          semester: string
          session: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          credit_unit?: number
          lecturer?: string
          department?: string
          level?: string
          semester?: string
          session?: string
          created_at?: string
        }
      }
      attendance_sessions: {
        Row: {
          id: string
          course_id: string
          week: number
          date: string
          start_time: string
          end_time: string
          qr_code: string
          is_active: boolean
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          week: number
          date: string
          start_time: string
          end_time: string
          qr_code: string
          is_active?: boolean
          location?: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          week?: number
          date?: string
          start_time?: string
          end_time?: string
          qr_code?: string
          is_active?: boolean
          location?: string
          created_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          session_id: string
          student_id: string
          matric_number: string
          marked_at: string
          status: string
          location: string
        }
        Insert: {
          id?: string
          session_id: string
          student_id: string
          matric_number: string
          marked_at: string
          status: string
          location?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          matric_number?: string
          marked_at?: string
          status?: string
          location?: string
        }
      }
    }
  }
}