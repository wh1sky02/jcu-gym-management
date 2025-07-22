import { Pool } from 'pg'

// Direct database connection for server-side operations
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
      }
      // Add other table types here
    }
  }
} 