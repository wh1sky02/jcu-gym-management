#!/usr/bin/env node

console.log('🧪 Testing login API...')

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@my.jcu.edu.au',
        password: 'admin123'
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
    
    if (response.status === 200) {
      console.log('✅ Test PASSED: Login successful')
    } else {
      console.log('❌ Test FAILED: Expected success but got:', response.status)
    }
    
  } catch (error) {
    console.error('🚨 Test error:', error)
  }
}

testLogin()
