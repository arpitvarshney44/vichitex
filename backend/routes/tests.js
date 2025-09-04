import express from 'express'
import { protect, student, admin } from '../middleware/auth.js'
import Test from '../models/Test.js'
import User from '../models/User.js'
import TestAttempt from '../models/TestAttempt.js'

const router = express.Router()

// @route   GET /api/tests
// @desc    Get available tests for student
// @access  Private (Student)
router.get('/', protect, student, async (req, res) => {
  try {
    const tests = await Test.find({
      status: 'active',
      isActive: true
    }).populate('subjectId', 'name').populate('chapterId', 'name')

    res.json({
      success: true,
      tests: tests
    })
  } catch (error) {
    console.error('Get tests error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/tests/:id
// @desc    Get test details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('subjectId', 'name')
      .populate('chapterId', 'name')

    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    res.json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        description: test.description || '',
        subjectId: test.subjectId,
        chapterId: test.chapterId,
        totalQuestions: test.totalQuestions,
        timeLimit: test.timeLimit,
        difficultyLevel: test.difficultyLevel,
        questions: test.questions
      }
    })
  } catch (error) {
    console.error('Get test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/tests/:id/start
// @desc    Start a test
// @access  Private (Student)
router.post('/:id/start', protect, student, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    // Check if test is active
    if (!test.isActive) {
      return res.status(403).json({ message: 'This test is not available' })
    }

    // Check if user has this test assigned and update status to 'started'
    const user = await User.findById(req.user.id)
    const assignedTest = user.assignedTests.find(at => at.test.toString() === req.params.id)
    
    if (!assignedTest) {
      return res.status(403).json({ message: 'This test is not assigned to you' })
    }

    if (assignedTest.status === 'completed') {
      return res.status(403).json({ message: 'This test has already been completed' })
    }

    // Check if test is available based on assigned date
    const now = new Date()
    const testDate = assignedTest.testDate ? new Date(assignedTest.testDate) : null
    
    if (testDate) {
      // If test has a specific date, check if it's available
      const testDateStart = new Date(testDate)
      testDateStart.setHours(0, 0, 0, 0)
      
      const testDateEnd = new Date(testDate)
      testDateEnd.setHours(23, 59, 59, 999)
      
      if (now < testDateStart) {
        return res.status(403).json({ 
          message: `This test is scheduled for ${testDate.toLocaleDateString()}. It will be available from 00:00 AM to 11:59 PM on that date.` 
        })
      } else if (now > testDateEnd) {
        return res.status(403).json({ message: 'This test has expired. Please contact your administrator.' })
      }
    }

    // Update the test status to 'started' only if it's not already started
    if (assignedTest.status === 'assigned') {
      assignedTest.status = 'started'
      await user.save()
    }

    res.json({
      success: true,
      message: assignedTest.status === 'started' ? 'Test started successfully' : 'Test resumed successfully'
    })
  } catch (error) {
    console.error('Start test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})



// @route   POST /api/tests/:id/submit
// @desc    Submit test answers
// @access  Private (Student)
router.post('/:id/submit', protect, student, async (req, res) => {
  try {
    const { answers, timeTaken, startTime } = req.body

    const test = await Test.findById(req.params.id)
    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    const user = await User.findById(req.user.id)

    // Calculate score and prepare answers with correctness using NEET/JEE marking system
    let correctAnswers = 0
    let wrongAnswers = 0
    let totalMarks = 0
    const totalQuestions = test.questions.length
    const processedAnswers = []

    // NEET and JEE marking system: +4 for correct, -1 for wrong, 0 for unattempted
    const correctMark = 4
    const wrongMark = -1

    answers.forEach(answer => {
      const question = test.questions.find(q => q._id.toString() === answer.questionId)
      const isCorrect = question && question.correctAnswer === answer.selectedOption
      
      if (isCorrect) {
        correctAnswers++
        totalMarks += correctMark
      } else {
        wrongAnswers++
        totalMarks += wrongMark
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      })
    })

    // Calculate percentage score based on maximum possible marks
    const maxPossibleMarks = totalQuestions * correctMark
    const score = Math.round((totalMarks / maxPossibleMarks) * 100)

    // Save test attempt to database
    const testAttempt = new TestAttempt({
      userId: user._id,
      testId: test._id,
      score,
      correctAnswers,
      wrongAnswers,
      totalQuestions,
      totalMarks,
      maxPossibleMarks,
      questionsAttempted: answers.length,
      questionsUnattempted: totalQuestions - answers.length,
      timeTaken,
      answers: processedAnswers,
      startedAt: startTime ? new Date(startTime) : new Date(),
      completedAt: new Date(),
      status: 'completed'
    })

    await testAttempt.save()

    // Update the assigned test status to 'completed'
    const assignedTest = user.assignedTests.find(at => at.test.toString() === req.params.id)
    if (assignedTest) {
      assignedTest.status = 'completed'
      await user.save()
    }

    res.json({
      success: true,
      results: {
        score,
        correctAnswers,
        wrongAnswers,
        totalQuestions,
        totalMarks,
        maxPossibleMarks,
        timeTaken,
        accuracy: Math.round((correctAnswers / totalQuestions) * 100),
        questionsAttempted: answers.length,
        questionsUnattempted: totalQuestions - answers.length
      }
    })
  } catch (error) {
    console.error('Submit test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/tests/:id/results
// @desc    Get test results for user
// @access  Private
router.get('/:id/results', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    // Get user's attempts for this test
    const attempts = await TestAttempt.find({
      userId: req.user.id,
      testId: req.params.id
    }).sort({ createdAt: -1 })

    res.json({
      success: true,
      attempts
    })
  } catch (error) {
    console.error('Get test results error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/tests/user/history
// @desc    Get user's test history
// @access  Private
router.get('/user/history', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ userId: req.user.id })
      .populate({
        path: 'testId',
        select: 'title difficultyLevel timeLimit subjectId chapterId',
        populate: [
          { path: 'subjectId', select: 'name' },
          { path: 'chapterId', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50) // Get last 50 attempts

    res.json({
      success: true,
      testHistory: attempts
    })
  } catch (error) {
    console.error('Get test history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/tests/user/attempts
// @desc    Get user's test attempts summary
// @access  Private
router.get('/user/attempts', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ userId: req.user.id })
      .populate('testId', 'title difficultyLevel')
      .sort({ createdAt: -1 })

    const summary = {
      totalAttempts: attempts.length,
      averageScore: attempts.length > 0 ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(attempt => attempt.score)) : 0,
      totalTimeSpent: attempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0),
      recentAttempts: attempts.slice(0, 5) // Last 5 attempts
    }

    res.json({
      success: true,
      summary
    })
  } catch (error) {
    console.error('Get test attempts summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/tests/generate
// @desc    Generate a test for a subject based on completed chapters
// @access  Private (Student)
router.post('/generate', protect, async (req, res) => {
  try {
    const { subjectId } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // For now, return a success message indicating test generation
    // In a real implementation, you would generate questions based on the completed chapters
    res.json({
      success: true,
      message: 'Test generation feature coming soon.',
      subjectId
    })

  } catch (error) {
    console.error('Generate test error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 