import { NextRequest, NextResponse } from "next/server"
import { getDatabaseAdapter } from "@/lib/database-adapter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const userId = searchParams.get('userId')

    const db = getDatabaseAdapter()

    let query = `
      SELECT 
        b.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        s.date as session_date,
        s.start_time,
        s.end_time,
        s.type as session_type,
        s.instructor,
        s.description as session_description
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN gym_sessions s ON b.session_id = s.id
      WHERE u.role != 'admin'
    `

    const params = []
    if (status) {
      query += ' AND b.status = ?'
      params.push(status)
    }
    if (date) {
      query += ' AND s.date = ?'
      params.push(date)
    }
    if (userId) {
      query += ' AND b.user_id = ?'
      params.push(userId)
    }

    query += ' ORDER BY s.date DESC, s.start_time DESC'

    // Use the cloud database method to get all bookings with filters
    const allBookings = await db.getAllBookings()
    
    // Filter the results based on the parameters
    let filteredBookings = allBookings
    
    if (status) {
      filteredBookings = filteredBookings.filter((booking: any) => booking.status === status)
    }
    if (userId) {
      filteredBookings = filteredBookings.filter((booking: any) => booking.user_id === userId)
    }
    
    const bookings = filteredBookings.map((booking: any) => ({
      id: booking.id,
      userId: booking.user_id,
      sessionId: booking.session_id,
      status: booking.status,
      bookingDate: booking.booking_date,
      checkInTime: booking.check_in_time,
      checkOutTime: booking.check_out_time,
      notes: booking.notes,
      rating: booking.rating,
      feedback: booking.feedback,
      user: {
        name: `${booking.first_name} ${booking.last_name}`,
        email: booking.email,
        studentId: booking.student_id
      },
      session: {
        date: booking.session_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        type: booking.type,
        instructor: booking.instructor,
        description: booking.description
      }
    }))

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { bookingId, updates } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      )
    }

    const db = getDatabaseAdapter()

    const updateFields = []
    const params = []

    if (updates.status !== undefined) {
      updateFields.push('status = ?')
      params.push(updates.status)
    }
    if (updates.checkInTime !== undefined) {
      updateFields.push('check_in_time = ?')
      params.push(updates.checkInTime)
    }
    if (updates.checkOutTime !== undefined) {
      updateFields.push('check_out_time = ?')
      params.push(updates.checkOutTime)
    }
    if (updates.notes !== undefined) {
      updateFields.push('notes = ?')
      params.push(updates.notes)
    }
    if (updates.rating !== undefined) {
      updateFields.push('rating = ?')
      params.push(updates.rating)
    }
    if (updates.feedback !== undefined) {
      updateFields.push('feedback = ?')
      params.push(updates.feedback)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 }
      )
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    params.push(bookingId)

    const stmt = (db as any).db.prepare(`
      UPDATE bookings 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `)

    stmt.run(...params)

    // If cancelling a booking, update session capacity
    if (updates.status === 'cancelled') {
      const bookingStmt = (db as any).db.prepare('SELECT session_id FROM bookings WHERE id = ?')
      const booking = bookingStmt.get(bookingId)
      
      if (booking) {
        const sessionStmt = (db as any).db.prepare(`
          UPDATE gym_sessions 
          SET current_bookings = current_bookings - 1
          WHERE id = ?
        `)
        sessionStmt.run(booking.session_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
} 