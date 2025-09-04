import mongoose from 'mongoose'

const testAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: -100, // Allow negative scores for NEET/JEE marking system
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  wrongAnswers: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 0
  },
  maxPossibleMarks: {
    type: Number,
    required: true,
    default: 0
  },
  questionsAttempted: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  questionsUnattempted: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    required: true,
    min: 0
  },

  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: Number,
      required: true,
      min: 0
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['completed'],
    default: 'completed'
  }
}, {
  timestamps: true
})

// Index for better query performance
testAttemptSchema.index({ userId: 1, testId: 1 })
testAttemptSchema.index({ userId: 1, createdAt: -1 })
testAttemptSchema.index({ testId: 1, createdAt: -1 })

// Virtual for accuracy percentage
testAttemptSchema.virtual('accuracy').get(function() {
  return this.totalQuestions > 0 ? Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0
})

// Ensure virtual fields are serialized
testAttemptSchema.set('toJSON', {
  virtuals: true
})

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema)

export default TestAttempt 