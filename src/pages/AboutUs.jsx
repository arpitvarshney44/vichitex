import React, { useState, useEffect } from 'react'
import { FaGraduationCap, FaUsers, FaChartLine, FaBell, FaBook, FaLaptop, FaStar, FaQuoteLeft, FaArrowRight, FaCheckCircle, FaRocket, FaEye, FaHeart, FaShieldAlt, FaAward } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import logo from '../../logo.png'
import founderImage from '../../vivek.png'

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleContactClick = () => {
    navigate('/')
    setTimeout(() => {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const stats = [
    { icon: FaUsers, number: "1000+", label: "Students Enrolled", color: "from-blue-500 to-blue-600" },
    { icon: FaBook, number: "500+", label: "Tests Created", color: "from-purple-500 to-purple-600" },
    { icon: FaChartLine, number: "95%", label: "Success Rate", color: "from-green-500 to-green-600" },
    { icon: FaStar, number: "4.8", label: "Student Rating", color: "from-orange-500 to-orange-600" }
  ]

  const features = [
    {
      icon: FaBook,
      title: "Chapter-Based MCQ Tests",
      description: "Aligned with NEET and JEE syllabi, curated by subject experts.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FaChartLine,
      title: "Student Progress Dashboard",
      description: "Visual insights into what you've completed, what's left, and where you stand.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FaUsers,
      title: "Admin-Assigned Tests",
      description: "Tailored to each student's chapter completion, so no one is overwhelmed or left behind.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FaLaptop,
      title: "Clean and Intuitive UI",
      description: "No distractions, only purposeful study with a modern interface.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: FaShieldAlt,
      title: "Batch Management System",
      description: "A structured flow for batch-based enrollment, tracking, and content access.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: FaBell,
      title: "Email Notifications",
      description: "Students and parents are always updated when new tests are assigned or completed.",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-orange-500/10 animate-pulse"></div>
        <div 
          className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full mb-8 animate-bounce-in">
              <FaGraduationCap className="text-orange-500" />
              <span className="font-medium">About Vichitex</span>
            </div>
            
                         <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
               About Us – 
               <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                 Vichitex
               </span>
             </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Master Your Studies with Test, Revision and Practice
            </p>
            
            <p className="text-lg text-gray-700 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              India's First Platform for Test, Revision and Practice for individual student.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Mission Text */}
                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <p className="text-lg leading-relaxed">
                    At Vichitex, we are on a mission to transform the way students prepare for India's most competitive entrance exams — NEET and JEE. Our platform is not just a learning tool; it's a personalized companion for every student on their journey to academic excellence.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    We understand the pressure and dedication it takes to crack these national-level exams. That's why Vichitex blends structured preparation, smart test management, and real-time tracking, all in one unified and student-friendly environment.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Whether you're a student aiming to clear NEET/JEE or a parent tracking your child's progress — Vichitex offers transparency, depth, and the right tools to unlock potential.
                  </p>
                </div>
                
                {/* Logo */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative group">
                    <div className="w-64 h-64 lg:w-80 lg:h-80 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                        <img 
                          src={logo} 
                          alt="Vichitex Logo" 
                          className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-6">
                      <h3 className="text-2xl font-bold text-gray-900">Vichitex</h3>
                      <p className="text-blue-600 font-semibold">Educational Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.6s' }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaEye className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
              </div>
              
              <p className="text-xl text-gray-700 text-center leading-relaxed">
                To democratize competitive exam preparation by offering affordable, interactive, and adaptive solutions — built for students, by those who've walked the same path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What Makes Vichitex Unique?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that set us apart and make learning more effective
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: `${0.1 * index}s` }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Message from the Founder</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Founder Image */}
              <div className="lg:col-span-1">
                <div className="relative group">
                                     <div className="w-64 h-80 mx-auto relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                     <img 
                       src={founderImage} 
                       alt="Vivek Kumar - Founder of Vichitex"
                       className="relative w-full h-full object-cover rounded-2xl border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                       onError={(e) => {
                         e.target.src = founderImage
                       }}
                     />
                  </div>
                  <div className="text-center mt-6">
                    <h3 className="text-2xl font-bold text-gray-900">Vivek Kumar</h3>
                    <p className="text-blue-600 font-semibold">Founder & CEO, Vichitex</p>
                  </div>
                </div>
              </div>
              
              {/* Founder Message */}
              <div className="lg:col-span-2">
                <div className={`bg-white rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up ${isVisible ? 'animate-slide-in-up' : ''}`} style={{ animationDelay: '0.8s' }}>
                  <div className="flex items-start space-x-4 mb-6">
                    <FaQuoteLeft className="text-4xl text-blue-500 flex-shrink-0 mt-2" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Dear Students & Parents,</h3>
                    </div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                    <p className="text-lg leading-relaxed">
                      I founded Vichitex with a simple idea — to reduce the noise and complexity in NEET and JEE preparation, and instead deliver a clear path, tailored to every learner.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      As someone who has personally experienced the highs and lows of competitive exam prep, I know how overwhelming it can get — multiple books, coaching schedules, tests, and constant performance pressure.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      At Vichitex, we're changing that. We believe in intelligent preparation, not just hard work. We believe that you deserve better tools, not more pressure. And above all, we believe in your potential.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      Our platform is built keeping your real struggles and daily challenges in mind. From chapter-wise tracking to personalized test assignments — every feature here has a purpose: to simplify your journey, and maximize your outcome.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      Let's move beyond generic coaching. Let's build your personal study path — one chapter at a time.
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-lg font-semibold text-gray-900">
                        With belief in your success,
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        — Vivek Kumar
                      </p>
                      <p className="text-gray-600">
                        Founder, Vichitex
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full mb-8">
              <FaRocket className="text-orange-300" />
              <span className="font-medium">Join the Vichitex Journey</span>
            </div>
            
                         <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
               Ready to Transform Your Preparation?
             </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're a first-time aspirant, a repeat candidate, or a concerned parent — Vichitex is your partner in success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Get Started Today</span>
                <FaArrowRight className="text-sm" />
              </Link>
              
                             <button
                 onClick={handleContactClick}
                 className="inline-flex items-center space-x-2 bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
               >
                 <span>Contact Us</span>
                 <FaArrowRight className="text-sm" />
               </button>
            </div>
            
                         <p className="text-blue-100 mt-8 text-lg">
               Enroll today, track smartly, and rise consistently.
             </p>
            <p className="text-white font-semibold text-xl">
              Because with Vichitex, you don't just study — you grow with clarity.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default AboutUs 