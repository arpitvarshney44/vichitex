import express from 'express'
import mongoose from 'mongoose'
import { protect, admin } from '../middleware/auth.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Test from '../models/Test.js'
import User from '../models/User.js'
import Subject from '../models/Subject.js'
import Chapter from '../models/Chapter.js'
import Batch from '../models/Batch.js'
import emailService from '../services/emailService.js'

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'), false)
    }
  }
})

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // Get current date and calculate previous month
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    
    // Get current month statistics
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true })
    const totalTests = await Test.countDocuments({ isActive: true })
    const activeTests = await Test.countDocuments({ status: 'active', isActive: true })
    
    // Get current month test attempts
    const currentMonthAttempts = await Test.aggregate([
      { $unwind: '$attempts' },
      { $match: { 'attempts.completedAt': { $gte: currentMonth } } },
      { $count: 'count' }
    ])
    const recentAttempts = currentMonthAttempts[0]?.count || 0
    
    // Get previous month statistics for trend calculation
    const previousMonthStudents = await User.countDocuments({ 
      role: 'student', 
      isActive: true,
      createdAt: { $lt: currentMonth, $gte: previousMonth }
    })
    
    const previousMonthTests = await Test.countDocuments({ 
      isActive: true,
      createdAt: { $lt: currentMonth, $gte: previousMonth }
    })
    
    const previousMonthActiveTests = await Test.countDocuments({ 
      status: 'active', 
      isActive: true,
      createdAt: { $lt: currentMonth, $gte: previousMonth }
    })
    
    const previousMonthAttempts = await Test.aggregate([
      { $unwind: '$attempts' },
      { $match: { 'attempts.completedAt': { $gte: previousMonth, $lt: currentMonth } } },
      { $count: 'count' }
    ])
    const previousAttempts = previousMonthAttempts[0]?.count || 0
    
    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%'
      const change = ((current - previous) / previous) * 100
      return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`
    }
    
    const studentTrend = calculateTrend(totalStudents, previousMonthStudents)
    const testTrend = calculateTrend(totalTests, previousMonthTests)
    const activeTestTrend = calculateTrend(activeTests, previousMonthActiveTests)
    const attemptsTrend = calculateTrend(recentAttempts, previousAttempts)
    
    // Get recent test attempts for display
    const recentAttemptsData = await Test.aggregate([
      { $unwind: '$attempts' },
      { $sort: { 'attempts.completedAt': -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'attempts.user',
          foreignField: '_id',
          as: 'user'
        }
      }
    ])

    // Get top performing students
    const topStudents = await User.aggregate([
      { $match: { role: 'student', isActive: true } },
      { $unwind: '$testAttempts' },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          averageScore: { $avg: '$testAttempts.score' },
          totalTests: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } },
      { $limit: 5 }
    ])

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTests,
        activeTests,
        recentAttempts,
        trends: {
          students: studentTrend,
          tests: testTrend,
          activeTests: activeTestTrend,
          attempts: attemptsTrend
        }
      },
      recentAttempts: recentAttemptsData,
      topStudents
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/categories/:category
// @desc    Get subjects and chapters for a category (NEET/JEE)
// @access  Private (Admin)
router.get('/categories/:category', protect, admin, async (req, res) => {
  try {
    const { category } = req.params
    
    if (!['neet', 'jee'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be neet or jee' })
    }

    // Get subjects for the category
    const subjects = await Subject.find({ 
      examType: category,
      isActive: true 
    }).sort({ order: 1 })

    // Get chapters for each subject
    const chapters = {}
    for (const subject of subjects) {
      const subjectChapters = await Chapter.find({ 
        subject: subject._id,
        isActive: true 
      }).sort({ order: 1 })
      chapters[subject._id] = subjectChapters
    }

    res.json({
      subjects,
      chapters
    })
  } catch (error) {
    console.error('Get category data error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/chapters
// @desc    Create a new chapter
// @access  Private (Admin)
router.post('/chapters', protect, admin, async (req, res) => {
  try {
    const { subjectId, name, description } = req.body

    if (!subjectId || !name) {
      return res.status(400).json({ message: 'Subject ID and chapter name are required' })
    }

    // Find the subject
    const subject = await Subject.findById(subjectId)
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    // Get the next order number for this subject
    const lastChapter = await Chapter.findOne({ subject: subjectId }).sort({ order: -1 })
    const nextOrder = (lastChapter?.order || 0) + 1

    // Create the chapter
    const chapter = new Chapter({
      name,
      description: description || '',
      subject: subjectId,
      subjectId: subject.code || subjectId, // Use subject code or ID
      order: nextOrder,
      createdBy: req.user.id
    })

    await chapter.save()

    // Add chapter to subject
    subject.chapters.push(chapter._id)
    await subject.save()

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      chapter
    })
  } catch (error) {
    console.error('Create chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})






// @route   GET /api/admin/tests/available
// @desc    Get available tests for assignment
// @access  Private (Admin)
router.get('/tests/available', protect, admin, async (req, res) => {
  try {
    const tests = await Test.find({
      isActive: true,
      status: 'active'
    })
    .populate('subjectId', 'name')
    .populate('chapterId', 'name')
    .select('title subjectId chapterId difficultyLevel topicTag timeLimit examType questions status')
    .sort({ createdAt: -1 })

    res.json({
      success: true,
      tests: tests || []
    })
  } catch (error) {
    console.error('Get available tests error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})



// @route   POST /api/admin/students/:id/enroll-batch
// @desc    Enroll student in a batch
// @access  Private (Admin)
router.post('/students/:id/enroll-batch', protect, admin, async (req, res) => {
  try {
    const { batchName, batchType, duration } = req.body
    const studentId = req.params.id

    if (!batchName || !batchType) {
      return res.status(400).json({ message: 'Batch name and type are required' })
    }

    const student = await User.findById(studentId)
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + (duration || 12)) // Default 12 months

    // Update student's batch enrollment
    student.batchEnrollment = {
      isEnrolled: true,
      batchName,
      batchType: batchType.toUpperCase(),
      enrolledAt: new Date(),
      expiresAt,
      isActive: true
    }

    await student.save()

    res.json({
      success: true,
      message: 'Student enrolled in batch successfully',
      batchEnrollment: student.batchEnrollment
    })
  } catch (error) {
    console.error('Enroll student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/subjects
// @desc    Get all subjects
// @access  Private (Admin)
router.get('/subjects', protect, admin, async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true })
      .populate('chapters')
      .sort({ examType: 1, order: 1 })

    res.json({
      success: true,
      subjects
    })
  } catch (error) {
    console.error('Get subjects error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/subjects
// @desc    Create a new subject
// @access  Private (Admin)
router.post('/subjects', protect, admin, async (req, res) => {
  try {
    const { name, description, examType, icon, color } = req.body

    if (!name || !examType) {
      return res.status(400).json({ message: 'Name and exam type are required' })
    }

    // Get the next order number for this exam type
    const lastSubject = await Subject.findOne({ examType }).sort({ order: -1 })
    const nextOrder = (lastSubject?.order || 0) + 1

    const subject = new Subject({
      name,
      description: description || '',
      examType,
      category: examType.toUpperCase(),
      icon: icon || 'FaBook',
      color: color || 'from-blue-500 to-blue-600',
      order: nextOrder,
      createdBy: req.user.id
    })

    await subject.save()

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      subject
    })
  } catch (error) {
    console.error('Create subject error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/admin/chapters/:id
// @desc    Delete a chapter
// @access  Private (Admin)
router.delete('/chapters/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params

    // Find the chapter
    const chapter = await Chapter.findById(id)
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' })
    }

    // Check if chapter has any tests
    const testsWithChapter = await Test.find({ chapters: id })
    if (testsWithChapter.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete chapter. It is associated with existing tests. Please delete the tests first.' 
      })
    }

    // Check if any users have completed this chapter
    const usersWithChapter = await User.find({
      'completedChapters.chapter': id
    })
    if (usersWithChapter.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete chapter. Some students have completed this chapter. Please contact support.' 
      })
    }

    // Delete the chapter
    await Chapter.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    })
  } catch (error) {
    console.error('Delete chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/tests
// @desc    Create a new test
// @access  Private (Admin)
router.post('/tests', protect, admin, async (req, res) => {
  try {
    const { 
      title, 
      difficultyLevel, 
      topicTag, 
      timeLimit, 
      examType,
      questions, 
      chapterId, 
      subjectId 
    } = req.body

    // Validate required fields
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required' })
    }



    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (!question.text || !question.options || question.options.length < 2) {
        return res.status(400).json({ 
          message: `Question ${i + 1} must have text and at least 2 options` 
        })
      }
      if (question.correctAnswer === undefined || question.correctAnswer === null) {
        return res.status(400).json({ 
          message: `Question ${i + 1} must have a correct answer selected` 
        })
      }
    }

    // Find the chapter
    const chapter = await Chapter.findById(chapterId)
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' })
    }

    // Create the test
    const test = new Test({
      title,
      difficultyLevel,
      topicTag,
      timeLimit,
      examType: examType || 'neet', // Default to neet if not provided
      subjectId,
      chapterId,
      questions,
      createdBy: req.user._id || req.user.id
    })

    await test.save()

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      test
    })
  } catch (error) {
    console.error('Create test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/admin/tests/:id
// @desc    Update a test
// @access  Private (Admin)
router.put('/tests/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params
    const { 
      title, 
      difficultyLevel, 
      topicTag, 
      timeLimit, 
      examType,
      questions 
    } = req.body

    // Validate required fields
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required' })
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (!question.text || !question.options || question.options.length < 2) {
        return res.status(400).json({ 
          message: `Question ${i + 1} must have text and at least 2 options` 
        })
      }
      if (question.correctAnswer === undefined || question.correctAnswer === null) {
        return res.status(400).json({ 
          message: `Question ${i + 1} must have a correct answer selected` 
        })
      }
    }

    // Find and update the test
    const test = await Test.findByIdAndUpdate(
      id,
      {
        title,
        difficultyLevel,
        topicTag,
        timeLimit,
        examType: examType || 'neet', // Default to neet if not provided
        questions
      },
      { new: true, runValidators: true }
    )

    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    res.json({
      success: true,
      message: 'Test updated successfully',
      test
    })
  } catch (error) {
    console.error('Update test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/categories/:category
// @desc    Get subjects and chapters for a specific category (neet/jee)
// @access  Private (Admin)
router.get('/categories/:category', protect, admin, async (req, res) => {
  try {
    const { category } = req.params
    
    if (!['neet', 'jee'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be neet or jee' })
    }

    // Get subjects for the category
    const subjects = await Subject.find({ 
      examType: category,
      isActive: true 
    }).sort({ order: 1 })

    // Get chapters for each subject
    const chapters = {}
    for (const subject of subjects) {
      const subjectChapters = await Chapter.find({ 
        subject: subject._id,
        isActive: true 
      }).sort({ order: 1 })
      
      chapters[subject._id] = subjectChapters
    }

    res.json({
      success: true,
      subjects,
      chapters
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/students/progress
// @desc    Get all students with their progress details
// @access  Private (Admin)
router.get('/students/progress', protect, admin, async (req, res) => {
  try {
    // Get all students using EXACT same population as student endpoint
    const students = await User.find({ 
      role: 'student',
      isActive: true 
    })
    .populate({
      path: 'assignedTests.test',
      populate: [
        { path: 'subjectId', select: 'name' },
        { path: 'chapterId', select: 'name' }
      ]
    })
    .populate('assignedTests.assignedBy', 'name')
    .populate('completedChapters.chapter')
    .select('name email phone batchEnrollment createdAt lastLoginAt completedChapters assignedTests testAttempts')

    // Get detailed progress for each student
    const progress = {}
    
    for (const student of students) {
      // Get student's completed chapters
      const completedChapters = student.completedChapters || []

      // Use EXACT same logic as student dashboard for processing assigned tests
      const now = new Date()
      const assignedTestsDetails = student.assignedTests.map(assignment => {
        const testDate = assignment.testDate ? new Date(assignment.testDate) : new Date(assignment.assignedAt || now)
        const assignedAt = assignment.assignedAt ? new Date(assignment.assignedAt) : now
        const isAvailable = now >= testDate
        const timeUntilTest = testDate - now
        const daysUntilTest = Math.ceil(timeUntilTest / (1000 * 60 * 60 * 24))

        return {
          ...assignment.toObject(),
          title: assignment.test?.title || 'Unknown Test',
          subject: assignment.test?.subjectId?.name || 'Unknown Subject',
          chapter: assignment.test?.chapterId?.name || 'Unknown Chapter',
          assignedAt: assignedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          testDate: testDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          testDateFormatted: testDate.toLocaleDateString(),
          isAvailable,
          daysUntilTest: isAvailable ? 0 : daysUntilTest,
          canStart: isAvailable && assignment.status === 'assigned',
          assignedBy: assignment.assignedBy?.name || 'Admin'
        }
      })

      // Get student's test attempts from their testAttempts array
      const testAttempts = student.testAttempts || []

      // Calculate statistics
      const totalChapters = completedChapters.length
      const totalAssignedTests = assignedTestsDetails.length
      const completedTests = testAttempts.length
      const averageScore = testAttempts.length > 0 
        ? Math.round(testAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / testAttempts.length * 100) / 100
        : 0

      progress[student._id] = {
        completedChapters: totalChapters,
        assignedTests: totalAssignedTests,
        completedTests,
        averageScore,
        testAttempts,
        completedChaptersDetails: completedChapters.map(cc => ({
          name: cc.chapter?.name || 'Unknown Chapter',
          completedAt: cc.completedAt
        })),
        assignedTestsDetails
      }
    }

    res.json({
      success: true,
      students,
      progress
    })
  } catch (error) {
    console.error('Get student progress error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})



// @route   PUT /api/admin/update-test-assignment
// @desc    Update test assignment date
// @access  Private (Admin)
router.put('/update-test-assignment', protect, admin, async (req, res) => {
  try {
    const { studentId, testId, testDate } = req.body

    if (!studentId || !testId || !testDate) {
      return res.status(400).json({ message: 'Student ID, Test ID, and Test Date are required' })
    }

    // Validate test date (must be today or in the future)
    const testDateObj = new Date(testDate)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Start of today
    
    if (testDateObj < today) {
      return res.status(400).json({ message: 'Test date cannot be in the past' })
    }

    // Find student and update the assignment
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const assignment = student.assignedTests.find(
      assignment => assignment.test.toString() === testId
    )

    if (!assignment) {
      return res.status(404).json({ message: 'Test assignment not found' })
    }

    // Update only the test date, keep assignedAt unchanged
    assignment.testDate = testDateObj
    // assignedAt should never change - it represents when admin originally assigned the test
    await student.save()

    // Add notification to student
    const test = await Test.findById(testId)
    student.addNotification(
      'test_available',
      'Test Date Updated',
      `The test "${test.title}" date has been updated to ${testDateObj.toLocaleDateString()}`
    )
    await student.save()

    res.json({
      success: true,
      message: 'Test assignment updated successfully',
      assignment: {
        test: test?.title,
        student: student.name,
        testDate: testDateObj,
        assignedAt: assignment.assignedAt
      }
    })
  } catch (error) {
    console.error('Update test assignment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/tests/for-student/:studentId
// @desc    Get tests filtered by student's batch type
// @access  Private (Admin)
router.get('/tests/for-student/:studentId', protect, admin, async (req, res) => {
  try {
    const { studentId } = req.params

    // Find the student and get their batch type
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const batchType = student.batchEnrollment?.batchType
    if (!batchType) {
      return res.status(400).json({ message: 'Student is not enrolled in any batch' })
    }

    // Get all active tests
    let tests = await Test.find({ isActive: true })
      .populate('subjectId', 'name examType')
      .populate('chapterId', 'name')
      .select('title subjectId chapterId difficultyLevel topicTag timeLimit examType questions status')

    // Filter tests based on batch type using examType field
    const filteredTests = tests.filter(test => {
      const testExamType = test.examType?.toLowerCase() || 'neet'
      const studentBatchType = batchType.toLowerCase()
      
      // Match test exam type with student batch type
      return testExamType === studentBatchType
    })

    res.json({
      success: true,
      tests: filteredTests,
      studentBatch: {
        name: student.batchEnrollment.batchName,
        type: batchType
      }
    })
  } catch (error) {
    console.error('Get tests for student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/admin/remove-test-assignment
// @desc    Remove test assignment from student
// @access  Private (Admin)
router.delete('/remove-test-assignment', protect, admin, async (req, res) => {
  try {
    const { studentId, testId } = req.body

    if (!studentId || !testId) {
      return res.status(400).json({ message: 'Student ID and Test ID are required' })
    }

    // Find student and remove the assignment
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const assignmentIndex = student.assignedTests.findIndex(
      assignment => assignment.test.toString() === testId
    )

    if (assignmentIndex === -1) {
      return res.status(404).json({ message: 'Test assignment not found' })
    }

    // Get test info for notification
    const test = await Test.findById(testId)
    
    // Remove the assignment
    student.assignedTests.splice(assignmentIndex, 1)
    await student.save()

    // Add notification to student
    student.addNotification(
      'system',
      'Test Assignment Removed',
      `The test "${test?.title}" has been removed from your assignments`
    )
    await student.save()

    res.json({
      success: true,
      message: 'Test assignment removed successfully'
    })
  } catch (error) {
    console.error('Remove test assignment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/batch-pricing
// @desc    Get all batch pricing information
// @access  Private (Admin)
router.get('/batch-pricing', protect, admin, async (req, res) => {
  try {
    const batches = await Batch.find({ isActive: true }).sort({ sortOrder: 1 })
    
    res.json({
      success: true,
      batches
    })
  } catch (error) {
    console.error('Get batch pricing error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/admin/batch-pricing/:batchId
// @desc    Update batch pricing
// @access  Private (Admin)
router.put('/batch-pricing/:batchId', protect, admin, async (req, res) => {
  try {
    const { batchId } = req.params
    const { name, type, price, originalPrice, duration, features, description, subjects, mcqCount } = req.body

    // Validate required fields
    if (!name || !type || !price || !originalPrice || !duration) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Validate price values
    if (price < 0 || originalPrice < 0) {
      return res.status(400).json({ message: 'Prices must be positive values' })
    }

    // Validate type
    if (!['NEET', 'JEE'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either NEET or JEE' })
    }

    // Update the batch in database
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { 
        name, 
        type, 
        price, 
        originalPrice, 
        duration, 
        features,
        description,
        subjects,
        mcqCount
      },
      { new: true }
    )

    if (!updatedBatch) {
      return res.status(404).json({ message: 'Batch not found' })
    }

    res.json({
      success: true,
      message: 'Batch pricing updated successfully',
      batch: updatedBatch
    })
  } catch (error) {
    console.error('Update batch pricing error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/assign-batch
// @desc    Assign a batch to a student
// @access  Private (Admin)
router.post('/assign-batch', protect, admin, async (req, res) => {
  try {
    const { studentId, batchId } = req.body

    // Validate required fields
    if (!studentId || !batchId) {
      return res.status(400).json({ message: 'Student ID and Batch ID are required' })
    }

    // Find the student
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Check if student is already enrolled in a batch
    if (student.batchEnrollment && student.batchEnrollment.isEnrolled) {
      return res.status(400).json({ message: 'Student is already enrolled in a batch' })
    }

    // Find the batch
    const batch = await Batch.findById(batchId)
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' })
    }

    // Calculate enrollment dates
    const now = new Date()
    
    // Parse duration string to get days (e.g., "6 months" = 180 days, "1 year" = 365 days)
    let durationInDays = 365 // Default to 1 year
    if (batch.duration) {
      const durationLower = batch.duration.toLowerCase()
      if (durationLower.includes('month')) {
        const months = parseInt(durationLower.match(/\d+/)?.[0] || 6)
        durationInDays = months * 30
      } else if (durationLower.includes('year')) {
        const years = parseInt(durationLower.match(/\d+/)?.[0] || 1)
        durationInDays = years * 365
      } else if (durationLower.includes('day')) {
        durationInDays = parseInt(durationLower.match(/\d+/)?.[0] || 30)
      }
    }
    
    const expiresAt = new Date(now.getTime() + (durationInDays * 24 * 60 * 60 * 1000))

    // Create batch enrollment
    student.batchEnrollment = {
      batchId: batch._id,
      batchName: batch.name,
      batchType: batch.type,
      isEnrolled: true,
      enrolledAt: now,
      expiresAt: expiresAt,
      isActive: true,
      validUntil: expiresAt.toISOString().split('T')[0] // Format as YYYY-MM-DD for frontend
    }

    // Save the student
    await student.save()

    // Add notification to student
    student.addNotification(
      'system',
      'Batch Enrollment',
      `You have been enrolled in the ${batch.name} (${batch.type}) batch. Your access expires on ${expiresAt.toLocaleDateString()}.`
    )
    await student.save()

    res.json({
      success: true,
      message: 'Batch assigned successfully',
      enrollment: student.batchEnrollment
    })
  } catch (error) {
    console.error('Assign batch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/assign-test
// @desc    Assign a test to a student
// @access  Private (Admin)
router.post('/assign-test', protect, admin, async (req, res) => {
  try {
    console.log('📝 Test assignment request received:', { 
      studentId: req.body.studentId, 
      testId: req.body.testId, 
      testDate: req.body.testDate 
    })
    
    const { studentId, testId, testDate } = req.body

    // Validate required fields
    if (!studentId || !testId) {
      console.log('❌ Missing required fields for test assignment')
      return res.status(400).json({ message: 'Student ID and Test ID are required' })
    }

    // Find the student
    const student = await User.findById(studentId)
    if (!student) {
      console.log('❌ Student not found:', studentId)
      return res.status(404).json({ message: 'Student not found' })
    }

    // Find the test with populated subject and chapter
    const test = await Test.findById(testId)
      .populate('subjectId', 'name')
      .populate('chapterId', 'name')
    if (!test) {
      console.log('❌ Test not found:', testId)
      return res.status(404).json({ message: 'Test not found' })
    }

    console.log(`✅ Found student: ${student.name} (${student.email})`)
    console.log(`✅ Found test: ${test.title}`)

    // Check if test is already assigned to this student
    const existingAssignment = student.assignedTests.find(
      assignment => assignment.test.toString() === testId
    )

    if (existingAssignment) {
      console.log('❌ Test already assigned to student')
      return res.status(400).json({ message: 'Test is already assigned to this student' })
    }

    // Add test to student's assigned tests
    const assignedAtDate = new Date() // Always current date/time when admin assigns
    let testDateObj = new Date() // Default to today if no specific date provided
    
    if (testDate) {
      // If specific test date provided, use it
      testDateObj = new Date(testDate + 'T00:00:00')
    }

    const testAssignment = {
      test: testId,
      assignedBy: req.user._id, // Track who assigned it
      status: 'assigned',
      assignedAt: assignedAtDate, // When the admin assigned the test
      testDate: testDateObj // When the test becomes available to student
    }

    student.assignedTests.push(testAssignment)

    // Add notification to student
    student.addNotification(
      'test_available',
      'New Test Assigned',
      `You have been assigned a new test: ${test.title}. Please check your dashboard to take the test.`
    )

    await student.save()
    console.log('✅ Test assignment saved to database')

    // Send email notification with improved error handling
    try {
      console.log(`📧 Starting email notification process for test assignment`)
      console.log(`📧 Email details: ${student.email}, ${student.name}, ${test.title}`)
      
      // Check if email service is configured
      if (!emailService.isConfigured) {
        console.log('⚠️ Email service not configured, attempting to initialize...')
        await emailService.initialize()
      }
      
              if (emailService.isConfigured) {
          await emailService.sendTestAssignmentEmail(
            student.email,
            student.name,
            test.title,
            test.subjectId?.name || 'Unknown Subject',
            test.chapterId?.name || 'Unknown Chapter',
            testDateObj
          )
          console.log(`✅ Test assignment email sent successfully to ${student.email}`)
          console.log(`📧 Email details: Subject: ${test.subjectId?.name}, Chapter: ${test.chapterId?.name}, Test Date: ${testDateObj ? testDateObj.toLocaleDateString() : 'Not specified'}`)
      } else {
        console.log('❌ Email service not available, skipping email notification')
      }
    } catch (emailError) {
      console.error('❌ Failed to send test assignment email:', emailError.message)
      console.error('Test assignment email error details:', {
        studentEmail: student.email,
        studentName: student.name,
        testTitle: test.title,
        error: emailError.message,
        stack: emailError.stack
      })
      // Don't fail the request if email fails, but log the error for debugging
      // The test assignment is still successful even if email fails
    }

    res.json({
      success: true,
      message: 'Test assigned successfully',
      assignment: testAssignment
    })
  } catch (error) {
    console.error('❌ Assign test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/test-email
// @desc    Test email functionality
// @access  Private (Admin)
router.post('/test-email', protect, admin, async (req, res) => {
  try {
    const { email, name, testTitle } = req.body

    if (!email || !name || !testTitle) {
      return res.status(400).json({ 
        message: 'Email, name, and test title are required' 
      })
    }

    console.log(`🧪 Testing email functionality for ${email}`)
    
    // Check if email service is configured
    if (!emailService.isConfigured) {
      console.log('⚠️ Email service not configured, attempting to initialize...')
      await emailService.initialize()
    }
    
    if (!emailService.isConfigured) {
      return res.status(500).json({ 
        message: 'Email service not configured',
        error: 'Email service initialization failed'
      })
    }
    
    // Test the email function directly
    await emailService.sendTestAssignmentEmail(email, name, testTitle, 'Test Subject', 'Test Chapter', new Date())
    
    res.json({
      success: true,
      message: 'Test email sent successfully'
    })
  } catch (error) {
    console.error('❌ Test email failed:', error.message)
    res.status(500).json({ 
      message: 'Test email failed',
      error: error.message 
    })
  }
})

// @route   POST /api/admin/assign-batch
// @desc    Assign a batch to a student
// @access  Private (Admin)
router.post('/assign-batch', protect, admin, async (req, res) => {
  try {
    const { studentId, batchId } = req.body

    if (!studentId || !batchId) {
      return res.status(400).json({ message: 'Student ID and Batch ID are required' })
    }

    // Find the student
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Find the batch
    const batch = await Batch.findById(batchId)
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' })
    }

    // Update student's batch enrollment
    student.batchEnrollment = {
      batchId: batch._id,
      isEnrolled: true,
      batchName: batch.name,
      batchType: batch.type,
      enrolledAt: new Date(),
      expiresAt: batch.duration ? new Date(Date.now() + batch.duration * 24 * 60 * 60 * 1000) : null,
      isActive: true,
      validUntil: batch.duration ? new Date(Date.now() + batch.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
    }

    await student.save()

    res.json({
      success: true,
      message: 'Batch assigned successfully',
      enrollment: student.batchEnrollment
    })
  } catch (error) {
    console.error('Assign batch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/admin/remove-batch
// @desc    Remove batch enrollment from a student
// @access  Private (Admin)
router.post('/remove-batch', protect, admin, async (req, res) => {
  try {
    const { studentId } = req.body

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' })
    }

    // Find the student
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Check if student is enrolled in a batch
    if (!student.batchEnrollment || !student.batchEnrollment.isEnrolled) {
      return res.status(400).json({ message: 'Student is not enrolled in any batch' })
    }

    // Remove batch enrollment
    student.batchEnrollment = {
      batchId: null,
      isEnrolled: false,
      batchName: null,
      batchType: null,
      enrolledAt: null,
      expiresAt: null,
      isActive: false,
      validUntil: null
    }

    await student.save()

    res.json({
      success: true,
      message: 'Batch removed successfully'
    })
  } catch (error) {
    console.error('Remove batch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/admin/tests/:id
// @desc    Delete a test
// @access  Private (Admin)
router.delete('/tests/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params

    // Find the test
    const test = await Test.findById(id)
    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    // Check if test is assigned to any students
    const studentsWithTest = await User.find({
      'assignedTests.test': id
    })

    if (studentsWithTest.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete test. It is assigned to ${studentsWithTest.length} student(s). Please remove assignments first.` 
      })
    }

    // Delete the test
    await Test.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Test deleted successfully'
    })
  } catch (error) {
    console.error('Delete test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 