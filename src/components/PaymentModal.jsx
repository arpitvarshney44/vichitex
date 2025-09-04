import React, { useState, useEffect } from 'react'
import { FaTimes, FaCreditCard, FaShieldAlt, FaCheckCircle, FaGift, FaTag } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

const PaymentModal = ({ isOpen, onClose, batchPlan, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [finalAmount, setFinalAmount] = useState(batchPlan?.price || 0)
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('pending')
      setCouponCode('')
      setAppliedCoupon(null)
      setFinalAmount(batchPlan?.price || 0)
      setDiscountAmount(0)
    }
  }, [isOpen, batchPlan])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setCouponLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          amount: batchPlan.price,
          batchType: batchPlan.type
        })
      })

      const data = await response.json()

      if (data.success) {
        setAppliedCoupon(data.data.coupon)
        setDiscountAmount(data.data.discountAmount)
        setFinalAmount(data.data.finalAmount)
        toast.success(`Coupon applied! You saved ₹${data.data.discountAmount}`)
      } else {
        toast.error(data.message || 'Invalid coupon code')
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Error applying coupon. Please try again.')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setDiscountAmount(0)
    setFinalAmount(batchPlan?.price || 0)
    toast.success('Coupon removed')
  }

  const handlePayment = async () => {
    if (!batchPlan) return

    setLoading(true)
    try {
      // Create order
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          batchName: batchPlan.name,
          batchType: batchPlan.type,
          amount: batchPlan.price,
          couponCode: appliedCoupon?.code || null
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order')
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Vichitex',
        description: `Batch Enrollment - ${batchPlan.name}${appliedCoupon ? ` (with ${appliedCoupon.name})` : ''}`,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                batchName: batchPlan.name,
                batchType: batchPlan.type,
                amount: batchPlan.price,
                couponCode: appliedCoupon?.code || null
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              setPaymentStatus('success')
              toast.success('Payment successful! You are now enrolled in the batch.')
              setTimeout(() => {
                onSuccess(verifyData.data)
                onClose()
              }, 2000)
            } else {
              throw new Error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            setPaymentStatus('failed')
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || ''
        },
        theme: {
          color: '#2563eb'
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'pending' && (
            <>
              {/* Batch Details */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{batchPlan?.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{batchPlan?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">₹{batchPlan?.price}</span>
                  <span className="text-sm text-gray-500">{batchPlan?.duration || 'Annual Access'}</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaGift className="text-purple-500 mr-2" />
                  Have a coupon code?
                </h4>
                
                {!appliedCoupon ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {couponLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaTag className="text-sm" />
                      )}
                      <span className="text-sm">Apply</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <div>
                          <p className="font-medium text-green-800">{appliedCoupon.name}</p>
                          <p className="text-sm text-green-600">Code: {appliedCoupon.code}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-medium">₹{batchPlan?.price}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-green-600">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Final Amount:</span>
                    <span className="font-bold text-xl text-gray-900">₹{finalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {batchPlan?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    <span>Pay ₹{finalAmount}</span>
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
                <FaShieldAlt />
                <span>Secure payment powered by Razorpay</span>
              </div>
            </>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">You are now enrolled in {batchPlan?.name}</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimes className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">Please try again or contact support</p>
              <button
                onClick={() => setPaymentStatus('pending')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal 