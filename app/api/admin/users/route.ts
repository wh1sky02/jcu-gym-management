import { NextRequest, NextResponse } from "next/server"
import { getDatabaseAdapter } from "@/lib/database-adapter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    // Get all users from database using the correct method
    const db = getDatabaseAdapter()
          const allUsers = await db.getAllUsers()
    
    // Filter users based on query parameters and exclude admin users
    let filteredUsers = allUsers.filter((user: any) => user.role !== 'admin')
    
    if (status) {
      filteredUsers = filteredUsers.filter((user: any) => user.status === status)
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter((user: any) => user.role === role)
    }
    
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredUsers = filteredUsers.filter((user: any) => 
        user.first_name?.toLowerCase().includes(searchTerm) ||
        user.last_name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm)
      )
    }

    // Map users to frontend format
    const users = filteredUsers.map((user: any) => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      student_id: user.student_id,
      role: user.role,
      membership_type: user.membership_type,
      status: user.status,
      phone: user.phone,
      created_at: user.created_at,
      approval_date: user.approval_date,
      expiry_date: user.expiry_date,
      points: user.points || 0,
      streak: user.streak || 0,
      total_workouts: user.total_workouts || 0,
      payment_status: user.payment_status,
      payment_method: user.payment_method,
      payment_amount: user.payment_amount || 0,
      emergency_contact_name: user.emergency_contact_name,
      emergency_contact_phone: user.emergency_contact_phone,
      emergency_contact_relationship: user.emergency_contact_relationship
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, updates } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = getDatabaseAdapter()

    // Update user in database
    const updateFields = []
    const params = []

    if (updates.status !== undefined) {
      updateFields.push('status = ?')
      params.push(updates.status)
    }
    if (updates.role !== undefined) {
      updateFields.push('role = ?')
      params.push(updates.role)
    }
    if (updates.membershipType !== undefined) {
      updateFields.push('membership_type = ?')
      params.push(updates.membershipType)
    }
    if (updates.points !== undefined) {
      updateFields.push('points = ?')
      params.push(updates.points)
    }
    if (updates.suspensionCount !== undefined) {
      updateFields.push('suspension_count = ?')
      params.push(updates.suspensionCount)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 }
      )
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')

    // Use cloud database method with proper parameter indexing
    const paramIndexes = updateFields.map((_, index) => `$${index + 1}`).join(', ')
    const finalQuery = `UPDATE users SET ${updateFields.map((field, index) => field.replace('?', `$${index + 1}`)).join(', ')} WHERE id = $${updateFields.length + 1}`
    
    params.push(userId)
    await db.executeQuery(finalQuery, params)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = getDatabaseAdapter()

    // Delete user from database (this will cascade to related records)
    await db.executeQuery('DELETE FROM users WHERE id = $1', [userId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
} 