import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaUsers,
  FaShieldAlt,
  FaMobileAlt,
  FaHeadset,
  FaStar,
  FaWhatsapp,
  FaChevronDown,
  FaChevronUp,
  FaComments
} from 'react-icons/fa'
import { FaTelegram } from 'react-icons/fa6'
import logo from '../../logo.png'
import FeedbackModal from './FeedbackModal.jsx'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [expandedSections, setExpandedSections] = useState({
    quickLinks: false,
    features: false,
    contact: false
  })
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-orange-500/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Company Info - Full width on mobile */}
            <div className="lg:col-span-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white">
                  <img src={logo} alt="Vichitex Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vichitex
                </span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed text-sm lg:text-base">
                Empowering students with smart test preparation and progress tracking. 
                Join thousands of learners achieving their academic goals.
              </p>
              
              {/* Social Links - Responsive grid */}
              <div className="flex justify-center lg:justify-start space-x-2 lg:space-x-3 mb-6 lg:mb-0">
                <a href="https://youtube.com/@vichitexofficial25?si=_R2pM-pyU6reVjRn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 group">
                  <FaYoutube className="text-white text-base lg:text-lg group-hover:text-red-200 transition-colors duration-300" />
                </a>
                <a href="https://www.linkedin.com/in/vivek-parth-a13699335" target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 group">
                  <FaLinkedin className="text-white text-base lg:text-lg group-hover:text-blue-200 transition-colors duration-300" />
                </a>
                <a href="https://www.instagram.com/vichitex.in?igsh=eWE5NWpzZmsxZTEz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg lg:rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 group">
                  <FaInstagram className="text-white text-base lg:text-lg group-hover:text-orange-200 transition-colors duration-300" />
                </a>
                <a href="https://whatsapp.com/channel/0029VbAfQnDG3R3iH6hNJ23Y" target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 group">
                  <FaWhatsapp className="text-white text-base lg:text-lg group-hover:text-green-200 transition-colors duration-300" />
                </a>
                <a href="https://t.me/Vichitex" target="_blank" rel="noopener noreferrer" className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 group">
                  <FaTelegram className="text-white text-base lg:text-lg group-hover:text-purple-200 transition-colors duration-300" />
                </a>
              </div>
            </div>

            {/* Quick Links - Collapsible on mobile */}
            <div className="lg:col-span-1">
              <button 
                onClick={() => toggleSection('quickLinks')}
                className="w-full lg:hidden flex items-center justify-between text-base font-semibold text-white mb-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
              >
                <span className="flex items-center">
                  <FaArrowRight className="mr-2 text-blue-400" />
                  Quick Links
                </span>
                {expandedSections.quickLinks ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              <h3 className="hidden lg:flex text-base font-semibold mb-4 text-white items-center">
                <FaArrowRight className="mr-2 text-blue-400" />
                Quick Links
              </h3>
              
              <div className={`${expandedSections.quickLinks ? 'block' : 'hidden'} lg:block`}>
                <ul className="space-y-2 text-center lg:text-left">
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center lg:justify-start group text-sm">
                      <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center lg:justify-start group text-sm">
                      <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center lg:justify-start group text-sm">
                      <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link to="/about-us" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center lg:justify-start group text-sm">
                      <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Features - Collapsible on mobile */}
            <div className="lg:col-span-1">
              <button 
                onClick={() => toggleSection('features')}
                className="w-full lg:hidden flex items-center justify-between text-base font-semibold text-white mb-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
              >
                <span className="flex items-center">
                  <FaStar className="mr-2 text-orange-400" />
                  Features
                </span>
                {expandedSections.features ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              <h3 className="hidden lg:flex text-base font-semibold mb-4 text-white items-center">
                <FaStar className="mr-2 text-orange-400" />
                Features
              </h3>
              
              <div className={`${expandedSections.features ? 'block' : 'hidden'} lg:block`}>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 text-sm">
                    <FaGraduationCap className="mr-2 text-blue-400 flex-shrink-0" />
                    <span>Smart Tests</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 text-sm">
                    <FaChartLine className="mr-2 text-purple-400 flex-shrink-0" />
                    <span>Progress</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 text-sm">
                    <FaTrophy className="mr-2 text-orange-400 flex-shrink-0" />
                    <span>Achievements</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 text-sm">
                    <FaUsers className="mr-2 text-green-400 flex-shrink-0" />
                    <span>Community</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 text-sm">
                    <FaShieldAlt className="mr-2 text-blue-400 flex-shrink-0" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-300 text-sm">
                    <FaMobileAlt className="mr-2 text-purple-400 flex-shrink-0" />
                    <span>Mobile</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info - Collapsible on mobile */}
            <div className="lg:col-span-1">
              <button 
                onClick={() => toggleSection('contact')}
                className="w-full lg:hidden flex items-center justify-between text-base font-semibold text-white mb-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
              >
                <span className="flex items-center">
                  <FaHeadset className="mr-2 text-green-400" />
                  Contact Us
                </span>
                {expandedSections.contact ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              <h3 className="hidden lg:flex text-base font-semibold mb-4 text-white items-center">
                <FaHeadset className="mr-2 text-green-400" />
                Contact Us
              </h3>
              
              <div className={`${expandedSections.contact ? 'block' : 'hidden'} lg:block`}>
                <div className="space-y-3 text-center lg:text-left">
                  <div className="flex items-start justify-center lg:justify-start space-x-3">
                    <FaEnvelope className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Email</p>
                      <p className="text-gray-400 text-xs">vichitex.in@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-center lg:justify-start space-x-3">
                    <FaPhone className="text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Phone</p>
                      <p className="text-gray-400 text-xs">+91 9798480148</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-center lg:justify-start space-x-3">
                    <FaMapMarkerAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Address</p>
                      <p className="text-gray-400 text-xs">India</p>
                    </div>
                  </div>
                </div>

                

                {/* Feedback Button - Desktop only */}
                <div className="mt-4 lg:mt-6 hidden lg:block">
                  <h4 className="text-sm font-semibold mb-3 text-white text-left">Help Us Improve</h4>
                  <button 
                    onClick={() => setShowFeedbackModal(true)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <FaComments className="text-sm" />
                    <span>Send Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Improved mobile layout */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
              {/* Copyright and Policy Links */}
              <div className="flex flex-col items-center lg:items-start space-y-3 lg:space-y-0 lg:space-x-6 text-sm text-gray-400 text-center lg:text-left">
                <span>&copy; {currentYear} Vichitex. All rights reserved.</span>
                
                {/* Policy Links - Responsive grid */}
                <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 lg:gap-4 lg:gap-6 text-xs lg:text-sm">
                  <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-300 px-2 py-1 lg:px-0 lg:py-0 rounded lg:rounded-none hover:bg-gray-800 lg:hover:bg-transparent">
                    Privacy Policy
                  </Link>
                  <Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors duration-300 px-2 py-1 lg:px-0 lg:py-0 rounded lg:rounded-none hover:bg-gray-800 lg:hover:bg-transparent">
                    Terms & Conditions
                  </Link>
                  <Link to="/cancellation-refund" className="hover:text-blue-400 transition-colors duration-300 px-2 py-1 lg:px-0 lg:py-0 rounded lg:rounded-none hover:bg-gray-800 lg:hover:bg-transparent">
                    Cancellation & Refund
                  </Link>
                  <Link to="/shipping-delivery" className="hover:text-blue-400 transition-colors duration-300 px-2 py-1 lg:px-0 lg:py-0 rounded lg:rounded-none hover:bg-gray-800 lg:hover:bg-transparent">
                    Shipping & Delivery
                  </Link>
                  <Link to="/contact-us" className="hover:text-blue-400 transition-colors duration-300 px-2 py-1 lg:px-0 lg:py-0 rounded lg:rounded-none hover:bg-gray-800 lg:hover:bg-transparent col-span-2 lg:col-span-1">
                    Contact Us
                  </Link>
                </div>
              </div>
              
              {/* Developer Credit */}
              <div className="flex items-center justify-center lg:justify-end">
                <a 
                  href="https://www.sirswasolutions.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs lg:text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-1 group"
                >
                  <span>Developed by</span>
                  <span className="font-semibold text-blue-400 group-hover:text-blue-300">Sirswa Solutions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </footer>
  )
}

export default Footer 