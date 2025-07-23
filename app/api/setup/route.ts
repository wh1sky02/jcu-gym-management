import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { pool } from "@/lib/database"

export async function GET() {
  try {
    // Check if any admin users exist
    const adminExists = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'admin'
    `)
    
    const needsSetup = adminExists.rows[0].count === '0'
    
    return NextResponse.json({ needsSetup })
  } catch (error) {
    console.error('Error checking admin setup:', error)
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Validate email format (JCU email)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@my\.jcu\.edu\.au$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please use your JCU email address (@my.jcu.edu.au)" },
        { status: 400 }
      )
    }
    
    // Check if any admin users already exist
    const existingAdmins = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'admin'
    `)
    
    if (existingAdmins.rows[0].count !== '0') {
      return NextResponse.json(
        { error: "Admin setup has already been completed" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await pool.query(`
      SELECT id FROM users WHERE email = $1
    `, [email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate a unique student ID for admin
    const adminStudentId = `JC000001`

    // Create admin user
    const result = await pool.query(`
      INSERT INTO users (
        email,
        password_hash,
        first_name,
        last_name,
        student_id,
        role,
        membership_type,
        status,
        approval_date,
        expiry_date,
        payment_status,
        payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, email, role
    `, [
      email,
      passwordHash,
      'System',
      'Administrator',
      adminStudentId,
      'admin',
      'premium',
      'approved',
      new Date(),
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      'paid',
      'system'
    ])

    const user = result.rows[0]

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 }
    )
  }
}
