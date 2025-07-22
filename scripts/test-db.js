#!/usr/bin/env node

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ko20l6ckCcOppeYM@db.trujadxwiwawipjkbduc.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

async function testConnection() {
  console.log('🔄 Testing database connection...')
  
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connected successfully!')
    console.log('📅 Server time:', result.rows[0].now)
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection() 