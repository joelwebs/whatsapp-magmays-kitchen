
import { useEffect, useMemo, useState } from 'react'
import { getCategories, getFoods } from '../../services/api'
import './menu.css'

function asList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default function Menu() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([getFoods(), getCategories()])
      .then(([foodData, categoryData]) => {
        if (!active) return
        setFoods(asList(foodData))
        setCategories(asList(categoryData))
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load the menu.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase()

    return foods.filter((food) => {
      const matchesSearch = [
        food.name,
        food.description,
        food.category_name,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))

      const categoryId =
        food.category?.id ?? food.category_id ?? food.category

      const matchesCategory =
        category === 'all' || String(categoryId) === String(category)

      return matchesSearch && matchesCategory
    })
  }, [foods, search, category])

  return (
    <main className="menu-page">
      <header className="menu-page-header">
        <div>
          <p className="menu-eyebrow">OWNER WORKSPACE</p>
          <h1>Menu management</h1>
          <p>Review the food items currently stored in your backend.</p>
        </div>
        <span className="menu-count">{foods.length} items</span>
      </header>

      <section className="menu-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search food or description..."
          aria-label="Search menu"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((item, index) => (
            <option key={item.id ?? index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </section>

      {error && <div className="menu-error">{error}</div>}

      {loading ? (
        <p className="menu-message">Loading menu from Django…</p>
      ) : filteredFoods.length === 0 ? (
        <div className="menu-empty">
          <span>🍽️</span>
          <h2>No matching food items</h2>
          <p>Try another search or category.</p>
        </div>
      ) : (
        <section className="menu-grid">
          {filteredFoods.map((food, index) => {
            const available =
              food.is_available ??
              food.available ??
              food.is_active ??
              true

            return (
              <article
                className="menu-food-card"
                key={food.id ?? food.pk ?? index}
              >
                {food.image_url ? (
                  <img
                    className="menu-food-image"
                    src={food.image_url}
                    alt={food.name || 'Food item'}
                  />
                ) : (
                  <div className="menu-food-image menu-image-placeholder">
                    🍲
                  </div>
                )}

                <div className="menu-food-content">
                  <div className="menu-food-title-row">
                    <h2>{food.name || 'Unnamed food'}</h2>
                    <span
                      className={`menu-availability ${
                        available ? 'is-available' : 'is-unavailable'
                      }`}
                    >
                      {available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p className="menu-food-description">
                    {food.description || 'No description provided.'}
                  </p>

                  <div className="menu-food-footer">
                    <strong>
                      {food.price != null
                        ? `GH₵ ${Number(food.price).toFixed(2)}`
                        : 'Price not set'}
                    </strong>
                    <span>
                      {food.category_name ||
                        food.category?.name ||
                        'Uncategorised'}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
