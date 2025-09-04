import express from 'express'
import { protect, admin } from '../middleware/auth.js'
import Feedback from '../models/Feedback.js'

const router = express.Router()

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' })
    }

    // Get user agent and IP address
    const userAgent = req.headers['user-agent'] || ''
    const ipAddress = req.ip || req.connection.remoteAddress || ''

    // Create feedback
    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      category: category || 'general',
      userAgent,
      ipAddress
    })

    await feedback.save()

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for your input.',
      feedback: {
        id: feedback._id,
        subject: feedback.subject,
        category: feedback.category,
        status: feedback.status
      }
    })
  } catch (error) {
    console.error('Submit feedback error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/feedback
// @desc    Get all feedback (admin only)
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query

    // Build query
    const query = {}
    if (status) query.status = status
    if (category) query.category = category
    if (priority) query.priority = priority

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Get feedback with pagination
    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')

    // Get total count
    const total = await Feedback.countDocuments(query)

    res.json({
      success: true,
      feedback,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    })
  } catch (error) {
    console.error('Get feedback error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/feedback/:id
// @desc    Get single feedback (admin only)
// @access  Private (Admin)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('resolvedBy', 'name email')

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    res.json({
      success: true,
      feedback
    })
  } catch (error) {
    console.error('Get single feedback error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/feedback/:id
// @desc    Update feedback status and notes (admin only)
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body

    const feedback = await Feedback.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    // Update fields
    if (status) feedback.status = status
    if (priority) feedback.priority = priority
    if (adminNotes !== undefined) feedback.adminNotes = adminNotes

    // Set resolved info if status is resolved
    if (status === 'resolved' && !feedback.resolvedAt) {
      feedback.resolvedAt = new Date()
      feedback.resolvedBy = req.user.id
    }

    await feedback.save()

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback
    })
  } catch (error) {
    console.error('Update feedback error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (admin only)
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    await feedback.deleteOne()

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    })
  } catch (error) {
    console.error('Delete feedback error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/feedback/stats/summary
// @desc    Get feedback statistics (admin only)
// @access  Private (Admin)
router.get('/stats/summary', protect, admin, async (req, res) => {
  try {
    const total = await Feedback.countDocuments()
    const pending = await Feedback.countDocuments({ status: 'pending' })
    const inProgress = await Feedback.countDocuments({ status: 'in-progress' })
    const resolved = await Feedback.countDocuments({ status: 'resolved' })
    const closed = await Feedback.countDocuments({ status: 'closed' })

    // Category breakdown
    const categoryStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])

    // Priority breakdown
    const priorityStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ])

    // Recent feedback (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recent = await Feedback.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        closed,
        recent,
        categories: categoryStats,
        priorities: priorityStats
      }
    })
  } catch (error) {
    console.error('Get feedback stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 