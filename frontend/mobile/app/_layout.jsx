import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Header from '../components/Header'
import FoodCard from '../components/FoodCard'
import PrimaryButton from '../components/PrimaryButton'
import LoadingState, { ErrorState } from '../components/LoadingState'
import { getCategories, getFoods } from '../services/api'
import './_layout.css'

export default function HomePage({ onNavigate }) {
  const [categories, setCategories] = useState([])
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'
  const baseUrl = API_BASE_URL.replace('/api/v1', '')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [cats, items] = await Promise.all([getCategories(), getFoods()])
      setCategories(cats)
      setFoods(items)
    } catch (err) {
      setError(err.message || 'Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const featuredFoods = foods.slice(0, 6)

  if (loading) return <LoadingState message="Loading menu..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="home" id="home-page">
      <Header
        showLogo
        showCart
        onCartClick={() => onNavigate('checkout')}
      />

      {/* Hero Section */}
      <section className="home__hero" id="home-hero">
        <div className="home__hero-bg" />
        <div className="home__hero-inner">
          <div className="home__hero-content">
            <motion.div
              className="home__hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              🔥 Fresh Today
            </motion.div>
            <motion.h2
              className="home__hero-title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Delicious Meals{'\n'}Made Fresh Daily
            </motion.h2>
            <motion.p
              className="home__hero-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Good food. Great taste. Always.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PrimaryButton
                onClick={() => onNavigate('menu')}
                size="md"
                fullWidth={false}
                id="home-order-now-btn"
              >
                Order Now
              </PrimaryButton>
            </motion.div>
          </div>
          <motion.div
            className="home__hero-img"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {featuredFoods[0]?.image_url && (
              <img
                src={
                  featuredFoods[0].image_url.startsWith('http')
                    ? featuredFoods[0].image_url
                    : `${baseUrl}${featuredFoods[0].image_url}`
                }
                alt={featuredFoods[0].name}
                className="home__hero-food-img"
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Our Menu — Category Circles */}
      {categories.length > 0 && (
        <section className="home__section" id="home-categories">
          <h3 className="home__section-title">Our Menu</h3>
          <div className="home__categories">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                className="home__category-item"
                onClick={() => onNavigate('menu', { categoryId: cat.id })}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.93 }}
                id={`home-category-${cat.id}`}
              >
                <div className="home__category-circle">
                  {(() => {
                    const catFood = foods.find((f) => f.category === cat.id)
                    const imgUrl = catFood?.image_url
                    if (imgUrl) {
                      const src = imgUrl.startsWith('http')
                        ? imgUrl
                        : `${baseUrl}${imgUrl}`
                      return (
                        <img
                          src={src}
                          alt={cat.name}
                          className="home__category-img"
                          loading="lazy"
                        />
                      )
                    }
                    return <span className="home__category-emoji">🍽️</span>
                  })()}
                </div>
                <span className="home__category-name">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Meals */}
      {featuredFoods.length > 0 && (
        <section className="home__section" id="home-featured">
          <div className="home__section-header">
            <h3 className="home__section-title">Featured Meals</h3>
            <button
              className="home__view-all"
              onClick={() => onNavigate('menu')}
              id="home-view-all-btn"
            >
              View All →
            </button>
          </div>
          <div className="home__featured-scroll">
            {featuredFoods.map((food, i) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <FoodCard
                  food={food}
                  layout="featured"
                  onClick={() => onNavigate('food', { food })}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 'var(--space-2xl)' }} />
    </div>
  )
}
