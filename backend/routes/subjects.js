import express from 'express'
import { protect, admin } from '../middleware/auth.js'
import Subject from '../models/Subject.js'
import Chapter from '../models/Chapter.js'

const router = express.Router()

// @route   GET /api/subjects
// @desc    Get all active subjects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true })
      .populate('chapters', 'name order')
      .sort('order')
      .lean()

    res.json({
      success: true,
      subjects
    })
  } catch (error) {
    console.error('Get subjects error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/subjects/:id
// @desc    Get subject by ID with chapters
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate({
        path: 'chapters',
        select: 'name description order estimatedHours difficulty isActive',
        options: { sort: { order: 1 } }
      })
      .lean()

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    res.json({
      success: true,
      subject
    })
  } catch (error) {
    console.error('Get subject error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/subjects
// @desc    Create new subject (Admin only)
// @access  Private (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    console.log('Creating subject with data:', req.body)
    const { name, description, code, category, level } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Subject name is required' })
    }

    // Check if subject with same name or code already exists
    const existingSubjectQuery = { name }
    if (code && code.trim()) {
      existingSubjectQuery.$or = [{ name }, { code: code.trim() }]
    }
    
    const existingSubject = await Subject.findOne(existingSubjectQuery)

    if (existingSubject) {
      return res.status(400).json({ 
        message: 'Subject with this name or code already exists' 
      })
    }

    const subjectData = {
      name,
      description: description || '',
      code: code && code.trim() ? code.trim() : undefined,
      category: category || 'Other',
      level: level || 'Secondary',
      createdBy: req.user.id
    }

    console.log('Creating subject with data:', subjectData)

    const subject = await Subject.create(subjectData)

    console.log('Subject created successfully:', subject)

    res.status(201).json({
      success: true,
      subject
    })
  } catch (error) {
    console.error('Create subject error details:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      })
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Subject with this name or code already exists' 
      })
    }
    
    res.status(500).json({ 
      message: 'Server error creating subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

// @route   PUT /api/subjects/:id
// @desc    Update subject (Admin only)
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, code, category, level, isActive } = req.body

    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    // Check if name or code conflicts with other subjects
    if (name || code) {
      const existingSubject = await Subject.findOne({
        $or: [
          { name: name || subject.name },
          { code: code || subject.code }
        ],
        _id: { $ne: req.params.id }
      })

      if (existingSubject) {
        return res.status(400).json({ 
          message: 'Subject with this name or code already exists' 
        })
      }
    }

    if (name) subject.name = name
    if (description !== undefined) subject.description = description
    if (code) subject.code = code
    if (category) subject.category = category
    if (level) subject.level = level
    if (isActive !== undefined) subject.isActive = isActive

    await subject.save()

    res.json({
      success: true,
      subject
    })
  } catch (error) {
    console.error('Update subject error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/subjects/:id
// @desc    Delete subject (Admin only)
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    // Check if subject has chapters
    if (subject.chapters.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete subject with existing chapters' 
      })
    }

    await Subject.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    })
  } catch (error) {
    console.error('Delete subject error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/subjects/:id/chapters
// @desc    Add chapter to subject (Admin only)
// @access  Private (Admin)
router.post('/:id/chapters', protect, admin, async (req, res) => {
  try {
    const { name, description, order, estimatedHours, difficulty, topics } = req.body

    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    // Check if chapter with same order already exists
    const existingChapter = await Chapter.findOne({
      subject: req.params.id,
      order
    })

    if (existingChapter) {
      return res.status(400).json({ 
        message: 'Chapter with this order already exists' 
      })
    }

    const chapter = await Chapter.create({
      name,
      description,
      subject: req.params.id,
      order,
      estimatedHours,
      difficulty,
      topics: Array.isArray(topics) ? topics : [],
      createdBy: req.user.id
    })

    // Add chapter to subject
    subject.chapters.push(chapter._id)
    await subject.save()

    res.status(201).json({
      success: true,
      chapter
    })
  } catch (error) {
    console.error('Create chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/subjects/:subjectId/chapters/:chapterId
// @desc    Update chapter (Admin only)
// @access  Private (Admin)
router.put('/:subjectId/chapters/:chapterId', protect, admin, async (req, res) => {
  try {
    const { name, description, order, estimatedHours, difficulty, topics, isActive } = req.body
    console.log('Updating chapter with data:', { name, description, order, estimatedHours, difficulty, topics, isActive })

    const chapter = await Chapter.findOne({
      _id: req.params.chapterId,
      subject: req.params.subjectId
    })

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' })
    }

    // Check if order conflicts with other chapters in the same subject
    if (order && order !== chapter.order) {
      const existingChapter = await Chapter.findOne({
        subject: req.params.subjectId,
        order,
        _id: { $ne: req.params.chapterId }
      })

      if (existingChapter) {
        return res.status(400).json({ 
          message: 'Chapter with this order already exists' 
        })
      }
    }

    if (name) chapter.name = name
    if (description !== undefined) chapter.description = description
    if (order) chapter.order = order
    if (estimatedHours) chapter.estimatedHours = estimatedHours
    if (difficulty) chapter.difficulty = difficulty
    if (topics !== undefined) chapter.topics = Array.isArray(topics) ? topics : []
    if (isActive !== undefined) chapter.isActive = isActive

    await chapter.save()

    res.json({
      success: true,
      chapter
    })
  } catch (error) {
    console.error('Update chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/subjects/:subjectId/chapters/:chapterId
// @desc    Delete chapter (Admin only)
// @access  Private (Admin)
router.delete('/:subjectId/chapters/:chapterId', protect, admin, async (req, res) => {
  try {
    const chapter = await Chapter.findOne({
      _id: req.params.chapterId,
      subject: req.params.subjectId
    })

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' })
    }

    await Chapter.findByIdAndDelete(req.params.chapterId)

    // Remove chapter from subject
    await Subject.findByIdAndUpdate(req.params.subjectId, {
      $pull: { chapters: req.params.chapterId }
    })

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    })
  } catch (error) {
    console.error('Delete chapter error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 