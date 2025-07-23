#!/usr/bin/env node

console.log('🧪 Testing invalid login API...')

const testInvalidLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@my.jcu.edu.au',
        password: 'wrongpassword'
      })
    })

    console.log('📡 Response status:', response.status)
    
    const data = await response.text()
    console.log('📡 Response body:', data)
    
    try {
      const jsonData = JSON.parse(data)
      console.log('📡 Parsed JSON:', jsonData)
    } catch (e) {
      console.log('📡 Response is not JSON')
    }
    
    if (response.status === 401) {
      console.log('✅ Test PASSED: Invalid login correctly rejected')
    } else {
      console.log('❌ Test FAILED: Expected 401 but got:', response.status)
    }
    
  } catch (error) {
    console.error('🚨 Test error:', error)
  }
}

testInvalidLogin()
