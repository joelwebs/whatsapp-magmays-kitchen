
import { useEffect, useState } from 'react'
import {
  getBusiness,
  getCategories,
  getDeliveryLocations,
  getFoods,
} from '../../services/api'
import './dashboard.css'

function listFrom(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

function getName(item) {
  return item?.name || item?.title || 'Unnamed item'
}

export default function Dashboard() {
  const [data, setData] = useState({
    business: null,
    foods: [],
    categories: [],
    locations: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      const results = await Promise.allSettled([
        getBusiness(),
        getFoods(),
        getCategories(),
        getDeliveryLocations(),
      ])

      if (!active) return

      const [business, foods, categories, locations] = results
      const failed = results.find((result) => result.status === 'rejected')

      setData({
        business:
          business.status === 'fulfilled'
            ? business.value
            : null,
        foods:
          foods.status === 'fulfilled'
            ? listFrom(foods.value)
            : [],
        categories:
          categories.status === 'fulfilled'
            ? listFrom(categories.value)
            : [],
        locations:
          locations.status === 'fulfilled'
            ? listFrom(locations.value)
            : [],
      })

      if (failed) {
        setError(
          'Some information could not load. Check that the Django server is running.'
        )
      }

      setLoading(false)
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const availableFoods = data.foods.filter(
    (food) => food.is_available ?? food.available ?? food.is_active ?? true
  )

  const businessName =
    data.business?.name ||
    data.business?.business_name ||
    'Magmay’s Kitchen'

  return (
    <main className="owner-page">
      <header className="owner-header">
        <div>
          <p className="owner-eyebrow">OWNER WORKSPACE</p>
          <h1>Dashboard</h1>
          <p className="owner-muted">
            Welcome back. Here is your kitchen overview.
          </p>
        </div>
        <div className="owner-business-chip">
          <span className="owner-status-dot" />
          {businessName}
        </div>
      </header>

      {error && <div className="owner-alert">{error}</div>}

      {loading ? (
        <div className="owner-panel owner-loading">
          Loading your business information…
        </div>
      ) : (
        <>
          <section className="owner-stats">
            <article className="owner-stat-card">
              <span className="owner-stat-icon">🍲</span>
              <p>Total menu items</p>
              <strong>{data.foods.length}</strong>
              <small>Items returned by the menu API</small>
            </article>

            <article className="owner-stat-card">
              <span className="owner-stat-icon">✓</span>
              <p>Available items</p>
              <strong>{availableFoods.length}</strong>
              <small>Based on each item's availability field</small>
            </article>

            <article className="owner-stat-card">
              <span className="owner-stat-icon">▦</span>
              <p>Categories</p>
              <strong>{data.categories.length}</strong>
              <small>Menu categories</small>
            </article>

            <article className="owner-stat-card">
              <span className="owner-stat-icon">⌖</span>
              <p>Delivery locations</p>
              <strong>{data.locations.length}</strong>
              <small>Locations returned by the API</small>
            </article>
          </section>

          <section className="owner-panel">
            <div className="owner-section-heading">
              <div>
                <h2>Menu overview</h2>
                <p>Recent items returned by your backend.</p>
              </div>
              <a href="/owner/menu" className="owner-text-link">
                View menu →
              </a>
            </div>

            {data.foods.length === 0 ? (
              <div className="owner-empty">
                <span>🍽️</span>
                <h3>No menu items returned</h3>
                <p>
                  Add menu items through your existing backend admin
                  until owner menu creation is connected.
                </p>
              </div>
            ) : (
              <div className="owner-table-wrap">
                <table className="owner-table">
                  <thead>
                    <tr>
                      <th>Food item</th>
                      <th>Price</th>
                      <th>Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.foods.slice(0, 6).map((food, index) => {
                      const isAvailable =
                        food.is_available ??
                        food.available ??
                        food.is_active ??
                        true

                      return (
                        <tr key={food.id ?? food.pk ?? index}>
                          <td>
                            <div className="owner-food-name">
                              {food.image_url && (
                                <img
                                  src={food.image_url}
                                  alt=""
                                  className="owner-food-thumb"
                                />
                              )}
                              <span>{getName(food)}</span>
                            </div>
                          </td>
                          <td>
                            {food.price != null
                              ? `GH₵ ${Number(food.price).toFixed(2)}`
                              : '—'}
                          </td>
                          <td>
                            <span
                              className={`owner-pill ${
                                isAvailable
                                  ? 'owner-pill-active'
                                  : 'owner-pill-inactive'
                              }`}
                            >
                              {isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="owner-panel owner-business-panel">
            <div>
              <h2>Business information</h2>
              <p>Information retrieved from your business endpoint.</p>
            </div>
            {data.business ? (
              <dl className="owner-business-details">
                <div>
                  <dt>Business name</dt>
                  <dd>{businessName}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    {data.business.phone ||
                      data.business.phone_number ||
                      'Not provided by API'}
                  </dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>
                    {data.business.address ||
                      data.business.location ||
                      'Not provided by API'}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="owner-muted">
                Business information could not be retrieved.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  )
}
