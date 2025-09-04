import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Configure axios base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.baseURL = API_URL

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('token') || localStorage.getItem('adminToken')
    if (storedToken) {
      setToken(storedToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Try to get user info from token without making an API call
      const storedToken = localStorage.getItem('token') || localStorage.getItem('adminToken')
      if (storedToken) {
        // Set the token in axios headers
        setToken(storedToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        
        // Try to get user info from a simple endpoint
        try {
          const response = await axios.get('/api/auth/me')
          setUser(response.data.user)
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('adminToken')
          setToken(null)
          delete axios.defaults.headers.common['Authorization']
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Auth status check error:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('adminToken')
      setToken(null)
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      let message = 'Login failed'
      if (error.response?.status === 429) {
        message = 'Too many login attempts. Please wait 15 minutes and try again.'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }
      return { 
        success: false, 
        error: message
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token: newToken, user } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/admin/login', { email, password })
      const { token: newToken, user } = response.data
      
      localStorage.setItem('adminToken', newToken)
      setToken(newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      let message = 'Admin login failed'
      if (error.response?.status === 429) {
        message = 'Too many login attempts. Please wait 15 minutes and try again.'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }
      return { 
        success: false, 
        error: message
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminToken')
    setToken(null)
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    loading,
    token,
    login,
    register,
    adminLogin,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 