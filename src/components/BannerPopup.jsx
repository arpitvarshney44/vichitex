import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

const BannerPopup = () => {
  const [banner, setBanner] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = async () => {
    try {
      setIsLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/active`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.banner && (data.banner.desktop || data.banner.mobile)) {
          setBanner(data.banner)
          setIsVisible(true)
        }
      }
    } catch (error) {
      console.error('Error loading banner:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleBannerClick = () => {
    // Redirect to batch section
    const batchSection = document.getElementById('batches')
    if (batchSection) {
      batchSection.scrollIntoView({ behavior: 'smooth' })
    }
    handleClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible])

  if (isLoading) {
    return null
  }
  
  if (!isVisible) {
    return null
  }
  
  if (!banner) {
    return null
  }

  // Determine which banner to show based on screen size
  const isMobile = window.innerWidth <= 768
  const bannerToShow = isMobile ? banner.mobile : banner.desktop

  if (!bannerToShow) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full">
        {/* Close Button - Desktop */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 bg-white text-gray-600 hover:text-gray-800 rounded-full p-2 shadow-lg transition-colors duration-300 z-10 hidden md:block"
          aria-label="Close banner"
        >
          <FaTimes className="text-lg" />
        </button>
        
        {/* Banner Image */}
        <div 
          className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={handleBannerClick}
        >
          <img
            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${bannerToShow.filename}`}
            alt="Promotional Banner"
            className="w-full h-auto rounded-lg shadow-2xl"
            style={{
              maxHeight: isMobile ? '80vh' : '70vh',
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* Mobile Close Button - Bottom */}
        {isMobile && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleClose}
              className="bg-white text-gray-600 hover:text-gray-800 rounded-full p-3 shadow-lg transition-colors duration-300 z-10 flex items-center space-x-2"
              aria-label="Close banner"
            >
              <FaTimes className="text-lg" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        )}
        
        {/* Click hint for mobile */}
        {isMobile && (
          <div className="text-center mt-4 text-white text-sm">
            <p>Tap to view batch details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BannerPopup 