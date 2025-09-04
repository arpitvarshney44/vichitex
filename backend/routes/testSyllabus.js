import express from 'express'
import TestSyllabus from '../models/TestSyllabus.js'
import Test from '../models/Test.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// Test endpoint to check if routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Test syllabus routes are working' })
})

// Get all test syllabi (Admin only)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const syllabi = await TestSyllabus.find({ isActive: true })
      .populate('testId', 'title subjectId chapterId')
      .populate('testId.subjectId', 'name')
      .populate('testId.chapterId', 'name')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      syllabi
    })
  } catch (error) {
    console.error('Error fetching test syllabi:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test syllabi',
      error: error.message
    })
  }
})

// Get syllabus for a specific test (Admin only)
router.get('/admin/test/:testId', protect, admin, async (req, res) => {
  try {
    const { testId } = req.params
    
    const syllabus = await TestSyllabus.findOne({ 
      testId, 
      isActive: true 
    }).populate('testId', 'title subjectId chapterId')

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found for this test'
      })
    }

    res.json({
      success: true,
      syllabus
    })
  } catch (error) {
    console.error('Error fetching test syllabus:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test syllabus'
    })
  }
})

// Create new test syllabus (Admin only)
router.post('/admin/create', protect, admin, async (req, res) => {
  try {
    const {
      testId,
      title,
      description,
      topics,
      importantPoints,
      studyMaterials
    } = req.body

    // Validate test exists
    const test = await Test.findById(testId)
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      })
    }

    // Check if syllabus already exists for this test
    const existingSyllabus = await TestSyllabus.findOne({ testId, isActive: true })
    if (existingSyllabus) {
      return res.status(400).json({
        success: false,
        message: 'Syllabus already exists for this test'
      })
    }

    const syllabus = new TestSyllabus({
      testId,
      title,
      description,
      topics: topics || [],
      importantPoints: importantPoints || [],
      studyMaterials: studyMaterials || [],
      createdBy: req.user.id
    })

    await syllabus.save()

    const populatedSyllabus = await TestSyllabus.findById(syllabus._id)
      .populate('testId', 'title subjectId chapterId')
      .populate('testId.subjectId', 'name')
      .populate('testId.chapterId', 'name')

    res.status(201).json({
      success: true,
      message: 'Test syllabus created successfully',
      syllabus: populatedSyllabus
    })
  } catch (error) {
    console.error('Error creating test syllabus:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create test syllabus'
    })
  }
})

// Update test syllabus (Admin only)
router.put('/admin/:syllabusId', protect, admin, async (req, res) => {
  try {
    const { syllabusId } = req.params
    const {
      title,
      description,
      topics,
      importantPoints,
      studyMaterials
    } = req.body

    const syllabus = await TestSyllabus.findById(syllabusId)
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      })
    }

    syllabus.title = title || syllabus.title
    syllabus.description = description || syllabus.description
    syllabus.topics = topics || syllabus.topics
    syllabus.importantPoints = importantPoints || syllabus.importantPoints
    syllabus.studyMaterials = studyMaterials || syllabus.studyMaterials

    await syllabus.save()

    const updatedSyllabus = await TestSyllabus.findById(syllabusId)
      .populate('testId', 'title subjectId chapterId')
      .populate('testId.subjectId', 'name')
      .populate('testId.chapterId', 'name')

    res.json({
      success: true,
      message: 'Test syllabus updated successfully',
      syllabus: updatedSyllabus
    })
  } catch (error) {
    console.error('Error updating test syllabus:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update test syllabus'
    })
  }
})

// Delete test syllabus (Admin only)
router.delete('/admin/:syllabusId', protect, admin, async (req, res) => {
  try {
    const { syllabusId } = req.params

    const syllabus = await TestSyllabus.findById(syllabusId)
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      })
    }

    syllabus.isActive = false
    await syllabus.save()

    res.json({
      success: true,
      message: 'Test syllabus deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting test syllabus:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete test syllabus'
    })
  }
})

// Get syllabus for assigned tests (Student)
router.get('/student/assigned', protect, async (req, res) => {
  try {
    const userId = req.user.id

    // Get assigned tests for the student
    const assignedTestIds = req.user.assignedTests?.map(at => at.test) || []
    
    const assignedTests = await Test.find({
      _id: { $in: assignedTestIds },
      isActive: true
    }).populate('subjectId', 'name').populate('chapterId', 'name')

    // Get syllabi for assigned tests
    const testIds = assignedTests.map(test => test._id)
    
    const syllabi = await TestSyllabus.find({
      testId: { $in: testIds },
      isActive: true
    }).populate('testId', 'title subjectId chapterId')

    // Combine test and syllabus data
    const testSyllabi = assignedTests.map(test => {
      const syllabus = syllabi.find(s => s.testId._id.toString() === test._id.toString())
      return {
        test,
        syllabus: syllabus || null
      }
    })

    res.json({
      success: true,
      testSyllabi
    })
  } catch (error) {
    console.error('Error fetching student test syllabi:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test syllabi'
    })
  }
})

// Get syllabus for a specific test (Student)
router.get('/student/test/:testId', protect, async (req, res) => {
  try {
    const { testId } = req.params
    const userId = req.user.id

    // Check if student has access to this test
    const hasAccess = req.user.assignedTests?.includes(testId)
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this test'
      })
    }

    const syllabus = await TestSyllabus.findOne({
      testId,
      isActive: true
    }).populate('testId', 'title subjectId chapterId')

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found for this test'
      })
    }

    res.json({
      success: true,
      syllabus
    })
  } catch (error) {
    console.error('Error fetching test syllabus:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test syllabus'
    })
  }
})

export default router 