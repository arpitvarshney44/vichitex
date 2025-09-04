import { Link } from 'react-router-dom'
import { FaArrowLeft, FaFileContract, FaGavel, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import ScrollToTop from '../components/ScrollToTop'

const TermsAndConditions = () => {
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
            <FaFileContract className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
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
              <FaGavel className="mr-3 text-blue-600" />
              Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms and Conditions ("Terms") govern your use of the Vichitex educational platform and services. 
              By accessing or using our platform, you agree to be bound by these Terms and all applicable laws and regulations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Definitions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">"Platform"</h3>
                <p className="text-gray-700">Refers to the Vichitex website, mobile applications, and all related services.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">"User"</h3>
                <p className="text-gray-700">Refers to any individual who accesses or uses the platform, including students, parents, and educators.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">"Content"</h3>
                <p className="text-gray-700">Refers to all information, data, text, software, music, sound, photographs, graphics, video, messages, and other materials.</p>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Account Creation</h3>
                <p className="text-blue-800 text-sm">You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Account Security</h3>
                <p className="text-green-800 text-sm">You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Age Requirements</h3>
                <p className="text-orange-800 text-sm">Users under 13 must have parental consent. Users under 18 must have parental supervision when using the platform.</p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use the platform only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-medium text-gray-800 mb-2">Prohibited Activities</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Infringe on intellectual property rights</li>
                  <li>• Harass, abuse, or harm other users</li>
                  <li>• Attempt to gain unauthorized access</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-800 mb-2">Permitted Activities</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Access educational content and tests</li>
                  <li>• Track learning progress</li>
                  <li>• Participate in discussions</li>
                  <li>• Use platform features as intended</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Platform Content</h3>
                <p className="text-gray-700 mb-3">
                  The platform and its original content, features, and functionality are owned by Vichitex and are protected by 
                  international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">User Content</h3>
                <p className="text-gray-700 mb-3">
                  You retain ownership of content you submit to the platform. By submitting content, you grant us a 
                  non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Restrictions</h3>
                <p className="text-gray-700">
                  You may not copy, modify, distribute, sell, or lease any part of our platform without our prior written consent.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
              which is incorporated into these Terms by reference.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Data Usage</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• We collect data to provide and improve our services</li>
                <li>• Your data is protected using industry-standard security measures</li>
                <li>• We do not sell your personal information to third parties</li>
                <li>• You have rights regarding your personal data</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Subscription Services</h3>
                <p className="text-gray-700 mb-3">
                  Some features of the platform may require a paid subscription. All fees are non-refundable unless otherwise stated.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Processing</h3>
                <p className="text-gray-700 mb-3">
                  Payments are processed through secure third-party payment processors. You agree to provide accurate payment information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Billing</h3>
                <p className="text-gray-700">
                  Subscriptions automatically renew unless cancelled. You may cancel your subscription at any time through your account settings.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaExclamationTriangle className="mr-3 text-orange-600" />
              Disclaimers
            </h2>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Service Availability</h3>
                <p className="text-orange-800 text-sm">We strive to maintain platform availability but do not guarantee uninterrupted access. We may suspend or discontinue services at any time.</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Educational Content</h3>
                <p className="text-yellow-800 text-sm">While we provide educational content, we do not guarantee specific academic outcomes. Results may vary based on individual effort and circumstances.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Third-Party Content</h3>
                <p className="text-red-800 text-sm">We may link to third-party websites or content. We are not responsible for the accuracy or reliability of such content.</p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Vichitex shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including but not limited to loss of profits, data, or use.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">
                Our total liability to you for any claims arising from the use of our platform shall not exceed the amount 
                you paid us in the twelve months preceding the claim.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">User Termination</h3>
                <p className="text-gray-700 mb-3">
                  You may terminate your account at any time by contacting us or using the account deletion feature.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Platform Termination</h3>
                <p className="text-gray-700 mb-3">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe 
                  violates these Terms or is harmful to other users or the platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Effect of Termination</h3>
                <p className="text-gray-700">
                  Upon termination, your right to use the platform ceases immediately. We may delete your account and data 
                  in accordance with our data retention policies.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
              from these Terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting 
              the new Terms on the platform and updating the "Last updated" date.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                Your continued use of the platform after changes become effective constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaCheckCircle className="mr-3 text-green-600" />
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700"><strong>Email:</strong> vichitex.in@gmail.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 9798480148</p>
              <p className="text-gray-700"><strong>Address:</strong> India</p>
            </div>
          </section>
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}

export default TermsAndConditions 