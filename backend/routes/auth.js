import express from 'express'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'
import { protect, generateToken } from '../middleware/auth.js'
import { 
  sendWelcomeEmail, 
  sendPasswordResetEmail,
  generateResetToken,
  testEmailConfiguration
} from '../services/emailService.js'
import emailService from '../services/emailService.js'

const router = express.Router()

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
})

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, email, phone, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Create user with emailVerified set to true by default
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'student',
      emailVerified: true // Set to true by default, no verification required
    })

    if (user) {
      // Send welcome email with improved error handling
      try {
        console.log(`📧 Attempting to send welcome email to ${user.email}`)
        await sendWelcomeEmail(user)
        console.log(`✅ Welcome email sent successfully to ${user.email}`)
      } catch (emailError) {
        console.error('❌ Error sending welcome email:', emailError.message)
        console.error('Welcome email error details:', {
          userEmail: user.email,
          userName: user.name,
          error: emailError.message,
          stack: emailError.stack
        })
        // Don't fail registration if email fails, but log the error for debugging
      }

      const token = generateToken(user._id)
      
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified
        },
        message: 'Registration successful! Welcome to Vichitex.'
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Check for user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Update last active
    user.lastActive = new Date()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    })
  } catch (error) {
    console.error('Get user info error:', error)
    res.status(500).json({ message: 'Server error getting user info' })
  }
})

// @route   POST /api/auth/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/admin/login', authLimiter, validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Check for admin user
    const user = await User.findOne({ email, role: 'admin' }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Admin account is deactivated' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    // Update last active
    user.lastActive = new Date()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ message: 'Server error during admin login' })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('subjects', 'name code')
      .populate('progress.completedChapters', 'name subject')

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // Update last active
    req.user.lastActive = new Date()
    await req.user.save()

    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Server error during logout' })
  }
})

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', protect, async (req, res) => {
  try {
    const token = generateToken(req.user.id)
    
    res.json({
      success: true,
      token,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        emailVerified: req.user.emailVerified
      }
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ message: 'Server error during token refresh' })
  }
})





// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', authLimiter, [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const resetExpire = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = resetExpire
    await user.save()

    // Send reset email with improved error handling
    try {
      console.log(`📧 Attempting to send password reset email to ${user.email}`)
      await sendPasswordResetEmail(user, resetToken)
      console.log(`✅ Password reset email sent successfully to ${user.email}`)
      
      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    } catch (emailError) {
      console.error('❌ Error sending password reset email:', emailError.message)
      console.error('Password reset email error details:', {
        userEmail: user.email,
        userName: user.name,
        error: emailError.message,
        stack: emailError.stack
      })
      
      // Clear the reset token since email failed
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()
      
      res.status(500).json({ message: 'Error sending password reset email. Please try again later.' })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Server error during password reset request' })
  }
})

// @route   GET /api/auth/email-health
// @desc    Test email configuration
// @access  Public
router.get('/email-health', async (req, res) => {
  try {
    const isEmailConfigured = await testEmailConfiguration()
    
    if (isEmailConfigured) {
      res.json({
        success: true,
        message: 'Email configuration is valid',
        emailConfigured: true
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Email configuration is invalid',
        emailConfigured: false
      })
    }
  } catch (error) {
    console.error('Email health check error:', error)
    res.status(500).json({
      success: false,
      message: 'Error checking email configuration',
      emailConfigured: false
    })
  }
})





// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', authLimiter, [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { token, password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully! You can now login with your new password.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Server error during password reset' })
  }
})

export default router 