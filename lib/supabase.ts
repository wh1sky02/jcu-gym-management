import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

const supabaseUrl = 'https://trujadxwiwawipjkbduc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Direct database connection for server-side operations
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ko20l6ckCcOppeYM@db.trujadxwiwawipjkbduc.supabase.co:5432/postgres',
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          student_id: string
          role: 'student' | 'admin'
          membership_type: 'basic' | 'premium' | '1-trimester' | '3-trimester' | '1-year'
          status: 'pending' | 'approved' | 'suspended' | 'expired'
          phone: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          created_at: string
          updated_at: string
          approval_date: string | null
          expiry_date: string | null
          points: number
          streak: number
          total_workouts: number
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_reference: string | null
          billing_address: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          student_id: string
          role?: 'student' | 'admin'
          membership_type?: 'basic' | 'premium' | '1-trimester' | '3-trimester' | '1-year'
          status?: 'pending' | 'approved' | 'suspended' | 'expired'
          phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          created_at?: string
          updated_at?: string
          approval_date?: string | null
          expiry_date?: string | null
          points?: number
          streak?: number
          total_workouts?: number
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          billing_address?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          student_id?: string
          role?: 'student' | 'admin'
          membership_type?: 'basic' | 'premium' | '1-trimester' | '3-trimester' | '1-year'
          status?: 'pending' | 'approved' | 'suspended' | 'expired'
          phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          created_at?: string
          updated_at?: string
          approval_date?: string | null
          expiry_date?: string | null
          points?: number
          streak?: number
          total_workouts?: number
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          billing_address?: string | null
        }
      }
      gym_sessions: {
        Row: {
          id: string
          date: string
          start_time: string
          end_time: string
          capacity: number
          current_bookings: number
          is_active: boolean
          type: string
          instructor: string | null
          description: string | null
          difficulty: string | null
          waitlist_count: number
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time: string
          end_time: string
          capacity: number
          current_bookings?: number
          is_active?: boolean
          type?: string
          instructor?: string | null
          description?: string | null
          difficulty?: string | null
          waitlist_count?: number
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string
          end_time?: string
          capacity?: number
          current_bookings?: number
          is_active?: boolean
          type?: string
          instructor?: string | null
          description?: string | null
          difficulty?: string | null
          waitlist_count?: number
          price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          session_id: string
          status: 'confirmed' | 'cancelled' | 'no-show' | 'completed'
          booking_date: string
          check_in_time: string | null
          check_out_time: string | null
          notes: string | null
          rating: number | null
          feedback: string | null
          is_recurring: boolean
          recurring_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          status?: 'confirmed' | 'cancelled' | 'no-show' | 'completed'
          booking_date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          notes?: string | null
          rating?: number | null
          feedback?: string | null
          is_recurring?: boolean
          recurring_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          status?: 'confirmed' | 'cancelled' | 'no-show' | 'completed'
          booking_date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          notes?: string | null
          rating?: number | null
          feedback?: string | null
          is_recurring?: boolean
          recurring_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          action_url: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'announcement'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          action_url?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'announcement'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          action_url?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      billing_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          description: string | null
          transaction_type: 'payment' | 'refund' | 'adjustment'
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          payment_method: string | null
          payment_reference: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          description?: string | null
          transaction_type: 'payment' | 'refund' | 'adjustment'
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          payment_method?: string | null
          payment_reference?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          description?: string | null
          transaction_type?: 'payment' | 'refund' | 'adjustment'
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          payment_method?: string | null
          payment_reference?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
  }
} 