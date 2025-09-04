import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0,
    default: null // Maximum discount amount for percentage coupons
  },
  minimumAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  usageLimit: {
    type: Number,
    min: 1,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableBatches: [{
    type: String, // Array of batch types like 'NEET', 'JEE'
    enum: ['NEET', 'JEE']
  }],
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: String,
    discountApplied: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
couponSchema.index({ code: 1 })
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 })
couponSchema.index({ 'usedBy.userId': 1 })

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date()
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    this.usedCount < this.usageLimit
  )
}

// Method to check if user has already used this coupon
couponSchema.methods.hasUserUsed = function(userId) {
  return this.usedBy.some(usage => usage.userId.toString() === userId.toString())
}

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(originalAmount) {
  if (originalAmount < this.minimumAmount) {
    return 0
  }

  let discount = 0
  if (this.discountType === 'percentage') {
    discount = (originalAmount * this.discountValue) / 100
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount
    }
  } else {
    discount = this.discountValue
  }

  return Math.min(discount, originalAmount) // Don't discount more than the original amount
}

// Method to apply coupon and record usage
couponSchema.methods.applyCoupon = function(userId, orderId, originalAmount) {
  if (!this.isValid()) {
    throw new Error('Coupon is not valid')
  }

  if (this.hasUserUsed(userId)) {
    throw new Error('User has already used this coupon')
  }

  const discountAmount = this.calculateDiscount(originalAmount)
  
  // Record usage
  this.usedBy.push({
    userId,
    usedAt: new Date(),
    orderId,
    discountApplied: discountAmount
  })
  
  this.usedCount += 1
  
  return discountAmount
}

const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon 