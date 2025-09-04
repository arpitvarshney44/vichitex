import { Link } from 'react-router-dom'
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaWhatsapp, 
  FaTelegram,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaComments,
  FaHeadset,
  FaInfoCircle
} from 'react-icons/fa'
import ScrollToTop from '../components/ScrollToTop'

const ContactUs = () => {

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
            <FaEnvelope className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          </div>
          <p className="text-gray-600 mt-2">Get in touch with our team for support, inquiries, or feedback</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaInfoCircle className="mr-3 text-blue-600" />
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email Support</h3>
                    <p className="text-blue-600 font-medium">vichitex.in@gmail.com</p>
                    <p className="text-gray-600 text-sm mt-1">Response within 24 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-green-600 font-medium">+91 9798480148</p>
                    <p className="text-gray-600 text-sm mt-1">Monday - Friday, 9 AM - 6 PM IST</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Office Address</h3>
                    <p className="text-purple-600 font-medium">India</p>
                    <p className="text-gray-600 text-sm mt-1">Serving students nationwide</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-orange-600 font-medium">Monday - Friday</p>
                    <p className="text-gray-600 text-sm mt-1">9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaComments className="mr-3 text-blue-600" />
                Connect With Us
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://whatsapp.com/channel/0029VbAfQnDG3R3iH6hNJ23Y" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300"
                >
                  <FaWhatsapp className="text-green-600 text-xl" />
                  <div>
                    <p className="font-medium text-green-900">WhatsApp</p>
                    <p className="text-green-700 text-sm">Quick support</p>
                  </div>
                </a>

                <a 
                  href="https://t.me/Vichitex" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  <FaTelegram className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-medium text-blue-900">Telegram</p>
                    <p className="text-blue-700 text-sm">Updates & support</p>
                  </div>
                </a>

                <a 
                  href="https://www.linkedin.com/in/vivek-parth-a13699335" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  <FaLinkedin className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-medium text-blue-900">LinkedIn</p>
                    <p className="text-blue-700 text-sm">Professional updates</p>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/vichitex.in?igsh=eWE5NWpzZmsxZTEz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-300"
                >
                  <FaInstagram className="text-pink-600 text-xl" />
                  <div>
                    <p className="font-medium text-pink-900">Instagram</p>
                    <p className="text-pink-700 text-sm">Latest updates</p>
                  </div>
                </a>

                <a 
                  href="https://youtube.com/@vichitexofficial25?si=_R2pM-pyU6reVjRn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300 col-span-2"
                >
                  <FaYoutube className="text-red-600 text-xl" />
                  <div>
                    <p className="font-medium text-red-900">YouTube</p>
                    <p className="text-red-700 text-sm">Educational content & tutorials</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Support Categories */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaHeadset className="mr-3 text-blue-600" />
                How Can We Help?
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-1">Technical Support</h3>
                  <p className="text-gray-600 text-sm">Platform issues, login problems, feature questions</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-1">Account & Billing</h3>
                  <p className="text-gray-600 text-sm">Subscription management, payment issues, refunds</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-1">Content & Features</h3>
                  <p className="text-gray-600 text-sm">Study materials, test questions, progress tracking</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-1">General Inquiries</h3>
                  <p className="text-gray-600 text-sm">Partnership opportunities, feedback, suggestions</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How quickly will I receive a response?</h3>
                <p className="text-gray-600 text-sm">We typically respond to emails within 24 hours during business days.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What information should I include in my message?</h3>
                <p className="text-gray-600 text-sm">Please include your account email, detailed description of the issue, and any relevant screenshots.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Can I get support on weekends?</h3>
                <p className="text-gray-600 text-sm">Phone support is available Monday-Friday. Email support is monitored daily.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I reset my password?</h3>
                <p className="text-gray-600 text-sm">Use the "Forgot Password" link on the login page or contact us for assistance.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">We accept all major credit cards, debit cards, and digital wallets through secure payment gateways.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Is my information secure?</h3>
                <p className="text-gray-600 text-sm">Yes, we use industry-standard encryption and security measures to protect your data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}

export default ContactUs 