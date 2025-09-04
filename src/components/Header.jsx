import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaHome,
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaArrowRight,
  FaComments
} from 'react-icons/fa'
import logo from '../../logo.png'
import FeedbackModal from './FeedbackModal.jsx'

const Header = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isMenuOpen
        ? 'bg-white/95 shadow-lg border-b border-blue-100'
        : transparent && !isScrolled
          ? 'bg-transparent shadow-none border-none backdrop-blur-0'
          : isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100' 
        : 'bg-white/80 backdrop-blur-md border-b border-blue-100'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group ml-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-pulse overflow-hidden bg-white">
              <img src={logo} alt="Vichitex Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vichitex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-300 hover:text-blue-600 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about-us" 
              className={`text-sm font-medium transition-colors duration-300 hover:text-blue-600 ${
                isActive('/about-us') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              About Us
            </Link>
              <Link 
                to="/#batches" 
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-600 text-gray-700"
              >
                Batches
              </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors duration-300 hover:text-blue-600 ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-xs" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-300"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span className="hidden lg:block">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
        </div>
      </header>
      
      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

        {/* Mobile Navigation Menu */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen 
          ? 'translate-x-0' 
          : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {/* Navigation Links */}
            <div className="space-y-1 mb-2">
              <div className="text-center mb-1.5">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <FaHome className="text-white text-xs" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Navigation</p>
              </div>
              
              <Link
                to="/"
                onClick={closeMenu}
                className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 w-full ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm scale-101' 
                    : 'bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 hover:shadow-sm hover:scale-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-white/20' 
                    : 'bg-blue-50 group-hover:bg-blue-100'
                }`}>
                  <FaHome className={`text-xs ${isActive('/') ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-xs">Home</span>
                  <p className="text-xs opacity-70">Landing page</p>
                </div>
                {isActive('/') && <div className="w-1 h-1 bg-white rounded-full mr-1"></div>}
              </Link>

              <Link
                to="/about-us"
                onClick={closeMenu}
                className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 w-full ${
                  isActive('/about-us') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm scale-101' 
                    : 'bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 hover:shadow-sm hover:scale-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${
                  isActive('/about-us') 
                    ? 'bg-white/20' 
                    : 'bg-blue-50 group-hover:bg-blue-100'
                }`}>
                  <FaGraduationCap className={`text-xs ${isActive('/about-us') ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-xs">About Us</span>
                  <p className="text-xs opacity-70">Our story</p>
                </div>
                {isActive('/about-us') && <div className="w-1 h-1 bg-white rounded-full mr-1"></div>}
              </Link>

              <Link
                to="/#batches"
                onClick={closeMenu}
                className="group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 w-full bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 hover:shadow-sm hover:scale-100"
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 bg-purple-50 group-hover:bg-purple-100">
                  <FaGraduationCap className="text-xs text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-xs">Batches</span>
                  <p className="text-xs opacity-70">Available courses</p>
                </div>
                <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mr-1"></div>
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 w-full ${
                    isActive('/dashboard') 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm scale-101' 
                      : 'bg-white/80 hover:bg-white text-gray-700 hover:text-green-600 hover:shadow-sm hover:scale-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-white/20' 
                      : 'bg-green-50 group-hover:bg-green-100'
                  }`}>
                    <FaTachometerAlt className={`text-xs ${isActive('/dashboard') ? 'text-white' : 'text-green-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-xs">Dashboard</span>
                    <p className="text-xs opacity-70">Manage studies</p>
                  </div>
                  {isActive('/dashboard') && <div className="w-1 h-1 bg-white rounded-full mr-1"></div>}
                </Link>
              )}
            </div>

            {/* User Section */}
            {user ? (
              <div className="border-t border-blue-100/50 pt-2 mb-2">
                <div className="text-center mb-1.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <FaUser className="text-white text-xs" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account</p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center">
                      <FaUser className="text-white text-xs" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-xs text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse mr-1"></div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/20">
                    <FaSignOutAlt className="text-xs" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-xs">Logout</span>
                    <p className="text-xs opacity-70">Sign out</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="border-t border-blue-100/50 pt-2 mb-2">
                <div className="text-center mb-1.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <FaUser className="text-white text-xs" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Auth</p>
                </div>
                
                <div className="space-y-1">
                <Link
                  to="/login"
                  onClick={closeMenu}
                    className="group flex items-center space-x-2 p-2 bg-white/80 hover:bg-white text-blue-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border-2 border-blue-200 hover:border-blue-300"
                  >
                    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-blue-50 group-hover:bg-blue-100">
                      <FaUser className="text-xs text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-xs">Login</span>
                      <p className="text-xs opacity-70">Access account</p>
                    </div>
                </Link>
                
                <Link
                  to="/register"
                  onClick={closeMenu}
                    className="group flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/20">
                      <FaGraduationCap className="text-xs" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-xs">Register</span>
                      <p className="text-xs opacity-70">New account</p>
                    </div>
                </Link>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="border-t border-blue-100/50 pt-2 mb-2">
              <div className="text-center mb-1.5">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <FaComments className="text-white text-xs" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</p>
              </div>
              
              <button
                onClick={() => {
                  setShowFeedbackModal(true)
                  closeMenu()
                }}
                className="w-full flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/20">
                  <FaComments className="text-xs" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-xs">Send Feedback</span>
                  <p className="text-xs opacity-70">Help us improve</p>
                </div>
              </button>
            </div>

            {/* Features Preview */}
            <div className="border-t border-blue-100/50 pt-2">
              <div className="text-center mb-1.5">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <FaTrophy className="text-white text-xs" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Features</p>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5">
                <div className="group bg-white/80 hover:bg-white p-1.5 rounded-md transition-all duration-300 hover:shadow-sm hover:scale-101">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <FaChartLine className="text-white text-xs" />
                    </div>
                    <span className="text-xs font-medium text-blue-700">Progress</span>
                  </div>
                  <p className="text-xs text-gray-600">Track learning</p>
                </div>
                
                <div className="group bg-white/80 hover:bg-white p-1.5 rounded-md transition-all duration-300 hover:shadow-sm hover:scale-101">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm flex items-center justify-center">
                    <FaTrophy className="text-white text-xs" />
                    </div>
                    <span className="text-xs font-medium text-purple-700">Tests</span>
                  </div>
                  <p className="text-xs text-gray-600">Smart tests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        user={user}
      />
    </>
  )
}

export default Header 