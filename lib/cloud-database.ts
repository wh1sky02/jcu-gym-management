import { pool } from './database'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import type { 
  User, 
  GymSession, 
  Booking, 
  AdminStats,
  Waitlist
} from './types'

class CloudDatabase {
  constructor() {
    console.log('🌐 Initializing Cloud Database (Neon)...')
    // Removed automatic demo data creation - admin setup is now handled via /api/setup
  }

  private async initializeProductionData() {
    // This method is now empty - admin setup is handled via the setup page
    console.log('Cloud database initialized - admin setup available at /setup')
  }

  // User methods
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Use direct PostgreSQL connection to bypass RLS
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [email]
      )
      
      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0] as User
    } catch (error) {
      console.error('Error fetching user by email:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      // Use direct PostgreSQL connection to bypass RLS
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1 LIMIT 1',
        [id]
      )
      
      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0] as User
    } catch (error) {
      console.error('Error fetching user by id:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  async getUserByStudentId(studentId: string): Promise<User | null> {
    try {
      // Use direct PostgreSQL connection to bypass RLS
      const result = await pool.query(
        'SELECT * FROM users WHERE student_id = $1 LIMIT 1',
        [studentId]
      )
      
      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0] as User
    } catch (error) {
      console.error('Error fetching user by student id:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM users ORDER BY created_at DESC'
      )
      
      return result.rows as User[]
    } catch (error) {
      console.error('Error fetching users:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const userId = userData.id || randomUUID()
      
      const result = await pool.query(`
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, student_id, role,
          membership_type, status, phone, emergency_contact_name, emergency_contact_phone,
          emergency_contact_relationship, approval_date, expiry_date, points, streak,
          total_workouts, payment_status, payment_method, payment_amount, payment_date,
          payment_reference, billing_address, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW(), NOW()
        ) RETURNING *
      `, [
        userId,
        userData.email,
        userData.password_hash || userData.passwordHash,
        userData.first_name || userData.firstName,
        userData.last_name || userData.lastName,
        userData.student_id || userData.studentId,
        userData.role || 'student',
        userData.membership_type || userData.membershipType,
        userData.status || 'pending',
        userData.phone,
        userData.emergency_contact_name || (userData.emergencyContact && userData.emergencyContact.name),
        userData.emergency_contact_phone || (userData.emergencyContact && userData.emergencyContact.phone),
        userData.emergency_contact_relationship || (userData.emergencyContact && userData.emergencyContact.relationship),
        userData.approval_date || userData.approvalDate,
        userData.expiry_date || userData.expiryDate,
        userData.points || 0,
        userData.streak || 0,
        userData.total_workouts || userData.totalWorkouts || 0,
        userData.payment_status || userData.paymentStatus,
        userData.payment_method || userData.paymentMethod,
        userData.payment_amount || userData.paymentAmount || 0,
        userData.payment_date || userData.paymentDate,
        userData.payment_reference || userData.paymentReference,
        userData.billing_address || userData.billingAddress
      ])

      return result.rows[0]
    } catch (error) {
      console.error('Error creating user:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  async updateUser(id: string, updates: any): Promise<any> {
    try {
      // Build dynamic update query
      const updateFields = []
      const values = []
      let paramCount = 1

      for (const [key, value] of Object.entries(updates)) {
        updateFields.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }

      // Always update the updated_at field
      updateFields.push(`updated_at = NOW()`)

      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `
      
      values.push(id)
      
      const result = await pool.query(query, values)
      
      if (result.rows.length === 0) {
        throw new Error('User not found')
      }
      
      console.log(`✅ User updated successfully: ${id}`)
      return result.rows[0]
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Session methods
  async getSessionById(id: string): Promise<GymSession | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM gym_sessions WHERE id = $1 LIMIT 1',
        [id]
      )
      
      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0] as GymSession
    } catch (error) {
      console.error('Error fetching session by id:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  async getAllSessions(): Promise<GymSession[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM gym_sessions WHERE is_active = true ORDER BY date ASC, start_time ASC'
      )
      
      return result.rows as GymSession[]
    } catch (error) {
      console.error('Error fetching all sessions:', error instanceof Error ? error.message : String(error))
      return []
    }
  }



  async getSessionsByDate(date: string): Promise<GymSession[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM gym_sessions WHERE date = $1 AND is_active = true ORDER BY start_time ASC',
        [date]
      )
      
      return result.rows as GymSession[]
    } catch (error) {
      console.error('Error fetching sessions by date:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async createSession(sessionData: any): Promise<any> {
    try {
      const sessionId = sessionData.id || randomUUID()
      
      const query = `
        INSERT INTO gym_sessions (
          id, date, start_time, end_time, capacity, current_bookings, 
          is_active, type, instructor, description, difficulty, price,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        ) RETURNING *
      `
      
      const values = [
        sessionId,
        sessionData.date,
        sessionData.start_time || sessionData.startTime,
        sessionData.end_time || sessionData.endTime,
        sessionData.capacity,
        sessionData.current_bookings || sessionData.currentBookings || 0,
        sessionData.is_active !== undefined ? sessionData.is_active : sessionData.isActive !== undefined ? sessionData.isActive : true,
        sessionData.type || 'general',
        sessionData.instructor || null,
        sessionData.description || null,
        sessionData.difficulty || null,
        sessionData.price || null
      ]
      
      const result = await pool.query(query, values)
      
      console.log(`✅ Session created successfully: ${sessionId}`)
      return result.rows[0]
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  async updateSession(id: string, updates: any): Promise<any> {
    try {
      // Build dynamic update query
      const updateFields = []
      const values = []
      let paramCount = 1

      for (const [key, value] of Object.entries(updates)) {
        updateFields.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }

      // Always update the updated_at field
      updateFields.push(`updated_at = NOW()`)

      const query = `
        UPDATE gym_sessions 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `
      
      values.push(id)
      
      const result = await pool.query(query, values)
      
      if (result.rows.length === 0) {
        throw new Error('Session not found')
      }
      
      console.log(`✅ Session updated successfully: ${id}`)
      return result.rows[0]
    } catch (error) {
      console.error('Error updating session:', error)
      throw error
    }
  }

  // Booking methods
  async createBooking(bookingData: any): Promise<any> {
    try {
      const bookingId = bookingData.id || randomUUID()
      const userId = bookingData.user_id || bookingData.userId
      const sessionId = bookingData.session_id || bookingData.sessionId
      const status = bookingData.status || 'confirmed'
      const bookingDate = bookingData.booking_date || bookingData.bookingDate || new Date().toISOString()
      
      const result = await pool.query(`
        INSERT INTO bookings (
          id, user_id, session_id, status, booking_date, is_recurring, recurring_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        bookingId,
        userId,
        sessionId,
        status,
        bookingDate,
        bookingData.is_recurring || false,
        bookingData.recurring_id || null
      ])

      // Update session booking count
      await this.updateSessionBookingCount(sessionId, 1)

      return result.rows[0]
    } catch (error) {
      console.error('Error creating booking:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const result = await pool.query(`
        SELECT 
          b.*,
          gs.id as session_id,
          gs.date as session_date,
          gs.start_time,
          gs.end_time,
          gs.type,
          gs.instructor,
          gs.description
        FROM bookings b
        LEFT JOIN gym_sessions gs ON b.session_id = gs.id
        WHERE b.user_id = $1
        ORDER BY b.booking_date DESC
      `, [userId])
      
      return result.rows as Booking[]
    } catch (error) {
      console.error('Error fetching user bookings:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      const result = await pool.query(`
        SELECT 
          b.*,
          gs.id as session_id,
          gs.date as session_date,
          gs.start_time,
          gs.end_time,
          gs.type,
          gs.instructor,
          gs.description,
          u.first_name,
          u.last_name,
          u.email,
          u.student_id
        FROM bookings b
        LEFT JOIN gym_sessions gs ON b.session_id = gs.id
        LEFT JOIN users u ON b.user_id = u.id
        ORDER BY b.booking_date DESC
      `)
      
      return result.rows as Booking[]
    } catch (error) {
      console.error('Error fetching all bookings:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async getSessionBookings(sessionId: string): Promise<Booking[]> {
    try {
      const result = await pool.query(`
        SELECT 
          b.*,
          u.id as user_id,
          u.first_name,
          u.last_name,
          u.email
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.session_id = $1
        ORDER BY b.booking_date DESC
      `, [sessionId])
      
      return result.rows as Booking[]
    } catch (error) {
      console.error('Error fetching session bookings:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async updateSessionBookingCount(sessionId: string, increment: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE gym_sessions SET current_bookings = current_bookings + $1 WHERE id = $2',
        [increment, sessionId]
      )
    } catch (error) {
      console.error('Error updating session booking count:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  // Notification methods
  async createNotification(notificationData: any): Promise<any> {
    try {
      const notificationId = notificationData.id || randomUUID()
      
      const query = `
        INSERT INTO notifications (
          id, user_id, title, message, type, priority, action_url, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, NOW()
        ) RETURNING *
      `
      
      const values = [
        notificationId,
        notificationData.user_id || notificationData.userId || null,
        notificationData.title,
        notificationData.message,
        notificationData.type || 'info',
        notificationData.priority || 'normal',
        notificationData.action_url || notificationData.actionUrl || null
      ]
      
      const result = await pool.query(query, values)
      
      console.log(`✅ Notification created successfully: ${notificationId}`)
      return result.rows[0]
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  async getUserNotifications(userId: string): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE user_id = $1 OR user_id IS NULL
        ORDER BY created_at DESC
      `
      
      const result = await pool.query(query, [userId])
      return result.rows
    } catch (error) {
      console.error('Error fetching user notifications:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async getAllNotifications(): Promise<any[]> {
    try {
      const query = `
        SELECT n.*, u.first_name, u.last_name, u.email as user_email
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.id
        ORDER BY n.created_at DESC
      `
      
      const result = await pool.query(query)
      return result.rows.map(row => ({
        ...row,
        user_name: row.user_id ? `${row.first_name} ${row.last_name}` : null
      }))
    } catch (error) {
      console.error('Error fetching all notifications:', error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = true, read_at = NOW() 
        WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)
      `
      
      await pool.query(query, [notificationId, userId])
      console.log(`✅ Notification ${notificationId} marked as read for user ${userId}`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = true, read_at = NOW() 
        WHERE (user_id = $1 OR user_id IS NULL) AND is_read = false
      `
      
      const result = await pool.query(query, [userId])
      console.log(`✅ Marked ${result.rowCount} notifications as read for user ${userId}`)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const query = `
        DELETE FROM notifications 
        WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)
      `
      
      const result = await pool.query(query, [notificationId, userId])
      console.log(`✅ Deleted notification ${notificationId} for user ${userId}`)
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  async deleteAllUserNotifications(userId: string): Promise<void> {
    try {
      const query = `
        DELETE FROM notifications 
        WHERE user_id = $1 OR user_id IS NULL
      `
      
      const result = await pool.query(query, [userId])
      console.log(`✅ Deleted ${result.rowCount} notifications for user ${userId}`)
    } catch (error) {
      console.error('Error deleting all notifications:', error)
      throw error
    }
  }

  // Direct database query methods
  async executeQuery(query: string, params?: any[]) {
    try {
      const result = await pool.query(query, params)
      return result.rows
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  async getSessionStats(sessionId: string) {
    const query = `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        COUNT(CASE WHEN status = 'no-show' THEN 1 END) as no_show_bookings,
        AVG(rating) as average_rating
      FROM bookings
      WHERE session_id = $1
    `
    return this.executeQuery(query, [sessionId])
  }

  async getUserStats(userId: string) {
    const query = `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_workouts,
        u.streak as current_streak,
        u.points as total_points
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.id = $1
      GROUP BY u.streak, u.points
    `
    return this.executeQuery(query, [userId])
  }

  async getPopularTimeSlots() {
    const query = `
      SELECT 
        gs.start_time,
        COUNT(b.id) as booking_count
      FROM gym_sessions gs
      LEFT JOIN bookings b ON gs.id = b.session_id
      WHERE b.status = 'confirmed'
      GROUP BY gs.start_time
      ORDER BY booking_count DESC
      LIMIT 5
    `
    return this.executeQuery(query)
  }

  async getMembershipDistribution() {
    const query = `
      SELECT 
        membership_type,
        COUNT(*) as count
      FROM users
      WHERE role = 'student'
      GROUP BY membership_type
      ORDER BY count DESC
    `
    return this.executeQuery(query)
  }

  async getRevenueStats() {
    const query = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as total_revenue,
        COUNT(*) as transaction_count
      FROM billing_transactions
      WHERE status = 'completed'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `
    return this.executeQuery(query)
  }

  // Override getAdminStats to use direct queries
  async getAdminStats(): Promise<any> {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      todayBookings,
      popularTimeSlots,
      membershipDistribution,
      revenueStats
    ] = await Promise.all([
      this.executeQuery('SELECT COUNT(*) as count FROM users WHERE role != $1', ['admin']),
      this.executeQuery('SELECT COUNT(*) as count FROM users WHERE status = $1 AND role != $2', ['approved', 'admin']),
      this.executeQuery('SELECT COUNT(*) as count FROM users WHERE status = $1', ['pending']),
      this.executeQuery('SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURRENT_DATE'),
      this.getPopularTimeSlots(),
      this.getMembershipDistribution(),
      this.getRevenueStats()
    ])

    // Calculate weekly attendance
    const weeklyAttendance = await this.executeQuery(`
      SELECT COUNT(*) as count
      FROM bookings b
      JOIN gym_sessions s ON b.session_id = s.id
      WHERE s.date >= CURRENT_DATE - INTERVAL '7 days'
      AND s.date <= CURRENT_DATE
      AND b.status = 'completed'
    `)

    // Calculate no-show rate
    const noShowStats = await this.executeQuery(`
      SELECT 
        COUNT(CASE WHEN status = 'no-show' THEN 1 END)::float / COUNT(*)::float * 100 as no_show_rate
      FROM bookings
      WHERE status IN ('completed', 'no-show')
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    `)

    return {
      totalUsers: totalUsers[0].count,
      activeUsers: activeUsers[0].count,
      pendingApprovals: pendingUsers[0].count,
      todayBookings: todayBookings[0].count,
      weeklyAttendance: weeklyAttendance[0].count,
      noShowRate: parseFloat(noShowStats[0].no_show_rate || '0'),
      popularTimeSlots,
      revenue: {
        monthly: revenueStats[0]?.total_revenue || 0,
        yearly: revenueStats.reduce((acc: number, curr: any) => acc + parseFloat(curr.total_revenue), 0),
        breakdown: revenueStats
      },
      peakHours: popularTimeSlots.map((slot: any) => ({
        hour: new Date('1970-01-01T' + slot.start_time).getHours(),
        utilization: (slot.booking_count / 10) * 100 // Assuming max capacity of 10
      })),
      membershipDistribution
    }
  }

  // Singleton pattern
  getInstance() {
    return this
  }

  async approveUser(userId: string, action: 'approve' | 'reject'): Promise<void> {
    try {
      const status = action === 'approve' ? 'approved' : 'suspended'
      const approvalDate = action === 'approve' ? new Date().toISOString() : null
      
      // Use direct PostgreSQL query to bypass RLS
      const query = `
        UPDATE users 
        SET status = $1, approval_date = $2, updated_at = NOW()
        WHERE id = $3
      `
      
      await pool.query(query, [status, approvalDate, userId])
      
      console.log(`✅ User ${userId} ${action}d successfully`)
    } catch (error) {
      console.error('Error approving user:', error)
      throw error
    }
  }
}

// Singleton instance
let instance: CloudDatabase | null = null

export function getCloudDatabase(): CloudDatabase {
  if (!instance) {
    instance = new CloudDatabase()
  }
  return instance
}

export default getCloudDatabase 