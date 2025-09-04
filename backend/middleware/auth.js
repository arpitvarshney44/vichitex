import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Check if JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set in environment variables')
        return res.status(500).json({ message: 'Server configuration error' })
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'User account is deactivated' })
      }

      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only.' })
  }
}

// Student only middleware
export const student = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next()
  } else {
    return res.status(403).json({ message: 'Access denied. Students only.' })
  }
}

// Optional authentication - doesn't require token but adds user if present
export const optionalAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    } catch (error) {
      // Token is invalid but we don't fail the request
    }
  }

  next()
}

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Rate limiting for authentication endpoints
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
}

// Rate limiting for general API endpoints
export const apiRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
} 