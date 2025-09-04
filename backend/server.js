import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Subject from './models/Subject.js'
import Chapter from './models/Chapter.js'
import TestSyllabus from './models/TestSyllabus.js'
import Batch from './models/Batch.js'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import testRoutes from './routes/tests.js'
import subjectRoutes from './routes/subjects.js'
import adminRoutes from './routes/admin.js'
import subscriptionRoutes from './routes/subscription.js'
import paymentRoutes from './routes/payment.js'
import testSyllabusRoutes from './routes/testSyllabus.js'
import batchRoutes from './routes/batches.js'
import couponRoutes from './routes/coupons.js'
import bannerRoutes from './routes/banners.js'
import feedbackRoutes from './routes/feedback.js'
import questionImageRoutes from './routes/questionImages.js'
import emailService from './services/emailService.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Trust proxy - needed when behind a reverse proxy/load balancer
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())

// CORS configuration - must come before rate limiting
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Handle preflight requests
app.options('*', cors())

// Rate limiting - much more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 5000 : 3000 // increased production limit to 3000
})

// Apply rate limiting to all routes except health check, auth, admin, and test-syllabus
app.use('/api/', (req, res, next) => {
  if (req.path === '/health' || req.path.startsWith('/auth/') || req.path.startsWith('/admin/') || req.path.startsWith('/test-syllabus/')) {
    return next() // Skip rate limiting for health check, auth, admin, and test-syllabus routes
  }
  return limiter(req, res, next)
})

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Static files with CORS headers
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for all uploads requests
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Set Cross-Origin Resource Policy to allow cross-origin access
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  
  // Additional headers for image serving
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none')
  res.header('Cross-Origin-Opener-Policy', 'unsafe-none')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  next()
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tests', testRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/test-syllabus', testSyllabusRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/question-images', questionImageRoutes)
app.use('/api', bannerRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  res.json({ 
    status: 'OK', 
    message: 'Vichitex API is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    rateLimit: 'configured',
    jwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
  })
})

// Test auth endpoint (no authentication required)
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoint is working',
    timestamp: new Date().toISOString(),
    jwtSecret: !!process.env.JWT_SECRET
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database initialization functions
const initializeAdminUser = async () => {
  try {
    console.log('🔍 Checking for admin user...')
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      return existingAdmin
    }

    // Create default admin user
    const adminData = {
      name: 'Vivek Kumar',
      email: 'vichitex.in@gmail.com',
      phone: '9798480148',
      password: 'vichitex@2025',
      role: 'admin',
      emailVerified: true,
      isActive: true,
      batchEnrollment: {
        isEnrolled: true,
        batchName: 'Admin Batch',
        batchType: 'other',
        enrolledAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        isActive: true,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }

    const adminUser = new User(adminData)
    await adminUser.save()
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminData.email)
    console.log('🔑 Password:', adminData.password)
    
    // Create a sample student user for testing
    await createSampleStudent()
    
    return adminUser
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }
}

