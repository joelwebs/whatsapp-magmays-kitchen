import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Toaster } from 'sonner'
import { CartProvider } from '../context/CartContext'
import { useCart } from '../context/useCart'

// Pages
import SplashPage from '../app/index.jsx'
import HomePage from '../app/_layout.jsx'
import MenuPage from '../app/menu.jsx'
import FoodDetailPage from '../app/food/[id].jsx'
import LocationPage from '../app/location.jsx'
import CheckoutPage from '../app/checkout.jsx'
import AboutPage from '../app/about.jsx'

import './App.css'

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
}

function BottomNav({ currentPage, navigate }) {
  const { itemCount } = useCart()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      page: 'home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'menu',
      label: 'Menu',
      page: 'menu',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
    {
      id: 'cart',
      label: 'Cart',
      page: 'checkout',
      badge: itemCount > 0 ? itemCount : null,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      ),
    },
    {
      id: 'about',
      label: 'Info',
      page: 'about',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
      ),
    },
  ]

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {navItems.map((item) => {
        const isActive = currentPage === item.page
        return (
          <button
            key={item.id}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate(item.page)}
            id={`nav-${item.id}`}
          >
            <div className="bottom-nav__icon-wrap">
              {item.icon}
              {item.badge && (
                <span className="bottom-nav__badge">{item.badge}</span>
              )}
              {isActive && (
                <motion.div
                  className="bottom-nav__active-dot"
                  layoutId="nav-dot"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
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

  // Pages that show the bottom nav
  const showBottomNav = ['home', 'menu', 'checkout', 'about'].includes(currentPage)

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

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNav currentPage={currentPage} navigate={navigate} />
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
            borderRadius: '12px',
          },
        }}
      />
    </CartProvider>
  )
}

export default App
