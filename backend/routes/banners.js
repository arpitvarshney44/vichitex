import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads')
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
    // Use a temporary name first, we'll rename it later
    cb(null, `banner-temp-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Banner data storage (in production, this should be in a database)
let banners = {
  desktop: null,
  mobile: null
}

// Load banners from file if exists
const bannersFilePath = path.join(__dirname, '../uploads/banners.json')
try {
  if (fs.existsSync(bannersFilePath)) {
    const bannersData = fs.readFileSync(bannersFilePath, 'utf8')
    banners = JSON.parse(bannersData)
  }
} catch (error) {
  console.error('Error loading banners:', error)
}

// Save banners to file
const saveBanners = () => {
  try {
    fs.writeFileSync(bannersFilePath, JSON.stringify(banners, null, 2))
  } catch (error) {
    console.error('Error saving banners:', error)
  }
}

// GET /api/banners/active - Public endpoint to get active banners
router.get('/active', async (req, res) => {
  try {
    // Return banners if any exist
    if (banners.desktop || banners.mobile) {
      res.json({
        success: true,
        banner: banners
      })
    } else {
      res.json({
        success: true,
        banner: null
      })
    }
  } catch (error) {
    console.error('Error getting active banners:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get banners'
    })
  }
})

// GET /api/admin/banners - Admin endpoint to get all banners
router.get('/admin/banners', adminAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      banners: banners
    })
  } catch (error) {
    console.error('Error getting banners:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get banners'
    })
  }
})

// POST /api/admin/banners/upload - Admin endpoint to upload banner
router.post('/admin/banners/upload', adminAuth, (req, res, next) => {
  upload.single('banner')(req, res, (err) => {
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

    const { type } = req.body
    if (!type || !['desktop', 'mobile'].includes(type)) {
      // Delete uploaded file if type is invalid
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid banner type. Must be "desktop" or "mobile"'
      })
    }

    // Delete old banner file if exists
    if (banners[type] && banners[type].filename) {
      const oldFilePath = path.join(__dirname, '../uploads', banners[type].filename)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
    }

    // Rename the uploaded file with the correct type
    const ext = path.extname(req.file.filename)
    const newFilename = `banner-${type}-${Date.now()}${ext}`
    const oldFilePath = req.file.path
    const newFilePath = path.join(__dirname, '../uploads', newFilename)
    
    fs.renameSync(oldFilePath, newFilePath)

    // Create new banner object
    const newBanner = {
      filename: newFilename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    }

    // Update banners object
    banners[type] = newBanner
    saveBanners()

    res.json({
      success: true,
      message: `${type} banner uploaded successfully`,
      banner: newBanner
    })
  } catch (error) {
    console.error('Error uploading banner:', error)
    
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
      message: 'Failed to upload banner'
    })
  }
})

// DELETE /api/admin/banners/:type - Admin endpoint to delete banner
router.delete('/admin/banners/:type', adminAuth, async (req, res) => {
  try {
    const { type } = req.params
    
    if (!['desktop', 'mobile'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner type. Must be "desktop" or "mobile"'
      })
    }

    if (!banners[type]) {
      return res.status(404).json({
        success: false,
        message: `${type} banner not found`
      })
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../uploads', banners[type].filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Remove from banners object
    banners[type] = null
    saveBanners()

    res.json({
      success: true,
      message: `${type} banner deleted successfully`
    })
  } catch (error) {
    console.error('Error deleting banner:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner'
    })
  }
})

export default router 