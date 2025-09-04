import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'
import Coupon from '../models/Coupon.js'

const router = express.Router()

// Initialize Razorpay function
const createRazorpayInstance = () => {
  console.log('Environment variables check:')
  console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing')
  console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing')
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not found in environment variables')
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// Create order for batch purchase
router.post('/create-order', protect, async (req, res) => {
  try {
    const { batchName, batchType, amount, couponCode } = req.body

    if (!batchName || !batchType || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Batch name, type, and amount are required'
      })
    }

    // Check if user is already enrolled in a batch
    const user = await User.findById(req.user.id)
    if (user.batchEnrollment.isEnrolled && user.batchEnrollment.isActive) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in a batch'
      })
    }

    let finalAmount = amount
    let couponData = null
    let discountAmount = 0

    // Apply coupon if provided
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() })
        if (coupon && coupon.isValid() && !coupon.hasUserUsed(req.user.id)) {
          // Check if coupon applies to this batch type
          if (coupon.applicableBatches.length === 0 || coupon.applicableBatches.includes(batchType)) {
            // Check minimum amount requirement
            if (amount >= coupon.minimumAmount) {
              discountAmount = coupon.calculateDiscount(amount)
              finalAmount = amount - discountAmount
              couponData = {
                id: coupon._id,
                code: coupon.code,
                name: coupon.name,
                discountAmount
              }
            }
          }
        }
      } catch (error) {
        console.error('Error applying coupon:', error)
        // Continue without coupon if there's an error
      }
    }

    // Create Razorpay order
    const razorpay = createRazorpayInstance()
    const options = {
      amount: finalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `batch_${Date.now()}`,
      notes: {
        batchName,
        batchType,
        userId: req.user.id,
        originalAmount: amount,
        discountAmount,
        couponCode: couponCode || null
      }
    }

    const order = await razorpay.orders.create(options)

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        batchName,
        batchType,
        originalAmount: amount,
        finalAmount,
        discountAmount,
        coupon: couponData
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating payment order'
    })
  }
})

// Verify payment and enroll user in batch
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      batchName,
      batchType,
      amount,
      couponCode
    } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - missing parameters'
      })
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature'
      })
    }

    // Apply coupon if provided
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() })
        if (coupon && coupon.isValid() && !coupon.hasUserUsed(req.user.id)) {
          // Record coupon usage
          coupon.usedBy.push({
            userId: req.user.id,
            usedAt: new Date(),
            orderId: razorpay_order_id,
            discountApplied: coupon.calculateDiscount(amount)
          })
          coupon.usedCount += 1
          await coupon.save()
        }
      } catch (error) {
        console.error('Error recording coupon usage:', error)
        // Continue with payment even if coupon recording fails
      }
    }

    // Update user batch enrollment
    const user = await User.findById(req.user.id)
    
    // Calculate expiration date (1 year from now)
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    user.batchEnrollment = {
      isEnrolled: true,
      batchName,
      batchType,
      enrolledAt: new Date(),
      expiresAt,
      isActive: true,
      validUntil: expiresAt.toISOString().split('T')[0] // YYYY-MM-DD format
    }

    // Also update subscription for compatibility
    user.subscription = {
      plan: 'premium',
      status: 'active',
      purchasedAt: new Date(),
      expiresAt,
      paymentId: razorpay_payment_id,
      amount: amount
    }

    await user.save()

    res.json({
      success: true,
      message: 'Payment verified and batch enrollment successful',
      data: {
        batchEnrollment: user.batchEnrollment,
        subscription: user.subscription
      }
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    })
  }
})

// Get batch plans
router.get('/batch-plans', async (req, res) => {
  try {
    const batchPlans = [
      {
        id: 'neet-2026',
        name: 'NEET TRP BATCH 2026',
        type: 'NEET',
        year: '2026',
        price: 2399,
        currency: 'INR',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete NEET preparation',
          'Annual access'
        ],
        description: 'Complete NEET preparation for 2026',
        color: 'green'
      },
      {
        id: 'neet-2027',
        name: 'NEET TRP BATCH 2027',
        type: 'NEET',
        year: '2027',
        price: 2399,
        currency: 'INR',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete NEET preparation',
          'Annual access'
        ],
        description: 'Complete NEET preparation for 2027',
        color: 'blue'
      },
      {
        id: 'jee-2026',
        name: 'JEE TRP BATCH 2026',
        type: 'JEE',
        year: '2026',
        price: 2399,
        currency: 'INR',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete JEE preparation',
          'Annual access'
        ],
        description: 'Complete JEE preparation for 2026',
        color: 'purple'
      },
      {
        id: 'jee-2027',
        name: 'JEE TRP BATCH 2027',
        type: 'JEE',
        year: '2027',
        price: 2399,
        currency: 'INR',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete JEE preparation',
          'Annual access'
        ],
        description: 'Complete JEE preparation for 2027',
        color: 'orange'
      }
    ]

    res.json({
      success: true,
      data: batchPlans
    })
  } catch (error) {
    console.error('Error fetching batch plans:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching batch plans'
    })
  }
})

// Get user's current batch enrollment
router.get('/batch-enrollment', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('batchEnrollment')
    
    res.json({
      success: true,
      data: user.batchEnrollment
    })
  } catch (error) {
    console.error('Error fetching batch enrollment:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching batch enrollment'
    })
  }
})

export default router 