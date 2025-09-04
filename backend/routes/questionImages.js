import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for question image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/question-images')
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `question-img-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type - only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// POST /api/question-images/upload - Upload question image
router.post('/upload', protect, admin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        })
      }
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message
      })
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }
    next()
  })
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    // Create image object
    const imageData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: imageData
    })
  } catch (error) {
    console.error('Error uploading question image:', error)
    
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error('Error deleting file after upload error:', unlinkError)
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    })
  }
})

// DELETE /api/question-images/:filename - Delete question image
router.delete('/:filename', protect, admin, async (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(__dirname, '../uploads/question-images', filename)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      res.json({
        success: true,
        message: 'Image deleted successfully'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      })
    }
  } catch (error) {
    console.error('Error deleting question image:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    })
  }
})

export default router