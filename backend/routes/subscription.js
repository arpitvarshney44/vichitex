import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// Get user subscription status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription')
    
    res.json({
      success: true,
      data: user.subscription
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status'
    })
  }
})

// Purchase premium plan
router.post('/purchase', protect, async (req, res) => {
  try {
    const { paymentId, amount } = req.body
    
    if (!paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID and amount are required'
      })
    }

    // For now, we'll simulate a successful payment
    // In a real implementation, you would verify the payment with your payment gateway
    
    const user = await User.findById(req.user.id)
    
    // Update subscription
    user.subscription = {
      plan: 'premium',
      status: 'active',
      purchasedAt: new Date(),
      expiresAt: null, // Lifetime access
      paymentId,
      amount: amount || 2399
    }
    
    await user.save()
    
    res.json({
      success: true,
      message: 'Premium plan purchased successfully',
      data: user.subscription
    })
  } catch (error) {
    console.error('Error purchasing premium plan:', error)
    res.status(500).json({
      success: false,
      message: 'Error purchasing premium plan'
    })
  }
})

// Cancel subscription (for future use if needed)
router.post('/cancel', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    // For now, we'll just mark as inactive
    // In a real implementation, you might want to handle refunds
    user.subscription.status = 'inactive'
    
    await user.save()
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: user.subscription
    })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription'
    })
  }
})

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        currency: 'INR',
        period: 'forever',
        features: [
          'Previous year questions paper',
          'Basic progress tracking',
          'Chapter completion marking',
          'Email notifications',
          'Mobile-friendly access',
          'Basic support'
        ],
        description: 'Perfect for getting started with basic study tracking'
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 2399,
        currency: 'INR',
        period: 'one-time',
        features: [
          'Everything in Free Plan',
          'Individual student tests',
          '50 MCQs per test',
          'Personalized test content',
          'Advanced progress analytics',
          'Priority email support',
          'Custom study recommendations',
          'Test performance insights',
          'Unlimited test attempts',
          'Detailed answer explanations'
        ],
        description: 'Complete learning experience with personalized tests',
        popular: true
      }
    ]
    
    res.json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans'
    })
  }
})

export default router 