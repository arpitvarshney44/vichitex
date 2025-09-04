import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  progress: {
    type: Map,
    of: {
      completedChapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
      }],
      progressPercentage: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    default: new Map()
  },
  testAttempts: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    answers: [{
      questionId: String,
      selectedAnswer: String,
      isCorrect: Boolean
    }]
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['test_available', 'progress_update', 'system'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active'
    },
    purchasedAt: {
      type: Date
    },
    expiresAt: {
      type: Date
    },
    paymentId: String,
    amount: {
      type: Number,
      default: 0
    }
  },
  // Batch enrollment system
  batchEnrollment: {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      default: null
    },
    isEnrolled: {
      type: Boolean,
      default: false
    },
    batchName: {
      type: String,
      default: null
    },
    batchType: {
      type: String,
      enum: ['NEET', 'JEE', 'other', null],
      required: false
    },
    enrolledAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    },
    validUntil: {
      type: String, // For frontend display (e.g., "2024-12-31")
      default: null
    }
  },
  // Completed chapters tracking
  completedChapters: [{
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    subjectId: String // For easy querying (neet-physics, jee-maths, etc.)
  }],
  // Assigned tests by admin
  assignedTests: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    testDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['assigned', 'started', 'completed', 'expired'],
      default: 'assigned'
    },
    completedAt: {
      type: Date,
      default: null
    },
    score: {
      type: Number,
      default: null
    }
  }]
}, {
  timestamps: true
})

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Update progress method
userSchema.methods.updateProgress = function(subjectId, chapterId, completed) {
  console.log('Updating progress:', { subjectId, chapterId, completed })
  
  if (!this.progress.has(subjectId.toString())) {
    this.progress.set(subjectId.toString(), {
      completedChapters: [],
      progressPercentage: 0,
      lastUpdated: new Date()
    })
  }
  
  const subjectProgress = this.progress.get(subjectId.toString())
  console.log('Current completed chapters:', subjectProgress.completedChapters.map(id => id.toString()))
  
  if (completed) {
    // Check if chapter is not already completed
    const isAlreadyCompleted = subjectProgress.completedChapters.some(
      id => id.toString() === chapterId.toString()
    )
    console.log('Adding chapter, already completed:', isAlreadyCompleted)
    if (!isAlreadyCompleted) {
      subjectProgress.completedChapters.push(chapterId)
      console.log('Chapter added to completed list')
    }
  } else {
    // Remove chapter from completed list
    const beforeCount = subjectProgress.completedChapters.length
    subjectProgress.completedChapters = subjectProgress.completedChapters.filter(
      id => id.toString() !== chapterId.toString()
    )
    const afterCount = subjectProgress.completedChapters.length
    console.log('Removing chapter, before:', beforeCount, 'after:', afterCount)
  }
  
  // Calculate progress percentage (this will be updated when we have total chapters)
  subjectProgress.lastUpdated = new Date()
  this.progress.set(subjectId.toString(), subjectProgress)
  console.log('Final completed chapters:', subjectProgress.completedChapters.map(id => id.toString()))
}

// Add notification method
userSchema.methods.addNotification = function(type, title, message) {
  this.notifications.unshift({
    type,
    title,
    message,
    read: false,
    createdAt: new Date()
  })
  
  // Keep only last 50 notifications
  if (this.notifications.length > 50) {
    this.notifications = this.notifications.slice(0, 50)
  }
}

// Mark notification as read
userSchema.methods.markNotificationAsRead = function(notificationId) {
  const notification = this.notifications.id(notificationId)
  if (notification) {
    notification.read = true
  }
}

// Ensure all assigned tests have testDate before saving
userSchema.pre('save', function(next) {
  if (this.assignedTests && this.assignedTests.length > 0) {
    this.assignedTests.forEach(assignment => {
      if (!assignment.testDate) {
        assignment.testDate = assignment.assignedAt || new Date()
      }
    })
  }
  next()
})

// Get unread notifications count
userSchema.methods.getUnreadNotificationsCount = function() {
  return this.notifications.filter(notification => !notification.read).length
}

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name
})

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password
    return ret
  }
})

const User = mongoose.model('User', userSchema)

export default User 