import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext()

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      // If no token, set default subscription and return
      if (!token) {
        setSubscription({
          plan: 'free',
          status: 'active',
          amount: 0
        })
        setLoading(false)
        return
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/subscription/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - set default subscription
          setSubscription({
            plan: 'free',
            status: 'active',
            amount: 0
          })
          return
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setSubscription(data.data)
      } else {
        setError(data.message || 'Failed to fetch subscription status')
      }
    } catch (err) {
      console.error('Error fetching subscription status:', err)
      // If API is not available or rate limited, set default subscription
      if (err.message.includes('Unexpected token') || err.message.includes('<!doctype') || err.message.includes('429')) {
        setSubscription({
          plan: 'free',
          status: 'active',
          amount: 0
        })
      } else {
        setError('Failed to fetch subscription status')
      }
    } finally {
      setLoading(false)
    }
  }

  // Purchase premium plan
  const purchasePremium = async (paymentId, amount = 2399) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/subscription/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId, amount })
      })

      const data = await response.json()

      if (data.success) {
        setSubscription(data.data)
        return { success: true, message: data.message }
      } else {
        setError(data.message || 'Failed to purchase premium plan')
        return { success: false, message: data.message }
      }
    } catch (err) {
      console.error('Error purchasing premium plan:', err)
      setError('Failed to purchase premium plan')
      return { success: false, message: 'Failed to purchase premium plan' }
    } finally {
      setLoading(false)
    }
  }

  // Get subscription plans
  const getPlans = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const response = await fetch(`${apiUrl}/api/subscription/plans`)
      const data = await response.json()

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch plans')
      }
    } catch (err) {
      console.error('Error fetching plans:', err)
      throw err
    }
  }

  // Check if user has premium access
  const hasPremiumAccess = () => {
    return subscription?.plan === 'premium' && subscription?.status === 'active'
  }

  // Check if user has free access
  const hasFreeAccess = () => {
    return true // Everyone has free access
  }

  // Refresh subscription status
  const refreshSubscription = () => {
    fetchSubscriptionStatus()
  }

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [user])

  const value = {
    subscription,
    loading,
    error,
    hasPremiumAccess,
    hasFreeAccess,
    purchasePremium,
    getPlans,
    refreshSubscription
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
} 