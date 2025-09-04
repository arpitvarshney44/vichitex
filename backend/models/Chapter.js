import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Chapter name is required'],
    trim: true,
    maxlength: [100, 'Chapter name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  subjectId: {
    type: String, // For compatibility with frontend (neet-physics, jee-maths, etc.)
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  estimatedHours: {
    type: Number,
    min: [1, 'Estimated hours must be at least 1'],
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Index for better query performance
chapterSchema.index({ subject: 1, order: 1 })
chapterSchema.index({ subjectId: 1 })
chapterSchema.index({ name: 1 })
chapterSchema.index({ isActive: 1 })

// Virtual for topic count
chapterSchema.virtual('topicCount').get(function() {
  return Array.isArray(this.topics) ? this.topics.length : 0
})

// Virtual for test count
chapterSchema.virtual('testCount').get(function() {
  return Array.isArray(this.tests) ? this.tests.length : 0
})

// Ensure virtual fields are serialized
chapterSchema.set('toJSON', {
  virtuals: true
})

const Chapter = mongoose.model('Chapter', chapterSchema)

export default Chapter 