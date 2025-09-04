import express from 'express'
import { protect, student } from '../middleware/auth.js'
import User from '../models/User.js'
import Chapter from '../models/Chapter.js'
import Test from '../models/Test.js'
import Subject from '../models/Subject.js'

const router = express.Router()

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedChapters.chapter')
      .populate('assignedTests.test')

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name) user.name = name
    if (phone) user.phone = phone

    await user.save()

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/batch-info
// @desc    Get user's batch enrollment information
// @access  Private
router.get('/batch-info', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      batchEnrollment: user.batchEnrollment
    })
  } catch (error) {
    console.error('Get batch info error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/assigned-tests
// @desc    Get user's assigned tests
// @access  Private
router.get('/assigned-tests', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'assignedTests.test',
        populate: [
          { path: 'subjectId', select: 'name' },
          { path: 'chapterId', select: 'name' }
        ]
      })
      .populate('assignedTests.assignedBy', 'name')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is enrolled in a batch
    if (!user.batchEnrollment.isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in a batch to view assigned tests' })
    }

    // Process assigned tests to include availability status
    const now = new Date()
    const processedTests = user.assignedTests.map(assignment => {
      const testDate = assignment.testDate ? new Date(assignment.testDate) : new Date(assignment.assignedAt || now)
      const isAvailable = now >= testDate
      const timeUntilTest = testDate - now
      const daysUntilTest = Math.ceil(timeUntilTest / (1000 * 60 * 60 * 24))

      return {
        ...assignment.toObject(),
        isAvailable,
        daysUntilTest: isAvailable ? 0 : daysUntilTest,
        testDateFormatted: testDate.toLocaleDateString(),
        canStart: isAvailable && assignment.status === 'assigned'
      }
    })

    res.json({
      success: true,
      assignedTests: processedTests
    })
  } catch (error) {
    console.error('Get assigned tests error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/completed-chapters
// @desc    Get user's completed chapters
// @access  Private
router.get('/completed-chapters', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedChapters.chapter')
      .populate('completedChapters.chapter.subject')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Group completed chapters by subject
    const chaptersBySubject = {}
    user.completedChapters.forEach(completed => {
      const subjectId = completed.subjectId
      if (!chaptersBySubject[subjectId]) {
        chaptersBySubject[subjectId] = []
      }
      chaptersBySubject[subjectId].push(completed)
    })

    res.json({
      success: true,
      completedChapters: user.completedChapters,
      chaptersBySubject
    })
  } catch (error) {
    console.error('Get completed chapters error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/users/complete-chapter
// @desc    Mark a chapter as completed
// @access  Private
router.post('/complete-chapter', protect, async (req, res) => {
  try {
    const { chapterId } = req.body

    if (!chapterId) {
      return res.status(400).json({ message: 'Chapter ID is required' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is enrolled in a batch
    if (!user.batchEnrollment.isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in a batch to complete chapters' })
    }

    // Find the chapter
    const chapter = await Chapter.findById(chapterId)
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' })
    }

    // Check if chapter is already completed
    const isAlreadyCompleted = user.completedChapters.some(
      completed => completed.chapter.toString() === chapterId
    )

    if (isAlreadyCompleted) {
      return res.status(400).json({ message: 'Chapter is already completed' })
    }

    // Add chapter to completed list
    user.completedChapters.push({
      chapter: chapterId,
      subjectId: chapter.subjectId,
      completedAt: new Date()
    })

    await user.save()

    res.json({
      success: true,
      message: 'Chapter marked as completed',
      completedChapters: user.completedChapters
    })
  } catch (error) {
    console.error('Complete chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/assigned-tests
// @desc    Get user's assigned tests
// @access  Private
router.get('/assigned-tests', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('assignedTests.test')
      .populate('assignedTests.assignedBy', 'name')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      assignedTests: user.assignedTests
    })
  } catch (error) {
    console.error('Get assigned tests error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/test-history
// @desc    Get user's test history
// @access  Private
router.get('/test-history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('testAttempts.test')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      testHistory: user.testAttempts
    })
  } catch (error) {
    console.error('Get test history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/users/start-test
// @desc    Start a test
// @access  Private
router.post('/start-test', protect, async (req, res) => {
  try {
    const { testId } = req.body

    if (!testId) {
      return res.status(400).json({ message: 'Test ID is required' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is enrolled in a batch
    if (!user.batchEnrollment.isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in a batch to take tests' })
    }

    // Find the test
    const test = await Test.findById(testId)
    if (!test || !test.isActive) {
      return res.status(404).json({ message: 'Test not found or inactive' })
    }

    // Check if test is assigned to user
    const assignedTest = user.assignedTests.find(
      assigned => assigned.test.toString() === testId
    )

    if (!assignedTest) {
      return res.status(403).json({ message: 'Test is not assigned to you' })
    }

    // Check if test date has arrived
    const now = new Date()
    const testDate = assignedTest.testDate ? new Date(assignedTest.testDate) : new Date(assignedTest.assignedAt || now)
    
    if (now < testDate) {
      const timeUntilTest = testDate - now
      const daysUntilTest = Math.ceil(timeUntilTest / (1000 * 60 * 60 * 24))
      return res.status(403).json({ 
        message: `This test is scheduled for ${testDate.toLocaleDateString()}. You can take it in ${daysUntilTest} day${daysUntilTest !== 1 ? 's' : ''}.` 
      })
    }

    // Check if test can be taken (additional validation from test model)
    if (!test.canUserTakeTest(user._id)) {
      return res.status(403).json({ message: 'You cannot take this test at this time' })
    }

    // Update assigned test status
    assignedTest.status = 'started'
    await user.save()

    // Return test data (without correct answers)
    const testData = {
      _id: test._id,
      title: test.title,
      description: test.description,
      timeLimit: test.timeLimit,
      totalQuestions: test.totalQuestions,
      questions: test.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
        marks: q.marks
      }))
    }

    res.json({
      success: true,
      message: 'Test started successfully',
      test: testData
    })
  } catch (error) {
    console.error('Start test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/users/submit-test
// @desc    Submit test answers
// @access  Private
router.post('/submit-test', protect, async (req, res) => {
  try {
    const { testId, answers, timeTaken } = req.body

    if (!testId || !answers) {
      return res.status(400).json({ message: 'Test ID and answers are required' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Find the test
    const test = await Test.findById(testId)
    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = test.questions.length

    answers.forEach(answer => {
      const question = test.questions.find(q => q._id.toString() === answer.questionId)
      if (question && question.correctAnswer === answer.selectedAnswer) {
        correctAnswers++
      }
    })

    const score = correctAnswers

    // Add attempt to test
    test.addAttempt(user._id, score, totalQuestions, correctAnswers, answers, timeTaken)
    await test.save()

    // Add attempt to user
    user.testAttempts.push({
      test: testId,
      score,
      totalQuestions,
      completedAt: new Date()
    })

    // Update assigned test status
    const assignedTest = user.assignedTests.find(
      assigned => assigned.test.toString() === testId
    )
    if (assignedTest) {
      assignedTest.status = 'completed'
      assignedTest.completedAt = new Date()
      assignedTest.score = score
    }

    await user.save()

    res.json({
      success: true,
      message: 'Test submitted successfully',
      score,
      totalQuestions,
      correctAnswers,
      percentage: Math.round((score / totalQuestions) * 100)
    })
  } catch (error) {
    console.error('Submit test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/test-syllabus
// @desc    Get user's test syllabus (upcoming chapters and tests)
// @access  Private
router.get('/test-syllabus', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('assignedTests.test')
      .populate('completedChapters.chapter')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is enrolled in a batch
    if (!user.batchEnrollment.isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in a batch to view syllabus' })
    }

    const batchType = user.batchEnrollment.batchType.toLowerCase()

    // Get subjects for the batch type
    const subjects = await Subject.find({ 
      examType: batchType,
      isActive: true 
    }).populate('chapters')

    // Organize syllabus by subject
    const syllabus = subjects.map(subject => {
      const completedChapters = user.completedChapters.filter(
        completed => completed.subjectId === subject.code && completed.chapter
      ).map(completed => completed.chapter._id.toString())

      const chapters = subject.chapters.map(chapter => ({
        ...chapter.toObject(),
        isCompleted: completedChapters.includes(chapter._id.toString()),
        assignedTests: user.assignedTests.filter(
          assigned => assigned.test && assigned.test.chapters && assigned.test.chapters.includes(chapter._id)
        )
      }))

      return {
        subject: {
          _id: subject._id,
          name: subject.name,
          icon: subject.icon,
          color: subject.color
        },
        chapters
      }
    })

    res.json({
      success: true,
      syllabus
    })
  } catch (error) {
    console.error('Get test syllabus error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/progress
// @desc    Get user's overall progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedChapters.chapter')
      .populate('assignedTests.test')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Calculate progress statistics
    const totalCompletedChapters = user.completedChapters.length
    const totalAssignedTests = user.assignedTests.length
    const totalCompletedTests = user.assignedTests.filter(test => test.status === 'completed').length
    const totalTestAttempts = user.testAttempts.length

    // Calculate average test score
    let averageScore = 0
    if (user.testAttempts.length > 0) {
      const totalScore = user.testAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
      averageScore = Math.round((totalScore / user.testAttempts.length) * 100) / 100
    }

    res.json({
      success: true,
      progress: {
        totalCompletedChapters,
        totalAssignedTests,
        totalCompletedTests,
        totalTestAttempts,
        averageScore,
        batchEnrollment: user.batchEnrollment
      }
    })
  } catch (error) {
    console.error('Get progress error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/users/complete-chapter
// @desc    Mark a chapter as completed
// @access  Private
router.post('/complete-chapter', protect, async (req, res) => {
  try {
    const { chapterId } = req.body

    if (!chapterId) {
      return res.status(400).json({ message: 'Chapter ID is required' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is enrolled in a batch
    if (!user.batchEnrollment.isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in a batch to mark chapters as completed' })
    }

    // Find the chapter
    const chapter = await Chapter.findById(chapterId)
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' })
    }

    // Check if chapter is already completed
    const alreadyCompleted = user.completedChapters.find(
      completed => completed.chapter.toString() === chapterId
    )

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Chapter is already marked as completed' })
    }

    // Add chapter to completed chapters
    user.completedChapters.push({
      chapter: chapterId,
      subjectId: chapter.subject.toString(),
      completedAt: new Date()
    })

    await user.save()

    res.json({
      success: true,
      message: 'Chapter marked as completed successfully'
    })
  } catch (error) {
    console.error('Complete chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/users/uncomplete-chapter
// @desc    Unmark a chapter as completed
// @access  Private
router.delete('/uncomplete-chapter', protect, async (req, res) => {
  try {
    const { chapterId } = req.body

    if (!chapterId) {
      return res.status(400).json({ message: 'Chapter ID is required' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is enrolled in a batch
    if (!user.batchEnrollment.isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in a batch to unmark chapters' })
    }

    // Find the completed chapter
    const completedChapterIndex = user.completedChapters.findIndex(
      completed => completed.chapter.toString() === chapterId
    )

    if (completedChapterIndex === -1) {
      return res.status(404).json({ message: 'Chapter is not marked as completed' })
    }

    // Remove chapter from completed chapters
    user.completedChapters.splice(completedChapterIndex, 1)
    await user.save()

    res.json({
      success: true,
      message: 'Chapter unmarked as completed successfully'
    })
  } catch (error) {
    console.error('Uncomplete chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 