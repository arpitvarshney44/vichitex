import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaEye, FaEyeSlash, FaLock, FaArrowRight, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaUserLock } from 'react-icons/fa'
import logo from '../../logo.png'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState('form')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const token = searchParams.get('token')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('No reset token found. Please check your email for the correct password reset link.')
      toast.error('No reset token found. Please check your email for the correct password reset link.')
    }
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await axios.post(`${apiUrl}/api/auth/reset-password`, {
        token,
        password: formData.password
      })
      
      if (response.data.success) {
        setStatus('success')
        setMessage(response.data.message)
        toast.success('Password reset successfully!')
      } else {
        setError(response.data.message || 'Password reset failed')
        toast.error(response.data.message || 'Password reset failed')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      console.error('Error response:', error.response)
      setError(error.response?.data?.message || 'Password reset failed. Please try again.')
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Header */}
      <Header />

      {/* Background Animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-orange-500/5 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-pulse overflow-hidden bg-white">
                <img src={logo} alt="Vichitex Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vichitex
              </span>
            </Link>
            <h2 className={`mt-8 text-4xl font-bold text-gray-900 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.3s' }}>
              Reset Password
            </h2>
            <p className={`mt-3 text-lg text-gray-600 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.5s' }}>
              Enter your new password
            </p>
          </div>
        </div>

        <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.7s' }}>
          <div className="bg-white/80 backdrop-blur-md py-10 px-6 shadow-2xl rounded-3xl border border-white/20">
            {status === 'form' && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                      placeholder="Enter new password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform"
                      >
                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                      placeholder="Confirm new password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform"
                      >
                        {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaShieldAlt className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FaLock className="mr-2" />
                        <span>Reset Password</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <FaCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successfully!</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-4">
                  <button
                    onClick={handleLogin}
                    className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <span>Continue to Login</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <FaTimesCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reset Failed</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="space-y-4">
                  <button
                    onClick={handleLogin}
                    className="group w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-xl shadow-md text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Go to Login</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className={`mt-12 sm:mx-auto sm:w-full sm:max-w-2xl animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.9s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <FaLock className="text-green-500 text-lg" />
              <span className="text-sm font-medium text-gray-700">Secure Reset</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <FaUserLock className="text-green-500 text-lg" />
              <span className="text-sm font-medium text-gray-700">Account Security</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <FaShieldAlt className="text-green-500 text-lg" />
              <span className="text-sm font-medium text-gray-700">Password Updated</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ResetPassword 