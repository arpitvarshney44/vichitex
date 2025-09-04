import { Link } from 'react-router-dom'
import { FaArrowLeft, FaTruck, FaDownload, FaClock, FaGlobe, FaMobileAlt, FaDesktop, FaTabletAlt } from 'react-icons/fa'
import ScrollToTop from '../components/ScrollToTop'

const ShippingAndDelivery = () => {
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
            <FaTruck className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shipping and Delivery Policy</h1>
          </div>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Vichitex, we provide digital educational services and content. This Shipping and Delivery Policy outlines 
              how our services are delivered, accessed, and managed. Since we offer digital services, there is no physical 
              shipping involved.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our services are delivered instantly upon successful payment and account activation.
            </p>
          </section>

          {/* Service Delivery */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaDownload className="mr-3 text-green-600" />
              Service Delivery
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-3">Instant Access</h3>
                <p className="text-green-800 mb-4">
                  Upon successful payment and account verification, you will have immediate access to all purchased services 
                  and features on the Vichitex platform.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm">Educational content and study materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm">Practice tests and assessments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm">Progress tracking and analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm">Premium features and tools</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-3">Account Activation</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</div>
                    <div>
                      <p className="text-blue-800 font-medium">Payment Processing</p>
                      <p className="text-blue-700 text-sm">Payment is processed securely through our payment partners</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</div>
                    <div>
                      <p className="text-blue-800 font-medium">Account Verification</p>
                      <p className="text-blue-700 text-sm">Account is automatically activated upon successful payment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</div>
                    <div>
                      <p className="text-blue-800 font-medium">Service Access</p>
                      <p className="text-blue-700 text-sm">Immediate access to all purchased services and features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Access Methods */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Methods</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <FaDesktop className="text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">Web Platform</h3>
                <p className="text-gray-700 text-sm">Access through any modern web browser on desktop or laptop computers</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <FaMobileAlt className="text-4xl text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">Mobile Devices</h3>
                <p className="text-gray-700 text-sm">Optimized for smartphones and mobile browsers</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <FaTabletAlt className="text-4xl text-purple-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">Tablets</h3>
                <p className="text-gray-700 text-sm">Full functionality on tablet devices</p>
              </div>
            </div>
          </section>

          {/* System Requirements */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">System Requirements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-3">Browser Requirements</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Google Chrome (version 80+)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Mozilla Firefox (version 75+)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Safari (version 13+)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Microsoft Edge (version 80+)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-3">Device Requirements</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Stable internet connection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Minimum 2GB RAM</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">JavaScript enabled</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Cookies enabled</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery Timeline */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaClock className="mr-3 text-orange-600" />
              Delivery Timeline
            </h2>
            <div className="space-y-4">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-orange-900 mb-3">Standard Delivery</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800 font-medium">Payment Processing</span>
                    <span className="text-orange-700 text-sm">1-2 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800 font-medium">Account Activation</span>
                    <span className="text-orange-700 text-sm">Immediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800 font-medium">Service Access</span>
                    <span className="text-orange-700 text-sm">Instant</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900 mb-3">Potential Delays</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-yellow-800 font-medium text-sm">Payment Verification</p>
                      <p className="text-yellow-700 text-xs">May take up to 24 hours for certain payment methods</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-yellow-800 font-medium text-sm">Technical Issues</p>
                      <p className="text-yellow-700 text-xs">Rare cases of system maintenance or updates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-yellow-800 font-medium text-sm">Account Review</p>
                      <p className="text-yellow-700 text-xs">Manual review required for suspicious activities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Geographic Availability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaGlobe className="mr-3 text-blue-600" />
              Geographic Availability
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-3">Global Access</h3>
                <p className="text-blue-800 mb-4">
                  Vichitex services are available worldwide, with some regional variations in content and features.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Available Everywhere</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Core educational content</li>
                      <li>• Practice tests and assessments</li>
                      <li>• Progress tracking</li>
                      <li>• Basic features</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Regional Variations</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Localized content</li>
                      <li>• Regional payment methods</li>
                      <li>• Language preferences</li>
                      <li>• Currency options</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Updates and Maintenance</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 mb-3">Regular Updates</h3>
                <p className="text-purple-800 mb-4">
                  We regularly update our platform with new features, content, and improvements. These updates are delivered 
                  automatically and are included in your subscription.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-700 text-sm">New educational content and materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-700 text-sm">Enhanced features and tools</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-700 text-sm">Performance improvements and bug fixes</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-orange-900 mb-3">Scheduled Maintenance</h3>
                <p className="text-orange-800 mb-4">
                  We occasionally perform scheduled maintenance to ensure optimal platform performance. Users are notified 
                  in advance of any planned maintenance windows.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-700 text-sm">Advance notification via email and platform</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-700 text-sm">Minimal downtime during maintenance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-700 text-sm">Extended access time to compensate for downtime</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Issues and Troubleshooting</h2>
            <div className="space-y-4">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-red-900 mb-3">Common Issues</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Login Problems</h4>
                    <p className="text-red-700 text-sm">Ensure correct email and password, check caps lock</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Slow Loading</h4>
                    <p className="text-red-700 text-sm">Check internet connection, clear browser cache</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Feature Not Available</h4>
                    <p className="text-red-700 text-sm">Verify subscription status and payment confirmation</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-3">Support Solutions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</div>
                    <div>
                      <p className="text-green-800 font-medium">Check FAQ Section</p>
                      <p className="text-green-700 text-sm">Visit our help center for common solutions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</div>
                    <div>
                      <p className="text-green-800 font-medium">Contact Support</p>
                      <p className="text-green-700 text-sm">Email vichitex.in@gmail.com for assistance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</div>
                    <div>
                      <p className="text-green-800 font-medium">Phone Support</p>
                      <p className="text-green-700 text-sm">Call +91 9798480148 during business hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help with Access?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you experience any issues with service delivery or access, our support team is here to help:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Email Support</h3>
                <p className="text-blue-800 text-sm">vichitex.in@gmail.com</p>
                <p className="text-blue-700 text-xs mt-1">Response within 24 hours</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Phone Support</h3>
                <p className="text-green-800 text-sm">+91 9798480148</p>
                <p className="text-green-700 text-xs mt-1">Monday - Friday, 9 AM - 6 PM IST</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}

export default ShippingAndDelivery 