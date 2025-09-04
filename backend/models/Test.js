import mongoose from 'mongoose'

// Simplified question schema that matches frontend data structure
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  image: {
    filename: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true
    },
    mimetype: {
      type: String,
      trim: true
    },
    size: {
      type: Number
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      filename: {
        type: String,
        trim: true
      },
      originalName: {
        type: String,
        trim: true
      },
      mimetype: {
        type: String,
        trim: true
      },
      size: {
        type: Number
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  }],
  correctAnswer: {
    type: Number,  // Index of correct answer (0-3)
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be 0 or greater'],
    max: [3, 'Correct answer index must be 3 or less']
  },
  explanation: {
    type: String,
    trim: true,
    default: ''
  },
  explanationImage: {
    filename: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true
    },
    mimetype: {
      type: String,
      trim: true
    },
    size: {
      type: Number
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  marks: {
    type: Number,
    default: 1
  }
})

// Simplified test schema that matches frontend data structure
const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [200, 'Test title cannot be more than 200 characters']
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topicTag: {
    type: String,
    trim: true,
    default: ''
  },
  timeLimit: {
    type: Number,
    default: 60,
    min: [1, 'Time limit must be at least 1 minute'],
    max: [300, 'Time limit cannot be more than 300 minutes']
  },
  examType: {
    type: String,
    enum: ['neet', 'jee'],
    default: 'neet',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for better query performance
testSchema.index({ subjectId: 1, status: 1 })
testSchema.index({ createdBy: 1 })
testSchema.index({ chapterId: 1 })
testSchema.index({ isActive: 1 })
testSchema.index({ subjectId: 1, chapterId: 1 })
testSchema.index({ examType: 1 })
testSchema.index({ examType: 1, isActive: 1 })

// Virtual for total questions count
testSchema.virtual('totalQuestions').get(function() {
  return this.questions ? this.questions.length : 0
})

// Ensure virtual fields are serialized
testSchema.set('toJSON', {
  virtuals: true
})

const Test = mongoose.model('Test', testSchema)

export default Test 