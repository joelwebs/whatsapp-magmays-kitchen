import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Toaster } from 'sonner'
import { CartProvider } from '../context/CartContext'

// Pages
import SplashPage from '../app/index.jsx'
import HomePage from '../app/_layout.jsx'
import MenuPage from '../app/menu.jsx'
import FoodDetailPage from '../app/food/[id].jsx'
import LocationPage from '../app/location.jsx'
import CheckoutPage from '../app/checkout.jsx'
import AboutPage from '../app/about.jsx'
import OwnerLoginPage from '../app/owner/login.jsx'

import './App.css'

const pageTransition = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.25, ease: 'easeInOut' },
}

function AppRouter() {
  const [currentPage, setCurrentPage] = useState('splash')
  const [pageParams, setPageParams] = useState({})
  const [, setHistory] = useState([])

  const navigate = useCallback((page, params = {}) => {
    setHistory((prev) => [...prev, { page: currentPage, params: pageParams }])
    setCurrentPage(page)
    setPageParams(params)
    window.scrollTo(0, 0)
  }, [currentPage, pageParams])

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) {
        setCurrentPage('home')
        setPageParams({})
        return prev
      }
      const newHistory = [...prev]
      const last = newHistory.pop()
      setCurrentPage(last.page)
      setPageParams(last.params)
      window.scrollTo(0, 0)
      return newHistory
    })
  }, [])

  function renderPage() {
    switch (currentPage) {
      case 'splash':
        return (
          <SplashPage
            key="splash"
            onGetStarted={() => navigate('home')}
          />
        )
      case 'home':
        return (
          <HomePage
            key="home"
            onNavigate={navigate}
          />
        )
      case 'menu':
        return (
          <MenuPage
            key="menu"
            onNavigate={navigate}
            initialCategoryId={pageParams.categoryId}
          />
        )
      case 'food':
        return (
          <FoodDetailPage
            key="food"
            food={pageParams.food}
            onBack={goBack}
          />
        )
      case 'location':
        return (
          <LocationPage
            key="location"
            onNavigate={navigate}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            key="checkout"
            onNavigate={navigate}
          />
        )
      case 'about':
        return (
          <AboutPage
            key="about"
            onNavigate={navigate}
          />
        )
      case 'owner-login':
        return (
          <OwnerLoginPage
            key="owner-login"
            onNavigate={navigate}
          />
        )
      default:
        return (
          <HomePage
            key="home-default"
            onNavigate={navigate}
          />
        )
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="page-wrapper"
          {...pageTransition}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation (shown on Home only) */}
      {currentPage === 'home' && (
        <nav className="bottom-nav" id="bottom-nav">
          <button
            className="bottom-nav__item bottom-nav__item--active"
            onClick={() => navigate('home')}
            id="nav-home"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </button>
          <button
            className="bottom-nav__item"
            onClick={() => navigate('menu')}
            id="nav-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Menu</span>
          </button>
          <button
            className="bottom-nav__item"
            onClick={() => navigate('about')}
            id="nav-about"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            <span>Info</span>
          </button>
          <button
            className="bottom-nav__item"
            onClick={() => navigate('owner-login')}
            id="nav-profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </button>
        </nav>
      )}
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <AppRouter />
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
          },
        }}
      />
    </CartProvider>
  )
}

export default App
