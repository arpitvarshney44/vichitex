import mongoose from 'mongoose'

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['NEET', 'JEE'],
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  subjects: [{
    type: String,
    trim: true
  }],
  mcqCount: {
    type: Number,
    default: 45
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for efficient queries
batchSchema.index({ type: 1, year: 1, isActive: 1 })
batchSchema.index({ sortOrder: 1 })

const Batch = mongoose.model('Batch', batchSchema)

export default Batch 