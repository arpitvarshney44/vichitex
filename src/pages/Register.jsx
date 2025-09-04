import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaRocket, FaArrowRight, FaCheckCircle, FaStar } from 'react-icons/fa'
import logo from '../../logo.png'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'student'
      }
      
      const result = await register(userData)
      
      if (result.success) {
        toast.success(result.message || 'Registration successful! Welcome to Vichitex.')
        navigate('/dashboard')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
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
            <div className="flex flex-col items-center space-y-4">
              <Link to="/" className="inline-flex items-center space-x-2 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-pulse overflow-hidden bg-white">
                  <img src={logo} alt="Vichitex Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vichitex
                </span>
              </Link>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full animate-bounce-in">
                <FaStar className="text-orange-500 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="font-medium text-sm">Trusted Platform</span>
              </div>
            </div>
            <h2 className={`mt-6 text-4xl font-bold text-gray-900 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.3s' }}>
              Create your account
            </h2>
            <p className={`mt-3 text-lg text-gray-600 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.5s' }}>
              Join thousands of students tracking their progress
            </p>
          </div>
        </div>

        <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.7s' }}>
          <div className="bg-white/80 backdrop-blur-md py-10 px-6 shadow-2xl rounded-3xl border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                    placeholder="Create a password (min 6 characters)"
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
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-300 group-hover:shadow-md"
                    placeholder="Confirm your password"
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create account</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="group w-full flex justify-center items-center py-3 px-4 border-2 border-blue-200 rounded-xl shadow-md text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span>Sign in to existing account</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="group inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">
                <FaArrowRight className="mr-2 group-hover:-translate-x-1 transition-transform duration-300 rotate-180" />
                Back to home
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className={`mt-12 sm:mx-auto sm:w-full sm:max-w-4xl animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.9s' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20 group hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaCheckCircle className="text-white text-lg" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Smart Tests</span>
            </div>
            <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20 group hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaCheckCircle className="text-white text-lg" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Progress Tracking</span>
            </div>
            <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20 group hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaCheckCircle className="text-white text-lg" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Mobile Friendly</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Register 