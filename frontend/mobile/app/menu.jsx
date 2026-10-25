import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Header from '../components/Header'
import CategoryTabs from '../components/CategoryTabs'
import FoodCard from '../components/FoodCard'
import LoadingState, { ErrorState, EmptyState } from '../components/LoadingState'
import { getCategories, getFoods } from '../services/api'
import { Search, X } from 'lucide-react'
import './menu.css'

export default function MenuPage({ onNavigate, initialCategoryId }) {
  const [categories, setCategories] = useState([])
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

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

  const filteredFoods = useMemo(() => {
    let result = foods
    if (activeCategoryId) {
      result = result.filter((f) => f.category === activeCategoryId)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [foods, activeCategoryId, searchQuery])

  if (loading) return <LoadingState message="Loading menu..." />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="menu-page" id="menu-page">
      <Header
        title="Menu"
        showBack
        showSearch
        showCart
        onBack={() => onNavigate('home')}
        onSearch={() => setShowSearch((s) => !s)}
        onCartClick={() => onNavigate('checkout')}
      />

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="menu-page__search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="menu-page__search-box">
              <Search size={16} className="menu-page__search-icon" />
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-page__search-input"
                autoFocus
                id="menu-search-input"
              />
              {searchQuery && (
                <button
                  className="menu-page__search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CategoryTabs
        categories={categories}
        activeId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />

      {/* Food List */}
      <div className="menu-page__list" id="menu-food-list">
        {filteredFoods.length === 0 ? (
          <EmptyState message="No meals found" icon="🔍" />
        ) : (
          filteredFoods.map((food, i) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="menu-page__item"
            >
              <FoodCard
                food={food}
                layout="horizontal"
                onClick={() => onNavigate('food', { food })}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
