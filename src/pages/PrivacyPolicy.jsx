import { Link } from 'react-router-dom'
import { FaArrowLeft, FaShieldAlt, FaEye, FaLock, FaUserCheck } from 'react-icons/fa'
import ScrollToTop from '../components/ScrollToTop'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaEye className="mr-3 text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Vichitex, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              educational platform and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using Vichitex, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaUserCheck className="mr-3 text-blue-600" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Name and email address</li>
                  <li>Phone number (optional)</li>
                  <li>Educational institution and grade level</li>
                  <li>Profile information and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Test results and performance data</li>
                  <li>Study patterns and learning progress</li>
                  <li>Platform usage statistics</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Service Delivery</h3>
                <p className="text-blue-800 text-sm">Provide personalized learning experiences and track your academic progress</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Communication</h3>
                <p className="text-green-800 text-sm">Send important updates, notifications, and educational content</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Improvement</h3>
                <p className="text-purple-800 text-sm">Analyze usage patterns to enhance our platform and services</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Support</h3>
                <p className="text-orange-800 text-sm">Provide customer support and respond to your inquiries</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist in operating our platform</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaLock className="mr-3 text-blue-600" />
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Secure data storage practices</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-gray-800 mb-2">Access</h3>
                <p className="text-gray-700 text-sm">Request access to your personal information</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-800 mb-2">Correction</h3>
                <p className="text-gray-700 text-sm">Request correction of inaccurate information</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-800 mb-2">Deletion</h3>
                <p className="text-gray-700 text-sm">Request deletion of your personal information</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-medium text-gray-800 mb-2">Portability</h3>
                <p className="text-gray-700 text-sm">Request a copy of your data in a portable format</p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              These technologies help us:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and recommendations</li>
              <li>Ensure platform security and functionality</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is designed for students, and we take special care to protect the privacy of users under 18. 
              We collect only the minimum information necessary and obtain parental consent when required by law.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700"><strong>Email:</strong> vichitex.in@gmail.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 9798480148</p>
              <p className="text-gray-700"><strong>Address:</strong> India</p>
            </div>
          </section>

          {/* Updates */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this policy 
              periodically for any changes.
            </p>
          </section>
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}

export default PrivacyPolicy 