// Simple API client
interface ApiOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
  credentials?: RequestCredentials
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  async request(url: string, options: ApiOptions = {}): Promise<any> {
    const fullUrl = this.baseUrl + url
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: options.credentials || 'include'
    }

    if (options.body) {
      requestOptions.body = typeof options.body === 'string' 
        ? options.body 
        : JSON.stringify(options.body)
    }
    
    try {
      // Make the request
      const response = await fetch(fullUrl, requestOptions)
      
      // Parse response
      let responseData
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      // Return response with data
      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: response.headers
      }

    } catch (error) {
      throw error
    }
  }

  // Convenience methods
  async get(url: string, options: Omit<ApiOptions, 'method'> = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  async post(url: string, body?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}) {
    return this.request(url, { ...options, method: 'POST', body })
  }

  async put(url: string, body?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}) {
    return this.request(url, { ...options, method: 'PUT', body })
  }

  async delete(url: string, options: Omit<ApiOptions, 'method'> = {}) {
    return this.request(url, { ...options, method: 'DELETE' })
  }
}

// Create a default instance
export const apiClient = new ApiClient()

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}
