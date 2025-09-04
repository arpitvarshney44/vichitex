import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
  FaSignOutAlt,
  FaUsers,
  FaGraduationCap,
  FaFlask,
  FaAtom,
  FaLeaf,
  FaPaw,
  FaCalculator,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaCaretDown,
  FaCaretUp,
  FaCaretRight,
  FaPlus,
  FaTrash,
  FaFileAlt,
  FaBook,
  FaSync,
  FaGift,
  FaImage,
  FaDesktop,
  FaMobile,
  FaComments,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCalendar,
  FaClock
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Define NEET and JEE subjects
const NEET_SUBJECTS = [
    { id: 'neet-physics', name: 'Physics', icon: FaAtom, color: 'from-blue-500 to-blue-600' },
    { id: 'neet-chemistry', name: 'Chemistry', icon: FaFlask, color: 'from-green-500 to-green-600' },
    { id: 'neet-botany', name: 'Botany', icon: FaLeaf, color: 'from-emerald-500 to-emerald-600' },
    { id: 'neet-zoology', name: 'Zoology', icon: FaPaw, color: 'from-orange-500 to-orange-600' }
]

const JEE_SUBJECTS = [
    { id: 'jee-physics', name: 'Physics', icon: FaAtom, color: 'from-blue-500 to-blue-600' },
    { id: 'jee-chemistry', name: 'Chemistry', icon: FaFlask, color: 'from-green-500 to-green-600' },
    { id: 'jee-maths', name: 'Mathematics', icon: FaCalculator, color: 'from-purple-500 to-purple-600' }
  ]

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Check if user is logged in and is admin
  useEffect(() => {
    if (!user) {
      navigate('/admin-login')
      return
    }
    
    if (user.role !== 'admin') {
      navigate('/admin-login')
      return
    }
  }, [user, navigate])
  const [activeTab, setActiveTab] = useState('overview')
  const [activeCategory, setActiveCategory] = useState('neet') // 'neet' or 'jee'
  const [expandedSubjects, setExpandedSubjects] = useState(new Set())
  const [expandedChapters, setExpandedChapters] = useState(new Set())
  const [expandedSyllabusSubjects, setExpandedSyllabusSubjects] = useState(new Set())
  const [expandedSyllabusChapters, setExpandedSyllabusChapters] = useState(new Set())
  const [expandedSyllabusTests, setExpandedSyllabusTests] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Image field expansion state
  const [expandedQuestionImages, setExpandedQuestionImages] = useState(new Set())
  const [expandedOptionImages, setExpandedOptionImages] = useState(new Set())
  const [expandedExplanationImages, setExpandedExplanationImages] = useState(new Set())

  // NEET/JEE Management state
  const [categoryData, setCategoryData] = useState({
    neet: { subjects: NEET_SUBJECTS, chapters: {} },
    jee: { subjects: JEE_SUBJECTS, chapters: {} }
  })

  // Chapter and Test Creation state
  const [showChapterForm, setShowChapterForm] = useState(false)
  const [selectedSubjectForChapter, setSelectedSubjectForChapter] = useState(null)
  const [chapterFormData, setChapterFormData] = useState({
    name: '',
    description: ''
  })

  const [showTestForm, setShowTestForm] = useState(false)
  const [selectedChapterForTest, setSelectedChapterForTest] = useState(null)
  const [testFormData, setTestFormData] = useState({
    title: '',
    difficultyLevel: 'medium',
    topicTag: '',
    timeLimit: 60,
    examType: 'neet', // Add exam type field
    questions: []
  })

  // Student Management state
  const [students, setStudents] = useState([])
  const [studentProgress, setStudentProgress] = useState({})
  const [showAssignTestModal, setShowAssignTestModal] = useState(false)
  const [selectedStudentForTest, setSelectedStudentForTest] = useState(null)
  
  // Banner Management state
  const [banners, setBanners] = useState({ desktop: null, mobile: null })
  const [bannerLoading, setBannerLoading] = useState(false)
  const [availableTests, setAvailableTests] = useState([])
  const [filteredTestsForStudent, setFilteredTestsForStudent] = useState([])
  const [selectedTestToAssign, setSelectedTestToAssign] = useState(null)
  const [testAssignmentDate, setTestAssignmentDate] = useState('')
  const [studentBatchInfo, setStudentBatchInfo] = useState(null)
  const [loadingTestsForStudent, setLoadingTestsForStudent] = useState(false)
  
  // Hierarchical test selection state
  const [expandedTestSubjects, setExpandedTestSubjects] = useState(new Set())
  const [expandedTestChapters, setExpandedTestChapters] = useState(new Set())
  const [structuredTestsForStudent, setStructuredTestsForStudent] = useState({})

  // Batch Pricing Management state
  const [batchPricing, setBatchPricing] = useState([])
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [selectedBatchForPricing, setSelectedBatchForPricing] = useState(null)
  const [pricingFormData, setPricingFormData] = useState({
    name: '',
    type: '',
    price: 0,
    originalPrice: 0,
    duration: '',
    features: [],
    description: '',
    subjects: [],
    mcqCount: 45
  })

  // Student Management enhanced state
  const [expandedStudents, setExpandedStudents] = useState(new Set())
  const [studentBatchFilter, setStudentBatchFilter] = useState('all') // 'all', 'neet', 'jee', 'free'
  
  // Batch Assignment state
  const [showBatchAssignmentModal, setShowBatchAssignmentModal] = useState(false)
  const [selectedStudentForBatch, setSelectedStudentForBatch] = useState(null)
  const [selectedBatchForAssignment, setSelectedBatchForAssignment] = useState(null)
  
  // Coupon Management state
  const [coupons, setCoupons] = useState([])
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [selectedCouponForEdit, setSelectedCouponForEdit] = useState(null)
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscount: null,
    minimumAmount: 0,
    usageLimit: 1,
    validFrom: '',
    validUntil: '',
    applicableBatches: [],
    isActive: true
  })
  
  // Student Progress Details state
  const [showProgressDetailsModal, setShowProgressDetailsModal] = useState(false)
  const [selectedStudentForProgress, setSelectedStudentForProgress] = useState(null)
  const [expandedProgressSubjects, setExpandedProgressSubjects] = useState(new Set())

  // Test Details and Edit state
  const [showTestDetailsModal, setShowTestDetailsModal] = useState(false)
  const [selectedTestForDetails, setSelectedTestForDetails] = useState(null)
  const [showEditTestModal, setShowEditTestModal] = useState(false)
  const [selectedTestForEdit, setSelectedTestForEdit] = useState(null)
  const [editTestFormData, setEditTestFormData] = useState({
    title: '',
    difficultyLevel: 'medium',
    topicTag: '',
    timeLimit: 60,
    examType: 'neet', // Add exam type field
    questions: []
  })

  // Question Image Upload state
  const [imageUploadLoading, setImageUploadLoading] = useState({})

  // Test Syllabus state
  const [testSyllabi, setTestSyllabi] = useState([])
  const [showSyllabusForm, setShowSyllabusForm] = useState(false)
  const [selectedTestForSyllabus, setSelectedTestForSyllabus] = useState(null)
  const [syllabusFormData, setSyllabusFormData] = useState({
    title: '',
    description: '',
    topics: []
  })
  const [showEditSyllabusModal, setShowEditSyllabusModal] = useState(false)
  const [selectedSyllabusForEdit, setSelectedSyllabusForEdit] = useState(null)
  const [expandedTests, setExpandedTests] = useState(new Set())

  // Feedback Management state
  const [feedback, setFeedback] = useState([])
  const [feedbackStats, setFeedbackStats] = useState(null)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        await Promise.all([
          loadCategoryData(),
          loadStudentProgress(),
          loadAvailableTests(),
          loadTestSyllabi(),
          loadBatchPricing(),
          loadCoupons(),
          loadBanners(),
          loadFeedback(),
          loadFeedbackStats()
        ])
      } catch (error) {
        setError('Failed to load dashboard data')
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Reload category data when activeCategory changes
  useEffect(() => {
    if (activeCategory) {
      loadCategoryData()
    }
  }, [activeCategory])

  const loadCategoryData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/admin/categories/${activeCategory}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

      if (response.ok) {
        const data = await response.json()
        
        // Map the backend data to include the actual icon components
        const subjectsWithIcons = data.subjects?.map(subject => {
          const iconMap = {
            'FaAtom': FaAtom,
            'FaFlask': FaFlask,
            'FaLeaf': FaLeaf,
            'FaPaw': FaPaw,
            'FaCalculator': FaCalculator
          }
          return {
            ...subject,
            id: subject._id, // Use MongoDB _id as id
            icon: iconMap[subject.icon] || FaAtom // fallback to FaAtom if icon not found
          }
        }) || []
        
        setCategoryData(prev => ({
          ...prev,
          [activeCategory]: {
            subjects: subjectsWithIcons,
            chapters: data.chapters || {}
          }
        }))
      } else if (response.status === 429) {
        console.warn('Rate limited - using default category data')
        // Use default data instead of showing error
        setCategoryData(prev => ({
          ...prev,
          [activeCategory]: {
            subjects: activeCategory === 'neet' ? NEET_SUBJECTS : JEE_SUBJECTS,
            chapters: {}
          }
        }))
      } else {
        console.error('Failed to load category data:', response.status, response.statusText)
        setError('Failed to load category data')
      }
    } catch (error) {
      console.error('Error loading category data:', error)
      setError('Failed to load category data')
    }
  }

  const loadStudentProgress = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/students/progress`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
        setStudentProgress(data.progress || {})
      } else if (response.status === 429) {
        console.warn('Rate limited - using empty student data')
        setStudents([])
        setStudentProgress({})
      } else {
        console.error('Failed to load student progress:', response.status, response.statusText)
        // Use fallback data instead of showing error
        setStudents([])
        setStudentProgress({})
      }
    } catch (error) {
      console.error('Error loading student progress:', error)
      // Use fallback data instead of showing error
      setStudents([])
      setStudentProgress({})
    }
  }

  const loadAvailableTests = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/tests/available`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

      if (response.ok) {
        const data = await response.json()
        setAvailableTests(data.tests || [])
      } else if (response.status === 429) {
        console.warn('Rate limited - using empty tests data')
        // Use empty data instead of showing error
        setAvailableTests([])
      } else if (response.status === 500) {
        console.warn('Server error - using empty tests data')
        // Use empty data instead of showing error for server issues
        setAvailableTests([])
      } else {
        console.error('Failed to load available tests:', response.status, response.statusText)
        setError('Failed to load available tests')
      }
    } catch (error) {
      console.error('Error loading available tests:', error)
      setError('Failed to load available tests')
    }
  }

  const loadTestSyllabi = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/test-syllabus/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()

        setTestSyllabi(data.syllabi || [])
      } else if (response.status === 429) {
        console.warn('Rate limited - using empty syllabus data')
        setTestSyllabi([])
      } else if (response.status === 500) {
        console.warn('Server error - using empty syllabus data')
        setTestSyllabi([])
      } else {
        console.error('Failed to load test syllabi:', response.status, response.statusText)
        setError('Failed to load test syllabi')
      }
    } catch (error) {
      console.error('Error loading test syllabi:', error)
      setError('Failed to load test syllabi')
    }
  }

  const loadBatchPricing = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/batch-pricing`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBatchPricing(data.batches || [])
      } else {
        console.error('Failed to load batch pricing:', response.status, response.statusText)
        setError('Failed to load batch pricing')
      }
    } catch (error) {
      console.error('Error loading batch pricing:', error)
      setError('Failed to load batch pricing')
    }
  }

  const loadCoupons = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/coupons/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCoupons(data.data || [])
      } else {
        console.error('Failed to load coupons:', response.status, response.statusText)
        setError('Failed to load coupons')
      }
    } catch (error) {
      console.error('Error loading coupons:', error)
      setError('Failed to load coupons')
    }
  }

  const loadBanners = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/banners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBanners(data.banners || { desktop: null, mobile: null })
      } else {
        console.error('Failed to load banners:', response.status, response.statusText)
        setError('Failed to load banners')
      }
    } catch (error) {
      console.error('Error loading banners:', error)
      setError('Failed to load banners')
    }
  }

  const loadFeedback = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/feedback`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback || [])
      }
    } catch (error) {
      console.error('Error loading feedback:', error)
    }
  }

  const loadFeedbackStats = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/feedback/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbackStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading feedback stats:', error)
    }
  }

  const handleBannerUpload = async (type, file) => {
    try {
      setBannerLoading(true)
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const formData = new FormData()
      formData.append('banner', file)
      formData.append('type', type) // 'desktop' or 'mobile'

      const response = await fetch(`${API_URL}/api/admin/banners/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setBanners(prev => ({
          ...prev,
          [type]: data.banner
        }))
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} banner uploaded successfully!`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || `Failed to upload ${type} banner`)
      }
    } catch (error) {
      console.error('Error uploading banner:', error)
      toast.error(`Failed to upload ${type} banner`)
    } finally {
      setBannerLoading(false)
    }
  }

  const handleBannerDelete = async (type) => {
    try {
      setBannerLoading(true)
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/admin/banners/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setBanners(prev => ({
          ...prev,
          [type]: null
        }))
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} banner deleted successfully!`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || `Failed to delete ${type} banner`)
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error(`Failed to delete ${type} banner`)
    } finally {
      setBannerLoading(false)
    }
  }

  const handleQuestionImageUpload = async (questionIndex, file, isEditForm = false) => {
    try {
      setImageUploadLoading(prev => ({ ...prev, [questionIndex]: true }))
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(`${API_URL}/api/question-images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (isEditForm) {
          setEditTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, idx) => 
              idx === questionIndex 
                ? { ...q, image: data.image }
                : q
            )
          }))
        } else {
          setTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, idx) => 
              idx === questionIndex 
                ? { ...q, image: data.image }
                : q
            )
          }))
        }
        
        toast.success('Image uploaded successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading question image:', error)
      toast.error('Failed to upload image')
    } finally {
      setImageUploadLoading(prev => ({ ...prev, [questionIndex]: false }))
    }
  }

  const handleQuestionImageDelete = async (questionIndex, filename, isEditForm = false) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/question-images/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        if (isEditForm) {
          setEditTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, idx) => 
              idx === questionIndex 
                ? { ...q, image: null }
                : q
            )
          }))
        } else {
          setTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, idx) => 
              idx === questionIndex 
                ? { ...q, image: null }
                : q
            )
          }))
        }
        
        toast.success('Image deleted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting question image:', error)
      toast.error('Failed to delete image')
    }
  }

  const handleOptionImageUpload = async (questionIndex, optionIndex, file, isEditForm = false) => {
    try {
      setImageUploadLoading(prev => ({ ...prev, [`${questionIndex}-${optionIndex}`]: true }))
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(`${API_URL}/api/question-images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (isEditForm) {
          setEditTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? {
                    ...q,
                    options: q.options.map((opt, oIdx) => 
                      oIdx === optionIndex 
                        ? { ...opt, image: data.image }
                        : opt
                    )
                  }
                : q
            )
          }))
        } else {
          setTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? {
                    ...q,
                    options: q.options.map((opt, oIdx) => 
                      oIdx === optionIndex 
                        ? { ...opt, image: data.image }
                        : opt
                    )
                  }
                : q
            )
          }))
        }
        
        toast.success('Option image uploaded successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to upload option image')
      }
    } catch (error) {
      console.error('Error uploading option image:', error)
      toast.error('Failed to upload option image')
    } finally {
      setImageUploadLoading(prev => ({ ...prev, [`${questionIndex}-${optionIndex}`]: false }))
    }
  }

  const handleOptionImageDelete = async (questionIndex, optionIndex, filename, isEditForm = false) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/question-images/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        if (isEditForm) {
          setEditTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? {
                    ...q,
                    options: q.options.map((opt, oIdx) => 
                      oIdx === optionIndex 
                        ? { ...opt, image: null }
                        : opt
                    )
                  }
                : q
            )
          }))
        } else {
          setTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? {
                    ...q,
                    options: q.options.map((opt, oIdx) => 
                      oIdx === optionIndex 
                        ? { ...opt, image: null }
                        : opt
                    )
                  }
                : q
            )
          }))
        }
        
        toast.success('Option image deleted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete option image')
      }
    } catch (error) {
      console.error('Error deleting option image:', error)
      toast.error('Failed to delete option image')
    }
  }

  const handleExplanationImageUpload = async (questionIndex, file, isEditForm = false) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/question-images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (isEditForm) {
          setEditTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? { ...q, explanationImage: data.image }
                : q
            )
          }))
        } else {
          setTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? { ...q, explanationImage: data.image }
                : q
            )
          }))
        }
        
        toast.success('Explanation image uploaded successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to upload explanation image')
      }
    } catch (error) {
      console.error('Error uploading explanation image:', error)
      toast.error('Failed to upload explanation image')
    }
  }

  const handleExplanationImageDelete = async (questionIndex, filename, isEditForm = false) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/question-images/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        if (isEditForm) {
          setEditTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? { ...q, explanationImage: null }
                : q
            )
          }))
        } else {
          setTestFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIdx) => 
              qIdx === questionIndex 
                ? { ...q, explanationImage: null }
                : q
            )
          }))
        }
        
        toast.success('Explanation image deleted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete explanation image')
      }
    } catch (error) {
      console.error('Error deleting explanation image:', error)
      toast.error('Failed to delete explanation image')
    }
  }

  const toggleSubjectExpansion = (subjectId) => {
    const newExpanded = new Set(expandedSubjects)
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId)
    } else {
      newExpanded.add(subjectId)
    }
    setExpandedSubjects(newExpanded)
  }

  const toggleChapterExpansion = (chapterId) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const toggleSyllabusSubjectExpansion = (subjectId) => {
    const newExpanded = new Set(expandedSyllabusSubjects)
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId)
    } else {
      newExpanded.add(subjectId)
    }
    setExpandedSyllabusSubjects(newExpanded)
  }

  const toggleSyllabusChapterExpansion = (chapterId) => {
    const newExpanded = new Set(expandedSyllabusChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedSyllabusChapters(newExpanded)
  }

  const toggleSyllabusTestExpansion = (testId) => {
    const newExpanded = new Set(expandedSyllabusTests)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedSyllabusTests(newExpanded)
  }

  // Image field expansion toggle functions
  const toggleQuestionImageExpansion = (questionIndex) => {
    const newExpanded = new Set(expandedQuestionImages)
    const key = `question-${questionIndex}`
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedQuestionImages(newExpanded)
  }

  const toggleOptionImageExpansion = (questionIndex, optionIndex) => {
    const newExpanded = new Set(expandedOptionImages)
    const key = `option-${questionIndex}-${optionIndex}`
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedOptionImages(newExpanded)
  }

  const toggleExplanationImageExpansion = (questionIndex) => {
    const newExpanded = new Set(expandedExplanationImages)
    const key = `explanation-${questionIndex}`
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedExplanationImages(newExpanded)
  }

  const handleAddChapter = (subjectId) => {
    setSelectedSubjectForChapter(subjectId)
    setChapterFormData({ name: '', description: '' })
    setShowChapterForm(true)
  }

  const handleChapterSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/admin/chapters`, {
        method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subjectId: selectedSubjectForChapter,
          ...chapterFormData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create chapter')
      }

      const data = await response.json()
      
      // Add the new chapter to the local state
      setCategoryData(prev => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          chapters: {
            ...prev[activeCategory].chapters,
            [selectedSubjectForChapter]: [
              ...(prev[activeCategory].chapters[selectedSubjectForChapter] || []),
              data.chapter
            ]
          }
        }
      }))

      toast.success('Chapter created successfully!')
      setShowChapterForm(false)
      setSelectedSubjectForChapter(null)
      setChapterFormData({ name: '', description: '' })
      
      // Refresh the category data to get updated chapters
      loadCategoryData()
    } catch (error) {
      console.error('Chapter submission error:', error)
      toast.error(error.message)
    }
  }

  const handleCreateTest = (chapterId, subjectId, subjectName) => {
    setSelectedChapterForTest({ chapterId, subjectId, subjectName })
    setTestFormData({
          title: '',
      difficultyLevel: 'medium',
      topicTag: '',
          timeLimit: 60,
      examType: 'neet', // Set default exam type
      questions: []
    })
    setShowTestForm(true)
  }

  const handleDeleteChapter = async (chapterId, subjectId) => {
    if (!window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/admin/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Chapter deleted successfully!')
        
        // Refresh the category data to update the UI
        loadCategoryData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete chapter')
      }
    } catch (error) {
      console.error('Delete chapter error:', error)
      toast.error('Failed to delete chapter')
    }
  }

  const addQuestion = () => {
    setTestFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: [
            { text: '', image: null },
            { text: '', image: null },
            { text: '', image: null },
            { text: '', image: null }
          ],
          correctAnswer: 0,
          image: null,
          explanation: '',
          explanationImage: null
        }
      ]
    }))
  }

  const updateTestQuestion = (index, field, value) => {
    setTestFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateTestOption = (questionIndex, optionIndex, value) => {
    setTestFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((opt, j) => 
                j === optionIndex 
                  ? { ...opt, text: value }
                  : opt
              ) 
            }
          : q
      )
    }))
  }

  const removeQuestion = (index) => {
    setTestFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const handleTestSubmit = async (e) => {
    e.preventDefault()
    
    if (testFormData.questions.length < 1) {
      toast.error('Please add at least 1 question')
      return
    }



    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const requestData = {
        chapterId: selectedChapterForTest.chapterId,
        subjectId: selectedChapterForTest.subjectId, // Send actual subject ID, not name
        ...testFormData
      }
      

      
      const response = await fetch(`${API_URL}/api/admin/tests`, {
        method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create test')
      }

      toast.success('Test created successfully!')
      setShowTestForm(false)
      setSelectedChapterForTest(null)
      setTestFormData({
        title: '',
        difficultyLevel: 'medium',
        topicTag: '',
        timeLimit: 60,
        examType: 'neet',
        questions: []
      })
      loadAvailableTests() // Refresh available tests
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Helper function to structure tests hierarchically
  const structureTestsBySubjectAndChapter = (tests) => {
    const structured = {}
    
    tests.forEach(test => {
      const subjectName = test.subjectId?.name || 'Unknown Subject'
      const chapterName = test.chapterId?.name || 'Unknown Chapter'
      
      if (!structured[subjectName]) {
        structured[subjectName] = {}
      }
      
      if (!structured[subjectName][chapterName]) {
        structured[subjectName][chapterName] = []
      }
      
      structured[subjectName][chapterName].push(test)
    })
    
    return structured
  }

  // Toggle functions for hierarchical test selection
  const toggleTestSubjectExpansion = (subjectName) => {
    const newExpanded = new Set(expandedTestSubjects)
    if (newExpanded.has(subjectName)) {
      newExpanded.delete(subjectName)
    } else {
      newExpanded.add(subjectName)
    }
    setExpandedTestSubjects(newExpanded)
  }

  const toggleTestChapterExpansion = (chapterName) => {
    const newExpanded = new Set(expandedTestChapters)
    if (newExpanded.has(chapterName)) {
      newExpanded.delete(chapterName)
    } else {
      newExpanded.add(chapterName)
    }
    setExpandedTestChapters(newExpanded)
  }

  const handleAssignTest = async (studentId) => {
    setSelectedStudentForTest(studentId)
    setSelectedTestToAssign(null)
    setTestAssignmentDate('')
    setStudentBatchInfo(null)
    setLoadingTestsForStudent(true)
    
    try {
      // Get student batch info
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/tests/for-student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStudentBatchInfo(data.studentBatch)
        
        // Use the tests returned by the backend (already filtered)
        setFilteredTestsForStudent(data.tests || [])
        
        // Structure the tests hierarchically
        const structured = structureTestsBySubjectAndChapter(data.tests || [])
        setStructuredTestsForStudent(structured)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to load tests for student')
        setFilteredTestsForStudent([])
        setStructuredTestsForStudent({})
      }
    } catch (error) {
      console.error('Error loading tests for student:', error)
      toast.error('Failed to load tests for student')
      setFilteredTestsForStudent([])
      setStructuredTestsForStudent({})
    } finally {
      setLoadingTestsForStudent(false)
    }
    
    setShowAssignTestModal(true)
  }

  const handleAssignTestSubmit = async () => {
    if (!selectedTestToAssign) {
      toast.error('Please select a test to assign')
      return
    }

    if (!testAssignmentDate) {
      toast.error('Please select a test date')
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/assign-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: selectedStudentForTest,
          testId: selectedTestToAssign,
          testDate: testAssignmentDate
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign test')
      }

      toast.success('Test assigned successfully!')
      setShowAssignTestModal(false)
      setSelectedStudentForTest(null)
      setSelectedTestToAssign(null)
      setTestAssignmentDate('')
      
      // Show loading state and refresh student data to show updated assigned tests
      toast.loading('Refreshing student data...', { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for better UX
      await loadStudentProgress()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Batch Assignment handlers
  const handleAssignBatch = (student) => {
    setSelectedStudentForBatch(student)
    setSelectedBatchForAssignment(null)
    setShowBatchAssignmentModal(true)
  }

  const handleBatchAssignmentSubmit = async () => {
    if (!selectedBatchForAssignment) {
      toast.error('Please select a batch to assign')
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/assign-batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: selectedStudentForBatch._id,
          batchId: selectedBatchForAssignment
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign batch')
      }

      toast.success('Batch assigned successfully!')
      setShowBatchAssignmentModal(false)
      setSelectedStudentForBatch(null)
      setSelectedBatchForAssignment(null)
      
      // Refresh student data to show updated enrollment
      toast.loading('Refreshing student data...', { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 500))
      await loadStudentProgress()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRemoveBatch = async (student) => {
    if (!window.confirm(`Are you sure you want to remove ${student.name} from their current batch? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/remove-batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: student._id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove batch')
      }

      toast.success('Batch removed successfully!')
      
      // Refresh student data to show updated enrollment
      toast.loading('Refreshing student data...', { duration: 1000 })
      await new Promise(resolve => setTimeout(resolve, 500))
      await loadStudentProgress()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Progress Details handlers
  const handleViewProgressDetails = (student) => {
    setSelectedStudentForProgress(student)
    setShowProgressDetailsModal(true)
  }

  const handleViewTestDetails = (test) => {
    setSelectedTestForDetails(test)
    setShowTestDetailsModal(true)
  }

  const handleEditTest = (test) => {
    setSelectedTestForEdit(test)
    
    // Process questions to ensure backward compatibility with explanationImage field
    const processedQuestions = (test.questions || []).map(question => ({
      ...question,
      explanationImage: question.explanationImage || null, // Ensure explanationImage field exists
      options: (question.options || []).map(option => ({
        text: typeof option === 'string' ? option : (option.text || ''),
        image: typeof option === 'object' && option.image ? option.image : null
      }))
    }))
    
    setEditTestFormData({
      title: test.title,
      difficultyLevel: test.difficultyLevel,
      topicTag: test.topicTag || '',
      timeLimit: test.timeLimit,
      examType: test.examType || 'neet', // Add exam type field
      questions: processedQuestions
    })
    setShowEditTestModal(true)
  }

  const handleEditTestSubmit = async (e) => {
    e.preventDefault()
    
    if (editTestFormData.questions.length < 1) {
      toast.error('Please add at least 1 question')
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/admin/tests/${selectedTestForEdit._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editTestFormData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update test')
      }

      toast.success('Test updated successfully!')
      setShowEditTestModal(false)
      setSelectedTestForEdit(null)
      loadAvailableTests() // Refresh the tests list
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addEditQuestion = () => {
    setEditTestFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: [
            { text: '', image: null },
            { text: '', image: null },
            { text: '', image: null },
            { text: '', image: null }
          ],
          correctAnswer: 0,
          image: null,
          explanation: '',
          explanationImage: null
        }
      ]
    }))
  }

  const updateEditTestQuestion = (index, field, value) => {
    setEditTestFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateEditTestOption = (questionIndex, optionIndex, value) => {
    setEditTestFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        questionIndex === i 
          ? { 
              ...q, 
              options: q.options.map((opt, j) => 
                j === optionIndex 
                  ? { ...opt, text: value }
                  : opt
              ) 
            }
          : q
      )
    }))
  }

  const removeEditQuestion = (index) => {
    setEditTestFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const toggleStudentExpansion = (studentId) => {
    const newExpanded = new Set(expandedStudents)
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId)
    } else {
      newExpanded.add(studentId)
    }
    setExpandedStudents(newExpanded)
  }

  const toggleTestExpansion = (testId) => {
    const newExpanded = new Set(expandedTests)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedTests(newExpanded)
  }

  // Group tests by subject and chapter for the Tests tab
  const getTestsBySubject = () => {
    const grouped = {}
    
    availableTests.forEach(test => {
      const subjectName = test.subjectId?.name || 'Unknown Subject'
      const chapterName = test.chapterId?.name || 'Unknown Chapter'
      
      if (!grouped[subjectName]) {
        grouped[subjectName] = {}
      }
      if (!grouped[subjectName][chapterName]) {
        grouped[subjectName][chapterName] = []
      }
      grouped[subjectName][chapterName].push(test)
    })
    
    return Object.entries(grouped).map(([subjectName, chapters]) => ({
      subjectName,
      chapters: Object.entries(chapters).map(([chapterName, tests]) => ({
        chapterName,
        tests
      }))
    }))
  }



  const getEnrollmentStatus = (student) => {
    if (student.batchEnrollment?.isEnrolled) {
      return {
        type: 'batch',
        status: 'Enrolled',
        batchName: student.batchEnrollment.batchName,
        batchType: student.batchEnrollment.batchType,
        enrolledAt: student.batchEnrollment.enrolledAt,
        expiresAt: student.batchEnrollment.expiresAt,
        isActive: student.batchEnrollment.isActive
      }
    } else {
      return {
        type: 'free',
        status: 'Free Plan',
        batchName: null,
        batchType: null,
        enrolledAt: null,
        expiresAt: null,
        isActive: false
      }
    }
  }

  // Filter students based on batch type and sort alphabetically
  const getFilteredStudents = () => {
    let filteredStudents
    if (studentBatchFilter === 'all') {
      filteredStudents = students
    } else {
      filteredStudents = students.filter(student => {
        const enrollment = getEnrollmentStatus(student)
        if (studentBatchFilter === 'FREE') {
          return enrollment.type === 'free'
        }
        return enrollment.batchType && enrollment.batchType.toUpperCase() === studentBatchFilter
      })
    }
    
    // Sort students alphabetically by name
    return filteredStudents.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()
      return nameA.localeCompare(nameB)
    })
  }

  const getSyllabiForTest = (testId) => {
    console.log('Looking for syllabi for testId:', testId)
    console.log('Available syllabi:', testSyllabi)
    
    const filteredSyllabi = testSyllabi.filter(syllabus => {
      // Handle both string and ObjectId comparisons
      const syllabusTestId = typeof syllabus.testId === 'object' ? syllabus.testId._id : syllabus.testId
      console.log('Comparing:', syllabusTestId, 'with', testId, 'Result:', syllabusTestId === testId)
      return syllabusTestId === testId
    })
    
    console.log('Filtered syllabi for test', testId, ':', filteredSyllabi)
    return filteredSyllabi
  }

  // Test Syllabus handlers
  const handleViewSyllabusDetails = (syllabus) => {
    setSelectedSyllabusForEdit(syllabus)
    setShowEditSyllabusModal(true)
  }

  const handleEditSyllabus = (syllabus) => {
    setSelectedSyllabusForEdit(syllabus)
    setSyllabusFormData({
      title: syllabus.title,
      description: syllabus.description,
      topics: syllabus.topics || []
    })
    setShowEditSyllabusModal(true)
  }

  const handleSyllabusSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/test-syllabus/admin/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: selectedTestForSyllabus,
          ...syllabusFormData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create syllabus')
      }

      toast.success('Syllabus created successfully!')
      setShowSyllabusForm(false)
      setSelectedTestForSyllabus(null)
      setSyllabusFormData({
        title: '',
        description: '',
        topics: []
      })
      loadTestSyllabi()
    } catch (error) {
      console.error('Syllabus submission error:', error)
      toast.error(error.message)
    }
  }

  const handleEditSyllabusSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_URL}/api/test-syllabus/admin/${selectedSyllabusForEdit._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(syllabusFormData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update syllabus')
      }

      toast.success('Syllabus updated successfully!')
      setShowEditSyllabusModal(false)
      setSelectedSyllabusForEdit(null)
      setSyllabusFormData({
        title: '',
        description: '',
        topics: []
      })
      loadTestSyllabi()
    } catch (error) {
      console.error('Syllabus update error:', error)
      toast.error(error.message)
    }
  }

  const addTopic = () => {
    setSyllabusFormData(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        { topic: '', description: '', weightage: 0 }
      ]
    }))
  }

  const updateTopic = (index, field, value) => {
    setSyllabusFormData(prev => ({
      ...prev,
      topics: prev.topics.map((topic, i) => 
        i === index ? { ...topic, [field]: value } : topic
      )
    }))
  }

  const removeTopic = (index) => {
    setSyllabusFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }))
  }

  const handleEditPricing = (batch) => {
    setSelectedBatchForPricing(batch)
    setPricingFormData({
      name: batch.name,
      type: batch.type,
      price: batch.price,
      originalPrice: batch.originalPrice,
      duration: batch.duration,
      features: batch.features || [],
      description: batch.description || '',
      subjects: batch.subjects || [],
      mcqCount: batch.mcqCount || 45
    })
    setShowPricingModal(true)
  }

  const handlePricingSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/batch-pricing/${selectedBatchForPricing._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pricingFormData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update batch pricing')
      }

      toast.success('Batch pricing updated successfully!')
      setShowPricingModal(false)
      setSelectedBatchForPricing(null)
      loadBatchPricing() // Refresh pricing data
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addFeature = () => {
    setPricingFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index, value) => {
    setPricingFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index) => {
    setPricingFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  // Coupon Management functions
  const handleCreateCoupon = () => {
    setSelectedCouponForEdit(null)
    setCouponFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscount: null,
      minimumAmount: 0,
      usageLimit: 1,
      validFrom: '',
      validUntil: '',
      applicableBatches: [],
      isActive: true
    })
    setShowCouponModal(true)
  }

  const handleEditCoupon = (coupon) => {
    setSelectedCouponForEdit(coupon)
    setCouponFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minimumAmount: coupon.minimumAmount,
      usageLimit: coupon.usageLimit,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      applicableBatches: coupon.applicableBatches || [],
      isActive: coupon.isActive
    })
    setShowCouponModal(true)
  }

  const handleCouponSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const url = selectedCouponForEdit 
        ? `${API_URL}/api/coupons/admin/${selectedCouponForEdit._id}`
        : `${API_URL}/api/coupons/admin/create`
      
      const method = selectedCouponForEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(couponFormData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save coupon')
      }

      toast.success(selectedCouponForEdit ? 'Coupon updated successfully!' : 'Coupon created successfully!')
      setShowCouponModal(false)
      setSelectedCouponForEdit(null)
      loadCoupons() // Refresh coupons list
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/coupons/admin/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Coupon deleted successfully!')
        loadCoupons() // Refresh coupons list
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete coupon')
      }
    } catch (error) {
      console.error('Delete coupon error:', error)
      toast.error('Failed to delete coupon')
    }
  }

  const toggleBatchType = (batchType) => {
    setCouponFormData(prev => ({
      ...prev,
      applicableBatches: prev.applicableBatches.includes(batchType)
        ? prev.applicableBatches.filter(type => type !== batchType)
        : [...prev.applicableBatches, batchType]
    }))
  }

  const toggleProgressSubjectExpansion = (subjectName) => {
    const newExpanded = new Set(expandedProgressSubjects)
    if (newExpanded.has(subjectName)) {
      newExpanded.delete(subjectName)
    } else {
      newExpanded.add(subjectName)
    }
    setExpandedProgressSubjects(newExpanded)
  }

  // Feedback Management Functions
  const handleUpdateFeedbackStatus = async (feedbackId, status) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/feedback/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success('Feedback status updated successfully')
        loadFeedback()
        loadFeedbackStats()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update feedback status')
      }
    } catch (error) {
      console.error('Error updating feedback status:', error)
      toast.error('Failed to update feedback status')
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Feedback deleted successfully')
        loadFeedback()
        loadFeedbackStats()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete feedback')
      }
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast.error('Failed to delete feedback')
    }
  }

  // Delete test handler
  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/admin/tests/${testId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete test')
      }

      toast.success('Test deleted successfully!')
      loadAvailableTests() // Refresh tests list
    } catch (error) {
      console.error('Delete test error:', error)
      toast.error(error.message)
    }
  }

  // Delete test syllabus handler
  const handleDeleteTestSyllabus = async (syllabusId) => {
    if (!window.confirm('Are you sure you want to delete this test syllabus? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/test-syllabus/admin/${syllabusId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete test syllabus')
      }

      toast.success('Test syllabus deleted successfully!')
      loadTestSyllabi() // Refresh syllabi list
    } catch (error) {
      console.error('Delete test syllabus error:', error)
      toast.error(error.message)
    }
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
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-4">Access Denied</div>
          <div className="text-gray-600 mb-4">Please log in as an admin to access this dashboard.</div>
          <button
            onClick={() => navigate('/admin-login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Admin Login
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
                  Welcome back, {user?.name || 'Admin'}! 👋
                </h2>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  Manage NEET/JEE content and monitor student progress.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">Last Login: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">Platform Status: Active</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaGraduationCap className="text-white text-4xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Grid Layout */}
          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-2">
                              {[
                  { id: 'neet-jee', name: 'NEET/JEE', icon: FaGraduationCap },
                  { id: 'tests', name: 'Tests', icon: FaFileAlt },
                  { id: 'test-syllabus', name: 'Test Syllabus', icon: FaBook },
                  { id: 'student-management', name: 'Student Management', icon: FaUsers },
                  { id: 'batch-pricing', name: 'Batch Pricing', icon: FaEnvelope },
                  { id: 'coupon-management', name: 'Coupons', icon: FaGift },
                  { id: 'banner-management', name: 'Banner', icon: FaImage },
                  { id: 'feedback', name: 'Feedback', icon: FaComments }
                ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-xl font-medium text-xs transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white border border-gray-200'
                  }`}
                >
                  <tab.icon className={`${activeTab === tab.id ? 'text-white' : 'text-gray-500'} text-lg`} />
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
                  { id: 'neet-jee', name: 'NEET/JEE', icon: FaGraduationCap },
                  { id: 'tests', name: 'Tests', icon: FaFileAlt },
                  { id: 'test-syllabus', name: 'Test Syllabus', icon: FaBook },
                  { id: 'student-management', name: 'Student Management', icon: FaUsers },
                  { id: 'batch-pricing', name: 'Batch Pricing', icon: FaEnvelope },
                  { id: 'coupon-management', name: 'Coupon Management', icon: FaGift },
                  { id: 'banner-management', name: 'Banner Management', icon: FaImage },
                  { id: 'feedback', name: 'Feedback', icon: FaComments }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-4 md:px-6 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-fit ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`${activeTab === tab.id ? 'text-white' : 'text-gray-500'} text-base flex-shrink-0`} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'neet-jee' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveCategory('neet')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'neet'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  NEET
                </button>
                <button
                  onClick={() => setActiveCategory('jee')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'jee'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JEE
                </button>
              </div>

              {/* Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData[activeCategory]?.subjects?.map((subject) => (
                  <div key={subject.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`bg-gradient-to-br ${subject.color} p-3 rounded-lg`}>
                          <subject.icon className="text-white text-xl" />
                      </div>
                        <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                    </div>
                      <button
                        onClick={() => toggleSubjectExpansion(subject.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {expandedSubjects.has(subject.id) ? <FaCaretDown /> : <FaCaretRight />}
                      </button>
                </div>

                    {/* Chapters List */}
                    {expandedSubjects.has(subject.id) && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Chapters</h4>
                          <button
                            onClick={() => handleAddChapter(subject.id)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-1"
                          >
                            <FaPlus className="text-xs" />
                            <span>Add Chapter</span>
                          </button>
              </div>
                        
                                                <div className="space-y-2">
                          {categoryData[activeCategory]?.chapters?.[subject.id]?.map((chapter, index) => (
                            <div key={chapter._id} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-900">{index + 1}. {chapter.name}</h5>
                                  {chapter.description && (
                                    <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => handleDeleteChapter(chapter._id, subject.id)}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-1"
                                  >
                                    <FaTrash className="text-xs" />
                                    <span>Delete</span>
                                  </button>
                                </div>
            </div>
                </div>
                          )) || (
                            <div className="text-gray-500 text-sm text-center py-4">
                              No chapters added yet. Click "Add Chapter" to get started.
              </div>
                          )}
              </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'student-management' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Student Management</h3>
                  <p className="text-gray-600 mt-1">Monitor student progress and assign tests</p>
                </div>
                <button
                  onClick={async () => {
                    toast.loading('Refreshing student data...', { duration: 1000 })
                    await loadStudentProgress()
                  }}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
                >
                  <FaSync className="text-sm" />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
              </div>
              
            {/* Batch Type Filter */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Filter by Batch Type:</span>
                  <button
                  onClick={() => setStudentBatchFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    studentBatchFilter === 'all'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                  All Students
                  </button>
                  <button
                  onClick={() => setStudentBatchFilter('NEET')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    studentBatchFilter === 'NEET'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                  NEET
                  </button>
                  <button
                  onClick={() => setStudentBatchFilter('JEE')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    studentBatchFilter === 'JEE'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                  JEE
                  </button>
                  <button
                  onClick={() => setStudentBatchFilter('FREE')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    studentBatchFilter === 'FREE'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                  Free Plan
                  </button>
                </div>
                </div>
            
            {/* Student Stats Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Students */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{students?.length || 0}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                      <FaUsers className="text-white text-xl" />
                    </div>
              </div>
                          </div>
              
                {/* Free Plan Students */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Free Plan Students</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {students?.filter(student => {
                          const enrollment = getEnrollmentStatus(student)
                          return enrollment.type === 'free'
                        }).length || 0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    </div>
                    </div>
                
                {/* NEET Students */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">NEET Students</p>
                      <p className="text-2xl font-bold text-red-600">
                        {students?.filter(student => {
                          const enrollment = getEnrollmentStatus(student)
                          return enrollment.batchType && enrollment.batchType.toUpperCase() === 'NEET'
                        }).length || 0}
                      </p>
                  </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg">
                      <FaGraduationCap className="text-white text-xl" />
                </div>
                  </div>
                </div>
                
                {/* JEE Students */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">JEE Students</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {students?.filter(student => {
                          const enrollment = getEnrollmentStatus(student)
                          return enrollment.batchType && enrollment.batchType.toUpperCase() === 'JEE'
                        }).length || 0}
                      </p>
                  </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                      <FaAtom className="text-white text-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              {getFilteredStudents()?.length > 0 ? (
                  <div className="space-y-4 sm:space-y-6">
                  {getFilteredStudents().map((student, index) => {
                    const enrollment = getEnrollmentStatus(student)
                    const progress = studentProgress[student._id] || {}
                    
                    return (
                      <div key={student._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200">
                        {/* Student Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Serial Number */}
                            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-sm sm:text-base flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-medium text-base sm:text-lg">
                                {student.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{student.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{student.email}</p>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  enrollment.type === 'batch' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {enrollment.status}
                                </span>
                                {enrollment.type === 'batch' && enrollment.batchName && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {enrollment.batchName}
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  📱 {student.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => toggleStudentExpansion(student._id)}
                              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                            >
                              {expandedStudents.has(student._id) ? <FaCaretDown /> : <FaCaretRight />}
                            </button>
                            {enrollment.type === 'free' && (
                              <button 
                                onClick={() => handleAssignBatch(student)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center space-x-1"
                              >
                                <FaGraduationCap className="text-xs" />
                                <span className="hidden sm:inline">Assign Batch</span>
                                <span className="sm:hidden">Batch</span>
                              </button>
                            )}
                            {enrollment.type === 'batch' && (
                              <button 
                                onClick={() => handleRemoveBatch(student)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-1"
                              >
                                <FaTimes className="text-xs" />
                                <span className="hidden sm:inline">Remove Batch</span>
                                <span className="sm:hidden">Remove</span>
                              </button>
                            )}
                            <button 
                              onClick={() => handleAssignTest(student._id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-1"
                            >
                              <FaPlus className="text-xs" />
                              <span className="hidden sm:inline">Assign Test</span>
                              <span className="sm:hidden">Assign</span>
                            </button>
                          </div>
                        </div>



                        {/* Expanded Details */}
                        {expandedStudents.has(student._id) && (
                          <div className="border-t border-gray-200 pt-4 space-y-4">
                            {/* Progress Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Progress Summary</h4>
                                <button
                                  onClick={() => handleViewProgressDetails(student)}
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-1"
                                >
                                  <FaBook className="text-xs" />
                                  <span>View Details</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                <div className="text-center">
                                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{progress.completedChapters || 0}</div>
                                  <div className="text-xs text-gray-600">Chapters Completed</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xl sm:text-2xl font-bold text-green-600">{progress.assignedTests || 0}</div>
                                  <div className="text-xs text-gray-600">Tests Assigned</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xl sm:text-2xl font-bold text-purple-600">{progress.completedTests || 0}</div>
                                  <div className="text-xs text-gray-600">Tests Completed</div>
                                </div>
                              </div>
                            </div>
                            {/* Enrollment Details */}
                            {enrollment.type === 'batch' && (
                              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Batch Enrollment Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                  <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-gray-600 sm:mr-2">Batch Name:</span>
                                    <span className="font-medium truncate">{enrollment.batchName}</span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-gray-600 sm:mr-2">Batch Type:</span>
                                    <span className="font-medium capitalize">{enrollment.batchType}</span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-gray-600 sm:mr-2">Enrolled:</span>
                                    <span className="font-medium">
                                      {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-gray-600 sm:mr-2">Expires:</span>
                                    <span className="font-medium">
                                      {enrollment.expiresAt ? new Date(enrollment.expiresAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaUsers className="text-gray-400 text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {studentBatchFilter === 'all' ? 'No Students Found' : 
                     studentBatchFilter === 'FREE' ? 'No Free Plan Students Found' : 
                     `No ${studentBatchFilter} Students Found`}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {studentBatchFilter === 'all' 
                      ? 'Students will appear here once they register and become active.'
                      : studentBatchFilter === 'FREE'
                      ? 'Free plan students will appear here once they register without enrolling in a paid batch.'
                      : `${studentBatchFilter} students will appear here once they enroll in ${studentBatchFilter} batches.`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveCategory('neet')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'neet'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  NEET
                </button>
                <button
                  onClick={() => setActiveCategory('jee')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'jee'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JEE
                </button>
              </div>

              {/* Subjects Grid with Chapters and Create Test Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData[activeCategory]?.subjects?.map((subject) => (
                  <div key={subject.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                        <div className={`bg-gradient-to-br ${subject.color} p-3 rounded-lg`}>
                          <subject.icon className="text-white text-xl" />
                          </div>
                        <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                        </div>
                        <button
                        onClick={() => toggleSubjectExpansion(subject.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                        {expandedSubjects.has(subject.id) ? <FaCaretDown /> : <FaCaretRight />}
                        </button>
                      </div>

                    {/* Chapters List */}
                    {expandedSubjects.has(subject.id) && (
                      <div className="space-y-3">
                          <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Chapters</h4>
                          </div>
                          
                        <div className="space-y-2">
                          {categoryData[activeCategory]?.chapters?.[subject.id]?.map((chapter, index) => {
                            // Find tests for this chapter
                            const chapterTests = availableTests.filter(test => 
                              test.chapterId?._id === chapter._id || test.chapterId === chapter._id
                            )
                            
                              return (
                              <div key={chapter._id} className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{index + 1}. {chapter.name}</h5>
                                    {chapter.description && (
                                      <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">{chapterTests.length} test{chapterTests.length !== 1 ? 's' : ''}</span>
                                    {chapterTests.length > 0 && (
                                      <button
                                        onClick={() => toggleChapterExpansion(chapter._id)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                                      >
                                        {expandedChapters.has(chapter._id) ? <FaCaretDown /> : <FaCaretRight />}
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleCreateTest(chapter._id, subject.id, subject.name)}
                                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-1"
                                    >
                                      <FaPlus className="text-xs" />
                                      <span>Create Test</span>
                                    </button>
                                  </div>
                                  </div>
                                  
                                {/* Show existing tests for this chapter */}
                                {chapterTests.length > 0 && expandedChapters.has(chapter._id) && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="space-y-2">
                                      {chapterTests.map((test) => (
                                      <div key={test._id} className="bg-gray-50 rounded p-2 border border-gray-100">
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <h6 className="font-medium text-gray-900 text-xs">{test.title}</h6>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <span className="text-xs text-gray-500">{test.questions?.length || 0} questions</span>
                                              <span className="text-xs text-gray-500">•</span>
                                              <span className="text-xs text-gray-500">{test.timeLimit} min</span>
                                              <span className="text-xs text-gray-500">•</span>
                                              <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                                                  test.difficultyLevel === 'easy' 
                                                  ? 'bg-green-100 text-green-800' 
                                                    : test.difficultyLevel === 'hard'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                  {test.difficultyLevel}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <button 
                                              onClick={() => handleViewTestDetails(test)}
                                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                            >
                                              View
                                            </button>
                                            <button 
                                              onClick={() => handleEditTest(test)}
                                              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition-colors"
                                            >
                                              Edit
                                            </button>
                                            <button 
                                              onClick={() => handleDeleteTest(test._id)}
                                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  </div>
                                )}
                                </div>
                              )
                          }) || (
                            <div className="text-gray-500 text-sm text-center py-4">
                              No chapters added yet. Go to NEET/JEE tab to add chapters.
                            </div>
                          )}
                          </div>
                        </div>
                      )}
                    </div>
                ))}
              </div>
              
              {categoryData[activeCategory]?.subjects?.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaFileAlt className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Available</h3>
                  <p className="text-gray-600 mb-4">Subjects will appear here once they are configured in the NEET/JEE section.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'test-syllabus' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveCategory('neet')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'neet'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  NEET
                </button>
                <button
                  onClick={() => setActiveCategory('jee')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'jee'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JEE
                </button>
                </div>

              {/* Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData[activeCategory]?.subjects?.map((subject) => (
                  <div key={subject.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`bg-gradient-to-br ${subject.color} p-3 rounded-lg`}>
                          <subject.icon className="text-white text-xl" />
              </div>
                        <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                      </div>
                      <button
                        onClick={() => toggleSyllabusSubjectExpansion(subject.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {expandedSyllabusSubjects.has(subject.id) ? <FaCaretDown /> : <FaCaretRight />}
                      </button>
            </div>
            
                    {/* Chapters List */}
                    {expandedSyllabusSubjects.has(subject.id) && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Chapters</h4>
                        </div>
                        
                        <div className="space-y-2">
                          {categoryData[activeCategory]?.chapters?.[subject.id]?.map((chapter) => {
                            // Find tests for this chapter
                            const chapterTests = availableTests.filter(test => 
                              test.chapterId?._id === chapter._id || test.chapterId === chapter._id
                            )
                    
                    return (
                              <div key={chapter._id} className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{chapter.name}</h5>
                                    {chapter.description && (
                                      <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                                    )}
                              </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">{chapterTests.length} test{chapterTests.length !== 1 ? 's' : ''}</span>
                                    {chapterTests.length > 0 && (
                              <button
                                        onClick={() => toggleSyllabusChapterExpansion(chapter._id)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                              >
                                        {expandedSyllabusChapters.has(chapter._id) ? <FaCaretDown /> : <FaCaretRight />}
                              </button>
                                    )}
                          </div>
                        </div>

                                {/* Show tests for this chapter */}
                                {chapterTests.length > 0 && expandedSyllabusChapters.has(chapter._id) && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="space-y-2">
                                      {chapterTests.map((test) => {
                                        const testSyllabi = getSyllabiForTest(test._id)
                                        
                                        return (
                                          <div key={test._id} className="bg-gray-50 rounded p-2 border border-gray-100">
                                                                                         <div className="flex items-start justify-between mb-2">
                                               <div className="flex-1 min-w-0">
                                                 <h6 className="font-medium text-gray-900 text-xs">{test.title}</h6>
                                                 <div className="flex items-center space-x-2 mt-1">
                                                   <span className="text-xs text-gray-500">{test.questions?.length || 0} questions</span>
                                                   <span className="text-xs text-gray-500">•</span>
                                                   <span className="text-xs text-gray-500">{test.timeLimit} min</span>
                                                   <span className="text-xs text-gray-500">•</span>
                                                   <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                                                     test.difficultyLevel === 'easy' 
                                                       ? 'bg-green-100 text-green-800' 
                                                       : test.difficultyLevel === 'hard'
                                                       ? 'bg-red-100 text-red-800'
                                                       : 'bg-yellow-100 text-yellow-800'
                                                   }`}>
                                                     {test.difficultyLevel}
                                                   </span>
                                                 </div>
                                               </div>
                                               <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                                                 <span className="text-xs text-gray-500">{testSyllabi.length} syllabus{testSyllabi.length !== 1 ? 'i' : ''}</span>
                                                 {testSyllabi.length > 0 && (
                                                   <button
                                                     onClick={() => toggleSyllabusTestExpansion(test._id)}
                                                     className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                                                   >
                                                     {expandedSyllabusTests.has(test._id) ? <FaCaretDown /> : <FaCaretRight />}
                                                   </button>
                                                 )}
                                    <button
                                      onClick={() => {
                                        setSelectedTestForSyllabus(test._id)
                                        setSyllabusFormData({
                                          title: '',
                                          description: '',
                                          topics: []
                                        })
                                        setShowSyllabusForm(true)
                                      }}
                                                   className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded text-xs hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-1 whitespace-nowrap"
                                    >
                                      <FaPlus className="text-xs" />
                                      <span>Add Syllabus</span>
                                    </button>
                                               </div>
                                  </div>
                                  
                                            {/* Show syllabi for this test */}
                                            {testSyllabi.length > 0 && expandedSyllabusTests.has(test._id) && (
                                              <div className="mt-2 pt-2 border-t border-gray-100">
                                                <div className="space-y-2">
                                    {testSyllabi.map(syllabus => (
                                                    <div key={syllabus._id} className="bg-purple-50 rounded p-2 border border-purple-100">
                                                      <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                          <h7 className="font-medium text-gray-900 text-xs">{syllabus.title}</h7>
                                                          {syllabus.description && (
                                                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                                              {syllabus.description}
                                                            </p>
                                                          )}
                                                          <div className="flex items-center space-x-2 mt-1">
                                                            <span className="text-xs text-gray-500">Topics: {syllabus.topics?.length || 0}</span>
                                                            <span className="text-xs text-gray-500">•</span>
                                                            <span className="text-xs text-gray-500">Created: {new Date(syllabus.createdAt).toLocaleDateString()}</span>
                                                          </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                            <button 
                                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                              onClick={() => handleViewSyllabusDetails(syllabus)}
                                            >
                                              View
                                            </button>
                                            <button 
                                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                                              onClick={() => handleEditSyllabus(syllabus)}
                                            >
                                              Edit
                                            </button>
                                            <button 
                                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                                              onClick={() => handleDeleteTestSyllabus(syllabus._id)}
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                            )}
                                  </div>
                                        )
                                      })}
                                    </div>
                                </div>
                              )}
                            </div>
                            )
                          }) || (
                            <div className="text-gray-500 text-sm text-center py-4">
                              No chapters added yet. Go to NEET/JEE tab to add chapters.
                          </div>
                        )}
                      </div>
                </div>
                    )}
                  </div>
                ))}
              </div>
              
              {categoryData[activeCategory]?.subjects?.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaBook className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Available</h3>
                  <p className="text-gray-600 mb-4">Subjects will appear here once they are configured in the NEET/JEE section.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch-pricing' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Batch Pricing Management</h3>
              <p className="text-gray-600 mt-1">Update batch prices and features</p>
            </div>
            
            <div className="p-6">
              {batchPricing.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batchPricing.map(batch => (
                    <div key={batch._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                            <FaEnvelope className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{batch.type}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Price:</span>
                          <span className="font-medium text-green-600">₹{batch.price}</span>
                        </div>
                        {batch.originalPrice > batch.price && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="font-medium text-gray-500 line-through">₹{batch.originalPrice}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{batch.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Features:</span>
                          <span className="font-medium">{batch.features?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                          onClick={() => handleEditPricing(batch)}
                        >
                          Edit Pricing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaEnvelope className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Batch Pricing Found</h3>
                  <p className="text-gray-600 mb-4">Batch pricing will appear here once configured.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'banner-management' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Banner Management</h3>
                  <p className="text-gray-600 mt-1">Upload and manage website banners for desktop and mobile</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Desktop Banner */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                        <FaDesktop className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Desktop Banner</h3>
                        <p className="text-sm text-gray-600">Recommended: 1200x400px</p>
                      </div>
                    </div>
                  </div>
                  
                  {banners.desktop ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={`${API_URL}/uploads/${banners.desktop.filename}`} 
                          alt="Desktop Banner" 
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Uploaded: {new Date(banners.desktop.uploadedAt).toLocaleDateString()}</p>
                        <p>Size: {banners.desktop.filename}</p>
                      </div>
                      <button
                        onClick={() => handleBannerDelete('desktop')}
                        disabled={bannerLoading}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <FaTrash className="text-sm" />
                        <span>Remove Banner</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No desktop banner uploaded</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                handleBannerUpload('desktop', file)
                              }
                            }}
                            className="hidden"
                            disabled={bannerLoading}
                          />
                          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 inline-flex items-center space-x-2">
                            <FaPlus className="text-sm" />
                            <span>Upload Desktop Banner</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Banner */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                        <FaMobile className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Mobile Banner</h3>
                        <p className="text-sm text-gray-600">Recommended: 400x600px</p>
                      </div>
                    </div>
                  </div>
                  
                  {banners.mobile ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={`${API_URL}/uploads/${banners.mobile.filename}`} 
                          alt="Mobile Banner" 
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Uploaded: {new Date(banners.mobile.uploadedAt).toLocaleDateString()}</p>
                        <p>Size: {banners.mobile.filename}</p>
                      </div>
                      <button
                        onClick={() => handleBannerDelete('mobile')}
                        disabled={bannerLoading}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <FaTrash className="text-sm" />
                        <span>Remove Banner</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No mobile banner uploaded</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                handleBannerUpload('mobile', file)
                              }
                            }}
                            className="hidden"
                            disabled={bannerLoading}
                          />
                          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 inline-flex items-center space-x-2">
                            <FaPlus className="text-sm" />
                            <span>Upload Mobile Banner</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Information */}
              <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Banner Information</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Banners will appear as pop-ups on the landing page</p>
                  <p>• Clicking on a banner will redirect to the batch section</p>
                  <p>• Desktop banners are shown on larger screens</p>
                  <p>• Mobile banners are shown on smaller screens</p>
                  <p>• Only one banner type will be shown at a time</p>
                  <p>• Users can close the banner using the close button</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupon-management' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Coupon Management</h3>
                  <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
                </div>
                <button
                  onClick={handleCreateCoupon}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <FaPlus className="text-sm" />
                  <span>Create Coupon</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {coupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coupons.map(coupon => (
                    <div key={coupon._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
                            <FaGift className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{coupon.name}</h3>
                            <p className="text-sm text-gray-600 font-mono">{coupon.code}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-purple-600">
                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                          </span>
                        </div>
                        {coupon.maxDiscount && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Max Discount:</span>
                            <span className="font-medium">₹{coupon.maxDiscount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Usage:</span>
                          <span className="font-medium">{coupon.usedCount}/{coupon.usageLimit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Valid Until:</span>
                          <span className="font-medium">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                        </div>
                        {coupon.applicableBatches.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Batches:</span>
                            <span className="font-medium">{coupon.applicableBatches.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                        <button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                          onClick={() => handleEditCoupon(coupon)}
                        >
                          Edit
                        </button>
                        <button 
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300"
                          onClick={() => handleDeleteCoupon(coupon._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaGift className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coupons Found</h3>
                  <p className="text-gray-600 mb-4">Create your first coupon to start offering discounts to students.</p>
                  <button
                    onClick={handleCreateCoupon}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                  >
                    Create First Coupon
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Feedback Management</h3>
                  <p className="text-gray-600 mt-1">View and manage user feedback</p>
                </div>
                <div className="flex items-center space-x-4">
                  {feedbackStats && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {feedbackStats.pending} Pending
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {feedbackStats.resolved} Resolved
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.map(feedbackItem => (
                    <div key={feedbackItem._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                              <FaComments className="text-white text-sm" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{feedbackItem.subject}</h3>
                              <p className="text-sm text-gray-600">by {feedbackItem.name} ({feedbackItem.email})</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              feedbackItem.category === 'bug' ? 'bg-red-100 text-red-800' :
                              feedbackItem.category === 'feature' ? 'bg-blue-100 text-blue-800' :
                              feedbackItem.category === 'complaint' ? 'bg-orange-100 text-orange-800' :
                              feedbackItem.category === 'suggestion' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {feedbackItem.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              feedbackItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              feedbackItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              feedbackItem.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {feedbackItem.status}
                            </span>
                            <span className="text-gray-500">
                              {new Date(feedbackItem.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{feedbackItem.message}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedFeedback(feedbackItem)
                              setShowFeedbackModal(true)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                          >
                            View Details
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {feedbackItem._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaComments className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Found</h3>
                  <p className="text-gray-600">User feedback will appear here once submitted.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Management */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Feedback Management</h3>
                  <p className="text-gray-600 mt-1">View and manage user feedback</p>
                </div>
                <button
                  onClick={() => {
                    loadFeedback()
                    loadFeedbackStats()
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <FaSync className="text-sm" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Feedback Statistics */}
              {feedbackStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total</p>
                        <p className="text-2xl font-bold text-blue-900">{feedbackStats.total}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FaComments className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">{feedbackStats.pending}</p>
                      </div>
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <FaClock className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">In Progress</p>
                        <p className="text-2xl font-bold text-orange-900">{feedbackStats.inProgress}</p>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <FaSpinner className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Resolved</p>
                        <p className="text-2xl font-bold text-green-900">{feedbackStats.resolved}</p>
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <FaCheck className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Closed</p>
                        <p className="text-2xl font-bold text-gray-900">{feedbackStats.closed}</p>
                      </div>
                      <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                        <FaTimes className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Recent (7d)</p>
                        <p className="text-2xl font-bold text-purple-900">{feedbackStats.recent}</p>
                      </div>
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FaCalendar className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback List */}
              {feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.map(feedbackItem => (
                    <div key={feedbackItem._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${
                            feedbackItem.category === 'bug' ? 'bg-red-500' :
                            feedbackItem.category === 'feature' ? 'bg-blue-500' :
                            feedbackItem.category === 'complaint' ? 'bg-orange-500' :
                            feedbackItem.category === 'suggestion' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}>
                            <FaComments className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{feedbackItem.subject}</h3>
                            <p className="text-sm text-gray-600">by {feedbackItem.name} ({feedbackItem.email})</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feedbackItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            feedbackItem.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                            feedbackItem.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {feedbackItem.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feedbackItem.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            feedbackItem.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            feedbackItem.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {feedbackItem.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 mb-2">{feedbackItem.message}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Category: {feedbackItem.category}</span>
                          <span>{new Date(feedbackItem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                          onClick={() => {
                            setSelectedFeedback(feedbackItem)
                            setShowFeedbackModal(true)
                          }}
                        >
                          View Details
                        </button>
                        <button 
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300"
                          onClick={() => handleUpdateFeedbackStatus(feedbackItem._id, 'resolved')}
                        >
                          Mark Resolved
                        </button>
                        <button 
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300"
                          onClick={() => handleDeleteFeedback(feedbackItem._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FaComments className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Found</h3>
                  <p className="text-gray-600 mb-4">No feedback has been submitted yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chapter Creation Modal */}
        {showChapterForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Chapter</h3>
              <form onSubmit={handleChapterSubmit} className="space-y-4">
                              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chapter Name</label>
                  <input
                    type="text"
                    value={chapterFormData.name}
                    onChange={(e) => setChapterFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                              </div>
                              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={chapterFormData.description}
                    onChange={(e) => setChapterFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                              </div>
                <div className="flex space-x-3">
                          <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Create Chapter
                          </button>
                          <button
                    type="button"
                    onClick={() => setShowChapterForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                          >
                    Cancel
                          </button>
                        </div>
              </form>
                </div>
              </div>
            )}

        {/* Test Creation Modal */}
        {showTestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Test</h3>
              <form onSubmit={handleTestSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
                          <input 
                            type="text" 
                      value={testFormData.title}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required 
                          />
                        </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                    <select
                      value={testFormData.examType}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, examType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="neet">NEET</option>
                      <option value="jee">JEE</option>
                    </select>
                        </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      value={testFormData.difficultyLevel}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                      </div>
                        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                          <input 
                            type="number" 
                      value={testFormData.timeLimit}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1" 
                          />
                  </div>
                        </div>
                        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic Tag (Optional)</label>
                          <input 
                    type="text"
                    value={testFormData.topicTag}
                    onChange={(e) => setTestFormData(prev => ({ ...prev, topicTag: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                      </div>
                      
                {/* Questions Section */}
                <div>
                        <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Questions ({testFormData.questions.length})</h4>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add Question</span>
                    </button>
                        </div>
                        
                  <div className="space-y-4">
                    {testFormData.questions.map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Question {qIndex + 1}</h5>
                                <button 
                                  type="button" 
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimesCircle />
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                                  <textarea 
                              value={question.text}
                              onChange={(e) => updateTestQuestion(qIndex, 'text', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="2"
                              required
                                  />
                                </div>
                                
                                {/* Question Image Upload */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => toggleQuestionImageExpansion(qIndex)}
                                    className="flex items-center justify-between w-full text-left mb-2"
                                  >
                                    <label className="block text-sm font-medium text-gray-700">Question Image (Optional)</label>
                                    <span className="text-blue-600">
                                      {expandedQuestionImages.has(`question-${qIndex}`) ? <FaCaretUp size={16} /> : <FaCaretDown size={16} />}
                                    </span>
                                  </button>
                                  
                                  {expandedQuestionImages.has(`question-${qIndex}`) && (
                                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                      {question.image ? (
                                  <div className="space-y-2">
                                          <div className="relative">
                                            <img 
                                              src={`${API_URL}/uploads/question-images/${question.image.filename}`}
                                              alt="Question"
                                              className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleQuestionImageDelete(qIndex, question.image.filename)}
                                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                              <FaTimesCircle size={16} />
                                            </button>
                                          </div>
                                          <p className="text-xs text-gray-500">
                                            {question.image.originalName} ({(question.image.size / 1024).toFixed(1)} KB)
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files[0]
                                              if (file) {
                                                handleQuestionImageUpload(qIndex, file)
                                              }
                                            }}
                                            className="hidden"
                                            id={`question-image-${qIndex}`}
                                            disabled={imageUploadLoading[qIndex]}
                                          />
                                          <label 
                                            htmlFor={`question-image-${qIndex}`}
                                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                                          >
                                            {imageUploadLoading[qIndex] ? (
                                              <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                <span>Uploading...</span>
                                              </div>
                                            ) : (
                                              <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span>Upload Image</span>
                                              </div>
                                            )}
                                          </label>
                                          <p className="text-xs text-gray-500 mt-1">Click to upload an image for this question</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                  <div className="space-y-4">
                              {question.options.map((option, oIndex) => (
                                      <div key={oIndex} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm font-medium text-gray-600 w-6">{String.fromCharCode(65 + oIndex)}.</span>
                                        <input
                                          type="text"
                                            value={option.text || ''}
                                    onChange={(e) => updateTestOption(qIndex, oIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Option text"
                                    required
                                  />
                                  <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => updateTestQuestion(qIndex, 'correctAnswer', oIndex)}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-500">Correct</span>
                                        </div>
                                        
                                        {/* Option Image Upload */}
                                        <div className="ml-8">
                                          <button
                                            type="button"
                                            onClick={() => toggleOptionImageExpansion(qIndex, oIndex)}
                                            className="flex items-center justify-between w-full text-left mb-1"
                                          >
                                            <label className="block text-xs font-medium text-gray-600">Option Image (Optional)</label>
                                            <span className="text-blue-600">
                                              {expandedOptionImages.has(`option-${qIndex}-${oIndex}`) ? <FaCaretUp size={12} /> : <FaCaretDown size={12} />}
                                            </span>
                                          </button>
                                          
                                          {expandedOptionImages.has(`option-${qIndex}-${oIndex}`) && (
                                            <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                              {option.image ? (
                                                <div className="space-y-2">
                                                  <div className="relative">
                                                    <img 
                                                      src={`${API_URL}/uploads/question-images/${option.image.filename}`}
                                                      alt="Option"
                                                      className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                                    />
                                                    <button
                                                      type="button"
                                                      onClick={() => handleOptionImageDelete(qIndex, oIndex, option.image.filename)}
                                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                      <FaTimesCircle size={12} />
                                                    </button>
                                                  </div>
                                                  <p className="text-xs text-gray-500">
                                                    {option.image.originalName} ({(option.image.size / 1024).toFixed(1)} KB)
                                                  </p>
                                                </div>
                                              ) : (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                      const file = e.target.files[0]
                                                      if (file) {
                                                        handleOptionImageUpload(qIndex, oIndex, file)
                                                      }
                                                    }}
                                                    className="hidden"
                                                    id={`option-image-${qIndex}-${oIndex}`}
                                                    disabled={imageUploadLoading[`${qIndex}-${oIndex}`]}
                                                  />
                                                  <label 
                                                    htmlFor={`option-image-${qIndex}-${oIndex}`}
                                                    className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs"
                                                  >
                                                    {imageUploadLoading[`${qIndex}-${oIndex}`] ? (
                                                      <div className="flex items-center justify-center space-x-1">
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                                        <span>Uploading...</span>
                                                      </div>
                                                    ) : (
                                                      <div className="flex items-center justify-center space-x-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        <span>Upload Image</span>
                                                      </div>
                                                    )}
                                                  </label>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Question Explanation */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                                  <textarea 
                                    value={question.explanation || ''}
                                    onChange={(e) => updateTestQuestion(qIndex, 'explanation', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Explain why this answer is correct..."
                                  />
                                  
                                  {/* Explanation Image Upload */}
                                  <div className="mt-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleExplanationImageExpansion(qIndex)}
                                      className="flex items-center justify-between w-full text-left mb-1"
                                    >
                                      <label className="block text-xs font-medium text-gray-600">Explanation Image (Optional)</label>
                                      <span className="text-blue-600">
                                        {expandedExplanationImages.has(`explanation-${qIndex}`) ? <FaCaretUp size={12} /> : <FaCaretDown size={12} />}
                                      </span>
                                    </button>
                                    
                                    {expandedExplanationImages.has(`explanation-${qIndex}`) && (
                                      <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                        {question.explanationImage && question.explanationImage.filename ? (
                                          <div className="space-y-2">
                                            <div className="relative">
                                              <img 
                                                src={`${API_URL}/uploads/question-images/${question.explanationImage.filename}`}
                                                alt="Explanation"
                                                className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleExplanationImageDelete(qIndex, question.explanationImage.filename)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                              >
                                                <FaTimesCircle size={12} />
                                              </button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                              {question.explanationImage.originalName} ({(question.explanationImage.size / 1024).toFixed(1)} KB)
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                  handleExplanationImageUpload(qIndex, file)
                                                }
                                              }}
                                              className="hidden"
                                              id={`explanation-image-${qIndex}`}
                                              disabled={imageUploadLoading[`explanation-${qIndex}`]}
                                            />
                                            <label 
                                              htmlFor={`explanation-image-${qIndex}`}
                                              className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs"
                                            >
                                              {imageUploadLoading[`explanation-${qIndex}`] ? (
                                                <div className="flex items-center justify-center space-x-1">
                                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                                  <span>Uploading...</span>
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-center space-x-1">
                                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                  </svg>
                                                  <span>Upload Image</span>
                                                </div>
                                              )}
                                            </label>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                  </div>
                        </div>
                        
                <div className="flex space-x-3">
                        <button 
                    type="submit"
                    disabled={testFormData.questions.length < 1}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Test ({testFormData.questions.length} question{testFormData.questions.length !== 1 ? 's' : ''})
                        </button>
                        <button 
                          type="button" 
                    onClick={() => setShowTestForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                </div>
              </div>
            )}

        {/* Test Assignment Modal */}
        {showAssignTestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Test to Student</h3>
              <div className="space-y-4">
                {/* Show student batch info */}
                {studentBatchInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Student Batch:</strong> {studentBatchInfo.name} ({studentBatchInfo.type.toUpperCase()})
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Showing tests relevant to {studentBatchInfo.type.toUpperCase()} batch
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Test</label>
                  {loadingTestsForStudent ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-500">Loading tests...</p>
                    </div>
                  ) : (
                    <>
                      <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                        {Object.keys(structuredTestsForStudent).length === 0 ? (
                          <div className="p-3 text-center">
                            <p className="text-xs text-orange-600">
                              No tests available for this student's batch. Create tests for {studentBatchInfo?.type?.toUpperCase() || 'this batch'} subjects first.
                            </p>
                          </div>
                        ) : (
                          <div className="p-2">
                            {Object.entries(structuredTestsForStudent).map(([subjectName, chapters]) => (
                              <div key={subjectName} className="mb-3">
                                {/* Subject Header */}
                                <button
                                  type="button"
                                  onClick={() => toggleTestSubjectExpansion(subjectName)}
                                  className="w-full flex items-center justify-between p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                  <span className="font-medium text-blue-900">{subjectName}</span>
                                  <span className="text-blue-600">
                                    {expandedTestSubjects.has(subjectName) ? <FaCaretDown size={12} /> : <FaCaretRight size={12} />}
                                  </span>
                                </button>
                                
                                {/* Chapters */}
                                {expandedTestSubjects.has(subjectName) && (
                                  <div className="ml-4 mt-2 space-y-2">
                                    {Object.entries(chapters).map(([chapterName, tests], chapterIndex) => (
                                      <div key={chapterName}>
                                        {/* Chapter Header */}
                                        <button
                                          type="button"
                                          onClick={() => toggleTestChapterExpansion(chapterName)}
                                          className="w-full flex items-center justify-between p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                          <span className="font-medium text-gray-800">{chapterIndex + 1}. {chapterName}</span>
                                          <span className="text-gray-600">
                                            {expandedTestChapters.has(chapterName) ? <FaCaretDown size={12} /> : <FaCaretRight size={12} />}
                                          </span>
                                        </button>
                                        
                                        {/* Tests */}
                                        {expandedTestChapters.has(chapterName) && (
                                          <div className="ml-4 mt-2 space-y-1">
                                            {tests.map(test => (
                                              <button
                                                key={test._id}
                                                type="button"
                                                onClick={() => setSelectedTestToAssign(selectedTestToAssign === test._id ? null : test._id)}
                                                className={`w-full p-2 text-left rounded-lg transition-colors ${
                                                  selectedTestToAssign === test._id
                                                    ? 'bg-green-100 border-2 border-green-300'
                                                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                                                }`}
                                              >
                                                <div className="font-medium text-gray-900">{test.title}</div>
                                                <div className="text-xs text-gray-600">
                                                  {test.difficultyLevel} • {test.timeLimit} min • {test.questions?.length || 0} questions
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {selectedTestToAssign && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-800">
                              <strong>Selected:</strong> {filteredTestsForStudent.find(t => t._id === selectedTestToAssign)?.title}
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedTestToAssign(null)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Deselect
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={testAssignmentDate}
                    onChange={(e) => setTestAssignmentDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {testAssignmentDate === new Date().toISOString().slice(0, 10) 
                      ? "Test will be available immediately for today" 
                      : "Test will be available from 00:00 AM to 11:59 PM on the selected date"}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleAssignTestSubmit}
                    disabled={!selectedTestToAssign || !testAssignmentDate}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Test
                  </button>
                  <button 
                    onClick={() => setShowAssignTestModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
      </div>
        </div>
        )}

        {/* Test Details Modal */}
        {showTestDetailsModal && selectedTestForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Test Details</h3>
                <button
                  onClick={() => setShowTestDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedTestForDetails.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject & Chapter</label>
                    <p className="text-gray-900">{selectedTestForDetails.subjectId?.name || 'Unknown Subject'} - {selectedTestForDetails.chapterId?.name || 'Unknown Chapter'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {selectedTestForDetails.difficultyLevel}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit</label>
                    <p className="text-gray-900">{selectedTestForDetails.timeLimit} minutes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
                    <p className="text-gray-900">{selectedTestForDetails.questions?.length || 0} questions</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {selectedTestForDetails.examType || 'neet'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTestForDetails.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedTestForDetails.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedTestForDetails.status}
                    </span>
                  </div>
                  {selectedTestForDetails.topicTag && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Topic Tag</label>
                      <p className="text-gray-900">{selectedTestForDetails.topicTag}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Questions</h4>
                <div className="space-y-4">
                  {selectedTestForDetails.questions?.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-900 mb-2">Question {index + 1}</h5>
                        <p className="text-gray-700">{question.text}</p>
                        
                        {/* Question Image */}
                        {question.image && (
                          <div className="mt-3">
                            <img 
                              src={`${API_URL}/uploads/question-images/${question.image.filename}`}
                              alt="Question"
                              className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {question.image.originalName} ({(question.image.size / 1024).toFixed(1)} KB)
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-start space-x-2">
                            <span className="text-sm font-medium text-gray-600 w-6">{String.fromCharCode(65 + optionIndex)}.</span>
                            <div className="flex-1">
                            <span className={`text-sm ${question.correctAnswer === optionIndex ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
                                {typeof option === 'string' ? option : (option.text || '')}
                              {question.correctAnswer === optionIndex && ' ✓'}
                            </span>
                              
                              {/* Option Image */}
                              {typeof option === 'object' && option.image && (
                                <div className="mt-2">
                                  <img 
                                    src={`${API_URL}/uploads/question-images/${option.image.filename}`}
                                    alt="Option"
                                    className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                  />
                                </div>
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
                                src={`${API_URL}/uploads/question-images/${question.explanationImage.filename}`}
                                alt="Explanation"
                                className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTestDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Test Modal */}
        {showEditTestModal && selectedTestForEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Test</h3>
                <button
                  onClick={() => setShowEditTestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
              
              <form onSubmit={handleEditTestSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
                    <input
                      type="text"
                      value={editTestFormData.title}
                      onChange={(e) => setEditTestFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                    <select
                      value={editTestFormData.examType}
                      onChange={(e) => setEditTestFormData(prev => ({ ...prev, examType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="neet">NEET</option>
                      <option value="jee">JEE</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      value={editTestFormData.difficultyLevel}
                      onChange={(e) => setEditTestFormData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic Tag (Optional)</label>
                    <input
                      type="text"
                      value={editTestFormData.topicTag}
                      onChange={(e) => setEditTestFormData(prev => ({ ...prev, topicTag: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                    <input
                      type="number"
                      value={editTestFormData.timeLimit}
                      onChange={(e) => setEditTestFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="300"
                      required
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Questions ({editTestFormData.questions.length})</h4>
                    <button
                      type="button"
                      onClick={addEditQuestion}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add Question</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {editTestFormData.questions.map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Question {qIndex + 1}</h5>
                          <button 
                            type="button" 
                            onClick={() => removeEditQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                            <textarea 
                              value={question.text}
                              onChange={(e) => updateEditTestQuestion(qIndex, 'text', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="2"
                              required
                            />
                          </div>
                          
                          {/* Question Image Upload */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleQuestionImageExpansion(qIndex)}
                              className="flex items-center justify-between w-full text-left mb-2"
                            >
                              <label className="block text-sm font-medium text-gray-700">Question Image (Optional)</label>
                              <span className="text-blue-600">
                                {expandedQuestionImages.has(`question-${qIndex}`) ? <FaCaretUp size={16} /> : <FaCaretDown size={16} />}
                              </span>
                            </button>
                            
                            {expandedQuestionImages.has(`question-${qIndex}`) && (
                              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                {question.image ? (
                            <div className="space-y-2">
                                    <div className="relative">
                                      <img 
                                        src={`${API_URL}/uploads/question-images/${question.image.filename}`}
                                        alt="Question"
                                        className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleQuestionImageDelete(qIndex, question.image.filename, true)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                      >
                                        <FaTimesCircle size={16} />
                                      </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {question.image.originalName} ({(question.image.size / 1024).toFixed(1)} KB)
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            handleQuestionImageUpload(qIndex, file, true)
                                          }
                                        }}
                                        className="hidden"
                                        id={`edit-question-image-${qIndex}`}
                                        disabled={imageUploadLoading[qIndex]}
                                      />
                                      <label 
                                        htmlFor={`edit-question-image-${qIndex}`}
                                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                                      >
                                        {imageUploadLoading[qIndex] ? (
                                          <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span>Uploading...</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span>Upload Image</span>
                                          </div>
                                        )}
                                      </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Click to upload an image for this question</p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                            <div className="space-y-4">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm font-medium text-gray-600 w-6">{String.fromCharCode(65 + oIndex)}.</span>
                                  <input
                                    type="text"
                                      value={option.text || ''}
                                    onChange={(e) => updateEditTestOption(qIndex, oIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Option text"
                                    required
                                  />
                                  <input
                                    type="radio"
                                    name={`edit-correct-${qIndex}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => updateEditTestQuestion(qIndex, 'correctAnswer', oIndex)}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-500">Correct</span>
                                  </div>
                                  
                                  {/* Option Image Upload */}
                                  <div className="ml-8">
                                    <button
                                      type="button"
                                      onClick={() => toggleOptionImageExpansion(qIndex, oIndex)}
                                      className="flex items-center justify-between w-full text-left mb-1"
                                    >
                                      <label className="block text-xs font-medium text-gray-600">Option Image (Optional)</label>
                                      <span className="text-blue-600">
                                        {expandedOptionImages.has(`option-${qIndex}-${oIndex}`) ? <FaCaretUp size={12} /> : <FaCaretDown size={12} />}
                                      </span>
                                    </button>
                                    
                                    {expandedOptionImages.has(`option-${qIndex}-${oIndex}`) && (
                                      <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                        {option.image ? (
                                          <div className="space-y-2">
                                            <div className="relative">
                                              <img 
                                                src={`${API_URL}/uploads/question-images/${option.image.filename}`}
                                                alt="Option"
                                                className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleOptionImageDelete(qIndex, oIndex, option.image.filename, true)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                              >
                                                <FaTimesCircle size={12} />
                                              </button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                              {option.image.originalName} ({(option.image.size / 1024).toFixed(1)} KB)
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                  handleOptionImageUpload(qIndex, oIndex, file, true)
                                                }
                                              }}
                                              className="hidden"
                                              id={`edit-option-image-${qIndex}-${oIndex}`}
                                              disabled={imageUploadLoading[`${qIndex}-${oIndex}`]}
                                            />
                                            <label 
                                              htmlFor={`edit-option-image-${qIndex}-${oIndex}`}
                                              className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs"
                                            >
                                              {imageUploadLoading[`${qIndex}-${oIndex}`] ? (
                                                <div className="flex items-center justify-center space-x-1">
                                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                                  <span>Uploading...</span>
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-center space-x-1">
                                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                  </svg>
                                                  <span>Upload Image</span>
                                                </div>
                                              )}
                                            </label>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Question Explanation */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                            <textarea 
                              value={question.explanation || ''}
                              onChange={(e) => updateEditTestQuestion(qIndex, 'explanation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="3"
                              placeholder="Explain why this answer is correct..."
                            />
                            
                            {/* Explanation Image Upload */}
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={() => toggleExplanationImageExpansion(qIndex)}
                                className="flex items-center justify-between w-full text-left mb-1"
                              >
                                <label className="block text-xs font-medium text-gray-600">Explanation Image (Optional)</label>
                                <span className="text-blue-600">
                                  {expandedExplanationImages.has(`explanation-${qIndex}`) ? <FaCaretUp size={12} /> : <FaCaretDown size={12} />}
                                </span>
                              </button>
                              
                              {expandedExplanationImages.has(`explanation-${qIndex}`) && (
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                  {question.explanationImage && question.explanationImage.filename ? (
                                    <div className="space-y-2">
                                      <div className="relative">
                                        <img 
                                          src={`${API_URL}/uploads/question-images/${question.explanationImage.filename}`}
                                          alt="Explanation"
                                          className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleExplanationImageDelete(qIndex, question.explanationImage.filename, true)}
                                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                          <FaTimesCircle size={12} />
                                        </button>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {question.explanationImage.originalName} ({(question.explanationImage.size / 1024).toFixed(1)} KB)
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            handleExplanationImageUpload(qIndex, file, true)
                                          }
                                        }}
                                        className="hidden"
                                        id={`edit-explanation-image-${qIndex}`}
                                        disabled={imageUploadLoading[`explanation-${qIndex}`]}
                                      />
                                      <label 
                                        htmlFor={`edit-explanation-image-${qIndex}`}
                                        className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs"
                                      >
                                        {imageUploadLoading[`explanation-${qIndex}`] ? (
                                          <div className="flex items-center justify-center space-x-1">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                            <span>Uploading...</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-center space-x-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span>Upload Image</span>
                                          </div>
                                        )}
                                      </label>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    disabled={editTestFormData.questions.length < 1}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Test ({editTestFormData.questions.length} question{editTestFormData.questions.length !== 1 ? 's' : ''})
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowEditTestModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* Test Syllabus Creation Modal */}
        {showSyllabusForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Test Syllabus</h3>
              <form onSubmit={handleSyllabusSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test</label>
                    <select
                      value={selectedTestForSyllabus || ''}
                      onChange={(e) => setSelectedTestForSyllabus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a test...</option>
                      {availableTests.map(test => (
                        <option key={test._id} value={test._id}>
                          {test.title} ({test.subjectId?.name || 'Unknown Subject'} - {test.chapterId?.name || 'Unknown Chapter'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus Title</label>
                    <input
                      type="text"
                      value={syllabusFormData.title}
                      onChange={(e) => setSyllabusFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={syllabusFormData.description}
                    onChange={(e) => setSyllabusFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                {/* Topics Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Topics ({syllabusFormData.topics.length})</h4>
                    <button
                      type="button"
                      onClick={addTopic}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add Topic</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {syllabusFormData.topics.map((topic, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Topic {index + 1}</h5>
                          <button 
                            type="button" 
                            onClick={() => removeTopic(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topic Name</label>
                            <input
                              type="text"
                              value={topic.topic}
                              onChange={(e) => updateTopic(index, 'topic', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input
                              type="text"
                              value={topic.description}
                              onChange={(e) => updateTopic(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weightage (%)</label>
                            <input
                              type="number"
                              value={topic.weightage}
                              onChange={(e) => updateTopic(index, 'weightage', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>




                
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    disabled={!selectedTestForSyllabus || syllabusFormData.topics.length < 1}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Syllabus
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowSyllabusForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Test Syllabus Edit Modal */}
        {showEditSyllabusModal && selectedSyllabusForEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Test Syllabus</h3>
                <button
                  onClick={() => setShowEditSyllabusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
              
              <form onSubmit={handleEditSyllabusSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test</label>
                    <input
                      type="text"
                      value={`${selectedSyllabusForEdit.testId?.title || 'Unknown Test'} (${selectedSyllabusForEdit.testId?.subjectId?.name || 'Unknown Subject'} - ${selectedSyllabusForEdit.testId?.chapterId?.name || 'Unknown Chapter'})`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus Title</label>
                    <input
                      type="text"
                      value={syllabusFormData.title}
                      onChange={(e) => setSyllabusFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={syllabusFormData.description}
                    onChange={(e) => setSyllabusFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                {/* Topics Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Topics ({syllabusFormData.topics.length})</h4>
                    <button
                      type="button"
                      onClick={addTopic}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add Topic</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {syllabusFormData.topics.map((topic, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Topic {index + 1}</h5>
                          <button 
                            type="button" 
                            onClick={() => removeTopic(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topic Name</label>
                            <input
                              type="text"
                              value={topic.topic}
                              onChange={(e) => updateTopic(index, 'topic', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input
                              type="text"
                              value={topic.description}
                              onChange={(e) => updateTopic(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weightage (%)</label>
                            <input
                              type="number"
                              value={topic.weightage}
                              onChange={(e) => updateTopic(index, 'weightage', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    disabled={syllabusFormData.topics.length < 1}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Syllabus
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowEditSyllabusModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Batch Pricing Edit Modal */}
        {showPricingModal && selectedBatchForPricing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Batch Pricing</h3>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
              
              <form onSubmit={handlePricingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
                    <input
                      type="text"
                      value={pricingFormData.name}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Type</label>
                    <input
                      type="text"
                      value={pricingFormData.type}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (₹)</label>
                    <input
                      type="number"
                      value={pricingFormData.price}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      value={pricingFormData.originalPrice}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, originalPrice: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={pricingFormData.duration}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 6 months"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={pricingFormData.description}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Brief description of the batch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MCQ Count per Test</label>
                    <input
                      type="number"
                      value={pricingFormData.mcqCount}
                      onChange={(e) => setPricingFormData(prev => ({ ...prev, mcqCount: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Subjects Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Subjects ({pricingFormData.subjects.length})</h4>
                    <button
                      type="button"
                      onClick={() => setPricingFormData(prev => ({ ...prev, subjects: [...prev.subjects, ''] }))}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add Subject</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {pricingFormData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => {
                            const newSubjects = [...pricingFormData.subjects]
                            newSubjects[index] = e.target.value
                            setPricingFormData(prev => ({ ...prev, subjects: newSubjects }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter subject name"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const newSubjects = pricingFormData.subjects.filter((_, i) => i !== index)
                            setPricingFormData(prev => ({ ...prev, subjects: newSubjects }))
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Features ({pricingFormData.features.length})</h4>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {pricingFormData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter feature description"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Update Pricing
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPricingModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Progress Details Modal */}
        {showProgressDetailsModal && selectedStudentForProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Student Progress Details</h3>
                <button
                  onClick={() => setShowProgressDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
              
              {/* Student Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {selectedStudentForProgress.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedStudentForProgress.name}</h4>
                    <p className="text-sm text-gray-600">{selectedStudentForProgress.email}</p>
                    <p className="text-xs text-gray-500">📱 {selectedStudentForProgress.phone}</p>
                  </div>
                </div>
              </div>

              {/* Progress Stats Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Progress Overview</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedStudentForProgress.completedChapters?.length || 0}</div>
                    <div className="text-sm text-gray-600">Chapters Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{studentProgress[selectedStudentForProgress._id]?.assignedTestsDetails?.length || 0}</div>
                    <div className="text-sm text-gray-600">Tests Assigned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {studentProgress[selectedStudentForProgress._id]?.assignedTestsDetails?.filter(test => test.status === 'completed').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Tests Completed</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completed Chapters Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>Completed Chapters</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedStudentForProgress.completedChapters?.length || 0}
                    </span>
                  </h4>
                  
                  {selectedStudentForProgress.completedChapters && selectedStudentForProgress.completedChapters.length > 0 ? (
                    <div className="space-y-4">
                      {/* Group by subject */}
                      {(() => {
                                                const groupedBySubject = {}
                        selectedStudentForProgress.completedChapters.forEach(completed => {
                          const subjectName = completed.chapter?.subject?.name || completed.subjectId || 'Unknown Subject'
                          if (!groupedBySubject[subjectName]) {
                            groupedBySubject[subjectName] = []
                          }
                          groupedBySubject[subjectName].push(completed)
                        })
                        
                        return Object.entries(groupedBySubject).map(([subjectName, chapters]) => (
                          <div key={subjectName} className="border border-gray-200 rounded-lg">
                            <div 
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleProgressSubjectExpansion(subjectName)}
                            >
                              <h5 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                                {subjectName} ({chapters.length} chapter{chapters.length !== 1 ? 's' : ''})
                              </h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{chapters.length} completed</span>
                                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                  {expandedProgressSubjects.has(subjectName) ? <FaCaretUp /> : <FaCaretDown />}
                                </button>
                              </div>
                            </div>
                            {expandedProgressSubjects.has(subjectName) && (
                              <div className="px-4 pb-4 space-y-2">
                                {chapters.map((completed, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-2">
                                      <FaCheckCircle className="text-green-500 text-xs" />
                                      <span className="text-sm font-medium">
                                        {completed.chapter?.name || 'Unknown Chapter'}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {completed.completedAt ? new Date(completed.completedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaBook className="text-gray-400 text-3xl mx-auto mb-3" />
                      <p className="text-gray-600">No chapters completed yet</p>
                    </div>
                  )}
                </div>

                {/* Assigned Tests Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaFileAlt className="text-blue-500" />
                    <span>Assigned Tests</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {studentProgress[selectedStudentForProgress._id]?.assignedTestsDetails?.length || 0}
                    </span>
                  </h4>
                  
                  {studentProgress[selectedStudentForProgress._id]?.assignedTestsDetails && 
                   studentProgress[selectedStudentForProgress._id].assignedTestsDetails.length > 0 ? (
                    <div className="space-y-4">
                      {/* Group by subject */}
                      {(() => {
                        const groupedBySubject = {}
                        studentProgress[selectedStudentForProgress._id].assignedTestsDetails.forEach(test => {
                          const subjectId = test.subject
                          if (!groupedBySubject[subjectId]) {
                            groupedBySubject[subjectId] = []
                          }
                          groupedBySubject[subjectId].push(test)
                        })
                        
                        return Object.entries(groupedBySubject).map(([subjectId, tests]) => (
                          <div key={subjectId} className="border border-gray-200 rounded-lg">
                            <div 
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleTestSubjectExpansion(subjectId)}
                            >
                              <h5 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                                {subjectId} ({tests.length} test{tests.length !== 1 ? 's' : ''})
                              </h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                  {tests.filter(test => test.status === 'completed').length} completed
                                </span>
                                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                  {expandedTestSubjects.has(subjectId) ? <FaCaretUp /> : <FaCaretDown />}
                                </button>
                              </div>
                            </div>
                            {expandedTestSubjects.has(subjectId) && (
                              <div className="px-4 pb-4 space-y-3">
                                {tests.map((test, index) => {
                                  const testDate = test.testDate ? new Date(test.testDate) : new Date(test.assignedAt || Date.now())
                                  const now = new Date()
                                  const isAvailable = now >= testDate
                                  
                                  return (
                                    <div key={index} className="p-3 bg-gray-50 rounded border">
                                      <div className="flex items-center justify-between mb-2">
                                        <h6 className="font-medium text-sm">{test.title}</h6>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          test.status === 'completed' ? 'bg-green-100 text-green-800' :
                                          test.status === 'started' ? 'bg-yellow-100 text-yellow-800' :
                                          test.status === 'expired' ? 'bg-red-100 text-red-800' :
                                          isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                          {test.status === 'completed' ? 'Completed' :
                                           test.status === 'started' ? 'In Progress' :
                                           test.status === 'expired' ? 'Expired' :
                                           isAvailable ? 'Available' : 'Scheduled'}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-600 space-y-1">
                                        <div>Chapter: {test.chapter}</div>
                                        <div>Test Date: {testDate.toLocaleDateString()}</div>
                                        {test.assignedAt && (
                                          <div>Assigned Date: {new Date(test.assignedAt).toLocaleDateString()}</div>
                                        )}
                                        {test.score !== null && (
                                          <div className="font-medium text-blue-600">Score: {test.score}%</div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaFileAlt className="text-gray-400 text-3xl mx-auto mb-3" />
                      <p className="text-gray-600">No tests assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Assignment Modal */}
        {showBatchAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Batch to Student</h3>
              
              {selectedStudentForBatch && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Student:</strong> {selectedStudentForBatch.name}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedStudentForBatch.email}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                  <select 
                    value={selectedBatchForAssignment || ''}
                    onChange={(e) => setSelectedBatchForAssignment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a batch...</option>
                    {batchPricing.map(batch => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name} ({batch.type.toUpperCase()}) - ₹{batch.price}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedBatchForAssignment && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">Batch Details</h4>
                    {(() => {
                      const selectedBatch = batchPricing.find(b => b._id === selectedBatchForAssignment)
                      return selectedBatch ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{selectedBatch.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Features:</span>
                            <span className="font-medium">{selectedBatch.features?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subjects:</span>
                            <span className="font-medium">{selectedBatch.subjects?.length || 0}</span>
                          </div>
                          {selectedBatch.description && (
                            <div className="text-gray-600 text-xs mt-2">
                              {selectedBatch.description}
                            </div>
                          )}
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleBatchAssignmentSubmit}
                  disabled={!selectedBatchForAssignment}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Batch
                </button>
                <button
                  onClick={() => setShowBatchAssignmentModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Creation/Edit Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedCouponForEdit ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              
              <form onSubmit={handleCouponSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
                    <input
                      type="text"
                      value={couponFormData.code}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="SAVE20"
                      required
                      disabled={selectedCouponForEdit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Name *</label>
                    <input
                      type="text"
                      value={couponFormData.name}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20% Off Discount"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={couponFormData.description}
                    onChange={(e) => setCouponFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Optional description for this coupon"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                    <select
                      value={couponFormData.discountType}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                    <input
                      type="number"
                      value={couponFormData.discountValue}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step={couponFormData.discountType === 'percentage' ? '1' : '1'}
                      max={couponFormData.discountType === 'percentage' ? '100' : undefined}
                      required
                    />
                  </div>
                  
                  {couponFormData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (₹)</label>
                      <input
                        type="number"
                        value={couponFormData.maxDiscount || ''}
                        onChange={(e) => setCouponFormData(prev => ({ ...prev, maxDiscount: e.target.value ? parseFloat(e.target.value) : null }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="1"
                        placeholder="Optional"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Amount (₹)</label>
                    <input
                      type="number"
                      value={couponFormData.minimumAmount}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, minimumAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={couponFormData.usageLimit}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      step="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid From *</label>
                    <input
                      type="date"
                      value={couponFormData.validFrom}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until *</label>
                    <input
                      type="date"
                      value={couponFormData.validUntil}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Batch Types</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={couponFormData.applicableBatches.includes('NEET')}
                        onChange={() => toggleBatchType('NEET')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">NEET</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={couponFormData.applicableBatches.includes('JEE')}
                        onChange={() => toggleBatchType('JEE')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">JEE</span>
                    </label>
                    <p className="text-xs text-gray-500">
                      Leave unchecked to apply to all batch types
                    </p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={couponFormData.isActive}
                      onChange={(e) => setCouponFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                  >
                    {selectedCouponForEdit ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback Detail Modal */}
        {showFeedbackModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Feedback Details</h2>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false)
                    setSelectedFeedback(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <p className="text-gray-900">{selectedFeedback.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{selectedFeedback.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedFeedback.category === 'bug' ? 'bg-red-100 text-red-800' :
                      selectedFeedback.category === 'feature' ? 'bg-blue-100 text-blue-800' :
                      selectedFeedback.category === 'complaint' ? 'bg-orange-100 text-orange-800' :
                      selectedFeedback.category === 'suggestion' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedFeedback.category}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedFeedback.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      selectedFeedback.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      selectedFeedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedFeedback.priority}
                    </span>
                  </div>
                </div>

                {/* Subject and Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <p className="text-gray-900 font-medium">{selectedFeedback.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.message}</p>
                  </div>
                </div>

                {/* Status and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedFeedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedFeedback.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                      selectedFeedback.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedFeedback.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submitted</label>
                    <p className="text-gray-900">{new Date(selectedFeedback.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={selectedFeedback.adminNotes || ''}
                    onChange={(e) => setSelectedFeedback(prev => ({ ...prev, adminNotes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Add admin notes..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleUpdateFeedbackStatus(selectedFeedback._id, 'resolved')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleUpdateFeedbackStatus(selectedFeedback._id, 'in-progress')}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => {
                      setShowFeedbackModal(false)
                      setSelectedFeedback(null)
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
  )
}

export default AdminDashboard 