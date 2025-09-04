import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default PublicRoute 