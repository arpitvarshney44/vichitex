import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Batch from './models/Batch.js'

// Load environment variables
dotenv.config()

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

const seedBatches = async () => {
  try {
    console.log('🌱 Starting batch seeding...')
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vichitex'
    await mongoose.connect(mongoURI)
    console.log('✅ Connected to MongoDB')

    // Clear existing batches
    await Batch.deleteMany({})
    console.log('🗑️  Cleared existing batches')

    // Insert new batch data
    const result = await Batch.insertMany(batchData)
    console.log(`✅ Successfully seeded ${result.length} batches:`)

    // Log the created batches
    result.forEach(batch => {
      console.log(`   - ${batch.name}: ₹${batch.price}`)
    })

    console.log('🎉 Batch seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding batches:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

// Run the seed function
seedBatches() 