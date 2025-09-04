import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PaymentModal from '../components/PaymentModal'
import BannerPopup from '../components/BannerPopup'
import { 
  FaCheckCircle, 
  FaBook, 
  FaChartLine, 
  FaEnvelope, 
  FaMobile, 
  FaLaptop,
  FaGraduationCap,
  FaUserGraduate,
  FaBrain,
  FaUsers,
  FaClock,
  FaTrophy,
  FaArrowRight,
  FaQuestionCircle,
  FaPhone,
  FaWhatsapp,
  FaRocket,
  FaStar,
  FaLightbulb,
  FaCrosshairs,
  FaShieldAlt,
  FaPlay,
  FaGlobe,
  FaTablet,
  FaDesktop,
  FaLock,
  FaUserTie,
  FaFlask,
  FaGift,
  FaChevronDown,
  FaClipboardCheck,
  FaBell,
  FaCrown
} from 'react-icons/fa'

function FaqAccordion() {
  const faqs = [
    {
      q: "What's the difference between Free and Premium plans?",
      a: "Free plan includes previous year questions paper and basic progress tracking. Premium plan (₹2,399) adds individual student tests with 50 MCQs, personalized content, advanced analytics, and priority support."
    },
    {
      q: "Is the Premium plan a one-time payment?",
      a: "Yes, the Premium plan is a one-time payment of ₹2,399. There are no recurring charges or hidden fees."
    },
    {
      q: "What happens after I mark chapters as complete?",
      a: "Based on your progress, you'll receive a personalized test with 50 MCQs based only on the topics you've marked as completed. This ensures you're tested on what you've actually studied."
    },
    {
      q: "Can I take a test more than once?",
      a: "No, each test is a one-time challenge — just like a real exam. This helps you stay serious and honest with your preparation while building exam-like pressure."
    },
    {
      q: "How do I know when a test is available?",
      a: "You'll receive an email notification with the test link and details as soon as a test is ready for you based on your chapter completion."
    },
    {
      q: "Is this useful for board exam preparation?",
      a: "Absolutely! Vichitex is specifically built to help you revise each chapter systematically and test yourself before final exams, making it perfect for board exam preparation."
    },
    {
      q: "Is there any mobile app?",
      a: "Currently, Vichitex is web-based and fully mobile-friendly — no app download needed. You can access it from any device with a browser."
    }
  ]
  const colors = [
    { bg: 'from-blue-500 to-blue-600', icon: 'text-blue-100', border: 'border-blue-200', shadow: 'shadow-blue-100/40' },
    { bg: 'from-purple-500 to-purple-600', icon: 'text-purple-100', border: 'border-purple-200', shadow: 'shadow-purple-100/40' },
    { bg: 'from-orange-500 to-orange-600', icon: 'text-orange-100', border: 'border-orange-200', shadow: 'shadow-orange-100/40' },
    { bg: 'from-green-500 to-green-600', icon: 'text-green-100', border: 'border-green-200', shadow: 'shadow-green-100/40' },
    { bg: 'from-blue-500 to-purple-600', icon: 'text-blue-100', border: 'border-blue-200', shadow: 'shadow-blue-100/40' },
  ]
  const [open, setOpen] = useState(null)
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, i) => {
        const color = colors[i % colors.length]
        const isOpen = open === i
        return (
          <div
            key={i}
            className={`group bg-gradient-to-br ${color.bg} p-0.5 rounded-xl ${color.shadow} transition-all duration-500 animate-fade-in-up`}
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
          >
            <div
              className={`flex items-start bg-white rounded-xl border ${color.border} transition-all duration-500 cursor-pointer ${isOpen ? 'shadow-xl border-2 scale-[1.01]' : 'hover:shadow-md hover:-translate-y-0.5'}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${color.bg} rounded-lg flex items-center justify-center m-3 sm:m-4 mt-4 sm:mt-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>
                <FaQuestionCircle className={`text-lg sm:text-xl ${color.icon}`} />
              </div>
              <div className="flex-1 py-3 sm:py-4 pr-3 sm:pr-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'group-hover:text-blue-600'}`}>{faq.q}</h3>
                  <span className={`ml-2 sm:ml-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-gray-400 text-sm sm:text-base" />
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-32 sm:max-h-36 opacity-100 mt-1 sm:mt-2' : 'max-h-0 opacity-0 mt-0'}`}
                  style={{
                    transitionProperty: 'max-height, opacity, margin-top',
                  }}
                >
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{faq.a}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const LandingPage = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState('completed-chapters')
  const [howItWorksExpanded, setHowItWorksExpanded] = useState(false)
  const [useItAnywhereExpanded, setUseItAnywhereExpanded] = useState(false)
  const [whoIsForExpanded, setWhoIsForExpanded] = useState(false)
  const [openContact, setOpenContact] = useState(null)
  const [mcqTestExpanded, setMcqTestExpanded] = useState(false)
  const [emailAlertExpanded, setEmailAlertExpanded] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedBatchPlan, setSelectedBatchPlan] = useState(null)
  const [batches, setBatches] = useState([])
  const [loadingBatches, setLoadingBatches] = useState(true)

  const handleBatchPurchase = (batchPlan) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }
    setSelectedBatchPlan(batchPlan)
    setPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (data) => {
    // Refresh the page to update the user's batch enrollment status
    window.location.reload()
  }

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }, 100)
      }
    }
  }, [location.hash])

  // Fetch batches from API
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const response = await fetch(`${API_URL}/api/batches`)
        
        if (response.ok) {
          const data = await response.json()
          setBatches(data.batches || [])
        } else {
          console.error('Failed to fetch batches:', response.status)
          // Fallback to empty array
          setBatches([])
        }
      } catch (error) {
        console.error('Error fetching batches:', error)
        // Fallback to empty array
        setBatches([])
      } finally {
        setLoadingBatches(false)
      }
    }

    fetchBatches()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Banner Popup */}
      <BannerPopup />
      
      {/* Header */}
      <Header transparent={scrollY < 100} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-orange-500/10 animate-pulse"></div>
        <div 
          className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full mb-8 animate-bounce-in">
              <FaStar className="text-orange-500 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-medium">Trusted Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in-up">
              Master Your Studies with
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                Test, Revision and Practice
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            India's First Platform for Test, Revision and Practice for individual student. 
              <span className="font-semibold text-blue-600"> Vichitex</span> makes learning organized and effective.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link to="/register" className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 animate-pulse-slow">
                <span>Start Learning Free</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#batches" className="group bg-white hover:bg-blue-50 text-blue-600 font-bold text-lg px-8 py-4 rounded-full border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                <FaCrown className="text-sm" />
                <span>View Batch details </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Students Choose
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Vichitex
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              1. Get Personal test of completed chapters.<br />
              2. To see How many times you revise your completed chapter
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: 'completed-chapters', label: 'Total Completed Chapters', icon: FaCheckCircle },
                { id: 'submit-chapters', label: 'Submit Completed Chapter', icon: FaClipboardCheck },
                { id: 'total-tests', label: 'Total Tests Given', icon: FaTrophy },
                { id: 'my-tests', label: 'My Tests', icon: FaChartLine }
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              ))}
              </div>
          </div>
          
          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Total Completed Chapters Tab */}
              {activeTab === 'completed-chapters' && (
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6">
                      <FaCheckCircle className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Total Completed Chapters</h3>
                      <p className="text-xl text-gray-600">Track your learning progress systematically</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Visual Progress Tracking</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            <span>See all your completed chapters at a glance</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            <span>Subject-wise chapter completion overview</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            <span>Progress percentage for each subject</span>
                </li>
              </ul>
            </div>

                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">🎯 Study Motivation</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Celebrate your learning milestones</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Identify areas that need more attention</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Stay motivated with visual progress</span>
                </li>
              </ul>
                      </div>
            </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaCheckCircle className="text-white text-4xl" />
              </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Track Your Journey</h4>
                        <p className="text-gray-600">Every completed chapter brings you closer to your goals</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Submit Completed Chapter Tab */}
              {activeTab === 'submit-chapters' && (
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                      <FaClipboardCheck className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Submit Completed Chapter</h3>
                      <p className="text-xl text-gray-600">Mark your progress and unlock personalized tests</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">✅ Easy Chapter Marking</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>One-click chapter completion marking</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Instant progress update</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Automatic test generation trigger</span>
                </li>
              </ul>
            </div>

                      <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-6 rounded-2xl border border-purple-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">🚀 Unlock New Tests</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-purple-500 flex-shrink-0" />
                            <span>Get personalized MCQ tests</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-purple-500 flex-shrink-0" />
                            <span>50 questions based on completed chapters</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-purple-500 flex-shrink-0" />
                            <span>Email notification when test is ready</span>
                </li>
              </ul>
                      </div>
                </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaClipboardCheck className="text-white text-4xl" />
                </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Mark & Progress</h4>
                        <p className="text-gray-600">Every completed chapter opens new learning opportunities</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Total Tests Given Tab */}
              {activeTab === 'total-tests' && (
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-6">
                      <FaTrophy className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Total Tests Given</h3>
                      <p className="text-xl text-gray-600">Comprehensive overview of your test performance</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">📈 Performance Analytics</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                            <span>Total number of tests attempted</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                            <span>Average score across all tests</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                            <span>Subject-wise test performance</span>
                </li>
              </ul>
                </div>

                      <div className="bg-gradient-to-r from-red-50 to-purple-50 p-6 rounded-2xl border border-red-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">🎯 One-Attempt Challenge</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-red-500 flex-shrink-0" />
                            <span>Each test can only be taken once</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-red-500 flex-shrink-0" />
                            <span>Builds exam-like pressure</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-red-500 flex-shrink-0" />
                            <span>Encourages serious preparation</span>
                          </li>
                        </ul>
              </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaTrophy className="text-white text-4xl" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Test Your Knowledge</h4>
                        <p className="text-gray-600">Every test is a step towards mastery</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* My Tests Tab */}
              {activeTab === 'my-tests' && (
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                      <FaChartLine className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">My Tests</h3>
                      <p className="text-xl text-gray-600">Detailed view of your individual test results</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Detailed Results</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-purple-500 flex-shrink-0" />
                            <span>Individual test scores and answers</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-purple-500 flex-shrink-0" />
                            <span>Question-wise performance analysis</span>
                </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-purple-500 flex-shrink-0" />
                            <span>Correct vs incorrect answer review</span>
                </li>
              </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">🔄 Revision Tracking</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>See how many times you revise chapters</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Track improvement over time</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                            <span>Identify weak areas for focus</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaChartLine className="text-white text-4xl" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Analyze & Improve</h4>
                        <p className="text-gray-600">Learn from every test to get better</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MCQ Test Feature Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              MCQ Test Feature – Challenge Your Knowledge
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              At Vichitex, learning doesn't stop at just reading and marking chapters. To truly understand and evaluate what you've learned, we provide you with carefully curated Multiple Choice Question (MCQ) tests after you complete each chapter or module.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className={`bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden transition-all duration-500 ${
              mcqTestExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
            }`}>
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Content */}
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                      <FaClipboardCheck className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">📌 Here's how it works:</h3>
                  </div>
                  
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setMcqTestExpanded(!mcqTestExpanded)}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                    >
                      <span>{mcqTestExpanded ? 'Collapse' : 'Expand'}</span>
                      <FaChevronDown className={`transition-transform duration-300 ${mcqTestExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <div className={`space-y-4 sm:space-y-6 transition-all duration-500 ${
                    mcqTestExpanded ? 'max-h-[800px] sm:max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          As soon as you mark a chapter as <strong>Completed</strong>, a related MCQ test with 45 questions is unlocked for you.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          These questions are designed by educators to test both your <strong>conceptual clarity</strong> and <strong>practical understanding</strong>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          Each test is <strong>time-bound</strong>, so you can simulate a real exam environment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          Once submitted, you'll immediately see your <strong>score and correct answers</strong>, helping you know where you stand.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">5</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          You get only <strong>one attempt per test</strong>, so it encourages serious preparation and genuine self-assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 transition-all duration-500 ${
                    mcqTestExpanded ? 'max-h-48 sm:max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <p className="text-sm sm:text-lg font-semibold text-gray-900 text-center leading-relaxed">
                      �� With Vichitex, you don't just study — you master your subjects, one chapter at a time.
                    </p>
                  </div>
                </div>
                
                {/* Right Visual */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-8 lg:p-12 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FaTrophy className="text-white text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">45 Questions Per Test</h3>
                    <p className="text-purple-100 text-lg mb-6">
                      Comprehensive coverage of your completed chapters
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">⏱️</div>
                        <div>Time-bound</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">🎯</div>
                        <div>One attempt</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">📊</div>
                        <div>Instant results</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">✅</div>
                        <div>Detailed feedback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Alert System Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              📩 Email Alert System – Stay Informed, Always
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              You'll never miss an important update or test opportunity on Vichitex — thanks to our smart Email Notification System designed especially for students.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className={`bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden transition-all duration-500 ${
              emailAlertExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
            }`}>
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Visual */}
                <div className="bg-gradient-to-br from-blue-500 to-green-600 p-8 lg:p-12 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FaBell className="text-white text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Smart Notifications</h3>
                    <p className="text-blue-100 text-lg mb-6">
                      Never miss important updates
                    </p>
                    <div className="space-y-4 text-sm">
                      <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
                        <div className="text-2xl">📧</div>
                        <div>Test availability alerts</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
                        <div className="text-2xl">⏰</div>
                        <div>Expiry reminders</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
                        <div className="text-2xl">📊</div>
                        <div>Result notifications</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
                        <div className="text-2xl">📚</div>
                        <div>New content updates</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Content */}
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                      <FaEnvelope className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">📬 Here's how it helps you:</h3>
                  </div>
                  
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setEmailAlertExpanded(!emailAlertExpanded)}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                    >
                      <span>{emailAlertExpanded ? 'Collapse' : 'Expand'}</span>
                      <FaChevronDown className={`transition-transform duration-300 ${emailAlertExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <div className={`space-y-4 sm:space-y-6 transition-all duration-500 ${
                    emailAlertExpanded ? 'max-h-[800px] sm:max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          When a new test becomes available, you'll receive a <strong>personalized email notification</strong>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          If your test is nearing expiry or you haven't attempted it, we'll <strong>remind you in time</strong>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          Get email updates when new chapters, test series, or subject content are added.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          Receive instant alerts when your test results are available, with a <strong>breakdown of your score</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200 transition-all duration-500 ${
                    emailAlertExpanded ? 'max-h-48 sm:max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <p className="text-sm sm:text-lg font-semibold text-gray-900 text-center leading-relaxed">
                      🔔 These notifications ensure you stay on track, stay motivated, and never miss a step on your learning journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">Vichitex</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get started in minutes and transform your study routine
            </p>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setHowItWorksExpanded(!howItWorksExpanded)}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>{howItWorksExpanded ? 'Hide Steps' : 'Show How It Works'}</span>
              <FaChevronDown className={`transition-transform duration-300 ${howItWorksExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
            howItWorksExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up with your email in seconds. No complex setup required.",
                icon: FaUserGraduate
              },
              {
                step: "02",
                title: "Choose Subjects",
                description: "Select your subjects and mark chapters as you complete them.",
                icon: FaBook
              },
              {
                step: "03",
                title: "Take Tests",
                description: "Get personalized tests based on your completed chapters.",
                icon: FaChartLine
              }
            ].map((item, index) => (
                <div 
                  key={index} 
                  className={`group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                    howItWorksExpanded ? 'animate-fade-in-up' : ''
                  }`} 
                  style={{ 
                    animationDelay: howItWorksExpanded ? `${0.2 * (index + 1)}s` : '0s',
                    transform: howItWorksExpanded ? 'translateY(0)' : 'translateY(50px)',
                    opacity: howItWorksExpanded ? 1 : 0,
                    transition: `all 0.5s ease-out ${0.1 * (index + 1)}s`
                  }}
                >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="text-white text-xl" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{item.description}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use It Anywhere Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              📱 Use It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Anywhere</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access Vichitex from any device, anywhere, anytime
            </p>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setUseItAnywhereExpanded(!useItAnywhereExpanded)}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>{useItAnywhereExpanded ? 'Hide Features' : 'Show Device Features'}</span>
              <FaChevronDown className={`transition-transform duration-300 ${useItAnywhereExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
            useItAnywhereExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaGlobe,
                title: "🌐 100% Web-based",
                description: "No app download required — access directly from your browser",
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100",
                borderColor: "border-blue-200 hover:border-blue-300"
              },
              {
                icon: FaMobile,
                title: "📱 Fully Mobile-friendly",
                description: "Optimized for smartphones with touch-friendly interface",
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100",
                borderColor: "border-purple-200 hover:border-purple-300"
              },
              {
                icon: FaDesktop,
                title: "🖥️ Works on Desktop & Tablet",
                description: "Perfect experience on larger screens for detailed study",
                color: "from-orange-500 to-orange-600",
                bgColor: "from-orange-50 to-orange-100",
                borderColor: "border-orange-200 hover:border-orange-300"
              },
              {
                icon: FaLock,
                title: "🔐 Secure Login",
                description: "Protect your study data with secure authentication",
                color: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100",
                borderColor: "border-green-200 hover:border-green-300"
              }
            ].map((item, index) => (
                <div 
                  key={index} 
                  className={`group bg-gradient-to-br ${item.bgColor} p-6 rounded-2xl border ${item.borderColor} transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                    useItAnywhereExpanded ? 'animate-fade-in-up' : ''
                  }`} 
                  style={{ 
                    animationDelay: useItAnywhereExpanded ? `${0.2 * (index + 1)}s` : '0s',
                    transform: useItAnywhereExpanded ? 'translateY(0)' : 'translateY(50px)',
                    opacity: useItAnywhereExpanded ? 1 : 0,
                    transition: `all 0.5s ease-out ${0.1 * (index + 1)}s`
                  }}
                >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{item.description}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who is Vichitex For Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🧩 Who is <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Vichitex</span> For?
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl text-gray-600">
              Designed for students who want to take control of their revision journey
            </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Vichitex is specifically designed for <span className="font-semibold text-blue-600">NEET and JEE aspirants</span> who believe in systematic learning, 
                want to track their progress, and aim to excel in their competitive exam preparation. 
                Our platform is tailored to help you master each chapter systematically and build 
                the confidence needed to crack these challenging entrance examinations.
            </p>
          </div>
          
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setWhoIsForExpanded(!whoIsForExpanded)}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mt-8"
            >
              <span>{whoIsForExpanded ? 'Hide Details' : 'Learn More About Our Focus'}</span>
              <FaChevronDown className={`transition-transform duration-300 ${whoIsForExpanded ? 'rotate-180' : ''}`} />
            </button>
                </div>
          
          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
            whoIsForExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* NEET Students */}
              <div 
                className={`group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:border-green-300 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  whoIsForExpanded ? 'animate-fade-in-up' : ''
                }`} 
                style={{ 
                  animationDelay: whoIsForExpanded ? '0.2s' : '0s',
                  transform: whoIsForExpanded ? 'translateY(0)' : 'translateY(50px)',
                  opacity: whoIsForExpanded ? 1 : 0,
                  transition: 'all 0.5s ease-out 0.1s'
                }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaFlask className="text-white text-2xl" />
              </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    🧪 NEET Aspirants
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Perfect for medical entrance exam preparation with focused practice on Physics, Chemistry, and Biology concepts.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span>Systematic chapter-wise preparation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span>Biology-focused MCQ practice</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span>Physics & Chemistry concept strengthening</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span>Performance tracking for medical entrance</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* JEE Students */}
              <div 
                className={`group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  whoIsForExpanded ? 'animate-fade-in-up' : ''
                }`} 
                style={{ 
                  animationDelay: whoIsForExpanded ? '0.4s' : '0s',
                  transform: whoIsForExpanded ? 'translateY(0)' : 'translateY(50px)',
                  opacity: whoIsForExpanded ? 1 : 0,
                  transition: 'all 0.5s ease-out 0.2s'
                }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    🎓 JEE Aspirants
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Ideal for engineering entrance exam preparation with comprehensive coverage of Physics, Chemistry, and Mathematics.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span>Advanced problem-solving practice</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span>Mathematics-focused MCQ preparation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span>Physics & Chemistry concept mastery</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span>Engineering entrance exam readiness</span>
                    </li>
                  </ul>
                </div>
              </div>
          </div>
          
          <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-200">
                <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  Whether you're preparing for <span className="font-semibold text-green-600">NEET</span> or <span className="font-semibold text-blue-600">JEE</span> — <span className="font-semibold text-purple-600">Vichitex keeps you on track and exam-ready.</span> 
                  Our platform is specifically designed to help you master the core concepts and build the confidence needed to excel in these competitive entrance examinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Plans Section */}
      <section id="batches" className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🎯 Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Batch Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect batch for your NEET or JEE preparation journey
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            {loadingBatches ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl p-6 h-80 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                      </div>
                ))}
              </div>
            ) : batches.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {batches.map((batch, index) => {
                  const colors = {
                    NEET: {
                      bg: 'from-green-50 to-green-100',
                      border: 'border-green-200',
                      hoverBorder: 'hover:border-green-300',
                      iconBg: 'from-green-500 to-green-600',
                      checkColor: 'text-green-500',
                      buttonBg: 'from-green-500 to-green-600',
                      buttonHover: 'hover:from-green-600 hover:to-green-700'
                    },
                    JEE: {
                      bg: 'from-purple-50 to-purple-100',
                      border: 'border-purple-200',
                      hoverBorder: 'hover:border-purple-300',
                      iconBg: 'from-purple-500 to-purple-600',
                      checkColor: 'text-purple-500',
                      buttonBg: 'from-purple-500 to-purple-600',
                      buttonHover: 'hover:from-purple-600 hover:to-purple-700'
                    }
                  }
                  
                  const colorScheme = colors[batch.type] || colors.NEET
                  const IconComponent = batch.type === 'JEE' ? FaGraduationCap : FaFlask
                  
                  return (
                    <div key={batch._id} className={`group bg-gradient-to-br ${colorScheme.bg} p-1 rounded-2xl border ${colorScheme.border} ${colorScheme.hoverBorder} transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up`} style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="bg-white rounded-2xl p-6 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100/20 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                            <div className={`w-12 h-12 bg-gradient-to-br ${colorScheme.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="text-white text-lg" />
                  </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{batch.name}</h3>
                      <div className="mb-3">
                              <span className="text-2xl font-bold text-gray-900">₹{batch.price}</span>
                              {batch.originalPrice > batch.price && (
                                <span className="text-gray-500 line-through ml-2">₹{batch.originalPrice}</span>
                              )}
                        <span className="text-gray-600 ml-1 text-sm">/batch</span>
                      </div>
                            <p className="text-gray-600 text-sm">{batch.description}</p>
                </div>
                
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <FaCheckCircle className={`${colorScheme.checkColor} flex-shrink-0`} />
                              <span>{batch.subjects?.join(', ') || 'All subjects'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <FaCheckCircle className={`${colorScheme.checkColor} flex-shrink-0`} />
                              <span>{batch.mcqCount} MCQs per test</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <FaCheckCircle className={`${colorScheme.checkColor} flex-shrink-0`} />
                              <span>{batch.duration || 'Annual Access'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <FaCheckCircle className={`${colorScheme.checkColor} flex-shrink-0`} />
                        <span>Personalized tests</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <FaCheckCircle className={`${colorScheme.checkColor} flex-shrink-0`} />
                        <span>Email notifications</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <button 
                        onClick={() => handleBatchPurchase({
                                name: batch.name,
                                type: batch.type,
                                price: batch.price,
                                duration: batch.duration,
                                features: batch.features || []
                              })}
                              className={`inline-flex items-center space-x-2 bg-gradient-to-r ${colorScheme.buttonBg} ${colorScheme.buttonHover} text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full justify-center`}
                      >
                        <span>Join Batch</span>
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                  )
                })}
                    </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FaFlask className="text-gray-400 text-3xl" />
                  </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Batches Available</h3>
                <p className="text-gray-600">Please check back later for available batches.</p>
                </div>
            )}
            
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <p className="text-base text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  All batches include <span className="font-semibold text-blue-600">45 MCQs per test</span>, <span className="font-semibold text-purple-600">personalized content</span>, and <span className="font-semibold text-green-600">email notifications</span>. 
                  Choose your batch and start your preparation journey today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about Vichitex
            </p>
          </div>
          
          {/* Accordion FAQ */}
          <FaqAccordion />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full mb-6 animate-bounce-in">
              <FaEnvelope className="text-blue-600 animate-pulse" />
              <span className="font-semibold text-sm">24/7 Support Available</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Need Help? <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">We're Here</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Got questions, doubts, or need assistance? Our dedicated support team is ready to help you succeed on your learning journey.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6 mb-10">
              {/* Email Support Card */}
              <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 rounded-2xl animate-fade-in-up hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                <div 
                  className={`bg-white rounded-2xl p-5 sm:p-6 pb-6 sm:pb-8 h-full relative overflow-hidden cursor-pointer transition-all duration-500 ${openContact === 'email' ? 'shadow-xl scale-[1.01]' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                  onClick={() => setOpenContact(openContact === 'email' ? null : 'email')}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-blue-100/20 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <FaEnvelope className="text-white text-lg sm:text-xl" />
                    </div>
                      <span className={`transition-transform duration-300 ${openContact === 'email' ? 'rotate-180' : ''}`}>
                        <FaChevronDown className="text-gray-400 text-sm sm:text-base" />
                      </span>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 ${openContact === 'email' ? 'text-blue-600' : 'group-hover:text-blue-600'}`}>Email Support</h3>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${openContact === 'email' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">Get detailed, comprehensive responses to all your questions within 24 hours</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Detailed explanations</span>
                      </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>24-hour response time</span>
                      </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Technical assistance</span>
                      </div>
                    </div>
                      <a href="mailto:vichitex.in@gmail.com" className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                        <FaEnvelope className="text-xs" />
                      <span>vichitex.in@gmail.com</span>
                    </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone Support Card */}
              <div className="group bg-gradient-to-br from-purple-500 to-purple-600 p-0.5 rounded-2xl animate-fade-in-up hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ animationDelay: '0.4s' }}>
                <div 
                  className={`bg-white rounded-2xl p-5 sm:p-6 pb-6 sm:pb-8 h-full relative overflow-hidden cursor-pointer transition-all duration-500 ${openContact === 'phone' ? 'shadow-xl scale-[1.01]' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                  onClick={() => setOpenContact(openContact === 'phone' ? null : 'phone')}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-purple-100/20 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <FaPhone className="text-white text-lg sm:text-xl" />
                    </div>
                      <span className={`transition-transform duration-300 ${openContact === 'phone' ? 'rotate-180' : ''}`}>
                        <FaChevronDown className="text-gray-400 text-sm sm:text-base" />
                      </span>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 ${openContact === 'phone' ? 'text-purple-600' : 'group-hover:text-purple-600'}`}>Call Support</h3>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${openContact === 'phone' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">Quick help when you need immediate assistance or have urgent questions</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Instant response</span>
                      </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Personal guidance</span>
                      </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Urgent issue resolution</span>
                      </div>
                    </div>
                      <a href="tel:+919798480148" className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                        <FaPhone className="text-xs" />
                      <span>+91 9798480148</span>
                    </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support Card */}
              <div className="group bg-gradient-to-br from-green-500 to-green-600 p-0.5 rounded-2xl animate-fade-in-up hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ animationDelay: '0.5s' }}>
                <div 
                  className={`bg-white rounded-2xl p-5 sm:p-6 pb-6 sm:pb-8 h-full relative overflow-hidden cursor-pointer transition-all duration-500 ${openContact === 'whatsapp' ? 'shadow-xl scale-[1.01]' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                  onClick={() => setOpenContact(openContact === 'whatsapp' ? null : 'whatsapp')}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-green-100/20 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <FaWhatsapp className="text-white text-lg sm:text-xl" />
                    </div>
                      <span className={`transition-transform duration-300 ${openContact === 'whatsapp' ? 'rotate-180' : ''}`}>
                        <FaChevronDown className="text-gray-400 text-sm sm:text-base" />
                      </span>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 ${openContact === 'whatsapp' ? 'text-green-600' : 'group-hover:text-green-600'}`}>WhatsApp Support</h3>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${openContact === 'whatsapp' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">Quick chat support for fast answers and easy file sharing</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Quick responses</span>
                      </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>File sharing</span>
                      </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Convenient chat</span>
                      </div>
                    </div>
                      <a href="https://wa.me/919798480148" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                        <FaWhatsapp className="text-xs" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { icon: FaUsers, number: "India's", label: "Trusted Platform", color: "from-blue-500 to-blue-600" },
                { icon: FaClock, number: "< 2hrs", label: "Average Response", color: "from-purple-500 to-purple-600" },
                { icon: FaCheckCircle, number: "99%", label: "Satisfaction Rate", color: "from-green-500 to-green-600" },
                { icon: FaStar, number: "24/7", label: "Support Available", color: "from-orange-500 to-orange-600" }
              ].map((stat, index) => (
                <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="text-white text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        batchPlan={selectedBatchPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default LandingPage 