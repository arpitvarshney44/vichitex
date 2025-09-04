import express from 'express'
import Batch from '../models/Batch.js'

const router = express.Router()

// @route   GET /api/batches
// @desc    Get all active batches for landing page
// @access  Public
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find({ isActive: true }).sort({ sortOrder: 1 })
    
    res.json({
      success: true,
      batches
    })
  } catch (error) {
    console.error('Get batches error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/batches/:batchId
// @desc    Get specific batch by ID
// @access  Public
router.get('/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params
    
    const batch = await Batch.findOne({ _id: batchId, isActive: true })
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' })
    }
    
    res.json({
      success: true,
      batch
    })
  } catch (error) {
    console.error('Get batch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 