import express from 'express'
import { protect, admin } from '../middleware/auth.js'
import Coupon from '../models/Coupon.js'
import User from '../models/User.js'

const router = express.Router()

// Admin Routes

// Create a new coupon
router.post('/admin/create', protect, admin, async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minimumAmount,
      usageLimit,
      validFrom,
      validUntil,
      applicableBatches
    } = req.body

    // Validate required fields
    if (!code || !name || !discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() })
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      })
    }

    // Validate discount value
    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount must be between 1 and 100'
      })
    }

    if (discountType === 'fixed' && discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Fixed discount must be greater than 0'
      })
    }

    // Create coupon
    const coupon = new Coupon({
      code: code.toUpperCase(),
      name,
      description,
      discountType,
      discountValue,
      maxDiscount: maxDiscount || null,
      minimumAmount: minimumAmount || 0,
      usageLimit: usageLimit || 1,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableBatches: applicableBatches || [],
      createdBy: req.user.id
    })

    await coupon.save()

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating coupon'
    })
  }
})

// Get all coupons (admin)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('createdBy', 'name email')
      .populate('usedBy.userId', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: coupons
    })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons'
    })
  }
})

// Update coupon
router.put('/admin/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minimumAmount,
      usageLimit,
      validFrom,
      validUntil,
      applicableBatches,
      isActive
    } = req.body

    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }

    // Update fields
    if (name) coupon.name = name
    if (description !== undefined) coupon.description = description
    if (discountType) coupon.discountType = discountType
    if (discountValue !== undefined) coupon.discountValue = discountValue
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount
    if (minimumAmount !== undefined) coupon.minimumAmount = minimumAmount
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit
    if (validFrom) coupon.validFrom = new Date(validFrom)
    if (validUntil) coupon.validUntil = new Date(validUntil)
    if (applicableBatches) coupon.applicableBatches = applicableBatches
    if (isActive !== undefined) coupon.isActive = isActive

    await coupon.save()

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    })
  } catch (error) {
    console.error('Error updating coupon:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating coupon'
    })
  }
})

// Delete coupon
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }

    await Coupon.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon'
    })
  }
})

// User Routes

// Validate coupon code
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, amount, batchType } = req.body

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and amount are required'
      })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      })
    }

    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not valid or has expired'
      })
    }

    // Check if user has already used this coupon
    if (coupon.hasUserUsed(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this coupon'
      })
    }

    // Check if coupon applies to this batch type
    if (coupon.applicableBatches.length > 0 && !coupon.applicableBatches.includes(batchType)) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not applicable for this batch type'
      })
    }

    // Check minimum amount requirement
    if (amount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum amount required: ₹${coupon.minimumAmount}`
      })
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(amount)
    const finalAmount = amount - discountAmount

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        originalAmount: amount,
        discountAmount,
        finalAmount,
        savings: discountAmount
      }
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    res.status(500).json({
      success: false,
      message: 'Error validating coupon'
    })
  }
})

// Apply coupon to order
router.post('/apply', protect, async (req, res) => {
  try {
    const { couponId, orderId, originalAmount } = req.body

    if (!couponId || !orderId || !originalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon ID, order ID, and original amount are required'
      })
    }

    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }

    // Apply coupon and record usage
    const discountAmount = coupon.applyCoupon(req.user.id, orderId, originalAmount)
    await coupon.save()

    const finalAmount = originalAmount - discountAmount

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          name: coupon.name
        },
        originalAmount,
        discountAmount,
        finalAmount,
        orderId
      }
    })
  } catch (error) {
    console.error('Error applying coupon:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error applying coupon'
    })
  }
})

// Get user's coupon usage history
router.get('/history', protect, async (req, res) => {
  try {
    const coupons = await Coupon.find({
      'usedBy.userId': req.user.id
    }).populate('usedBy.userId', 'name email')

    const history = coupons.map(coupon => {
      const usage = coupon.usedBy.find(u => u.userId._id.toString() === req.user.id)
      return {
        couponCode: coupon.code,
        couponName: coupon.name,
        usedAt: usage.usedAt,
        orderId: usage.orderId,
        discountApplied: usage.discountApplied
      }
    })

    res.json({
      success: true,
      data: history
    })
  } catch (error) {
    console.error('Error fetching coupon history:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon history'
    })
  }
})

export default router 