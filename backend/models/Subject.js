import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    maxlength: [50, 'Subject name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  code: {
    type: String,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Subject code cannot be more than 10 characters']
  },
  category: {
    type: String,
    enum: ['NEET', 'JEE', 'Science', 'Mathematics', 'Languages', 'Social Studies', 'Other'],
    default: 'Other'
  },
  examType: {
    type: String,
    enum: ['neet', 'jee', 'other'],
    default: 'other'
  },
  level: {
    type: String,
    enum: ['Primary', 'Secondary', 'Higher Secondary', 'University'],
    default: 'Higher Secondary'
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: 'FaBook'
  },
  color: {
    type: String,
    default: 'from-blue-500 to-blue-600'
  }
}, {
  timestamps: true
})

// Index for better query performance
subjectSchema.index({ name: 1 })
subjectSchema.index({ code: 1 })
subjectSchema.index({ isActive: 1 })
subjectSchema.index({ category: 1 })
subjectSchema.index({ examType: 1 })

// Virtual for chapter count
subjectSchema.virtual('chapterCount').get(function() {
  return Array.isArray(this.chapters) ? this.chapters.length : 0
})

// Ensure virtual fields are serialized
subjectSchema.set('toJSON', {
  virtuals: true
})

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject 