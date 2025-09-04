import mongoose from 'mongoose'

const testSyllabusSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Syllabus title is required'],
    trim: true,
    maxlength: [200, 'Syllabus title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  topics: [{
    topic: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    weightage: {
      type: Number,
      min: [0, 'Weightage must be 0 or greater'],
      max: [100, 'Weightage cannot be more than 100'],
      default: 0
    }
  }],
  importantPoints: [{
    type: String,
    trim: true
  }],
  studyMaterials: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    link: {
      type: String,
      trim: true,
      default: ''
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for better query performance
testSyllabusSchema.index({ testId: 1 })
testSyllabusSchema.index({ createdBy: 1 })
testSyllabusSchema.index({ isActive: 1 })

// Virtual for total topics count
testSyllabusSchema.virtual('totalTopics').get(function() {
  return this.topics.length
})

// Ensure virtual fields are serialized
testSyllabusSchema.set('toJSON', {
  virtuals: true
})

const TestSyllabus = mongoose.model('TestSyllabus', testSyllabusSchema)

export default TestSyllabus 