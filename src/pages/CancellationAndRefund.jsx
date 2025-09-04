import { Link } from 'react-router-dom'
import { FaArrowLeft, FaUndo, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import ScrollToTop from '../components/ScrollToTop'

const CancellationAndRefund = () => {
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
            <FaUndo className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Refund Policy</h1>
          </div>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Please read our refund policy carefully before purchasing any batch.
            </p>
          </section>

          {/* Refund Eligibility */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaUndo className="mr-3 text-green-600" />
              1. Refund Eligibility
            </h2>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-green-800 font-medium mb-3">We offer refunds only in the following case:</p>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">➡️</div>
                <p className="text-green-700">A refund will be provided only if you will not get test regularly from our side.</p>
              </div>
            </div>
          </section>

          {/* Non-Refundable Cases */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaTimes className="mr-3 text-red-600" />
              Non-Refundable Cases
            </h2>
            <div className="bg-red-50 p-6 rounded-lg space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">➡️</div>
                <p className="text-red-700">Other any case refund is not applicable.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">➡️</div>
                <p className="text-red-700">If you not attempt test the refund is not applicable.</p>
              </div>
            </div>
          </section>

          {/* Cancellation Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaExclamationTriangle className="mr-3 text-orange-600" />
              Cancellation Terms
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="text-orange-800 mb-3">
                Cancellations are not applicable once the batch has been accessed.
              </p>
              <p className="text-orange-700">
                If the service was not accessed and cancellation is requested within 24 hours, you may be eligible for a refund (see refund policy).
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our refund policy, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Email Support</h3>
                <p className="text-blue-800 text-sm">vichitex.in@gmail.com</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Phone Support</h3>
                <p className="text-green-800 text-sm">+91 9798480148</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}

export default CancellationAndRefund 