const createSampleStudent = async () => {
  try {
    // Check if sample student already exists
    const existingStudent = await User.findOne({ email: 'student@vichitex.com' })
    if (existingStudent) {
      console.log('✅ Sample student already exists:', existingStudent.email)
      return existingStudent
    }

    const studentData = {
      name: 'Sample Student',
      email: 'student@vichitex.com',
      phone: '9876543210',
      password: 'student123',
      role: 'student',
      emailVerified: true,
      isActive: true,
      batchEnrollment: {
        isEnrolled: true,
        batchName: 'NEET TRP BATCH 2026',
        batchType: 'NEET',
        enrolledAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        isActive: true,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }

    const studentUser = new User(studentData)
    await studentUser.save()
    
    console.log('✅ Sample student created successfully!')
    console.log('📧 Email:', studentData.email)
    console.log('🔑 Password:', studentData.password)
    console.log('📚 Batch:', studentData.batchEnrollment.batchName)
    
    return studentUser
  } catch (error) {
    console.error('❌ Error creating sample student:', error)
  }
}

const initializeTestSyllabusCollection = async () => {
  try {
    console.log('📋 Initializing TestSyllabus collection...')
    
    // Check if the collection exists by trying to count documents
    const count = await TestSyllabus.countDocuments()
    console.log(`✅ TestSyllabus collection initialized with ${count} existing documents`)
  } catch (error) {
    console.log('✅ TestSyllabus collection will be created automatically on first use')
  }
}

const initializeSubjects = async (adminUser) => {
  try {
    console.log('📚 Initializing NEET and JEE subjects...')

    // NEET Subjects (without chapters)
    const neetSubjects = [
      {
        name: 'Physics',
        description: 'NEET Physics covers mechanics, thermodynamics, optics, and modern physics',
        examType: 'neet',
        category: 'NEET',
        icon: 'FaAtom',
        color: 'from-blue-500 to-blue-600',
        order: 1
      },
      {
        name: 'Chemistry',
        description: 'NEET Chemistry includes physical, organic, and inorganic chemistry',
        examType: 'neet',
        category: 'NEET',
        icon: 'FaFlask',
        color: 'from-green-500 to-green-600',
        order: 2
      },
      {
        name: 'Botany',
        description: 'NEET Botany covers plant biology, taxonomy, and physiology',
        examType: 'neet',
        category: 'NEET',
        icon: 'FaLeaf',
        color: 'from-emerald-500 to-emerald-600',
        order: 3
      },
      {
        name: 'Zoology',
        description: 'NEET Zoology includes animal biology, physiology, and evolution',
        examType: 'neet',
        category: 'NEET',
        icon: 'FaPaw',
        color: 'from-orange-500 to-orange-600',
        order: 4
      }
    ]

    // JEE Subjects (without chapters)
    const jeeSubjects = [
      {
        name: 'Physics',
        description: 'JEE Physics covers advanced mechanics, electromagnetism, and modern physics',
        examType: 'jee',
        category: 'JEE',
        icon: 'FaAtom',
        color: 'from-blue-500 to-blue-600',
        order: 1
      },
      {
        name: 'Chemistry',
        description: 'JEE Chemistry includes physical, organic, and inorganic chemistry',
        examType: 'jee',
        category: 'JEE',
        icon: 'FaFlask',
        color: 'from-green-500 to-green-600',
        order: 2
      },
      {
        name: 'Mathematics',
        description: 'JEE Mathematics covers algebra, calculus, geometry, and trigonometry',
        examType: 'jee',
        category: 'JEE',
        icon: 'FaCalculator',
        color: 'from-purple-500 to-purple-600',
        order: 3
      }
    ]

    // Check if subjects already exist
    const existingSubjects = await Subject.find({ examType: { $in: ['neet', 'jee'] } })
    if (existingSubjects.length > 0) {
      console.log('✅ Subjects already exist, skipping initialization')
      return
    }

    // Create subjects only (no chapters)
    for (const subjectData of neetSubjects) {
      const subject = new Subject({
        ...subjectData,
        createdBy: adminUser._id
      })
      await subject.save()
      console.log(`✅ Created NEET subject: ${subject.name}`)
    }

    for (const subjectData of jeeSubjects) {
      const subject = new Subject({
        ...subjectData,
        createdBy: adminUser._id
      })
      await subject.save()
      console.log(`✅ Created JEE subject: ${subject.name}`)
    }

    console.log('🎉 Subjects initialization completed!')
    console.log(`📊 Created ${neetSubjects.length} NEET subjects and ${jeeSubjects.length} JEE subjects`)
    console.log('📝 Chapters can now be added manually through the admin panel')

  } catch (error) {
    console.error('❌ Error initializing subjects:', error)
  }
}

// Initialize batch data
const initializeBatches = async () => {
  try {
    console.log('🌱 Initializing batch data...')
    
    const batchData = [
      {
        name: 'NEET TRP BATCH 2026',
        type: 'NEET',
        year: 2026,
        price: 2399,
        originalPrice: 2999,
        duration: '12 months',
        description: 'Complete NEET preparation for 2026',
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete NEET preparation',
          'Annual access',
          'Progress tracking',
          'Performance analytics',
          'Chapter-wise tests'
        ],
        subjects: ['Physics', 'Chemistry', 'Biology'],
        mcqCount: 45,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'NEET TRP BATCH 2027',
        type: 'NEET',
        year: 2027,
        price: 2399,
        originalPrice: 2999,
        duration: '12 months',
        description: 'Complete NEET preparation for 2027',
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete NEET preparation',
          'Annual access',
          'Progress tracking',
          'Performance analytics',
          'Chapter-wise tests'
        ],
        subjects: ['Physics', 'Chemistry', 'Biology'],
        mcqCount: 45,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'JEE TRP BATCH 2026',
        type: 'JEE',
        year: 2026,
        price: 2399,
        originalPrice: 2999,
        duration: '12 months',
        description: 'Complete JEE preparation for 2026',
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete JEE preparation',
          'Annual access',
          'Progress tracking',
          'Performance analytics',
          'Chapter-wise tests'
        ],
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        mcqCount: 45,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'JEE TRP BATCH 2027',
        type: 'JEE',
        year: 2027,
        price: 2399,
        originalPrice: 2999,
        duration: '12 months',
        description: 'Complete JEE preparation for 2027',
        features: [
          '45 MCQs per test',
          'Personalized tests',
          'Email notifications',
          'Complete JEE preparation',
          'Annual access',
          'Progress tracking',
          'Performance analytics',
          'Chapter-wise tests'
        ],
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        mcqCount: 45,
        isActive: true,
        sortOrder: 4
      }
    ]

    // Check if batches already exist
    const existingBatches = await Batch.find({})
    if (existingBatches.length > 0) {
      console.log('✅ Batches already exist, skipping initialization')
      return
    }

    // Create batches
    const result = await Batch.insertMany(batchData)
    console.log(`✅ Created ${result.length} batches:`)
    result.forEach(batch => {
      console.log(`   - ${batch.name}: ₹${batch.price}`)
    })
    console.log('🎉 Batch initialization completed!')

  } catch (error) {
    console.error('❌ Error initializing batches:', error)
  }
}

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vichitex', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}



// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    
    // Initialize database (admin user, subjects, and batches)
    console.log('\n🚀 Initializing database...')
    const adminUser = await initializeAdminUser()
    await initializeSubjects(adminUser)
    await initializeTestSyllabusCollection()
    await initializeBatches()
    console.log('✅ Database initialization completed!\n')
    
    // Test email configuration on startup
    console.log('📧 Testing email configuration...')
    const emailConfigured = await emailService.initialize()
    if (emailConfigured) {
      console.log('✅ Email configuration is valid')
    } else {
      console.log('⚠️ Email configuration has issues - emails may not work properly')
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📧 Admin login: admin@vichitex.com`)
      console.log(`🔑 Admin password: admin123`)
      console.log(`⚠️  Remember to change the admin password!`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app 