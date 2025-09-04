import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { 
  FaSignOutAlt, 
  FaBook, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBell, 
  FaTrophy,
  FaChartLine,
  FaUser,
  FaPlus,
  FaEdit,
  FaCrown,
  FaLock,
  FaTimes,
  FaCheck,
  FaFileAlt,
  FaPlay,
  FaClock,
  FaEye,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // State for Free Plan vs Batch Enrolled
  const [activeTab, setActiveTab] = useState('overview')
  const [completedChapters, setCompletedChapters] = useState([])
  const [assignedTests, setAssignedTests] = useState([])
  const [testHistory, setTestHistory] = useState([])
  const [testAttemptsSummary, setTestAttemptsSummary] = useState(null)
  const [batchInfo, setBatchInfo] = useState(null)
  const [availableChapters, setAvailableChapters] = useState([])
  const [subjectsWithChapters, setSubjectsWithChapters] = useState([])
  const [showChapterCompletionModal, setShowChapterCompletionModal] = useState(false)
  const [selectedChapterForCompletion, setSelectedChapterForCompletion] = useState(null)
  
  // State for expandable subjects
  const [expandedSubjects, setExpandedSubjects] = useState(new Set())

  // Test Syllabus state
  const [testSyllabi, setTestSyllabi] = useState([])
  const [showSyllabusDetailsModal, setShowSyllabusDetailsModal] = useState(false)
  const [selectedSyllabusForDetails, setSelectedSyllabusForDetails] = useState(null)

  // Test Details Modal state
  const [showTestDetailsModal, setShowTestDetailsModal] = useState(false)
  const [selectedTestForDetails, setSelectedTestForDetails] = useState(null)
  const [testDetailsLoading, setTestDetailsLoading] = useState(false)
  const [testDetailsData, setTestDetailsData] = useState(null)

  // Load batch enrollment data
  useEffect(() => {
    if (!user) return
    
    loadBatchData()
  }, [user])

  // Removed automatic refresh on focus to prevent 429 errors

  // Removed automatic refresh on location state change to prevent 429 errors

  const loadBatchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        
        // Check if backend is running
        try {
          const healthCheck = await fetch(`${apiUrl}/api/health`)
          if (!healthCheck.ok) {
            console.warn('Backend health check failed, using fallback data')
            setLoading(false)
            return
          }
        } catch (healthError) {
          console.warn('Backend not available, using fallback data:', healthError)
          // Set fallback data for development
          setBatchInfo({
            isEnrolled: true,
            batchName: "NEET 2026 Premium Batch",
            batchType: "NEET",
            isActive: true,
            expiresAt: "2026-01-28T03:46:07.226+00:00"
          })
          setCompletedChapters([])
          setAssignedTests([])
          setTestHistory([])
          setAvailableChapters([])
          setLoading(false)
          return
        }
        
        // Fetch batch-related data with better error handling
        const fetchWithRetry = async (url, options, retries = 1) => {
          for (let i = 0; i <= retries; i++) {
            try {
              const response = await fetch(url, options)
              if (response.ok) {
                return await response.json()
              } else if (response.status === 429) {
                // Don't retry on rate limit, just return null
                console.warn(`Rate limit exceeded for: ${url}`)
                return null
              } else {
                console.warn(`API call failed: ${url}`, response.status)
                return null
              }
            } catch (error) {
              console.warn(`API call error: ${url}`, error)
              if (i === retries) return null
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
            }
          }
          return null
        }
        
        // Fetch data sequentially to avoid overwhelming the server
        const batchData = await fetchWithRetry(`${apiUrl}/api/users/batch-info`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (batchData?.batchEnrollment) {
          setBatchInfo(batchData.batchEnrollment)
        }
        
        const chaptersData = await fetchWithRetry(`${apiUrl}/api/users/completed-chapters`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        
        if (chaptersData?.completedChapters) {
          setCompletedChapters(chaptersData.completedChapters)
        }
        
        const testsData = await fetchWithRetry(`${apiUrl}/api/users/assigned-tests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (testsData?.assignedTests) {
          setAssignedTests(testsData.assignedTests)
        }
        
        const historyData = await fetchWithRetry(`${apiUrl}/api/tests/user/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (historyData?.testHistory) {
          setTestHistory(historyData.testHistory)
        }

        const attemptsSummaryData = await fetchWithRetry(`${apiUrl}/api/tests/user/attempts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (attemptsSummaryData?.summary) {
          setTestAttemptsSummary(attemptsSummaryData.summary)
        }
        
        const syllabusData = await fetchWithRetry(`${apiUrl}/api/users/test-syllabus`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (syllabusData?.syllabus) {
          // Extract all chapters from syllabus for chapter completion
          const allChapters = []
          syllabusData.syllabus.forEach(subject => {
            subject.chapters?.forEach(chapter => {
              allChapters.push({
                ...chapter,
                subjectName: subject.subject.name
              })
            })
          })
          setAvailableChapters(allChapters)
          setSubjectsWithChapters(syllabusData.syllabus)
        }

        // Load test syllabi for assigned tests
        const testSyllabiData = await fetchWithRetry(`${apiUrl}/api/test-syllabus/student/assigned`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (testSyllabiData?.testSyllabi) {
          setTestSyllabi(testSyllabiData.testSyllabi)
        } else {
          setTestSyllabi([])
        }
        
      } catch (error) {
        console.error('Error loading batch data:', error)
        // Don't show error for rate limiting, just set empty data
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          setBatchInfo(null)
          setCompletedChapters([])
          setAssignedTests([])
          setTestHistory([])
          setTestAttemptsSummary(null)
          setAvailableChapters([])
          setSubjectsWithChapters([])
        } else {
          setError('Failed to load batch data. Please try refreshing the page in a few moments.')
        }
      } finally {
        setLoading(false)
      }
    }

  const hasBatchEnrollment = () => {
    return batchInfo && batchInfo.isEnrolled && batchInfo.isActive
  }

  const handleChapterCompletion = async (subjectId, chapterId) => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/users/complete-chapter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chapterId })
      })

      if (response.ok) {
        toast.success('Chapter marked as completed!')
        // Refresh completed chapters with retry
        const chaptersResponse = await fetch(`${apiUrl}/api/users/completed-chapters`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json()
          setCompletedChapters(chaptersData.completedChapters || [])
        }
      } else if (response.status === 429) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to mark chapter as completed')
      }
    } catch (error) {
      console.error('Chapter completion error:', error)
      toast.error('Failed to mark chapter as completed. Please try again.')
    }
  }

  const handleChapterUncompletion = async (subjectId, chapterId) => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/users/uncomplete-chapter`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chapterId })
      })

      if (response.ok) {
        toast.success('Chapter unmarked as completed!')
        // Refresh completed chapters with retry
        const chaptersResponse = await fetch(`${apiUrl}/api/users/completed-chapters`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json()
          setCompletedChapters(chaptersData.completedChapters || [])
        }
      } else if (response.status === 429) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to unmark chapter as completed')
      }
    } catch (error) {
      console.error('Chapter uncompletion error:', error)
      toast.error('Failed to unmark chapter as completed. Please try again.')
    }
  }

  const handleStartTest = async (testId) => {
    // Navigate to the test page
    navigate(`/test/${testId}`)
  }

  const handleOpenTestDetails = async (testId) => {
    try {
      setTestDetailsLoading(true)
      setSelectedTestForDetails(testId)
      setShowTestDetailsModal(true)
      
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      // Fetch test details
      const testResponse = await fetch(`${apiUrl}/api/tests/${testId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!testResponse.ok) {
        throw new Error('Failed to fetch test details')
      }
      
      const testData = await testResponse.json()
      
      // Fetch test attempts for this test
      const attemptsResponse = await fetch(`${apiUrl}/api/tests/user/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      let attemptsData = []
      if (attemptsResponse.ok) {
        const allAttempts = await attemptsResponse.json()
        attemptsData = allAttempts.testHistory.filter(attempt => 
          attempt.testId?._id === testId
        )
      }
      
      // Calculate statistics
      const totalAttempts = attemptsData.length
      const totalQuestions = testData.test.questions?.length || 0
      const totalCorrectAnswers = attemptsData.reduce((sum, attempt) => sum + (attempt.correctAnswers || 0), 0)
      const totalTimeSpent = attemptsData.reduce((sum, attempt) => sum + (attempt.timeTaken || 0), 0)
      
      // Calculate total questions attempted across all attempts
      const totalQuestionsAttempted = attemptsData.reduce((sum, attempt) => {
        // Count questions that were answered (not left blank)
        const answeredQuestions = attempt.answers ? Object.keys(attempt.answers).length : 0
        return sum + answeredQuestions
      }, 0)
      
      const averageScore = totalAttempts > 0 ? Math.round((totalCorrectAnswers / (totalAttempts * totalQuestions)) * 100) : 0
      const bestScore = totalAttempts > 0 ? Math.max(...attemptsData.map(attempt => 
        Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)
      )) : 0
      
      setTestDetailsData({
        test: testData.test,
        attempts: attemptsData,
        statistics: {
          totalAttempts,
          totalQuestions,
          totalCorrectAnswers,
          totalTimeSpent,
          averageScore,
          bestScore,
          totalQuestionsAttempted
        }
      })
      
    } catch (error) {
      console.error('Error loading test details:', error)
      toast.error('Failed to load test details')
    } finally {
      setTestDetailsLoading(false)
    }
  }

  const handleEnrollNow = () => {
    // Navigate to landing page with batch section anchor
    navigate('/')
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const batchSection = document.getElementById('batches')
      if (batchSection) {
        batchSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleRefreshDashboard = () => {
    loadBatchData()
    toast.success('Dashboard refreshed!')
  }

  const toggleSubjectExpansion = (subjectCode) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subjectCode)) {
        newSet.delete(subjectCode)
      } else {
        newSet.add(subjectCode)
      }
      return newSet
    })
  }

  // Group completed chapters by subject
  const getCompletedChaptersBySubject = () => {
    const grouped = {}
    
    // Create a mapping of subject IDs to subject names
    const subjectIdToName = {}
    subjectsWithChapters.forEach(subjectData => {
      if (subjectData.subject && subjectData.subject._id) {
        subjectIdToName[subjectData.subject._id] = subjectData.subject.name
      }
    })
    
    completedChapters.forEach(completed => {
      // Try to get the subject name from the mapping, fallback to subjectId if not found
      const subjectName = subjectIdToName[completed.subjectId] || completed.subjectId || 'Unknown Subject'
      if (!grouped[subjectName]) {
        grouped[subjectName] = []
      }
      grouped[subjectName].push(completed)
    })
    
    return Object.entries(grouped).map(([subjectName, chapters]) => ({
      subjectName,
      chapters
    }))
  }

  // Group test history by subject and chapter
  const getTestHistoryBySubject = () => {
    const grouped = {}
    
    testHistory.forEach(attempt => {
      const test = attempt.testId
      if (!test) return
      
      // Get subject and chapter names
      const subjectName = test.subjectId?.name || 'Unknown Subject'
      const chapterName = test.chapterId?.name || 'Unknown Chapter'
      
      if (!grouped[subjectName]) {
        grouped[subjectName] = {}
      }
      
      if (!grouped[subjectName][chapterName]) {
        grouped[subjectName][chapterName] = []
      }
      
      grouped[subjectName][chapterName].push(attempt)
    })
    
    return Object.entries(grouped).map(([subjectName, chapters]) => ({
      subjectName,
      chapters: Object.entries(chapters).map(([chapterName, attempts]) => ({
        chapterName,
        attempts
      }))
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Welcome back, {user?.name || 'Student'}! 👋
                </h2>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  Track your progress and complete your assigned tests.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">Last Login: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">Platform Status: Active</span>
                  </div>
                  <button
                    onClick={handleRefreshDashboard}
                    className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium">Refresh</span>
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-4xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Enrollment Status */}
        <div className="mb-6 sm:mb-8">
          {hasBatchEnrollment() ? (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Batch Enrolled</h3>
                  <p className="text-green-100">
                    {batchInfo?.batchName} • {batchInfo?.batchType} • Valid until {batchInfo?.expiresAt ? new Date(batchInfo.expiresAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <FaCrown className="text-4xl text-yellow-300" />
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                  <p className="text-orange-100">
                    Enroll in a batch to access all features and track your progress.
                  </p>
                </div>
                <button
                  onClick={handleEnrollNow}
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Grid Layout */}
          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'overview', name: 'Overview', icon: FaChartLine },
              { id: 'completed-chapters', name: 'Completed Chapters', icon: FaCheckCircle },
              { id: 'submit-chapter', name: 'Submit Chapter', icon: FaPlus },
              { id: 'tests-given', name: 'Tests Given', icon: FaTrophy },
              { id: 'my-tests', name: 'My Tests', icon: FaFileAlt },
              { id: 'test-syllabus', name: 'Test Syllabus', icon: FaBook }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!hasBatchEnrollment()}
                  className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-xl font-medium text-xs transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                      : hasBatchEnrollment()
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white border border-gray-200'
                      : 'text-gray-400 cursor-not-allowed opacity-50 bg-white border border-gray-200'
                  }`}
                >
                  <tab.icon className={`${activeTab === tab.id ? 'text-white' : hasBatchEnrollment() ? 'text-gray-500' : 'text-gray-400'} text-lg`} />
                  <span className="text-center leading-tight">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Scrollable Layout */}
          <div className="hidden sm:block">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              <nav className="flex space-x-2 overflow-x-auto scrollbar-hide min-w-0">
                {[
                  { id: 'overview', name: 'Overview', icon: FaChartLine },
                  { id: 'completed-chapters', name: 'Completed Chapters', icon: FaCheckCircle },
                  { id: 'submit-chapter', name: 'Submit Chapter', icon: FaPlus },
                  { id: 'tests-given', name: 'Tests Given', icon: FaTrophy },
                  { id: 'my-tests', name: 'My Tests', icon: FaFileAlt },
                  { id: 'test-syllabus', name: 'Test Syllabus', icon: FaBook }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={!hasBatchEnrollment()}
                    className={`flex items-center space-x-2 py-3 px-4 md:px-6 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-fit ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : hasBatchEnrollment()
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    : 'text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                    <tab.icon className={`${activeTab === tab.id ? 'text-white' : hasBatchEnrollment() ? 'text-gray-500' : 'text-gray-400'} text-base flex-shrink-0`} />
                    <span>{tab.name}</span>
              </button>
            ))}
          </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {hasBatchEnrollment() ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Completed Chapters</h3>
                      <FaCheckCircle className="text-green-500 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{completedChapters.length}</p>
                    <p className="text-gray-600 text-sm">Total chapters completed</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Assigned Tests</h3>
                      <FaFileAlt className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{assignedTests.length}</p>
                    <p className="text-gray-600 text-sm">Tests assigned by admin</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Tests Completed</h3>
                      <FaTrophy className="text-yellow-500 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{testAttemptsSummary?.totalAttempts || testHistory.length}</p>
                    <p className="text-gray-600 text-sm">Tests successfully completed</p>
                  </div>
                </div>

                {testAttemptsSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Average Score</h3>
                        <FaChartLine className="text-blue-500 text-2xl" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{testAttemptsSummary.averageScore}%</p>
                      <p className="text-gray-600 text-sm">Overall performance</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Best Score</h3>
                        <FaTrophy className="text-yellow-500 text-2xl" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{testAttemptsSummary.bestScore}%</p>
                      <p className="text-gray-600 text-sm">Highest achievement</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Total Time</h3>
                        <FaClock className="text-green-500 text-2xl" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{Math.round(testAttemptsSummary.totalTimeSpent / 60)}m</p>
                      <p className="text-gray-600 text-sm">Time spent on tests</p>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {testHistory.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                      <FaFileAlt className="text-purple-500 text-2xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {testHistory.slice(0, 3).map((attempt, index) => (
                        <button
                          key={index}
                          onClick={() => handleOpenTestDetails(attempt.testId?._id)}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-left"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">
                              {attempt.testId?.title || 'Unknown Test'}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Score: {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                            </p>
                          </div>
                          <FaEye className="text-gray-400 text-sm" />
                        </button>
                      ))}
                    </div>
                    {testHistory.length > 3 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setActiveTab('tests-given')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View all {testHistory.length} tests →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                <FaLock className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enroll in Batch to Access</h3>
                <p className="text-gray-600 mb-6">
                  Upgrade to a batch plan to access all features including chapter tracking, test assignments, and progress monitoring.
                </p>
                <button
                  onClick={handleEnrollNow}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  View Batch Plans
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed-chapters' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Completed Chapters</h3>
              <p className="text-gray-600 mt-1">Chapters you have marked as completed, organized by subject</p>
            </div>
            
            {hasBatchEnrollment() ? (
              <div className="p-6">
                {completedChapters.length > 0 ? (
                  <div className="space-y-6">
                    {getCompletedChaptersBySubject().map((subjectData, subjectIndex) => {
                      const { subjectName, chapters } = subjectData
                      
                      // Get subject color based on name
                      const getSubjectColor = (subjectName) => {
                        const name = subjectName?.toLowerCase()
                        if (name?.includes('physics')) return 'blue'
                        if (name?.includes('chemistry')) return 'green'
                        if (name?.includes('biology') || name?.includes('botany') || name?.includes('zoology')) return 'purple'
                        if (name?.includes('math')) return 'orange'
                        return 'gray'
                      }
                      
                      const color = getSubjectColor(subjectName)
                      const colorClasses = {
                        blue: 'bg-blue-50 border-blue-200',
                        green: 'bg-green-50 border-green-200',
                        purple: 'bg-purple-50 border-purple-200',
                        orange: 'bg-orange-50 border-orange-200',
                        gray: 'bg-gray-50 border-gray-200'
                      }
                      
                      const headerColorClasses = {
                        blue: 'text-blue-900',
                        green: 'text-green-900',
                        purple: 'text-purple-900',
                        orange: 'text-orange-900',
                        gray: 'text-gray-900'
                      }
                      
                      const isExpanded = expandedSubjects.has(subjectName)
                      
                      return (
                        <div key={subjectIndex} className={`border rounded-lg p-6 ${colorClasses[color]}`}>
                          <div 
                            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                            onClick={() => toggleSubjectExpansion(subjectName)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center border ${colorClasses[color].replace('bg-', 'border-')}`}>
                                <span className={`text-lg font-bold ${headerColorClasses[color]}`}>
                                  {subjectName.charAt(0)}
                                </span>
                              </div>
                        <div>
                                <h5 className={`text-lg font-semibold ${headerColorClasses[color]}`}>
                                  {subjectName}
                                </h5>
                          <p className="text-sm text-gray-600">
                                  {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} completed
                          </p>
                        </div>
                            </div>
                            <div className="text-right flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white ${headerColorClasses[color]} border ${colorClasses[color].replace('bg-', 'border-')}`}>
                                Completed
                              </span>
                              <div className={`text-lg transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                <FaChevronDown className={headerColorClasses[color]} />
                              </div>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              {chapters.map((completed, chapterIndex) => (
                                <div key={chapterIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h6 className="font-medium text-gray-900 mb-1">
                                        {chapterIndex + 1}. {completed.chapter?.name || 'Unknown Chapter'}
                                      </h6>
                                      <p className="text-xs text-gray-600">
                                        Completed: {completed.completedAt ? new Date(completed.completedAt).toLocaleDateString() : 'N/A'}
                                      </p>
                                    </div>
                                    <div className="ml-3">
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <FaCheckCircle className="mr-1" />
                                        Completed
                                      </span>
                                    </div>
                                  </div>
                      </div>
                    ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No chapters completed yet. Start learning!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enroll in a batch to access this feature.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'submit-chapter' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Submit Completed Chapter</h3>
              <p className="text-gray-600 mt-1">Mark chapters as completed to track your progress</p>
            </div>
            
            {hasBatchEnrollment() ? (
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {batchInfo?.batchType} Subjects & Chapters
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Select chapters you have completed to mark them as done. This will help track your progress across all subjects.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {subjectsWithChapters.length > 0 ? (
                    subjectsWithChapters.map((subjectData, subjectIndex) => {
                      const subject = subjectData.subject
                      const chapters = subjectData.chapters || []
                      
                      // Get subject color based on name
                      const getSubjectColor = (subjectName) => {
                        const name = subjectName?.toLowerCase()
                        if (name?.includes('physics')) return 'blue'
                        if (name?.includes('chemistry')) return 'green'
                        if (name?.includes('biology') || name?.includes('botany') || name?.includes('zoology')) return 'purple'
                        if (name?.includes('math')) return 'orange'
                        return 'gray'
                      }
                      
                      const color = getSubjectColor(subject.name)
                      const colorClasses = {
                        blue: 'bg-blue-50 border-blue-200',
                        green: 'bg-green-50 border-green-200',
                        purple: 'bg-purple-50 border-purple-200',
                        orange: 'bg-orange-50 border-orange-200',
                        gray: 'bg-gray-50 border-gray-200'
                      }
                      
                      const headerColorClasses = {
                        blue: 'text-blue-900',
                        green: 'text-green-900',
                        purple: 'text-purple-900',
                        orange: 'text-orange-900',
                        gray: 'text-gray-900'
                      }
                      
                      const isExpanded = expandedSubjects.has(subject.code || subject.name)
                      
                      return (
                        <div key={subjectIndex} className={`border rounded-lg p-6 ${colorClasses[color]}`}>
                          <div 
                            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                            onClick={() => chapters.length > 0 && toggleSubjectExpansion(subject.code || subject.name)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center border ${colorClasses[color].replace('bg-', 'border-')}`}>
                                <span className={`text-lg font-bold ${headerColorClasses[color]}`}>
                                  {subject.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h5 className={`text-lg font-semibold ${headerColorClasses[color]}`}>
                                  {subject.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} available
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white ${headerColorClasses[color]} border ${colorClasses[color].replace('bg-', 'border-')}`}>
                                {batchInfo?.batchType} Subject
                              </span>
                              {chapters.length > 0 && (
                                <div className={`text-lg transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                  <FaChevronDown className={headerColorClasses[color]} />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {chapters.length === 0 && (
                            <div className="text-center py-6 mt-4">
                              <FaBook className="text-2xl text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">No chapters available for this subject.</p>
                            </div>
                          )}

                          {isExpanded && chapters.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              {chapters.map((chapter, chapterIndex) => {
                                const isCompleted = completedChapters.some(completed => 
                                  completed.chapter?._id === chapter._id
                                )
                                
                                return (
                                  <div key={chapterIndex} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h6 className="font-medium text-gray-900 mb-1">{chapterIndex + 1}. {chapter.name}</h6>
                                        {chapter.description && (
                                          <p className="text-xs text-gray-600 line-clamp-2">{chapter.description}</p>
                                        )}
                                      </div>
                                      <div className="ml-3">
                                        {isCompleted ? (
                                          <button
                                            onClick={() => handleChapterUncompletion(subject.code || subject.name, chapter._id)}
                                            className="bg-white text-gray-700 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center space-x-1 hover:border-red-300 hover:text-red-600"
                                          >
                                            <FaTimes className="text-xs" />
                                            <span>Unmark Complete</span>
                                          </button>
                                        ) : (
                  <button
                                            onClick={() => handleChapterCompletion(subject.code || subject.name, chapter._id)}
                                            className="bg-white text-gray-700 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center space-x-1 hover:border-blue-300 hover:text-blue-600"
                  >
                                            <FaPlus className="text-xs" />
                                            <span>Mark Complete</span>
                  </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No subjects available for your batch type.</p>
                      <p className="text-sm text-gray-500">
                        Contact your admin to add subjects and chapters for {batchInfo?.batchType} batch.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Progress Tracking:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Completed: {completedChapters.length} chapters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaBook className="text-blue-500" />
                      <span>Total: {availableChapters.length} chapters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaChartLine className="text-purple-500" />
                      <span>Progress: {availableChapters.length > 0 ? Math.round((completedChapters.length / availableChapters.length) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enroll in a batch to access this feature.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tests-given' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Tests Given</h3>
              <p className="text-gray-600 mt-1">Your test history and scores, organized by subject and chapter</p>
            </div>
            
            {hasBatchEnrollment() ? (
              <div className="p-6">
                {testHistory.length > 0 ? (
                  <div className="space-y-6">
                    {getTestHistoryBySubject().map((subjectData, subjectIndex) => {
                      const { subjectName, chapters } = subjectData
                      
                      // Get subject color based on name
                      const getSubjectColor = (subjectName) => {
                        const name = subjectName?.toLowerCase()
                        if (name?.includes('physics')) return 'blue'
                        if (name?.includes('chemistry')) return 'green'
                        if (name?.includes('biology') || name?.includes('botany') || name?.includes('zoology')) return 'purple'
                        if (name?.includes('math')) return 'orange'
                        return 'gray'
                      }
                      
                      const color = getSubjectColor(subjectName)
                      const colorClasses = {
                        blue: 'bg-blue-50 border-blue-200',
                        green: 'bg-green-50 border-green-200',
                        purple: 'bg-purple-50 border-purple-200',
                        orange: 'bg-orange-50 border-orange-200',
                        gray: 'bg-gray-50 border-gray-200'
                      }
                      
                      const headerColorClasses = {
                        blue: 'text-blue-900',
                        green: 'text-green-900',
                        purple: 'text-purple-900',
                        orange: 'text-orange-900',
                        gray: 'text-gray-900'
                      }
                      
                      const isExpanded = expandedSubjects.has(subjectName)
                      
                      return (
                        <div key={subjectIndex} className={`border rounded-lg p-6 ${colorClasses[color]}`}>
                          <div 
                            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                            onClick={() => toggleSubjectExpansion(subjectName)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center border ${colorClasses[color].replace('bg-', 'border-')}`}>
                                <span className={`text-lg font-bold ${headerColorClasses[color]}`}>
                                  {subjectName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h5 className={`text-lg font-semibold ${headerColorClasses[color]}`}>
                                  {subjectName}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} with tests
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white ${headerColorClasses[color]} border ${colorClasses[color].replace('bg-', 'border-')}`}>
                                Tests Given
                              </span>
                              <div className={`text-lg transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                <FaChevronDown className={headerColorClasses[color]} />
                              </div>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="space-y-4">
                              {chapters.map((chapterData, chapterIndex) => {
                                const { chapterName, attempts } = chapterData
                                const isChapterExpanded = expandedSubjects.has(`${subjectName}-${chapterName}`)
                                
                                return (
                                  <div key={chapterIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div 
                                      className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                      onClick={() => toggleSubjectExpansion(`${subjectName}-${chapterName}`)}
                                    >
                                      <div>
                                        <h6 className="font-medium text-gray-900">{chapterIndex + 1}. {chapterName}</h6>
                                        <p className="text-sm text-gray-600">
                                          {attempts.length} test{attempts.length !== 1 ? 's' : ''} completed
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          {attempts.length}
                                        </span>
                                        <div className={`text-sm transition-transform duration-200 ${isChapterExpanded ? 'rotate-180' : ''}`}>
                                          <FaChevronDown className="text-gray-500" />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {isChapterExpanded && (
                                      <div className="space-y-3">
                                        {attempts.map((attempt, attemptIndex) => (
                                          <div key={attemptIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                              <h6 className="font-medium text-gray-900">{attempt.testId?.title || 'Unknown Test'}</h6>
                                              <p className="text-sm text-gray-600">
                                                Score: {(attempt.correctAnswers * 4) - ((attempt.totalQuestions - attempt.correctAnswers) * 1)} marks • Completed: {attempt.createdAt ? new Date(attempt.createdAt).toLocaleDateString() : 'N/A'}
                                              </p>
                                            </div>
                                                                                          <div className="text-right flex items-center space-x-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                  {(attempt.correctAnswers * 4) - ((attempt.totalQuestions - attempt.correctAnswers) * 1)} marks
                                                </span>
                                                <button
                                                onClick={() => handleOpenTestDetails(attempt.testId?._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-1"
                                              >
                                                <FaEye className="text-xs" />
                                                <span>Details</span>
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaTrophy className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tests completed yet. Start with your assigned tests!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enroll in a batch to access this feature.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-tests' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">My Tests</h3>
              <p className="text-gray-600 mt-1">Tests assigned by your admin</p>
            </div>
            
            {hasBatchEnrollment() ? (
              <div className="p-6">
                {assignedTests.length > 0 ? (
                  <div className="space-y-4">
                    {assignedTests.map((assigned, index) => {
                      const testDate = assigned.testDate ? new Date(assigned.testDate) : null
                      const now = new Date()
                      
                      let isAvailable = true
                      let timeUntilTest = 0
                      let daysUntilTest = 0
                      
                      if (testDate) {
                        isAvailable = now >= testDate
                        timeUntilTest = testDate - now
                        daysUntilTest = Math.ceil(timeUntilTest / (1000 * 60 * 60 * 24))
                      }
                      
                      const canStart = isAvailable && assigned.status === 'assigned'
                      const isCompleted = assigned.status === 'completed'
                      
                      return (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                                <FaFileAlt className="text-white text-xl" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{assigned.test?.title || 'Untitled Test'}</h3>
                                <p className="text-sm text-gray-600">
                                  {assigned.test?.subjectId?.name || 'Unknown Subject'} • {assigned.test?.chapterId?.name || 'Unknown Chapter'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Assigned: {new Date(assigned.assignedAt).toLocaleDateString()}
                                  {testDate && ` • Test Date: ${testDate.toLocaleDateString()}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {isCompleted ? (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completed
                                </span>
                              ) : canStart ? (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Available
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {daysUntilTest > 0 ? `In ${daysUntilTest} day${daysUntilTest !== 1 ? 's' : ''}` : 'Available Soon'}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-sm text-gray-600">Questions</div>
                              <div className="text-lg font-semibold text-gray-900">{assigned.test?.questions?.length || 0}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-sm text-gray-600">Time Limit</div>
                              <div className="text-lg font-semibold text-gray-900">{assigned.test?.timeLimit || 0} min</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-sm text-gray-600">Difficulty</div>
                              <div className="text-lg font-semibold text-gray-900">{assigned.test?.difficultyLevel || 'Medium'}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-sm text-gray-600">Status</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {isCompleted ? 'Completed' : canStart ? 'Ready' : 'Pending'}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-sm text-gray-600">Assigned Date</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {new Date(assigned.assignedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            {isCompleted ? (
                              <button
                                onClick={() => handleOpenTestDetails(assigned.test._id)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                              >
                                <FaEye className="text-sm" />
                                <span>View Results</span>
                              </button>
                            ) : canStart ? (
                              <button
                                onClick={() => handleStartTest(assigned.test._id)}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                              >
                                <FaPlay className="text-sm" />
                                <span>Start Test</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center space-x-2"
                              >
                                <FaClock className="text-sm" />
                                <span>Not Available</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tests assigned yet. Contact your admin to get started!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enroll in a batch to access this feature.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'test-syllabus' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Test Syllabus</h3>
              <p className="text-gray-600 mt-1">Syllabi for your assigned tests</p>
            </div>
            
            {hasBatchEnrollment() ? (
              <div className="p-6">
                {testSyllabi.length > 0 ? (
                <div className="space-y-6">
                    {testSyllabi.map((testSyllabus, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
                              <FaBook className="text-white text-xl" />
                    </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{testSyllabus.syllabus?.title || 'Untitled Syllabus'}</h3>
                              <p className="text-sm text-gray-600">
                                {testSyllabus.test?.title || 'Unknown Test'} • {testSyllabus.test?.subjectId?.name || 'Unknown Subject'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Test Date: {(() => {
                                  // Find the corresponding assigned test to get the test date
                                  const assignedTest = assignedTests.find(at => at.test?._id === testSyllabus.test?._id)
                                  return assignedTest?.testDate ? new Date(assignedTest.testDate).toLocaleDateString() : 'Not scheduled'
                                })()}
                              </p>
                      </div>
                      </div>
                          <button
                            onClick={() => {
                              setSelectedSyllabusForDetails(testSyllabus)
                              setShowSyllabusDetailsModal(true)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                          >
                            View Details
                          </button>
                  </div>

                        {testSyllabus.syllabus?.description && (
                          <p className="text-gray-600 mb-4">{testSyllabus.syllabus.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <span className="text-gray-600">Topics:</span>
                            <span className="ml-2 font-medium">{testSyllabus.syllabus?.topics?.length || 0}</span>
                          </div>
                        </div>
                  </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <FaBook className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Test Syllabi Available</h3>
                    <p className="text-gray-600 mb-4">Test syllabi will appear here once they are created by your admin for your assigned tests.</p>
                    <p className="text-sm text-gray-500">Contact your admin to create syllabi for your tests.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enroll in a batch to access test syllabi.</p>
              </div>
            )}
          </div>
        )}

        {/* Test Syllabus Details Modal */}
        {showSyllabusDetailsModal && selectedSyllabusForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Test Syllabus Details</h3>
                <button
                  onClick={() => setShowSyllabusDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
                      </div>
              
              <div className="space-y-6">
                {/* Test Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Test Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Test Title:</span>
                      <span className="ml-2 font-medium">{selectedSyllabusForDetails.test?.title || 'Unknown Test'}</span>
                        </div>
                    <div>
                      <span className="text-gray-600">Subject:</span>
                      <span className="ml-2 font-medium">{selectedSyllabusForDetails.test?.subjectId?.name || 'Unknown Subject'}</span>
                        </div>
                    <div>
                      <span className="text-gray-600">Chapter:</span>
                      <span className="ml-2 font-medium">{selectedSyllabusForDetails.test?.chapterId?.name || 'Unknown Chapter'}</span>
                      </div>
                    <div>
                      <span className="text-gray-600">Syllabus Title:</span>
                      <span className="ml-2 font-medium">{selectedSyllabusForDetails.syllabus?.title || 'Untitled Syllabus'}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedSyllabusForDetails.syllabus?.description && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedSyllabusForDetails.syllabus.description}</p>
                    </div>
                  )}

                {/* Topics */}
                {selectedSyllabusForDetails.syllabus?.topics && selectedSyllabusForDetails.syllabus.topics.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Topics</h4>
                    <div className="space-y-3">
                      {selectedSyllabusForDetails.syllabus.topics.map((topic, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{topic.topic}</h5>
                            {topic.weightage > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {topic.weightage}% weightage
                        </span>
                            )}
                      </div>
                          {topic.description && (
                            <p className="text-sm text-gray-600">{topic.description}</p>
                          )}
                        </div>
                      ))}
                        </div>
                  </div>
                )}


              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSyllabusDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test Details Modal */}
        {showTestDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Test Details & Analytics</h3>
                <button
                  onClick={() => {
                    setShowTestDetailsModal(false)
                    setTestDetailsData(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {testDetailsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : testDetailsData ? (
                <div className="space-y-8">
                  {/* Test Information Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">
                          {testDetailsData.test.title}
                        </h4>
                        <p className="text-gray-600">
                          {testDetailsData.test.subjectId?.name} • {testDetailsData.test.chapterId?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {testDetailsData.statistics.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600">Total Questions</div>
                      </div>
                    </div>
                    {testDetailsData.test.description && (
                      <p className="text-gray-700">{testDetailsData.test.description}</p>
                    )}
                  </div>

                  {/* Total Marks Statistics */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {testDetailsData.attempts.length > 0 ? (() => {
                          const totalCorrect = testDetailsData.statistics.totalCorrectAnswers
                          const totalWrong = testDetailsData.statistics.totalQuestionsAttempted - totalCorrect
                          const totalMarks = (totalCorrect * 4) - (totalWrong * 1)
                          return totalMarks
                        })() : 0}
                      </div>
                      <div className="text-lg text-gray-600 mb-1">Total Marks</div>
                      <div className="text-sm text-gray-500">
                        out of {testDetailsData.statistics.totalAttempts * testDetailsData.statistics.totalQuestions * 4} maximum
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {testDetailsData.statistics.totalQuestionsAttempted}
                        </div>
                        <div className="text-sm text-gray-600">Total Questions Attempted</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {testDetailsData.statistics.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600">Total Questions</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {testDetailsData.attempts.length > 0 ? (() => {
                            const totalPossible = testDetailsData.statistics.totalAttempts * testDetailsData.statistics.totalQuestions
                            return totalPossible - testDetailsData.statistics.totalQuestionsAttempted
                          })() : 0}
                        </div>
                        <div className="text-sm text-gray-600">Unattempted</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {Math.round(testDetailsData.statistics.totalTimeSpent / 60)}
                        </div>
                        <div className="text-sm text-gray-600">Total Time (min)</div>
                      </div>
                    </div>
                  </div>



                  {/* Questions with Correct Answers */}
                  {testDetailsData.test.questions && testDetailsData.test.questions.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Questions with Correct Answers</h4>
                      <div className="space-y-6">
                        {testDetailsData.test.questions.map((question, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Question {index + 1}
                                </span>
                                {question.difficulty && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {question.difficulty}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {question.options?.length || 0} options
                              </span>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-gray-900 font-medium leading-relaxed">
                                {question.text || question.question}
                              </p>
                              
                              {/* Question Image */}
                              {question.image && (
                                <div className="mt-3">
                                  <img 
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${question.image.filename}`}
                                    alt="Question"
                                    className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300 shadow-sm"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Options:</h5>
                              {question.options && question.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex} 
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    optionIndex === question.correctAnswer
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                      optionIndex === question.correctAnswer
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-gray-300 bg-white'
                                    }`}>
                                      {optionIndex === question.correctAnswer && (
                                        <FaCheck className="text-white text-xs" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                                                             <span className={`text-sm ${
                                         optionIndex === question.correctAnswer
                                           ? 'text-green-800 font-medium'
                                           : 'text-gray-700'
                                       }`}>
                                         {String.fromCharCode(65 + optionIndex)}. {typeof option === 'string' ? option : (option.text || '')}
                                       </span>
                                      
                                                                             {/* Option Image */}
                                       {typeof option === 'object' && option.image && (
                                         <div className="mt-2">
                                           <img 
                                             src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${option.image.filename}`}
                                             alt="Option"
                                             className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                           />
                                         </div>
                                       )}
                                    </div>
                                    {optionIndex === question.correctAnswer && (
                                      <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex-shrink-0">
                                        Correct Answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Explanation if available */}
                            {(question.explanation || question.explanationImage) && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <h6 className="text-sm font-medium text-blue-900 mb-1">Explanation:</h6>
                                {question.explanation && (
                                  <p className="text-sm text-blue-800 mb-2">{question.explanation}</p>
                                )}
                                {question.explanationImage && question.explanationImage.filename && (
                                  <div className="mt-2">
                                    <img 
                                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${question.explanationImage.filename}`}
                                      alt="Explanation"
                                      className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* User's answers from attempts */}
                            {testDetailsData.attempts.length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <h6 className="text-sm font-medium text-gray-900 mb-2">Your Attempts:</h6>
                                <div className="space-y-2">
                                                                     {testDetailsData.attempts.map((attempt, attemptIndex) => {
                                     const userAnswer = attempt.answers?.find(ans => ans.questionId === question._id)?.selectedOption
                                     const isCorrect = userAnswer === question.correctAnswer
                                     const marks = isCorrect ? '+4' : userAnswer !== undefined ? '-1' : '0'
                                     
                                     return (
                                       <div key={attemptIndex} className="flex items-center justify-between text-sm">
                                         <span className="text-gray-600">
                                           Attempt {attemptIndex + 1}: 
                                           {userAnswer !== undefined ? (
                                             <span className={`ml-2 font-medium ${
                                               isCorrect ? 'text-green-600' : 'text-red-600'
                                             }`}>
                                               {String.fromCharCode(65 + userAnswer)}. {typeof question.options[userAnswer] === 'string' ? question.options[userAnswer] : (question.options[userAnswer]?.text || '')}
                                             </span>
                                           ) : (
                                             <span className="ml-2 text-gray-500">Not answered</span>
                                           )}
                                         </span>
                                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                           isCorrect ? 'bg-green-100 text-green-800' : userAnswer !== undefined ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                         }`}>
                                           {marks} marks
                                         </span>
                                       </div>
                                     )
                                   })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NEET/JEE Performance Analysis */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">NEET/JEE Performance Analysis</h4>
                    <div className="space-y-3 text-sm">
                      {testDetailsData.attempts.length > 0 && (() => {
                        const totalCorrect = testDetailsData.statistics.totalCorrectAnswers
                        const totalWrong = testDetailsData.statistics.totalQuestionsAttempted - totalCorrect
                        const totalUnanswered = (testDetailsData.statistics.totalAttempts * testDetailsData.statistics.totalQuestions) - testDetailsData.statistics.totalQuestionsAttempted
                        const totalNeetScore = (totalCorrect * 4) - (totalWrong * 1)
                        const maxPossibleScore = testDetailsData.statistics.totalAttempts * testDetailsData.statistics.totalQuestions * 4
                        const averageNeetScore = testDetailsData.statistics.totalAttempts > 0 ? Math.round(totalNeetScore / testDetailsData.statistics.totalAttempts) : 0
                        
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Correct Answers:</span>
                              <span className="font-medium text-green-600">+{totalCorrect * 4} marks ({totalCorrect} questions)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Wrong Answers:</span>
                              <span className="font-medium text-red-600">-{totalWrong * 1} marks ({totalWrong} questions)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Unanswered:</span>
                              <span className="font-medium text-gray-600">0 marks ({totalUnanswered} questions)</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-gray-800 font-medium">Net Score:</span>
                              <span className="font-bold text-blue-600">{totalNeetScore} / {maxPossibleScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Average Time per Question:</span>
                              <span className="font-medium">{testDetailsData.statistics.totalQuestionsAttempted > 0 ? Math.round(testDetailsData.statistics.totalTimeSpent / testDetailsData.statistics.totalQuestionsAttempted) : 0}s</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Failed to load test details</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowTestDetailsModal(false)
                    setTestDetailsData(null)
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


export default StudentDashboard 