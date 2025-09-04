import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Email configuration class
class EmailService {
  constructor() {
    this.transporter = null
    this.isConfigured = false
    this.retryAttempts = 3
    this.retryDelay = 2000 // 2 seconds
  }

  // Initialize email transporter
  async initialize() {
    try {
      // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.')
  }

      // Create transporter configuration
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 15000,   // 15 seconds
        socketTimeout: 30000,     // 30 seconds
        secure: true,
        tls: {
          rejectUnauthorized: false
        }
      }

      this.transporter = nodemailer.createTransport(config)
      
      // Verify connection
      await this.transporter.verify()
      this.isConfigured = true
      
      console.log('✅ Email service initialized successfully')
      return true
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message)
      this.isConfigured = false
      return false
    }
  }

  // Send email with retry logic
  async sendEmail(mailOptions, emailType = 'unknown') {
    if (!this.isConfigured) {
      console.error(`❌ Email service not configured. Cannot send ${emailType} email.`)
      throw new Error('Email service not configured')
    }

    let lastError = null
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`📧 Sending ${emailType} email (attempt ${attempt}/${this.retryAttempts})`)
        
        const result = await this.transporter.sendMail(mailOptions)
        
        console.log(`✅ ${emailType} email sent successfully on attempt ${attempt}`)
        return result
        
      } catch (error) {
        lastError = error
        console.error(`❌ ${emailType} email attempt ${attempt} failed:`, error.message)
        
        if (attempt < this.retryAttempts) {
          console.log(`⏳ Retrying ${emailType} email in ${this.retryDelay}ms...`)
          await this.sleep(this.retryDelay)
        }
      }
    }
    
    console.error(`❌ All ${this.retryAttempts} attempts to send ${emailType} email failed`)
    throw lastError
  }

  // Utility function for delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Generate reset token
  generateResetToken() {
  return crypto.randomBytes(32).toString('hex')
}

// Send welcome email
  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: `"Vichitex" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Vichitex - Your Educational Journey Begins!',
      html: this.getWelcomeEmailTemplate(user.name)
    }

    return await this.sendEmail(mailOptions, 'welcome')
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: `"Vichitex" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - Vichitex',
      html: this.getPasswordResetEmailTemplate(user.name, resetUrl)
    }

    return await this.sendEmail(mailOptions, 'password-reset')
  }

  // Send test assignment email
  async sendTestAssignmentEmail(userEmail, userName, testTitle, subjectName, chapterName, testDate = null) {
    // Validate inputs
    if (!userEmail || !userName || !testTitle) {
      throw new Error('Missing required parameters: userEmail, userName, or testTitle')
    }

    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
    
    const mailOptions = {
      from: `"Vichitex" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `New Test Assigned - ${testTitle}`,
      html: this.getTestAssignmentEmailTemplate(userName, testTitle, subjectName, chapterName, dashboardUrl, testDate)
    }

    return await this.sendEmail(mailOptions, 'test-assignment')
  }

  // Email templates
  getWelcomeEmailTemplate(userName) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Welcome to Vichitex!</h1>
            <p style="color: #666; margin: 10px 0;">Your educational platform for success</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin-top: 0;">Hello ${userName}!</h2>
            <p style="color: #333; line-height: 1.6;">
              Welcome to Vichitex! We're excited to have you join our educational community. 
              You now have access to a comprehensive learning platform designed to help you excel in your studies.
            </p>
          </div>
          
          <div style="background-color: #2563eb; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0;">What you can do:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Access comprehensive study materials</li>
              <li>Take practice tests and assessments</li>
              <li>Track your learning progress</li>
              <li>Get personalized feedback</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin-bottom: 20px;">
              If you have any questions, feel free to contact our support team.
            </p>
            <p style="color: #999; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    }
    
  getPasswordResetEmailTemplate(userName, resetUrl) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Password Reset</h1>
            <p style="color: #666; margin: 10px 0;">Reset your Vichitex account password</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin-top: 0;">Hello ${userName}!</h2>
            <p style="color: #333; line-height: 1.6;">
              We received a request to reset your password for your Vichitex account. 
              Click the button below to create a new password.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> This password reset link will expire in 1 hour. 
              If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #2563eb; font-size: 12px; word-break: break-all;">
              ${resetUrl}
            </p>
          </div>
        </div>
      `
    }
    
  getTestAssignmentEmailTemplate(userName, testTitle, subjectName, chapterName, dashboardUrl, testDate = null) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">New Test Assigned!</h1>
            <p style="color: #666; margin: 10px 0;">You have a new test to complete</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">Hello ${userName}!</h2>
            <p style="color: #333; line-height: 1.6;">
              Your instructor has assigned you a new test: <strong>${testTitle}</strong>. 
              Please log in to your dashboard to take the test.
            </p>
          </div>
          
          <div style="background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h3 style="margin: 0 0 15px 0;">Test Details</h3>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
              ${testTitle}
            </div>
            ${subjectName ? `<div style="font-size: 16px; margin-bottom: 8px;">
              <strong>Subject:</strong> ${subjectName}
            </div>` : ''}
            ${chapterName ? `<div style="font-size: 16px; margin-bottom: 8px;">
              <strong>Chapter:</strong> ${chapterName}
            </div>` : ''}
            ${testDate ? `<div style="font-size: 16px; margin-bottom: 8px;">
              <strong>Test Date:</strong> ${new Date(testDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>` : ''}
            <p style="margin: 10px 0 0 0;">Ready to take the test</p>
          </div>
          
          <div style="background-color: #f0f8ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #2563eb; margin: 0 0 10px 0;">What to expect:</h4>
            <ul style="color: #333; margin: 0; padding-left: 20px;">
              <li>Multiple choice questions based on the chapter content</li>
              <li>Timed assessment to test your understanding</li>
              <li>Immediate feedback on your performance</li>
              <li>Detailed analysis of your strengths and areas for improvement</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
          <a href="${dashboardUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Go to Dashboard
            </a>
            <p style="color: #666; margin-top: 20px;">
              Log in to your dashboard to access and complete the test.
            </p>
            <p style="color: #999; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    }
}

// Create singleton instance
const emailService = new EmailService()

// Initialize email service on module load
emailService.initialize().catch(error => {
  console.error('Failed to initialize email service:', error.message)
})

// Export functions for backward compatibility
export const generateResetToken = () => emailService.generateResetToken()

export const sendWelcomeEmail = async (user) => {
  return await emailService.sendWelcomeEmail(user)
}

export const sendPasswordResetEmail = async (user, resetToken) => {
  return await emailService.sendPasswordResetEmail(user, resetToken)
}

export const sendTestAssignmentEmail = async (userEmail, userName, testTitle, subjectName, chapterName, testDate = null) => {
  return await emailService.sendTestAssignmentEmail(userEmail, userName, testTitle, subjectName, chapterName, testDate)
}

export const testEmailConfiguration = async () => {
  return await emailService.initialize()
}

// Export the service instance for advanced usage
export default emailService 