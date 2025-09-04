import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

import ResetPassword from './pages/ResetPassword'
import StudentDashboard from './pages/StudentDashboard'
import TestPage from './pages/TestPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import TokenRoute from './components/TokenRoute'
import AdminRoute from './components/AdminRoute'

// Policy Pages
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import CancellationAndRefund from './pages/CancellationAndRefund'
import ShippingAndDelivery from './pages/ShippingAndDelivery'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'

function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />

        <Route path="/reset-password" element={
          <TokenRoute>
            <ResetPassword />
          </TokenRoute>
        } />
        
        {/* Student Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test/:testId" 
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* Policy Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cancellation-refund" element={<CancellationAndRefund />} />
        <Route path="/shipping-delivery" element={<ShippingAndDelivery />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </div>
  )
}

export default App 